"""The build's checks, each one a mistake a student would otherwise see.

Every test builds a small tutorials tree in a temporary directory rather
than the real one, so a test never depends on which tutorials exist today.
"""

from pathlib import Path

import pytest

import build
from build import BuildError

ROOT = Path(__file__).resolve().parent.parent

FRONTMATTER = """---
title: "{title}"
slug: {slug}
module: {module}
module_title: "Module {module}"
series: {series}
version: {version}
{extra}---
"""


def write_tutorial(tutorials_dir: Path, slug: str, body: str = "# A page\n\nSome text.\n",
                   module: str = "mod", series: str = "ser", version: str = "2026.09.04.1",
                   title: str | None = None, extra: str = "") -> Path:
    folder = tutorials_dir / module / slug
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{slug}.md"
    path.write_text(FRONTMATTER.format(
        title=title or slug.replace("-", " ").title(), slug=slug, module=module,
        series=series, version=version, extra=extra,
    ) + body, encoding="utf-8")
    return path


def write_order(tutorials_dir: Path, slugs: list[str], module: str = "mod", series: str = "ser",
                title: str = "A series") -> None:
    (tutorials_dir / module).mkdir(parents=True, exist_ok=True)
    (tutorials_dir / module / f"{series}.order.yaml").write_text(
        f"series: {title}\norder:\n" + "".join(f"  - {s}\n" for s in slugs), encoding="utf-8"
    )


@pytest.fixture
def tree(tmp_path: Path):
    tutorials = tmp_path / "tutorials"
    out = tmp_path / "site"
    tutorials.mkdir()
    return tutorials, out


def run_build(tree):
    tutorials, out = tree
    return build.build(tutorials_dir=tutorials, out_dir=out, assets_dir=ROOT / "assets", clean=True)


def test_builds_a_page_and_the_contents(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "first", "# First\n\n## One\n\nText.\n\n## Two\n\nMore.\n")
    write_tutorial(tutorials, "second")
    write_order(tutorials, ["first", "second"])

    pages = run_build(tree)

    assert (out / "tutorials/mod/first/index.html").exists()
    assert (out / "index.html").exists()
    assert len(pages) == 3
    first = (out / "tutorials/mod/first/index.html").read_text(encoding="utf-8")
    assert "{{" not in first, "an unfilled shell token shipped"
    assert 'class="dl-nav-next"' in first
    assert 'class="dl-nav-prev"' not in first
    assert 'class="dl-toc"' in first, "two sections should produce a contents fold"
    contents = (out / "index.html").read_text(encoding="utf-8")
    assert "tutorials/mod/first/index.html" in contents
    assert "Module mod" in contents


def test_missing_frontmatter_field_stops_the_build(tree):
    tutorials, _ = tree
    folder = tutorials / "mod" / "bad"
    folder.mkdir(parents=True)
    (folder / "bad.md").write_text("---\ntitle: Bad\nslug: bad\n---\n# Bad\n", encoding="utf-8")
    write_order(tutorials, ["bad"])
    with pytest.raises(BuildError, match="missing"):
        run_build(tree)


def test_version_must_be_dated(tree):
    tutorials, _ = tree
    write_tutorial(tutorials, "page", version="1.0")
    write_order(tutorials, ["page"])
    with pytest.raises(BuildError, match="version"):
        run_build(tree)


def test_tutorial_not_in_an_order_file_stops_the_build(tree):
    tutorials, _ = tree
    write_tutorial(tutorials, "listed")
    write_tutorial(tutorials, "forgotten")
    write_order(tutorials, ["listed"])
    with pytest.raises(BuildError, match="forgotten"):
        run_build(tree)


def test_order_file_naming_a_missing_tutorial_stops_the_build(tree):
    tutorials, _ = tree
    write_tutorial(tutorials, "real")
    write_order(tutorials, ["real", "ghost"])
    with pytest.raises(BuildError, match="ghost"):
        run_build(tree)


def test_tutorial_links_resolve_or_fail(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "one", "# One\n\nSee [two](tutorial:two#part).\n")
    write_tutorial(tutorials, "two", "# Two\n\n## Part\n\nText.\n")
    write_order(tutorials, ["one", "two"])
    run_build(tree)
    page = (out / "tutorials/mod/one/index.html").read_text(encoding="utf-8")
    assert 'href="../../../tutorials/mod/two/index.html#part"' in page

    write_tutorial(tutorials, "one", "# One\n\nSee [nowhere](tutorial:nowhere).\n")
    with pytest.raises(BuildError, match="nowhere"):
        run_build(tree)


def test_image_without_alt_stops_the_build(tree):
    tutorials, _ = tree
    write_tutorial(tutorials, "pic", '# Pic\n\n<img src="a.png">\n')
    write_order(tutorials, ["pic"])
    with pytest.raises(BuildError, match="alt"):
        run_build(tree)


def test_image_with_alt_is_copied_beside_the_page(tree):
    tutorials, out = tree
    path = write_tutorial(tutorials, "pic", "# Pic\n\n![A small square](square.png)\n")
    (path.parent / "square.png").write_bytes(b"not really a png")
    write_order(tutorials, ["pic"])
    run_build(tree)
    assert (out / "tutorials/mod/pic/square.png").exists()


def test_draft_builds_but_stays_off_the_contents_and_out_of_search(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "shown")
    write_tutorial(tutorials, "hidden", extra="status: draft\n")
    write_order(tutorials, ["shown", "hidden"])
    run_build(tree)
    assert (out / "tutorials/mod/hidden/index.html").exists()
    contents = (out / "index.html").read_text(encoding="utf-8")
    assert "tutorials/mod/hidden/" not in contents
    index = (out / "assets/search-index.json").read_text(encoding="utf-8")
    assert "hidden" not in index
    assert "shown" in index


def test_search_index_carries_glossary_terms(tree):
    tutorials, out = tree
    path = write_tutorial(tutorials, "tables")
    (path.parent / "tables.glossary.yaml").write_text(
        "entries:\n  - term: primary key\n    definition: A column that identifies a row.\n",
        encoding="utf-8",
    )
    write_order(tutorials, ["tables"])
    run_build(tree)
    index = (out / "assets/search-index.json").read_text(encoding="utf-8")
    assert "primary key" in index


def test_shell_tokens_all_filled_and_all_used():
    shell = (ROOT / "assets" / "shell.html").read_text(encoding="utf-8")
    with pytest.raises(BuildError, match="not filled"):
        build.fill_shell(shell, {"TITLE": "x"}, "test")
    with pytest.raises(BuildError, match="no token"):
        build.fill_shell("<p>{{TITLE}}</p>", {"TITLE": "x", "EXTRA": "y"}, "test")


def test_the_real_tutorials_build(tmp_path: Path):
    pages = build.build(out_dir=tmp_path / "site", clean=True)
    assert pages
    assert (tmp_path / "site" / "index.html").exists()


FRONT_MD = """---
title: "The course"
doors:
  - title: "Start with a website"
    href: tutorial:first
    text: "Fork a small site and change one thing at a time."
    ends: "A site with its own address."
  - title: "Start with data"
    href: https://example.org/playground/
    text: "Make a table and ask it questions."
    ends: "A table you built."
    interim: true
---
Where to begin.

- **Two ways to begin.** Pick one.
- **Nothing is scored.** Nothing leaves your browser.
"""


def test_front_page_opens_with_front_md(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "first")
    write_order(tutorials, ["first"])
    (tutorials / "front.md").write_text(FRONT_MD, encoding="utf-8")
    (tutorials / "modules.yaml").write_text(
        "order:\n  - mod\n  - data\nplanned:\n  data:\n    title: Data\n    note: Being written.\n"
        "notes:\n  mod: The older pages are [elsewhere](https://example.org/old/).\n",
        encoding="utf-8",
    )

    build.build(tutorials_dir=tutorials, out_dir=out, assets_dir=ROOT / "assets", clean=True,
                front=tutorials / "front.md")

    page = (out / "index.html").read_text(encoding="utf-8")
    assert "<title>The course" in page
    assert page.count("<h1>") == 1
    assert "<h1>The course</h1>" in page
    assert "Where to begin." in page
    assert '<ul class="dl-intro-points">' in page
    assert '<a class="dl-door" href="tutorials/mod/first/index.html">' in page
    assert '<a class="dl-door dl-door-interim" href="https://example.org/playground/">' in page
    assert "<strong>At the end:</strong> A site with its own address." in page
    assert '<h2 class="dl-module-heading">Module mod</h2>' in page
    assert "tutorials/mod/first/index.html" in page
    assert '<h2 class="dl-module-heading">Data</h2>' in page
    assert "Being written." in page
    assert 'href="https://example.org/old/"' in page
    assert 'id="dl-search"' in page
    assert "Tutorials written here" not in page


def test_front_door_to_a_missing_tutorial_stops_the_build(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "first")
    write_order(tutorials, ["first"])
    (tutorials / "front.md").write_text(FRONT_MD.replace("tutorial:first", "tutorial:ghost"), encoding="utf-8")
    with pytest.raises(BuildError, match="ghost"):
        build.build(tutorials_dir=tutorials, out_dir=out, assets_dir=ROOT / "assets", clean=True,
                    front=tutorials / "front.md")


def test_module_with_no_pages_and_no_plan_stops_the_build(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "first")
    write_order(tutorials, ["first"])
    (tutorials / "modules.yaml").write_text("order:\n  - mod\n  - typo\n", encoding="utf-8")
    with pytest.raises(BuildError, match="typo"):
        build.build(tutorials_dir=tutorials, out_dir=out, assets_dir=ROOT / "assets", clean=True, front=None)


def test_site_block_becomes_an_editor(tree):
    tutorials, out = tree
    body = (
        "# A page\n\n"
        "```html site=card\n<p>Hi</p>\n```\n"
        "```css site=card\np { color: red; }\n```\n"
    )
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    run_build(tree)
    page = (out / "tutorials/mod/page/index.html").read_text(encoding="utf-8")
    assert 'class="dl-site-editor"' in page
    assert 'sandbox="allow-scripts"' in page
    assert "site-editor.js" in page


def test_site_block_with_unknown_language_stops_the_build(tree):
    tutorials, _ = tree
    body = "# A page\n\n```python site=card\nprint('hi')\n```\n"
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    with pytest.raises(BuildError, match="unknown language"):
        run_build(tree)


def test_non_consecutive_site_blocks_stop_the_build(tree):
    tutorials, _ = tree
    body = (
        "# A page\n\n"
        "```html site=card\n<p>One</p>\n```\n\n"
        "Some prose in between.\n\n"
        "```css site=card\np { color: red; }\n```\n"
    )
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    with pytest.raises(BuildError, match="not consecutive"):
        run_build(tree)


def test_page_without_a_site_block_has_no_editor_script(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "plain")
    write_order(tutorials, ["plain"])
    run_build(tree)
    page = (out / "tutorials/mod/plain/index.html").read_text(encoding="utf-8")
    assert "site-editor.js" not in page


def test_site_editor_preview_keeps_links_inside_itself():
    """A srcdoc iframe without a base tag resolves a relative address, a
    same-page link included, against the parent page's own address rather
    than its own; clicking one then loads a copy of the parent page into
    the preview instead of jumping within it. `about:srcdoc` as the base
    keeps it inside."""
    script = (ROOT / "assets/site-editor.js").read_text(encoding="utf-8")
    assert '<base href="about:srcdoc">' in script


def test_front_page_without_front_md_is_the_list(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "first")
    write_order(tutorials, ["first"])

    build.build(tutorials_dir=tutorials, out_dir=out, assets_dir=ROOT / "assets", clean=True, front=None)

    page = (out / "index.html").read_text(encoding="utf-8")
    assert "<h1>Tutorials</h1>" in page
    assert '<h2 class="dl-module-heading">Module mod</h2>' in page


def test_sql_block_becomes_a_cell(tree):
    tutorials, out = tree
    body = "# A page\n\n```sql cell=students\nselect 1;\n```\n"
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    run_build(tree)
    page = (out / "tutorials/mod/page/index.html").read_text(encoding="utf-8")
    assert 'class="dl-sql-cell"' in page
    assert 'data-db="students"' in page
    assert "select 1;" in page
    assert "sql-cell.js" in page
    assert '<label for="sql-cell-page-0-input">SQL</label>' in page
    assert 'class="dl-sql-download"' in page
    assert 'class="dl-sql-load"' in page


def test_sql_persist_cell_is_marked_and_labelled(tree):
    tutorials, out = tree
    body = "# A page\n\n```sql cell=my-table persist\nselect 1;\n```\n"
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    run_build(tree)
    page = (out / "tutorials/mod/page/index.html").read_text(encoding="utf-8")
    assert 'data-persist="true"' in page
    assert '<label for="sql-cell-page-0-input">Your table</label>' in page
    assert "Saved in this browser" in page


def test_sql_cell_without_persist_has_no_persist_marker(tree):
    tutorials, out = tree
    body = "# A page\n\n```sql cell=students\nselect 1;\n```\n"
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    run_build(tree)
    page = (out / "tutorials/mod/page/index.html").read_text(encoding="utf-8")
    assert "data-persist" not in page
    assert "Saved in this browser" not in page


def test_sql_check_block_becomes_a_button(tree):
    tutorials, out = tree
    body = "# A page\n\n```sql-check db=quiz task=check_products_table\n```\n"
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    run_build(tree)
    page = (out / "tutorials/mod/page/index.html").read_text(encoding="utf-8")
    assert 'class="dl-sql-check"' in page
    assert 'data-db="quiz"' in page
    assert 'data-task="check_products_table"' in page
    assert 'class="dl-sql-check-run"' in page
    assert "sql-cell.js" in page


def test_sql_check_alone_still_pulls_in_sql_cell_js(tree):
    # A page with only a check block and no ```sql cell= block should
    # still get sql-cell.js, since the check button needs it too.
    tutorials, out = tree
    body = "# A page\n\n```sql-check db=quiz task=check_products_table\n```\n"
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    run_build(tree)
    page = (out / "tutorials/mod/page/index.html").read_text(encoding="utf-8")
    assert "sql-cell.js" in page
    assert 'class="dl-sql-cell"' not in page


def test_sql_cells_sharing_a_name_need_not_be_consecutive(tree):
    tutorials, out = tree
    body = (
        "# A page\n\n"
        "```sql cell=students\ncreate table t(id);\n```\n\n"
        "Some prose in between, unlike a site editor's blocks.\n\n"
        "```sql cell=students\nselect * from t;\n```\n"
    )
    write_tutorial(tutorials, "page", body)
    write_order(tutorials, ["page"])
    run_build(tree)  # would raise for a site= block; a sql cell allows this
    page = (out / "tutorials/mod/page/index.html").read_text(encoding="utf-8")
    assert page.count('data-db="students"') == 2


def test_page_without_a_sql_block_has_no_cell_script(tree):
    tutorials, out = tree
    write_tutorial(tutorials, "plain")
    write_order(tutorials, ["plain"])
    run_build(tree)
    page = (out / "tutorials/mod/plain/index.html").read_text(encoding="utf-8")
    assert "sql-cell.js" not in page
