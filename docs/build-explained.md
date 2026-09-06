# `build.py`, explained

`build.py` is the one program that turns every markdown file in
`tutorials/` into the actual site in `site/`. It is the biggest file in
the repository — the file's own docstrings on almost every function
already cover the details of what each one does and why; this document
is a map through it.

---

## The big idea: one tutorial file becomes one finished page, through a shared shell

Run `python3 build.py`, and roughly this happens, in order:

1. Every `.md` file under `tutorials/` is **read and validated**
   (`read_tutorials()`): its YAML frontmatter is parsed
   (`split_frontmatter()`) and checked (`validate_frontmatter()`) — a
   missing required field, a malformed version, a slug that does not
   match its own file name, all stop the build rather than shipping a
   page nobody meant to.
2. Tutorials are grouped into **series** and **modules**
   (`read_order()`/`read_modules()`), checked against each series' own
   `.order.yaml` file — a tutorial no order file lists, or an order file
   listing a tutorial that does not exist, both stop the build.
3. Each tutorial's body goes through **markdown conversion**
   (`render_body()`), which is also where every fenced block kind this
   site knows — the web track's `site=`, the data track's `sql cell=`/
   `sql-check`/`py cell=`, the full-stack track's `app=` — gets pulled
   out before markdown ever sees it, converted separately, and stitched
   back in as real interactive markup. Cross-tutorial links
   (`tutorial:slug#anchor`) are resolved to real relative URLs here too,
   or the build fails, naming exactly which link is broken.
4. Every page is **assembled into the shared shell**
   (`assets/shell.html`, via `fill_shell()`) and **written** to `site/`
   — a tutorial page, the contents page (which is also the front page,
   when `tutorials/front.md` exists), and the standalone workspace page.
5. A **search index** (`write_search_index()`) is written alongside
   everything else: one row per live tutorial, for `assets/search.js` to
   read client-side.

A `Tutorial` object (near the top of the file) is the one shape that
flows through almost this entire pipeline — its own small set of
properties (`slug`, `module`, `url`, `is_live`, …) is worth reading
first, since so much of the rest of the file is "take a `Tutorial`, or a
list of them, and do something with it."

---

## Reading order

The file's own section-header comments (`# --- name ---`) are the real
table of contents; this groups them into a few bigger phases.

1. **Reading** (`Tutorial`, `split_frontmatter()`, `validate_frontmatter()`,
   `read_glossary()`, `read_tutorials()`, `read_order()`, `read_modules()`)
   — turns the files under `tutorials/` into validated, in-memory data,
   with every structural mistake this site can catch caught here, before
   any HTML is generated at all.
2. **Rendering** (`make_markdown()`, `resolve_links()`, `check_images()`,
   `relative_url()`) — the small shared pieces every page's body passes
   through: one configured `markdown.Markdown()` instance, cross-tutorial
   link resolution, and the alt-text check every `<img>` has to pass.
3. **The four fenced-block kinds**, each its own `extract_*`/`render_*`
   pair — `extract_site_editors()`/`render_site_editor()`/
   `site_editor_markup()`, `extract_sql_cells()`/`render_sql_cell()`,
   `extract_sql_checks()`/`render_sql_check()`,
   `extract_py_cells()`/`render_py_cell()`,
   `extract_app_cells()`/`render_app_cell()`. See `ARCHITECTURE.md` §1
   step 2 for the shared shape all five follow (a numbered placeholder
   comment stands in for the block while markdown converts the rest of
   the page, then `render_*` fills it back in with real markup) and §2/§3
   for what each cell kind actually does once a reader's browser has it.
   `render_workspace()`/`render_workspace_card()` sit in this section
   too: the workspace page reuses `site_editor_markup()` directly rather
   than going through `render_site_editor()`, since it has no tutorial to
   render inside.
4. **`render_body()`** — ties every extraction pass and the markdown
   conversion together, in order, and is also where a page's required
   Pyodide packages get decided (`ARCHITECTURE.md` §1 step 3, §3).
5. **Page furniture** (`render_toc()`, `render_nav()`, `render_search_box()`)
   — the table-of-contents fold, the previous/contents/next links, the
   contents page's search box.
6. **The front page** (`Front`, `read_front()`, `render_front()`,
   `render_contents()`) — `tutorials/front.md`'s title, opening prose and
   `doors:` list become the top of the contents page when the file
   exists; `render_contents()` builds the rest (every module, in order,
   with its series and their live tutorials) regardless of whether a
   front page exists at all.
7. **The student feedback pipeline** (`feedback_enabled()`,
   `report_issue_url()`, `report_doors_links()`, `report_doors_html()`,
   `cell_report_markup()`) — see `ARCHITECTURE.md` §4 for the mechanics
   and `CONTRIBUTING.md`'s own section on it for the workflows that act on
   a report once GitHub has it.
8. **The shell** (`TOKEN`, `fill_shell()`, `content_hash()`, `asset_url()`,
   `page_values()`) — every page is the same `assets/shell.html` template
   with `{{TOKEN}}` placeholders substituted; `fill_shell()` fails loudly
   on a token the page didn't fill or a value the template has no token
   for, so the two can never silently drift apart. `asset_url()` appends
   a content hash to every asset link, so a changed file is never served
   stale from a browser's own cache.
9. **`build()` and the `write_*` functions** — `build()` is the one
   function `main()` calls: read everything, then write every tutorial
   page, the contents page, the workspace page, and the search index, in
   that order (assets are copied first, since pages link to them by
   content hash). Each `write_*` function is a thin, page-specific
   wrapper around `page_values()`/`fill_shell()`.

---

## Two things worth understanding on their own

**Why placeholders, not direct substitution.** Every `extract_*` function
in phase 3 replaces a fenced block with a plain HTML comment
(`<!--SQL-CELL:0-->` and so on) rather than rendering its final markup
immediately. That is deliberate: the *rest* of the page's markdown still
has to go through `markdown.Markdown()` after extraction, and a block's
real markup — a `<textarea>`, a `<button>`, raw HTML that must survive
untouched — would not survive that conversion intact. Pulling every
block out first, converting what's left, then substituting real markup
back in afterward is what lets a tutorial writer put a code cell inside a
list item, or right after a heading, with no special-casing.

**Why every `extract_*` function takes `path` as an argument it barely
uses.** It exists purely so a `BuildError` raised deep inside one — "app
blocks named 'x' are not consecutive," say — can say exactly which file
is wrong. A build that fails without naming the file forces whoever reads
the error to go looking for it themselves.

---

## Where to look for something specific

- **"Why does a slug have to match its own file name and folder?"** —
  `validate_frontmatter()`'s last two checks. Both exist so a tutorial's
  identity is decided by where it sits in `tutorials/`, not by what its
  own frontmatter claims — the same reasoning `CONTRIBUTING.md`'s "a slug
  is a contract" trap describes from the other direction.
- **"What happens to a tutorial with `status: draft`?"** — it still
  builds (`build()` writes every tutorial in `series.items()`
  regardless), but `Tutorial.is_live` is `False` for it, and every place
  that filters on `is_live` — `render_contents()`'s per-series list,
  `write_search_index()`'s rows, `render_nav()`'s previous/next — leaves
  it out. The page exists at its URL; nothing links to it.
- **"Where does a page's `<title>` actually come from?"** — `page_values()`'s
  `TITLE` key, `html.escape()`d there and nowhere else — every caller
  passes a plain string in.
- **"Why does `render_contents()` take `planned`/`notes` as separate
  arguments from `series`, instead of reading them off each `Tutorial`
  directly?"** — `tutorials/modules.yaml`'s `planned:` block describes a
  module with *no tutorials in it yet*, so there is no `Tutorial` object
  to read a note off in the first place; `read_modules()` is what turns
  that file into the two dicts `render_contents()` needs.
