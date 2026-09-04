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
shell, a contents page, a search index, and the web track's site editor
(a fenced block tagged `site=name` becomes a live HTML/CSS/JS pane, per
`planning/CONSOLIDATION_PLAN.md` section 13). The front page is written
for the student: `tutorials/front.md` gives its opening and its two
doors, and the list of pages follows. `README.md` stays the longer map
for people who read the repository. What it checks, it checks strictly.
A mistake that stops the build is a mistake a student never sees.

Layout it expects:

    tutorials/front.md                      the front page's opening and its doors
    tutorials/modules.yaml                  order of modules, planned modules, notes
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

SITE_NAME = "dewstack"
REPO_URL = "https://github.com/deweydex/dewstack"
# The front page's opening and its doors live at tutorials/front.md. Without
# that file the front page is the list of tutorials alone.

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


def read_modules(tutorials_dir: Path) -> dict:
    """`modules.yaml` beyond the order: the modules planned but not yet
    written, each with a title and a note, and one note per module."""
    path = tutorials_dir / "modules.yaml"
    if not path.exists():
        return {"planned": {}, "notes": {}}
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    planned = data.get("planned") or {}
    for module, info in planned.items():
        if not isinstance(info, dict) or not info.get("title") or not info.get("note"):
            raise BuildError(f"{path}: planned module {module!r} needs a title and a note")
    return {"planned": planned, "notes": data.get("notes") or {}}


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


# -------------------------------------------------------------- site editor

# A fenced block tagged `site=name`, as `python exec` would mark a cell
# (plan, CONSOLIDATION_PLAN.md section 13). Consecutive blocks sharing a
# name become the HTML, CSS and JavaScript panes of one editor.
SITE_BLOCK = re.compile(r"```(?P<lang>[a-zA-Z]+) site=(?P<name>[a-z0-9-]+)\n(?P<code>.*?)\n```\n?", re.DOTALL)
SITE_LANGS = {"html": "HTML", "css": "CSS", "js": "JavaScript"}
SITE_PLACEHOLDER = "<!--SITE-EDITOR:{}-->"


def extract_site_editors(body: str, path: Path) -> tuple[str, list[dict]]:
    """Pulls `site=` fenced blocks out of the markdown source, leaving a
    placeholder that `render_site_editor()` fills back in once the rest of
    the page has been through markdown. Blocks sharing a name must sit back
    to back with nothing but blank lines between them; the source is the
    student's whole site as one glance, not the same name scattered
    through the page's prose."""
    matches = list(SITE_BLOCK.finditer(body))
    if not matches:
        return body, []

    runs: list[list[re.Match]] = [[matches[0]]]
    for prev, cur in zip(matches, matches[1:]):
        same_name = cur.group("name") == prev.group("name")
        only_blank_between = body[prev.end():cur.start()].strip() == ""
        if same_name and only_blank_between:
            runs[-1].append(cur)
        else:
            runs.append([cur])

    editors: list[dict] = []
    seen_names: set[str] = set()
    for run in runs:
        name = run[0].group("name")
        if name in seen_names:
            raise BuildError(f"{path}: site blocks named {name!r} are not consecutive")
        seen_names.add(name)
        files: dict[str, str] = {}
        for match in run:
            lang = match.group("lang").lower()
            if lang not in SITE_LANGS:
                raise BuildError(
                    f"{path}: site block {name!r} has an unknown language {match.group('lang')!r}; "
                    f"expected one of {', '.join(SITE_LANGS)}"
                )
            if lang in files:
                raise BuildError(f"{path}: site block {name!r} has two {lang} files")
            files[lang] = match.group("code")
        editors.append({"name": name, "files": files})

    new_body = body
    for index, run in reversed(list(enumerate(runs))):
        start, end = run[0].start(), run[-1].end()
        new_body = new_body[:start] + f"\n\n{SITE_PLACEHOLDER.format(index)}\n\n" + new_body[end:]
    return new_body, editors


def render_site_editor(editor: dict, index: int, tutorial: Tutorial) -> str:
    """One editor: a pane per file the block supplied, a sandboxed preview,
    a width control so a reader can watch a responsive layout wrap, and
    reset/download buttons. No saving here: the student's own fork is
    where changes are kept (plan, section 13)."""
    files = editor["files"]
    editor_id = f"site-editor-{tutorial.slug}-{editor['name']}"

    panes = []
    for lang, label in SITE_LANGS.items():
        if lang not in files:
            continue
        field_id = f"{editor_id}-{lang}"
        panes.append(
            f'<div class="dl-site-pane">'
            f'<label for="{field_id}">{label}</label>'
            f'<textarea id="{field_id}" class="dl-site-input" data-lang="{lang}" '
            f'spellcheck="false" autocapitalize="off">{html.escape(files[lang])}</textarea>'
            f"</div>"
        )

    return (
        f'<div class="dl-site-editor" id="{editor_id}" data-site-name="{html.escape(editor["name"])}">'
        f'<div class="dl-site-panes">{"".join(panes)}</div>'
        f'<div class="dl-site-preview">'
        f'<div class="dl-site-preview-controls">'
        f'<label for="{editor_id}-width">Preview width</label>'
        f'<input type="range" id="{editor_id}-width" class="dl-site-width" '
        f'min="30" max="100" step="5" value="100" '
        f'aria-describedby="{editor_id}-width-readout">'
        f'<output id="{editor_id}-width-readout" for="{editor_id}-width">100%</output>'
        f"</div>"
        f'<div class="dl-site-frame-wrap">'
        f'<iframe class="dl-site-frame" sandbox="allow-scripts" title="Live preview"></iframe>'
        f"</div>"
        f"</div>"
        f'<div class="dl-site-actions">'
        f'<button type="button" class="dl-site-reset">Reset</button>'
        f'<button type="button" class="dl-site-download">Download these files</button>'
        f"</div>"
        f"</div>"
    )


def render_body(tutorial: Tutorial, by_slug: dict[str, Tutorial]) -> tuple[str, str, bool]:
    """The tutorial's HTML, its table of contents, and whether it needs the
    site editor's script."""
    source, editors = extract_site_editors(tutorial.body, tutorial.path)
    md = make_markdown()
    rendered = md.convert(source)
    rendered = rendered.replace("<pre><code", '<pre class="dl-static"><code')
    rendered = resolve_links(rendered, tutorial, by_slug)
    check_images(rendered, tutorial)
    for index, editor in enumerate(editors):
        rendered = rendered.replace(SITE_PLACEHOLDER.format(index), render_site_editor(editor, index, tutorial))
    return rendered, render_toc(md.toc_tokens), bool(editors)


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


@dataclass
class Front:
    """The front page's opening: its title, its introduction as HTML, and its
    doors, each resolved to a real href."""
    title: str
    intro_html: str
    doors: list[dict]


DOOR_FIELDS = ("title", "href", "text", "ends")


def read_front(path: Path, by_slug: dict[str, Tutorial]) -> Front:
    """`tutorials/front.md`: a title and a `doors:` list in the frontmatter,
    and the opening paragraph and points in the body.

    A door opens on `tutorial:<slug>` or on a full web address. A slug that
    does not exist stops the build, as a dead link on the front page would
    be the first broken thing a student met.
    """
    text = path.read_text(encoding="utf-8")
    meta, body = split_frontmatter(text, path)
    if not meta.get("title"):
        raise BuildError(f"{path}: frontmatter needs a title")
    doors = meta.get("doors") or []
    if not isinstance(doors, list):
        raise BuildError(f"{path}: doors must be a list")
    resolved = []
    for door in doors:
        missing = [k for k in DOOR_FIELDS if not (isinstance(door, dict) and door.get(k))]
        if missing:
            raise BuildError(f"{path}: a door is missing {', '.join(missing)}")
        href = str(door["href"])
        if href.startswith("tutorial:"):
            slug = href[len("tutorial:"):]
            target = by_slug.get(slug)
            if target is None:
                raise BuildError(f"{path}: a door opens on tutorial:{slug}, which does not exist")
            href = target.url
        elif not href.startswith(("http://", "https://")):
            raise BuildError(f"{path}: a door's href must be tutorial:<slug> or a full web address, not {href!r}")
        resolved.append({**door, "href": href})
    intro = make_markdown().convert(body)
    # The body's first list is the points a student arrives with questions
    # about, styled as dewlab styles its own.
    intro = intro.replace("<ul>", '<ul class="dl-intro-points">', 1)
    return Front(str(meta["title"]), intro, resolved)


def render_front(front: Front) -> str:
    """The top of the front page: the title, the opening, and the doors."""
    out = [f"<h1>{html.escape(front.title)}</h1>", '<div class="dl-intro">', front.intro_html, "</div>"]
    if front.doors:
        out.append("<h2>Where to begin</h2>")
        out.append('<div class="dl-doors">')
        for door in front.doors:
            classes = "dl-door dl-door-interim" if door.get("interim") else "dl-door"
            out.append(f'<a class="{classes}" href="{html.escape(door["href"], quote=True)}">')
            out.append(f"<h3>{html.escape(str(door['title']))}</h3>")
            out.append(f"<p>{html.escape(str(door['text']))}</p>")
            out.append(f'<p class="dl-door-ends"><strong>At the end:</strong> {html.escape(str(door["ends"]))}</p>')
            out.append("</a>")
        out.append("</div>")
    return "\n".join(out)


def render_contents(tutorials: list[Tutorial], module_order: list[str], series: dict,
                    front_html: str | None = None, planned: dict | None = None,
                    notes: dict | None = None) -> str:
    """The front page: the opening and the doors when `front.md` gives them,
    the search box, then every module in order with its pages.

    A module in `planned` with no pages yet gets its heading and one line,
    so the shape of the course shows before all of it is written. A module
    in `notes` gets one line under its list.
    """
    planned = planned or {}
    notes = notes or {}
    if front_html:
        out = [front_html, render_search_box()]
    else:
        out = [
            "<h1>Tutorials</h1>",
            '<div class="dl-intro">',
            "<p>These tutorials are part of the web authoring and databases course. "
            "Everything here runs in your browser. There is nothing to install and "
            "no account to make.</p>",
            "</div>",
            render_search_box(),
        ]
    modules_seen = []
    for tutorial in tutorials:
        if tutorial.module not in modules_seen:
            modules_seen.append(tutorial.module)
    for module in module_order:
        if module not in modules_seen and module not in planned:
            raise BuildError(f"modules.yaml lists {module!r}, which has no pages and no planned entry")
    ordered = [m for m in module_order if m in modules_seen or m in planned]
    ordered += sorted(set(modules_seen) - set(module_order))
    titles = {t.module: t.module_title for t in tutorials}
    by_slug = {t.slug: t for t in tutorials}
    md = make_markdown()

    def note_html(text: str) -> str:
        md.reset()
        return f'<div class="dl-module-note">{md.convert(str(text))}</div>'

    for module in ordered:
        if module in modules_seen:
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
        else:
            info = planned[module]
            out.append(f'<h2 class="dl-module-heading">{html.escape(str(info["title"]))}</h2>')
            out.append(note_html(info["note"]))
        if module in notes:
            out.append(note_html(notes[module]))
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
          clean: bool = False, front: Path | None | str = "default") -> list[Path]:
    """Write the whole site. Returns every page written.

    `front` is the markdown that opens the front page. Left alone, it is
    `front.md` inside `tutorials_dir`. None, or a path that does not exist,
    gives a front page that is only the list."""
    if front == "default":
        front = tutorials_dir / "front.md"
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

    modules = read_modules(tutorials_dir)
    opening = read_front(front, by_slug) if front is not None and front.exists() else None
    written.append(write_contents(tutorials, module_order, series, shell, out_dir, assets_dir, opening, modules))
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
    body, toc, has_site_editor = render_body(tutorial, by_slug)
    ordered_live = [m for m in members if m.is_live] if tutorial.is_live else members
    nav = render_nav(tutorial, ordered_live, f"{root_base}index.html")
    crumbs = f"{html.escape(tutorial.module_title)} · {html.escape(series_title)}"
    meta = (
        f'<meta name="tutorial-slug" content="{html.escape(tutorial.slug)}">\n'
        f'<meta name="tutorial-module" content="{html.escape(tutorial.module)}">\n'
        f'<meta name="tutorial-version" content="{html.escape(tutorial.version)}">'
    )
    page_script = ""
    if has_site_editor:
        editor_url = asset_url(root_base, "site-editor.js", assets_dir)
        page_script = f'<script src="{editor_url}"></script>'
    page = fill_shell(shell, page_values(
        title=tutorial.title, root_base=root_base, crumbs=crumbs, nav=nav, toc=toc,
        body=body, page_script=page_script, meta=meta, assets_dir=assets_dir,
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
                   out_dir: Path, assets_dir: Path, front: Front | None = None,
                   modules: dict | None = None) -> Path:
    modules = modules or {"planned": {}, "notes": {}}
    title = front.title if front else "Tutorials"
    front_html = render_front(front) if front else None
    body = render_contents(tutorials, module_order, series, front_html,
                           modules.get("planned"), modules.get("notes"))
    search_url = asset_url("", "search.js", assets_dir)
    page = fill_shell(shell, page_values(
        title=title, root_base="", crumbs="", nav="", toc="", body=body,
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
