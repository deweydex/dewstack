# `assets/python_tools.py`, explained

This file is the entire Python half of the data track's Python cell:
running pandas/matplotlib code and turning whatever it produces —
printed text, a DataFrame, a figure, an error — into HTML.
`assets/sql-cell.js` is the other half — it boots Pyodide, imports this
module once per page (alongside `sql_tools.py`), and calls `run_python()`
for every run.

Most of this file is ported near verbatim from dewlab's own
`tutorial_tools.py`, including its reasoning — dewlab already solved
"how does a matplotlib figure become a PNG a reader can see" and "how
does printed text stay in the order it was printed," and there was no
reason to solve either differently here.

---

## The big idea: one namespace per cell name, and the cell decides what "the result" is

Like `sql_tools.py`'s connections, `_namespaces` is a plain dict keyed by
cell name — `_namespace()` creates a fresh one (seeded with `read_sql`,
`load_csv`, `download_csv` already in scope) the first time a name is
used, and every later run against that name reuses it, so variables and
imports from an earlier run are still there. `reset()` drops a name's
entry entirely, giving a cell's Reset button a clean slate.

What actually appears in a cell's output after a run is not "whatever it
printed" alone — it is printed text, *and* the value of the code's
trailing expression if it has one, *and* any matplotlib figure the code
drew but never explicitly showed. `run_python()` is where all three come
together, in the order they happened.

---

## Reading order

1. **`read_sql()`, `load_csv()`, `download_csv()`** — the three functions
   every cell's namespace starts with, so a reader can call them with no
   import. `read_sql()` is the bridge to `sql_tools.py`: it reaches into
   a SQL cell's own connection by name and returns a query against it as
   a DataFrame. `load_csv()` fetches a URL via `pyodide.http.pyfetch` —
   plain `pandas.read_csv(url)` cannot reach the network from inside
   Pyodide at all — with two distinct error messages (a fetch failure
   versus a non-200 response), because a reader seeing either needs to
   know it is not their code's fault. `download_csv()` is the mirror
   image: builds a `js.Blob`, a temporary object URL, and a throwaway
   `<a download>` element, clicks it, and cleans it up — the same trick a
   cell's own Download button already uses, just triggered from a
   reader's own code instead.
2. **`_is_dataframe()`/`_is_figure()`** — type checks that never `import
   pandas`/`import matplotlib` at module load time, reading `sys.modules`
   instead. Both libraries load lazily, only once a page actually needs
   them (`ARCHITECTURE.md` §1); checking `sys.modules` rather than
   importing outright is what keeps this file itself import-light.
3. **`_recolour_for_theme()`/`_figure_html()`** — a figure is drawn once
   and baked into a PNG, so its colours have to be decided at that
   moment, not left to CSS. `_recolour_for_theme()` repaints only the
   chrome (titles, axis labels, ticks, legend) to one fixed, readable
   grey (`_FIGURE_INK`) that passes contrast in both the light and dark
   page themes — never the plotted data itself, which keeps whatever
   colours a reader's own code chose.
4. **`_table_html()`** — a DataFrame (or Series, promoted to a
   single-column frame first) as an HTML table, truncated to `max_rows`
   with a note when it is, the same shape `sql_tools.py`'s own
   `_table_html()` produces for a SQL result.
5. **`_Sink`** — collects one run's output as HTML in order. Its one
   subtlety: consecutive `stream()` calls of the *same* kind (stdout, or
   an error) accumulate into a single open block instead of a new one
   each time, so five `print()` calls in a row read as one paragraph, the
   way a terminal would show them — but a DataFrame or figure in between
   two prints closes whatever was open first, so the final HTML still
   reads in the order the cell actually produced things.
6. **`_render_value()`/`_flush_figures()`** — what happens to the code's
   trailing expression, and to any figure that was drawn but never
   explicitly shown. `_render_value()` applies one rule at a time
   (nothing for `None`, a table for a DataFrame, a PNG for a figure,
   `repr()` for anything else) and remembers which figures it already
   rendered by `id()`, so `_flush_figures()` — called right after, and
   again inside `_patch_pyplot_show()` — never draws the same one twice.
7. **`_patch_pyplot_show()`** — replaces `plt.show()`, for the run only,
   with a version that flushes figures into the sink instead of trying to
   open a window that does not exist in a browser tab. Reinstalled at the
   start of every `run_python()` call, since pyplot may not even be
   imported yet the first time a cell runs.
8. **`run_python()`** — the entry point. Swaps `sys.stdout`/`sys.stderr`
   for `_StreamWriter`s pointed at the sink, awaits the cell's code with
   `pyodide.code.eval_code_async()` against its namespace, renders the
   trailing value and any leftover figures, and restores the real
   stdout/stderr in a `finally` — even a cell that raises still leaves the
   real streams in place for whatever runs after it. A reader's own
   exception renders as its type and message, not a traceback into this
   file's own code.

---

## Two things worth understanding on their own

**Why the last three parts of `run_python()`'s pipeline are a fixed
order.** Printed text (via `_StreamWriter`), the trailing expression's
value (via `_render_value()`), and any never-shown figure (via
`_flush_figures()`) are collected in exactly that sequence because that
is the order a reader's own code would have produced them in — a `print`
statement followed by a bare `df` on the last line should show the
printed line first, the table second, the same as a real interpreter's
session would read.

**Why `load_csv()` and `download_csv()` each carry a `# pragma: no
cover` comment.** Both import browser-only modules (`pyodide.http`,
`js`) that do not exist under plain CPython, which is what the rest of
this file's own tests run under (`tests/test_python_tools.py`). Those two
functions are exercised for real only inside `tests/e2e/`, against an
actual Pyodide in an actual browser tab.

---

## Where to look for something specific

- **"Why does a DataFrame render as a table but a plain list or dict
  render as `repr()`?"** — `_render_value()`'s own three-case order: only
  a DataFrame/Series and only a figure get their own treatment; every
  other type, however structured, falls through to the same `repr()`
  branch, matching what a reader would already see typing that value at
  a real Python prompt.
- **"Where does a figure's colour scheme actually get decided — light
  page, dark page, or something else?"** — nowhere per-theme at all:
  `_FIGURE_INK` is one fixed grey chosen to read against both themes at
  once, precisely so a figure baked before a reader switches theme never
  needs re-baking.
- **"What happens to a namespace's variables if the cell name is reused
  on a different page load?"** — nothing carries over between page
  loads; `_namespaces` is in-memory only, cleared the moment the tab
  closes or reloads. It only persists *within* one visit to one page.
