#!/usr/bin/env python3
"""Markdown in, a static site out.

A tutorial is a markdown file with a YAML frontmatter block. This script
reads every one under `tutorials/`, checks it, renders it into
`assets/shell.html`, and writes `site/`. GitHub Actions runs it on every
push to `main` and publishes `site/` to GitHub Pages. `site/` is never
committed.

The shape is borrowed from dewlab's build (deweydex/dewlab, build.py),
not its code. That script runs Python in the browser, an authoring
editor and a topic tree, and is over four thousand lines. This one does
the part a reading site needs: frontmatter, ordering, link checks, a
shell, a contents page and a search index. What it checks, it checks
strictly. A mistake that stops the build is a mistake a student never
sees.

Layout it expects:

    tutorials/modules.yaml                  order of modules on the contents page
    tutorials/<module>/<series>.order.yaml  series title and reading order
    tutorials/<module>/<slug>/<slug>.md     the tutorial
    tutorials/<module>/<slug>/<slug>.glossary.yaml   optional, terms it introduces
    tutorials/<module>/<slug>/*             anything else is copied beside the page

Every tutorial's frontmatter needs: title, slug, module, module_title,
series, version. `status` is optional and defaults to `live`; `draft`
builds the page but keeps it off the contents page and out of search.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
import sys
from dataclasses import dataclass, field
from pathlib import Path

import markdown
import yaml

ROOT = Path(__file__).resolve().parent
TUTORIALS = ROOT / "tutorials"
ASSETS = ROOT / "assets"
OUT = ROOT / "site"

SITE_NAME = "dewadaba"
REPO_URL = "https://github.com/deweydex/dewadaba"

REQUIRED_FRONTMATTER = ("title", "slug", "module", "module_title", "series", "version")
VERSION_PATTERN = re.compile(r"^\d{4}\.\d{2}\.\d{2}\.\d+$")
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
STATUSES = ("live", "draft")


class BuildError(Exception):
    """Something in the source is wrong. The message says what and where."""


# ------------------------------------------------------------------ reading


@dataclass
class Tutorial:
    path: Path
    meta: dict
    body: str
    glossary: list[dict] = field(default_factory=list)

    @property
    def title(self) -> str:
        return str(self.meta["title"])

    @property
    def slug(self) -> str:
        return str(self.meta["slug"])

    @property
    def module(self) -> str:
        return str(self.meta["module"])

    @property
    def module_title(self) -> str:
        return str(self.meta["module_title"])

    @property
    def series(self) -> str:
        return str(self.meta["series"])

    @property
    def version(self) -> str:
        return str(self.meta["version"])

    @property
    def status(self) -> str:
        return str(self.meta.get("status", "live"))

    @property
    def is_live(self) -> bool:
        return self.status == "live"

    @property
    def rel_dir(self) -> Path:
        """Where the page lands, relative to the site root."""
        return Path("tutorials") / self.module / self.slug

    @property
    def url(self) -> str:
        return f"{self.rel_dir.as_posix()}/index.html"


def split_frontmatter(text: str, where: Path) -> tuple[dict, str]:
    """The YAML block between the first two `---` lines, and the rest."""
    if not text.startswith("---\n"):
        raise BuildError(f"{where}: no frontmatter block at the top of the file")
    end = text.find("\n---\n", 4)
    if end == -1:
        raise BuildError(f"{where}: frontmatter block is never closed")
    try:
        meta = yaml.safe_load(text[4:end]) or {}
    except yaml.YAMLError as err:
        raise BuildError(f"{where}: frontmatter is not valid YAML: {err}") from err
    if not isinstance(meta, dict):
        raise BuildError(f"{where}: frontmatter must be a mapping")
    body = text[end + 5 :]
    return meta, body


def validate_frontmatter(meta: dict, where: Path) -> None:
    missing = [key for key in REQUIRED_FRONTMATTER if not meta.get(key)]
    if missing:
        raise BuildError(f"{where}: frontmatter is missing {', '.join(missing)}")
    if not SLUG_PATTERN.match(str(meta["slug"])):
        raise BuildError(f"{where}: slug {meta['slug']!r} must be lower-case words joined by hyphens")
    if not VERSION_PATTERN.match(str(meta["version"])):
        raise BuildError(f"{where}: version {meta['version']!r} must look like 2026.09.04.1")
    status = meta.get("status", "live")
    if status not in STATUSES:
        raise BuildError(f"{where}: status {status!r} must be one of {', '.join(STATUSES)}")
    if str(meta["slug"]) != where.stem:
        raise BuildError(f"{where}: slug {meta['slug']!r} does not match the file name")
    if str(meta["module"]) != where.parent.parent.name:
        raise BuildError(f"{where}: module {meta['module']!r} does not match the folder it sits in")


def read_glossary(path: Path) -> list[dict]:
    """`<slug>.glossary.yaml`: a list of entries, each with at least a `term`."""
    if not path.exists():
        return []
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    entries = data.get("entries", data) if isinstance(data, dict) else data
    if not isinstance(entries, list):
        raise BuildError(f"{path}: expected a list of entries")
    for entry in entries:
        if not isinstance(entry, dict) or not entry.get("term"):
            raise BuildError(f"{path}: every entry needs a term")
    return entries


def read_tutorials(tutorials_dir: Path) -> list[Tutorial]:
    found = []
    for md_path in sorted(tutorials_dir.glob("*/*/*.md")):
        if md_path.stem != md_path.parent.name:
            continue  # a practice page or a note, not the tutorial itself
        text = md_path.read_text(encoding="utf-8")
        meta, body = split_frontmatter(text, md_path)
        validate_frontmatter(meta, md_path)
        glossary = read_glossary(md_path.with_name(f"{md_path.stem}.glossary.yaml"))
        found.append(Tutorial(md_path, meta, body, glossary))
    slugs = {}
    for tutorial in found:
        if tutorial.slug in slugs:
            raise BuildError(f"{tutorial.path}: slug {tutorial.slug!r} is also used by {slugs[tutorial.slug]}")
        slugs[tutorial.slug] = tutorial.path
    return found


def read_order(tutorials_dir: Path, tutorials: list[Tutorial]) -> tuple[list[str], dict]:
    """Module order from `modules.yaml`, and each series' title and order.

    Returns the module order and a mapping of (module, series) to
    {"title": ..., "order": [slugs]}. A tutorial that no order file lists
    stops the build, and so does a listed slug with no tutorial behind it.
    """
    modules_file = tutorials_dir / "modules.yaml"
    module_order = []
    if modules_file.exists():
        module_order = list((yaml.safe_load(modules_file.read_text(encoding="utf-8")) or {}).get("order", []))

    series: dict[tuple[str, str], dict] = {}
    for order_file in sorted(tutorials_dir.glob("*/*.order.yaml")):
        module = order_file.parent.name
        name = order_file.name[: -len(".order.yaml")]
        data = yaml.safe_load(order_file.read_text(encoding="utf-8")) or {}
        order = list(data.get("order", []))
        if not order:
            raise BuildError(f"{order_file}: the order list is empty")
        series[(module, name)] = {"title": str(data.get("series", name)), "order": order}

    by_slug = {t.slug: t for t in tutorials}
    listed = set()
    for (module, name), info in series.items():
        for slug in info["order"]:
            tutorial = by_slug.get(slug)
            if tutorial is None:
                raise BuildError(f"{module}/{name}.order.yaml lists {slug!r}, but there is no such tutorial")
            if tutorial.module != module or tutorial.series != name:
                raise BuildError(
                    f"{tutorial.path}: listed in {module}/{name}.order.yaml but its frontmatter says "
                    f"module {tutorial.module!r}, series {tutorial.series!r}"
                )
            listed.add(slug)
    for tutorial in tutorials:
        if tutorial.slug not in listed:
            raise BuildError(
                f"{tutorial.path}: not listed in tutorials/{tutorial.module}/{tutorial.series}.order.yaml, "
                "so it would never appear on the contents page"
            )
    return module_order, series


# ---------------------------------------------------------------- rendering


def make_markdown() -> markdown.Markdown:
    return markdown.Markdown(
        extensions=["fenced_code", "tables", "toc", "sane_lists", "attr_list"],
        extension_configs={"toc": {"toc_depth": "2-3", "permalink": False}},
    )


TUTORIAL_LINK = re.compile(r'href="tutorial:([a-z0-9-]+)(#[^"]*)?"')
IMG_TAG = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
ALT_ATTR = re.compile(r'\balt\s*=\s*"', re.IGNORECASE)


def resolve_links(rendered: str, tutorial: Tutorial, by_slug: dict[str, Tutorial]) -> str:
    """`tutorial:slug` becomes a relative link, or the build stops."""

    def replace(match: re.Match) -> str:
        target = by_slug.get(match.group(1))
        if target is None:
            raise BuildError(f"{tutorial.path}: links to tutorial:{match.group(1)}, which does not exist")
        href = relative_url(tutorial.rel_dir, Path(target.url))
        return f'href="{href}{match.group(2) or ""}"'

    return TUTORIAL_LINK.sub(replace, rendered)


def check_images(rendered: str, tutorial: Tutorial) -> None:
    for tag in IMG_TAG.findall(rendered):
        if not ALT_ATTR.search(tag):
            raise BuildError(f"{tutorial.path}: an image has no alt text: {tag}")


def relative_url(from_dir: Path, to_file: Path) -> str:
    """A relative href from a page in `from_dir` to `to_file`, both site-relative."""
    up = "../" * len(from_dir.parts)
    return up + to_file.as_posix()


def render_body(tutorial: Tutorial, by_slug: dict[str, Tutorial]) -> tuple[str, str]:
    """The tutorial's HTML and its table of contents."""
    md = make_markdown()
    rendered = md.convert(tutorial.body)
    rendered = rendered.replace("<pre><code", '<pre class="dl-static"><code')
    rendered = resolve_links(rendered, tutorial, by_slug)
    check_images(rendered, tutorial)
    return rendered, render_toc(md.toc_tokens)


def render_toc(tokens: list[dict]) -> str:
    """A closed fold listing the page's sections. Nothing for a page with one."""
    count = sum(1 + len(t.get("children", [])) for t in tokens)
    if count < 2:
        return ""

    def items(nodes: list[dict]) -> str:
        out = []
        for node in nodes:
            out.append(f'<li><a href="#{node["id"]}">{html.escape(node["name"])}</a>')
            if node.get("children"):
                out.append(f"<ul>{items(node['children'])}</ul>")
            out.append("</li>")
        return "".join(out)

    return (
        '<details class="dl-toc"><summary>On this page'
        f'<span class="dl-toc-count">{count} sections</span></summary>'
        f"<nav aria-label=\"Sections of this page\"><ul>{items(tokens)}</ul></nav></details>"
    )


def render_nav(tutorial: Tutorial, members: list[Tutorial], contents_href: str) -> str:
    """Previous, contents, next. Empty links are left out rather than greyed."""
    index = members.index(tutorial)
    parts = []
    if index > 0:
        prev = members[index - 1]
        parts.append(f'<a class="dl-nav-prev" href="{relative_url(tutorial.rel_dir, Path(prev.url))}">{html.escape(prev.title)}</a>')
    parts.append(f'<a class="dl-nav-up" href="{contents_href}">Contents</a>')
    if index < len(members) - 1:
        nxt = members[index + 1]
        parts.append(f'<a class="dl-nav-next" href="{relative_url(tutorial.rel_dir, Path(nxt.url))}">{html.escape(nxt.title)}</a>')
    return "".join(parts)


def render_search_box() -> str:
    return (
        '<div class="dl-search" id="dl-search">'
        '<label for="dl-search-input" class="dl-search-label">Search the tutorials</label>'
        '<input type="search" id="dl-search-input" class="dl-search-input" '
        'placeholder="A word from a title, or a term you want to find" autocomplete="off" '
        'aria-describedby="dl-search-hint">'
        '<p class="dl-panel-note" id="dl-search-hint">This matches titles and the terms each tutorial teaches.</p>'
        '<ul class="dl-search-results" id="dl-search-results" hidden></ul>'
        "</div>"
    )


def render_contents(tutorials: list[Tutorial], module_order: list[str], series: dict) -> str:
    """The contents page. One short introduction, the search box, then the list."""
    out = [
        "<h1>Tutorials</h1>",
        '<div class="dl-intro">',
        "<p>These tutorials are part of the web authoring and databases course. "
        "Everything here runs in your browser. There is nothing to install and "
        "no account to make.</p>",
        '<ul class="dl-intro-points">',
        "<li><strong>The list below is grouped into modules.</strong> Each module "
        "has one or more series. A series is meant to be read in order, from the top.</li>",
        "<li><strong>The Settings button changes how the page looks.</strong> You can "
        "choose a theme, a typeface, a text size and a line width. The choices stay "
        "with you from page to page.</li>",
        "<li><strong>Nothing you do here is scored.</strong> Nothing you type leaves your browser.</li>",
        "</ul>",
        f'<p class="dl-intro-tree">The course map, with links to every part of the course, is in the '
        f'<a href="{REPO_URL}#readme">README</a>.</p>',
        "</div>",
        render_search_box(),
    ]
    modules_seen = []
    for tutorial in tutorials:
        if tutorial.module not in modules_seen:
            modules_seen.append(tutorial.module)
    ordered = [m for m in module_order if m in modules_seen] + sorted(set(modules_seen) - set(module_order))
    titles = {t.module: t.module_title for t in tutorials}
    by_slug = {t.slug: t for t in tutorials}

    for module in ordered:
        out.append(f'<h2 class="dl-module-heading">{html.escape(titles[module])}</h2>')
        module_series = [(key, info) for key, info in series.items() if key[0] == module]
        for (_, name), info in module_series:
            live = [by_slug[s] for s in info["order"] if by_slug[s].is_live]
            if not live:
                continue
            if len(module_series) > 1:
                out.append(f"<h3>{html.escape(info['title'])}</h3>")
            out.append('<ol class="dl-contents">')
            for t in live:
                out.append(f'<li><a href="{t.url}">{html.escape(t.title)}</a></li>')
            out.append("</ol>")
    return "\n".join(out)


def render_footer(root_base: str) -> str:
    return (
        f'<p>{SITE_NAME} is part of the web authoring and databases course. '
        f'The text and code are free to copy and change under the MIT licence. '
        f'<a href="{REPO_URL}">The source is on GitHub.</a></p>'
    )


# -------------------------------------------------------------------- shell

TOKEN = re.compile(r"\{\{([A-Z_]+)\}\}")


def fill_shell(shell: str, values: dict[str, str], where: str) -> str:
    """Every token in the template filled, and every value used. Either
    mismatch is a mistake that would otherwise ship as a literal `{{X}}`."""
    wanted = set(TOKEN.findall(shell))
    given = set(values)
    if wanted - given:
        raise BuildError(f"{where}: shell tokens not filled: {', '.join(sorted(wanted - given))}")
    if given - wanted:
        raise BuildError(f"{where}: values with no token in the shell: {', '.join(sorted(given - wanted))}")
    return TOKEN.sub(lambda m: values[m.group(1)], shell)


def content_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:10]


def asset_url(root_base: str, name: str, assets_dir: Path) -> str:
    """`assets/site.css?v=<hash>`, so a changed file is never served stale."""
    return f"{root_base}assets/{name}?v={content_hash(assets_dir / name)}"


def page_values(*, title: str, root_base: str, crumbs: str, nav: str, toc: str, body: str,
                page_script: str, meta: str, assets_dir: Path) -> dict[str, str]:
    return {
        "TITLE": html.escape(title),
        "ROOT_BASE": root_base,
        "STYLE_URL": asset_url(root_base, "site.css", assets_dir),
        "FONTS_CSS_URL": asset_url(root_base, "accessible-fonts.css", assets_dir),
        "SETTINGS_URL": asset_url(root_base, "settings.js", assets_dir),
        "CRUMBS": crumbs,
        "NAV_PREV_NEXT": nav,
        "TOC": toc,
        "BODY": body,
        "FOOTER": render_footer(root_base),
        "PAGE_SCRIPT": page_script,
        "META": meta,
    }


# -------------------------------------------------------------------- build


def build(tutorials_dir: Path = TUTORIALS, out_dir: Path = OUT, assets_dir: Path = ASSETS,
          clean: bool = False) -> list[Path]:
    """Write the whole site. Returns every page written."""
    if clean and out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    tutorials = read_tutorials(tutorials_dir)
    module_order, series = read_order(tutorials_dir, tutorials)
    by_slug = {t.slug: t for t in tutorials}
    shell = (assets_dir / "shell.html").read_text(encoding="utf-8")

    # Assets first: the pages link to them by content hash.
    copy_assets(assets_dir, out_dir / "assets")

    written = []
    for (module, name), info in series.items():
        members = [by_slug[s] for s in info["order"]]
        for tutorial in members:
            written.append(write_tutorial(tutorial, members, info["title"], shell, out_dir, assets_dir, by_slug))

    written.append(write_contents(tutorials, module_order, series, shell, out_dir, assets_dir))
    write_search_index(tutorials, series, out_dir)
    return written


def copy_assets(assets_dir: Path, target: Path) -> None:
    target.mkdir(parents=True, exist_ok=True)
    for item in assets_dir.iterdir():
        if item.name == "shell.html":
            continue
        dest = target / item.name
        if item.is_dir():
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(item, dest)
        else:
            shutil.copy2(item, dest)


def write_tutorial(tutorial: Tutorial, members: list[Tutorial], series_title: str, shell: str,
                   out_dir: Path, assets_dir: Path, by_slug: dict[str, Tutorial]) -> Path:
    root_base = "../" * len(tutorial.rel_dir.parts)
    body, toc = render_body(tutorial, by_slug)
    ordered_live = [m for m in members if m.is_live] if tutorial.is_live else members
    nav = render_nav(tutorial, ordered_live, f"{root_base}index.html")
    crumbs = f"{html.escape(tutorial.module_title)} · {html.escape(series_title)}"
    meta = (
        f'<meta name="tutorial-slug" content="{html.escape(tutorial.slug)}">\n'
        f'<meta name="tutorial-module" content="{html.escape(tutorial.module)}">\n'
        f'<meta name="tutorial-version" content="{html.escape(tutorial.version)}">'
    )
    page = fill_shell(shell, page_values(
        title=tutorial.title, root_base=root_base, crumbs=crumbs, nav=nav, toc=toc,
        body=body, page_script="", meta=meta, assets_dir=assets_dir,
    ), str(tutorial.path))

    target_dir = out_dir / tutorial.rel_dir
    target_dir.mkdir(parents=True, exist_ok=True)
    for item in tutorial.path.parent.iterdir():
        if item.is_file() and item.suffix not in (".md", ".yaml", ".yml"):
            shutil.copy2(item, target_dir / item.name)
    target = target_dir / "index.html"
    target.write_text(page, encoding="utf-8")
    return target


def write_contents(tutorials: list[Tutorial], module_order: list[str], series: dict, shell: str,
                   out_dir: Path, assets_dir: Path) -> Path:
    body = render_contents(tutorials, module_order, series)
    search_url = asset_url("", "search.js", assets_dir)
    page = fill_shell(shell, page_values(
        title="Tutorials", root_base="", crumbs="", nav="", toc="", body=body,
        page_script=f'<script src="{search_url}"></script>', meta="", assets_dir=assets_dir,
    ), "contents page")
    target = out_dir / "index.html"
    target.write_text(page, encoding="utf-8")
    return target


def write_search_index(tutorials: list[Tutorial], series: dict, out_dir: Path) -> Path:
    """One row per live tutorial, for `assets/search.js`: what a reader might
    type, which is the title, the module and series names, and the terms
    the tutorial's glossary file says it introduces."""
    documents = []
    for t in tutorials:
        if not t.is_live:
            continue
        documents.append({
            "title": t.title,
            "module": t.module,
            "moduleTitle": t.module_title,
            "series": t.series,
            "seriesTitle": series[(t.module, t.series)]["title"],
            "url": t.url,
            "terms": sorted({str(e["term"]) for e in t.glossary}),
        })
    target = out_dir / "assets" / "search-index.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(documents, ensure_ascii=False), encoding="utf-8")
    return target


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build site/ from tutorials/.")
    parser.add_argument("--clean", action="store_true", help="remove site/ first")
    args = parser.parse_args(argv)
    try:
        pages = build(clean=args.clean)
    except BuildError as err:
        print(f"build failed: {err}", file=sys.stderr)
        return 1
    print(f"wrote {len(pages)} pages to {OUT.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
