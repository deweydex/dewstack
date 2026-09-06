# `assets/sql-cell.js`, explained

This file is the entire client-side engine for three of the four cell
kinds `build.py` can put on a page: SQL cells and the quiz's self-check
buttons, Python cells, and the full-stack track's `app=` cells. (The
fourth, the web track's `site=` block, is `assets/site-editor.js`
instead — see `docs/site-editor-js-explained.md` once it exists, and
`ARCHITECTURE.md` §2 for why the two don't share one file.) One Pyodide
interpreter boots per page and every cell on that page, whichever kind it
is, runs through it.

---

## The big idea: one Pyodide, whatever packages this page actually needs

A page might have only SQL cells, only a Python cell, or several of
each — `build.py`'s `render_body()` already worked out, at build time,
exactly which fenced blocks are on this page, and wrote the answer into
`window.DEWSTACK_SQL_PACKAGES` (`ARCHITECTURE.md` §1, §3). `boot()`
(below) reads that variable rather than asking for a fixed list, so a
page with only SQL cells loads `sqlite3` alone and a page with a Python
cell also loads `pandas`/`matplotlib` — but there is exactly one boot
sequence either way, one `tools` module (`sql_tools.py`) always imported,
and one `pyTools` module (`python_tools.py`) imported only if the page
actually has a `.dl-py-cell`. A page mixing a SQL cell and a Python cell
still shares this one interpreter between them, which is what lets
`read_sql()` (`python_tools.py`) reach a SQL cell's table with no import
of its own.

---

## Reading order

1. **The file's own opening comment** — read it before anything else. It
   explains the "one Pyodide, one engine, everywhere" decision above, the
   full-stack cell's `dlQuery` bridge, and points at
   `assets/sql_tools.py`/`assets/python_tools.py` for the Python side of
   each cell kind.
2. **Module state and `boot()`** — `booting` (the one boot Promise every
   cell shares — `ensureBooted()` is what memoizes it, and resets it to
   `null` on a failure so a later click can try again rather than staying
   permanently stuck), `tools`, `pyTools`. `boot()` itself: fetch Pyodide
   from `pyodideBase()` (a CDN by default, or a self-hosted copy via
   `window.DEWSTACK_PYODIDE_BASE` — resolved against *this script's own
   location*, not the page's, since Pyodide re-resolves `indexURL` itself
   once running and the two resolutions have to agree), load this page's
   own package list, then `loadModule()` both Python files onto Pyodide's
   in-memory filesystem and `pyimport()` them.
3. **`window.dlQuery`** — set up inside `boot()`, only when the page has
   at least one app cell. A thin wrapper around `sql_tools.py`'s
   `query_rows()` that converts its result with `.toJs({dict_converter:
   Object.fromEntries})`, so a full-stack cell's own JavaScript gets back
   a plain array of plain objects, not a PyProxy it would have to know
   how to unwrap.
4. **Persistence (`storageKey()` through `restorePersisted()`)** — a
   `data-persist` SQL cell's own script is mirrored into `localStorage`,
   keyed by its `data-db` name, so the table it builds survives a reload
   or a later page sharing that name. Every read and write is wrapped in
   `try`/`catch`, since `localStorage` can throw (private browsing, a
   blocked origin, a full quota) and a failure here should only mean this
   one visit doesn't persist, not that the cell breaks.
5. **SQL cell wiring (`runCell()` through `setUp()`)** — `runCell()` is
   what Run calls: ensure Pyodide is booted, hand the textarea's value to
   `tools.run_sql()`, drop the returned HTML straight into the output.
   `resetCell()` restores the cell's original starter text and calls
   `tools.reset()`, dropping the connection entirely.
   `downloadCell()`/`loadCell()` are the plain file-save/file-open pair a
   SQL cell's own buttons use. `setUp()` wires all of a cell's buttons at
   once and returns whether a persisted cell actually had something saved
   to restore — the caller (bottom of the file) uses that to give a
   restored cell its automatic first run, so a table built on a previous
   visit is already there rather than waiting on a click nobody knows to
   make.
6. **The report panel (`updateCellReportLinks()`, `setUpReport()`)** —
   fills in the two fields `build.py`'s `cell_report_markup()` could not
   know ahead of time: the cell's current code and whatever its output
   area currently shows, truncated to a safe URL length
   (`REPORT_CODE_LIMIT`/`REPORT_OUTPUT_LIMIT`) and only computed once, at
   the moment the panel opens — not kept live on every keystroke. Shared
   by SQL and Python cells; the app cell has its own small variant inside
   `setUpApp()`, described below.
7. **The self-check button (`setUpCheck()`)** — looks up the named
   `check_*` function on `tools` by the block's own `task=` attribute and
   calls it, rather than switching on a fixed list of task names — adding
   a sixth check to `sql_tools.py` needs no matching change here.
8. **Python cell wiring (`runPyCell()` through `setUpPy()`)** — the same
   shape as the SQL cell's own Run/Reset, calling
   `pyTools.run_python()`/`pyTools.reset()` instead.
9. **App cell wiring (`appPane()` through `setUpApp()`)** — see the
   dedicated section below; this is the newest and least like the other
   two.
10. **The bottom of the file** — collects every cell/check on the page by
    class, wires each one up, calls `ensureBooted()` once (which is a
    no-op call if nothing on the page needs it, since the whole block is
    itself guarded by `if (cells.length || checks.length || pyCells.length
    || appCells.length)`), and, once boot resolves, runs every restored
    persisted cell automatically.

---

## The app cell, in more depth

`.dl-app-cell` is `build.py`'s `extract_app_cells()`/`render_app_cell()`
rendered: three panes (HTML, CSS, JS — HTML and CSS optional, JS
required), a preview element, an error box. It behaves like neither of
the other two cell kinds, because it renders straight into the page
rather than producing HTML from a Python call:

- **`renderAppPreview()`** sets the preview's `innerHTML` directly from
  the HTML pane, and wraps the CSS pane's text in a CSS `@scope
  (#<preview-id>) { … }` block before inserting it as a `<style>`
  element — the only reason a reader's own `p { color: red }` reaches
  only this cell's own preview and not the rest of the page, with no
  iframe boundary to do that job instead.
- **`runAppCell()`** removes any `<script>` element left over from a
  previous run and creates a brand new one rather than reusing it — an
  assignment to `innerHTML` never executes a `<script>` tag, which is
  exactly why a fresh element is required each time. The script's own
  text wraps the JS pane's code in an async IIFE taking `(root, dlQuery)`
  as plain parameters, so neither name ever becomes a real global, and
  chains a `.catch()` onto the call so a thrown error or a rejected
  `await` both land in the same place: the error box.
- **`resetAppCell()`** deliberately never calls `tools.reset()`. A SQL or
  Python cell owns its own connection or namespace by a `data-db`/
  `data-name` attribute; an app cell has neither — its `dlQuery()` calls
  name whichever connection they want, often a SQL cell's own, elsewhere
  on the page, that other cells still depend on. "Reset" for this cell
  kind can only mean putting its own three panes, preview and error box
  back to their starting state, never touching a connection something
  else might still be using.
- **The report panel inside `setUpApp()`** does not call the shared
  `setUpReport()` helper, because that helper reads one input element and
  an app cell has three. It rebuilds the same open/close-a-panel
  behaviour by hand, concatenating all three panes (each labelled
  `=== HTML ===` and so on) into one code block before calling the same
  `updateCellReportLinks()` every other cell kind uses.

---

## Where to look for something specific

- **"Why is `pyodideBase()`'s relative path resolved against
  `OWN_SCRIPT_URL`, not the page's own URL?"** — Pyodide re-resolves
  `indexURL` itself, internally, once it starts running — against
  wherever it considers "here" to be, which is not necessarily where the
  *page* lives. Resolving the configured base against this script's own
  location first, before ever handing it to `loadPyodide()`, is what
  keeps both resolutions in agreement regardless of how deep a page is
  nested under `tutorials/`.
- **"What happens to a SQL cell's report link if the reader never opens
  the report panel?"** — nothing; `updateCellReportLinks()` only runs
  inside the click handler that opens the panel, so a page nobody reports
  from never spends any time building those URLs at all.
- **"Why does `ensureBooted()` get called again inside every single
  `runCell()`/`runPyCell()`/`runAppCell()`, if boot already ran once at
  the bottom of the file?"** — `ensureBooted()` is cheap to call again: it
  just returns the same memoized Promise unless the earlier attempt
  failed, in which case a new click gets a genuine retry. Every entry
  point calling it is what makes each cell independently safe to use even
  if the page's own automatic boot hasn't resolved yet, or previously
  failed.
