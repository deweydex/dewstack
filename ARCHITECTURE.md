# Architecture

This is the map for someone reading the code, not writing a tutorial.
`README.md` is where a tutorial writer starts; this document goes underneath
it: how a tutorial's markdown becomes a page a student can run code in, what
runs where, and how the pieces talk to each other.

The short version, before the long one: there is no backend. Nothing here is
a server you deploy, a database you migrate, or an API you version. Two
separate programs, neither aware the other is running:

1. **`build.py`** — a Python script, run once per push by GitHub Actions,
   that turns the markdown in `tutorials/` into the static HTML in `site/`,
   which GitHub Pages then just serves as files.
2. **`assets/sql-cell.js`** and **`assets/site-editor.js`** — JavaScript
   that ships inside a built page and runs entirely in a *student's* browser
   tab. Between them they boot a real Python interpreter (Pyodide, Python
   compiled to WebAssembly) client-side for the SQL, Python and full-stack
   cell kinds, and a sandboxed live preview for the web track's HTML/CSS/JS
   blocks. No student code ever reaches a server dewstack controls, because
   there is no server for it to reach.

The shape of this document, and of the build itself, is borrowed from
dewlab's own (`deweydex/dewlab`, `ARCHITECTURE.md` and `build.py`) — not its
code. dewlab's build runs a whole authoring editor and a topic tree and is
over four thousand lines; this one does the smaller part a reading site
needs, described in `build.py`'s own opening docstring.

---

## 1. The build: markdown in, static site out

`build.py` is a single script that reads `tutorials/**/*.md` and writes
`site/`. It runs locally when a writer previews their work, and again,
identically, in `.github/workflows/deploy.yml` on every push to `main`.
`site/` is never committed — gitignored, rebuilt from scratch every time,
which is what stops a published page from drifting out of sync with the
markdown that describes it.

A tutorial is a folder, `tutorials/<module>/<slug>/`, holding its markdown
at `<slug>.md` and, optionally, `<slug>.glossary.yaml`. Where a page ends up
is decided by its frontmatter's `module` and `slug`, never by where its
source file sits.

The pipeline, roughly in the order the code runs it:

1. **Parse and validate frontmatter.** `split_frontmatter()` reads the YAML
   block at the top of a tutorial; `validate_frontmatter()` checks the
   required fields are there. A tutorial that fails this stops the whole
   build — a build that silently skips a broken file is a build that ships a
   stale page nobody asked for.

2. **Pull the site's four kinds of fenced block out before markdown ever
   sees them**, each its own `extract_*`/`render_*` pair:
   - `extract_site_editors()` / `render_site_editor()` — the web track's
     `site=name` blocks: HTML, CSS and JS panes beside a live sandboxed
     preview (§2).
   - `extract_sql_cells()` / `render_sql_cell()` and `extract_sql_checks()`
     / `render_sql_check()` — the data track's `sql cell=name` blocks and
     the self-check quiz's `sql check=name` blocks (§3).
   - `extract_py_cells()` / `render_py_cell()` — `py cell=name` blocks:
     pandas and matplotlib, run against the same SQLite connections a SQL
     cell on the page opened (§3).
   - `extract_app_cells()` / `render_app_cell()` — the full-stack track's
     `html app=name` / `css app=name` / `js app=name` groups, rendered
     straight into the page rather than into a sandboxed frame (§3).

   Every `extract_*` function replaces its blocks with a numbered
   placeholder comment and records the block's own content as a small dict;
   every `render_*` function turns one of those dicts into the real markup,
   substituted back in once markdown conversion is done. Pulling both out
   first and reinserting rendered markup afterward is what keeps a tutorial
   writer from ever having to think about a fence's contents being read as
   markdown by mistake.

3. **Convert what's left with `markdown.Markdown()`** (`make_markdown()`),
   then reinsert every placeholder. `render_body()` is where all four
   extraction passes and the conversion itself happen, in order, and it is
   also where a page's required Pyodide packages get decided: `sqlite3`
   alone if the page has any SQL cell, check, Python cell or app cell;
   `pandas` and `matplotlib` on top of that if it has a Python cell. A page
   with none of the four loads no Pyodide packages at all.

4. **Resolve cross-tutorial links and validate structure.** A
   `tutorial:slug#anchor` link becomes a real relative href
   (`resolve_links()`), or the build fails — a dead link is a bug here, not
   a warning. `<img>` without `alt` fails the same way (`check_images()`).

5. **Assemble navigation.** `read_order()`/`read_modules()` read the
   `.order.yaml` and `modules.yaml` files that decide a series' reading
   order and a module's place in the whole course; `render_nav()` builds the
   previous/next links every page carries.

6. **Render into `assets/shell.html`.** Every page — a tutorial, the
   contents page, the workspace — is the same template with `{{TOKEN}}`
   placeholders filled by `fill_shell()`. A token the template doesn't fill,
   or a page that doesn't fill every token the template has, fails the
   build.

7. **Stamp the footer.** `render_footer()` builds the `{{FOOTER}}` token
   every page fills: the copyright line, and — unless `feedback_enabled()`
   says otherwise — the "three doors" disclosure for reporting something
   about that page (§4).

8. **Write the pages, the contents page, the workspace, and the search
   index.** `write_tutorial()`, `write_contents()`, `write_workspace()` and
   `write_search_index()` are the functions that actually touch `site/`;
   `build()` calls them in order once everything above has been checked.

---

## 2. The web track: the site editor and its sandboxed preview

`assets/site-editor.js` turns a `site=name` block into `.dl-site-editor`: an
HTML pane, a CSS pane, a JS pane, a live preview, and a console. Nothing
here is saved across a visit — a reader's changes live only in the page
until they refresh; a "Download these files" button is the bridge to doing
real, kept work in the student's own fork.

Two run models, on purpose (`planning/CONSOLE_AND_WORKSPACE.md`, decided
2026-09-06). HTML and CSS are live: the preview redraws on every keystroke
in either pane, because a stylesheet is a state and the lesson is watching
a box change colour under your hand. JavaScript is a program, and a program
runs when asked — the JS pane does nothing until Run (or Ctrl/Cmd+Enter
inside it), and the preview keeps the last script that *did* run until
then, so retyping a colour never silently re-executes a half-edited script.

The preview is a real `<iframe sandbox="allow-scripts">`, deliberately with
no `allow-same-origin` — the two together are what makes the iframe an
isolated realm the parent page cannot reach into, and it in turn cannot
reach the parent page or the network beyond what a plain `<script>` in a
sandboxed frame is already allowed. That isolation is exactly why the
full-stack track (§3) could not reuse this component once its cells needed
to call back into Pyodide: a sandboxed frame with no `allow-same-origin`
cannot see a `window.dlQuery` sitting on the page that embeds it. The
console works by a small relay script injected into the preview document
ahead of the reader's own code, replacing `console.log`/`warn`/`error` with
versions that also `postMessage` back to the parent, which is how the
console panel outside the iframe ever finds out what happened inside it.

`assets/workspace.js` is this same component given a page of its own — a
saved list of named sites in `localStorage` (`dewstack:workspace:v1`), New/
Delete/Load, and CodeMirror panes (`assets/vendor/codemirror.bundle.js`,
built by `vendor-src/`) in place of the tutorial page's plain textareas,
which stay plain because tutorial pages are read on phones. Everything
about the preview, the run model and the console is the site-editor
component's own, reused unchanged.

---

## 3. The data track and the full-stack track: one Pyodide, three cell kinds

`assets/sql-cell.js` is the engine for all three of the remaining cell
kinds, booting one Pyodide interpreter per page and reusing it across
whichever of SQL cells, Python cells and full-stack app cells that page
has. Ported in shape from dewlab's `pyodide-engine.js`, its main-thread
path rather than its Worker one: a query or a chart on a student-sized
table finishes fast enough that keeping the page responsive during a
runaway one is not a problem worth a whole postMessage protocol to solve.

- **SQL cells** (`.dl-sql-cell`, `assets/sql_tools.py`) run SQL text
  against a named SQLite connection, kept alive for the page's whole visit
  by `get_connection()`. Two cells sharing a `db` name see the same tables
  and rows; two different names never do. `sql_check` blocks are the
  tentacular-plushies quiz's self-check: `check_*` functions look at a
  named connection's tables and report, instantly and without recording
  anything, whether a task's requirements are met.

- **Python cells** (`.dl-py-cell`, `assets/python_tools.py`) run pandas and
  matplotlib code. `read_sql()` is the bridge back to a SQL cell:
  it calls `sql_tools.get_connection()` directly, so a page can open a real
  dataset in a SQL cell and chart it in a Python cell below without an
  import statement making the connection explicit. `load_csv()` fetches a
  URL through `pyodide.http.pyfetch` (plain `pandas.read_csv(url)` cannot
  reach the network from inside Pyodide) and `download_csv()` triggers a
  real browser download via a `js.Blob`/`URL.createObjectURL` object,
  ported from dewlab's own rendering functions for the parts both files
  share: capturing a trailing expression's value, a DataFrame as a table, a
  matplotlib figure as a PNG.

- **Full-stack app cells** (`.dl-app-cell`, `build.py`'s
  `extract_app_cells()`/`render_app_cell()`) are consecutive `html app=`/
  `css app=`/`js app=` blocks rendered directly into the page — no iframe.
  This is the one deliberate departure from the web track's sandboxed
  model, decided 2026-09-06 after considering three ways for a page's
  script to reach its own Pyodide instance: bridge the site editor's
  sandbox with a `postMessage` protocol (keeps the sandbox intact, but
  layers a second new concept — cross-document messaging — onto a page
  whose whole point is one concept, "a query becomes a row"); open a real
  hole in the sandbox by adding `allow-same-origin` (simplest, at the cost
  of reopening the escape-the-sandbox risk that attribute's absence exists
  to prevent); or give this cell type no iframe at all, rendering straight
  into the page the way a SQL or Python cell's own output already does.
  The third, for teaching reasons as much as architectural ones: every
  other example of "one cell reaching another" on this site (`read_sql()`,
  `download_csv()`) is already direct, and a `postMessage` bridge would be
  the one place a student met indirection with no in-story reason for it.
  Its JS pane runs with
  `window.dlQuery(dbName, sql, params)` available — a real call into
  `sql_tools.py`'s `query_rows()` (parameterized, `?` placeholders, taught
  explicitly as the anti-SQL-injection pattern) — and its CSS pane is
  scoped to that cell's own preview element with the `@scope` at-rule
  rather than a shadow DOM or an iframe boundary. `resetAppCell()`
  deliberately does not call `sql_tools.py`'s connection reset: an app cell
  never owns a connection, only ever reads one, often one a SQL cell
  elsewhere on the page created.

Which packages a page's Pyodide needs — `sqlite3` alone, or `sqlite3` plus
`pandas` and `matplotlib` — is decided once, at build time, by
`render_body()` (§1), from exactly which of these block kinds the page
actually has.

---

## 4. The student feedback pipeline

Most pages carry a footer line, and a SQL, Python or app cell carries its
own smaller version among its own buttons: "Something wrong on this page?
Tell us." Both open the same three doors (`report_doors_links()`,
`build.py`) — a question goes to GitHub Discussions; an error or a
confusing page opens a prefilled GitHub issue via
`.github/ISSUE_TEMPLATE/report.yml`, with a cell-opened report already
carrying that cell's id, its current code, and whatever it last showed
(`cell_report_markup()`).

`planning/feedback.yaml` is the switch: `enabled: false` in that file turns
every door off across the whole site, read once per build by
`feedback_enabled()` — never a constant computed at import time, since that
would not see a test's or a workflow's own temporary copy of the file.

Two workflows act on a report once GitHub has it, both under
`.github/workflows/`:

- **`label-report.yml`** runs `tools/label_report.py` the moment an issue
  opens, applying a `page:`/`kind:` label GitHub's own fixed-text issue
  form cannot produce on its own, creating either label the first time it
  is needed.
- **`report-patterns.yml`** runs `tools/report_patterns.py` weekly,
  grouping open reports by page and by cell and opening or updating one
  `pattern` issue for any page crossing a threshold (three open reports, or
  two naming the same cell, within the last fortnight) — a hidden
  `<!-- pattern-key: <page> -->` marker is how a second run finds the issue
  it already opened rather than duplicating it.

`.claude/skills/triage-report/SKILL.md` is the order of operations for
working a report or a pattern issue once one arrives.
`docs/REPORTING_A_PROBLEM.md` is the student-facing explanation of the same
three doors.

---

## 5. Two build systems, on purpose

- **`vendor-src/`** exists purely to produce `assets/vendor/`. It is never
  run in CI's main `tests` job and never run by a writer building
  tutorials; its *output*, not its source, is what everything else in the
  repository depends on. Run `npm install && npm run build` inside it only
  when a pin in `vendor-src/package.json` changes, then commit the result
  in `assets/vendor/`.
- **`build.py`** and everything under `tutorials/`, `assets/*.py`, `tools/`
  need nothing but Python. `requirements-build.txt` is the entire
  dependency list for building and reading tutorials.

Cloning this repository and running `python3 build.py` works with no Node
installed at all, because the one thing that would have needed Node —
CodeMirror — is already sitting in `assets/vendor/` as plain JavaScript.
Node is a tool for updating one vendored library, not a dependency of the
project.

---

## 6. Tests: what each suite actually checks

```
python3 -m pytest                the fast ones, no browser
```

- **`tests/test_*.py`** — unit tests, no browser, no Pyodide. Mostly
  `build.py`'s own extraction and rendering logic (`test_build.py`), and
  the two cell-runtime modules' own logic under plain CPython
  (`test_sql_tools.py`, `test_python_tools.py`). This is what CI's `tests`
  job runs on every push and pull request.
- **`tests/e2e/`** — a real Chromium, driven with Playwright, against a
  real self-hosted Pyodide built from fixture markdown by an actual
  `build.py` run rather than a stand-in for one, so a change that breaks
  the markup a student receives fails here specifically. Needs
  `pip install playwright && playwright install chromium` and
  `python3 tools/fetch_pyodide.py --packages sqlite3 pandas matplotlib`
  first; each test file's own conftest skips with a message if either is
  missing, rather than failing. Not run in CI — a local, manual check
  before a change that touches a cell's runtime or the site editor.

---

## Where to start, by what you're changing

| Changing… | Start in |
|---|---|
| What a tutorial's markdown can express (a new frontmatter field, a new fence convention) | `build.py` |
| What a SQL cell or the self-check quiz can do | `assets/sql_tools.py` |
| What a Python cell can do, or how a DataFrame/figure renders | `assets/python_tools.py` |
| A cell's boot/run/reset wiring, or the `dlQuery` bridge for app cells | `assets/sql-cell.js` |
| The web track's site editor — panes, preview, console | `assets/site-editor.js` |
| The standalone workspace page (saved sites, New/Delete/Load) | `assets/workspace.js` |
| The settings panel or reading preferences | `assets/settings.js` |
| The contents page's search | `assets/search.js`, `write_search_index()` in `build.py` |
| The student feedback pipeline's labels or pattern detection | `tools/label_report.py`, `tools/report_patterns.py` |
| A self-hosted Pyodide's package list | `tools/fetch_pyodide.py` |
| House styling | `assets/site.css` |
| Where the content is coming from and what "done" means for each piece | `planning/CONSOLIDATION_PLAN.md` |
| Where things stand right now, and what to pick up next | `planning/NEXT_STEPS.md` |
