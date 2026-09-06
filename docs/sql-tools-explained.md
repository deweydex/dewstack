# `assets/sql_tools.py`, explained

This file is the entire Python half of the data track's SQL cell: turning
SQL text into an HTML table, keeping a named database alive for a page's
whole visit, and answering the tentacular-plushies quiz's self-check
questions. `assets/sql-cell.js` is the other half — it boots Pyodide,
imports this module once per page, and calls into it for every run.

---

## The big idea: one connection per name, kept for the page's whole visit

A dewstack page can have several SQL cells, and two of them might share a
`db` name on purpose — one cell creates a table, a later one queries it,
the way a real lesson builds up a database step by step. `_connections`
(a plain module-level dict) is what makes that possible: `_connection()`
opens an in-memory SQLite database the first time a name is asked for,
and every later call with that same name gets the same connection back.
Two cells with different names never see each other's tables, because
they are, quite literally, different databases.

This is also why the module has no `check()`-style grading and no notion
of "the reader's variables" the way `python_tools.py` does — a SQL cell
has no Python namespace at all. Everything it can do fits in one small
set of functions.

---

## Reading order

1. **`_connection()`/`get_connection()`** — the dict lookup described
   above. `get_connection()` is the public door: `python_tools.py`'s
   `read_sql()` calls it directly to pull a SQL cell's table into a
   DataFrame on a page that also has a Python cell, which is the one
   place another file reaches into this one.
2. **`run_sql()`** — what a SQL cell's Run button calls. Splits the
   cell's text into statements on a bare `;` (after `_strip_comments()`
   drops any `--` line comment first, so an instructional comment above a
   reader's own code doesn't count as something to execute), runs every
   statement but the last for its side effects, and renders the last
   one's result: a table if it returned rows, otherwise a plain sentence
   naming how many rows were affected. A `sqlite3.Error` — a typo, a
   missing table — renders as a short message rather than a Python
   traceback, since nothing here runs a reader's own Python and a
   traceback pointing at this file's code would only confuse.
3. **`query_rows()`** — the bridge a full-stack page's own JavaScript
   calls directly, as `window.dlQuery()` (`assets/sql-cell.js`). Runs one
   `SELECT`, with `?` placeholders and a `params` list standing in for
   any value that came from a reader (typed into a search box, say) —
   pasted straight into the SQL text instead, that same value is how a
   stray quote breaks a query, or worse, changes what it does. Returns
   plain `list[dict]` rather than rendered HTML, since a full-stack
   cell's own JavaScript decides what its rows look like on the page.
4. **`reset()`** — closes and drops a named connection, so a cell's Reset
   button gives its next run a clean database. Without this, a `CREATE
   TABLE` a reader runs a second time would fail, since the table from
   the first run would still exist.
5. **`check_*` functions** — the tentacular-plushies quiz's self-check,
   one function per task. Each reads a named connection's tables with
   `_table_columns()` and reports, in one line, whether that task's
   requirements are met — a `products` table with the right columns, a
   `transactions` table, enough rows, enough categories. `_check_html()`
   is the shared one-line renderer they all call.
6. **`_table_html()`** — the plain HTML-table builder `run_sql()` uses
   for a result with rows. Everything in it is `html.escape()`d, since a
   value in a reader's own table could be anything they typed.

---

## Two things worth understanding on their own

**Why this file stays free of pandas.** `build.py`'s `render_body()`
decides which Pyodide packages a page needs from exactly which fenced
blocks it has (`ARCHITECTURE.md` §1). A page with only SQL cells and
checks needs `sqlite3` alone — no `pandas`, no `matplotlib` — and that is
only true because this file never imports either. `python_tools.py` is
where pandas lives, loaded only on a page that actually has a Python
cell.

**Why a table name can be built into a query string in
`_table_columns()`, when `run_sql()` is so careful about
`query_rows()`'s placeholders.** The two situations look similar and are
not: `_table_columns()`'s `table` argument is always one of this file's
own hardcoded names (`"products"`, `"transactions"`), never text a reader
typed. A placeholder exists to keep a *reader-supplied* value from being
read as SQL; there is no such value here to protect against.

---

## Where to look for something specific

- **"What happens if a reader's SQL cell never creates a table at all,
  and a check runs anyway?"** — `_table_columns()` returns `None` when
  the table doesn't exist yet (it catches the `sqlite3.Error` a `SELECT`
  against a missing table raises), and every `check_*` function checks
  for that `None` first, with its own message naming what still needs to
  exist.
- **"Why does `run_sql()` commit after every run, not only after a
  successful one?"** — it commits inside the `try` block, right after the
  last statement's result is built, so a `CREATE TABLE`/`INSERT` earlier
  in the same script is still there even if the script's *final*
  statement is the one that fails.
- **"Where is the self-check's threshold — four products, three
  categories — actually decided?"** — inline in `check_products_rows()`
  and its neighbours, as plain numbers matching the tentacular-plushies
  task text. There is no shared constant, since each check's numbers
  belong to that one task and nowhere else.
