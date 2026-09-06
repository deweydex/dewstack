# Hints that know what the cell has done: the dewstack half

Written 2026-09-06, alongside `planning/CELL_HINTS.md` in
`deweydex/dewlab`, which holds the whole design: what the request is,
what a page can observe about a cell's runs without a server, the
authoring surface (two attributes on the `dl-hint` fold, `data-cell` and
`data-after`), the trigger grammar, the runtime, the questions for Josh,
and the survey of what nbgrader, otter, okpy and Runestone do. Read that
first. This note records only what is different here, so the two
repositories end up with the same authoring surface and each with its own
runtime, the same way `sql-cell.js` was ported in shape from dewlab's
engine rather than shared with it.

Nothing here is built.

---

## 1. What is the same

The `dl-hint` fold, the `dl-answer` fold, and the build check that a
`<details>` names one of them all exist here already. An author who
writes

```html
<details class="dl-hint" data-cell="orders" data-after="same-error:3">
<summary>pause and ponder</summary>

What does the last line of the message say is wrong? SQLite names the
thing it could not find. Is that a table name or a column name, and how
is it spelled in the `CREATE TABLE` above?

</details>
```

after a `sql cell=orders` block should be writing exactly what they would
write in dewlab after a `python exec` cell. The attribute names, the term
grammar (`errors:N`, `same-error:N`, `unchanged:N`, `runs:N`,
`check-fails:N`, `minutes:M`), the rule that a revealed fold appears
closed and is never a modal, the rule that no count is ever shown to the
reader, and the house order for stages (a question and one move; then
steps; then the shape of the code; the answer never triggered) all carry
over unchanged. `build.py` validates `data-cell` against this page's
cells the same way; a `data-cell` naming nothing fails the build.

## 2. What differs: what a run and an error are, per cell kind

`assets/sql-cell.js` runs three cell kinds on one main-thread Pyodide;
the site editor is a fourth engine with no Pyodide at all. Each has its
own answer to "the cell ran" and "it went wrong".

| Cell | A run is | An error is | `unchanged` compares | `expect` could be |
|---|---|---|---|---|
| `sql cell=` | a Run click | `.dl-sql-error` in `run_sql()`'s HTML | the textarea | a SQL expression against the named connection |
| `py cell=` | a Run click | `.dl-error` in `run_python()`'s HTML | the textarea | a Python expression against the named namespace |
| `sql-check` | a Check my work click | `.dl-check-fail` in the result | nothing; a check has no code | not needed, the check is the check |
| site editor `site=` | a Run of the JavaScript pane only | an error posted by the console relay | the JavaScript pane | a DOM query against the preview |
| app cell | a Run of its JavaScript pane | the same relay | the JavaScript pane | the same |

Two of those rows need saying out loud.

**HTML and CSS have no run.** They are live by design
(`planning/CONSOLE_AND_WORKSPACE.md`): the preview redraws on every
keystroke. There is nothing to count, and a fold triggered on keystrokes
would fire while a reader is mid-word. On the web track, a staged hint
can bind only to the JavaScript pane's Run, or to nothing. A checker for
"add a link inside the nav" would be an `expect` that queries the preview
document, evaluated on a click the reader makes, and that is a later
piece, not this one.

**`sql-check` is already an attempt counter waiting to be read.** The
tentacular-plushies quiz's five checks are the only checks on the site,
and each click is one attempt at one task. `check-fails:3` on a check
block's own id is the most natural first trigger on this site, ahead of
anything on a cell, because the quiz's tasks are precisely "run it until
the check says yes" and the check already says what is missing.

## 3. What the runtime here would need

Counters live in a `Map` keyed by the cell element, or on
`element.dataset`, since there is no `cell` object of the kind dewlab
keeps; `runCell()`, `runPyCell()` and the check's click handler each
update them after their `innerHTML` assignment, from the returned HTML
(`querySelector(".dl-error, .dl-sql-error")` for errored; the last
non-empty line of its text for `same-error`; the textarea's value
against the last-run value for `unchanged`). Reveal and reset follow
dewlab's rules. Reset here means the cell's Reset button; there is no
Restart & run all. The settings panel (`settings.js`) gains the same
on/off toggle.

Nothing is persisted, so counters restart on reload; a persisted SQL cell
saves its text only, and this note does not propose widening that.

`expect` on a SQL cell, if adopted, is one function in `sql_tools.py`:
`holds(db_name, sql)` running the expression as `SELECT (<expr>)` on the
named connection and returning whether the single value is truthy, with
any `sqlite3.Error` as False. Unit-testable under CPython with the rest of
that file, like the `check_*` functions beside it.

## 4. Where to try it

- `data/the-tentacular-plushies-quiz`: `check-fails:2` folds under tasks
  1 and 3, the two whose checks name a missing column or a row count a
  reader most often misreads.
- `data/asking-questions-of-a-table`: one `same-error:3` fold on the
  cell where a reader first types a `WHERE` clause, since a misspelled
  column is the error that page produces most.
- `data/charting-a-querys-result`: one fold on the Python cell, for the
  Python-cell path.
- Tests: `tests/test_sql_tools.py` and `tests/test_python_tools.py`
  run the cell runtimes' Python under CPython, so `holds()` is covered
  there if built. `tests/e2e/` already drives the site editor, the
  full-stack cell and the workspace in a real Chromium, so a
  `test_cell_hints_staged.py` beside them has a fixture and a server to
  use. Still a reason to build and test the runtime on dewlab first, then
  port the shape: dewlab's cell object already carries most of the
  counters this needs.

## 5. Questions specific to dewstack

The dewlab note's section 9 has the shared questions. Three are only
about this site:

1. **Start where?** (a) the quiz's `sql-check` blocks, since the counter
   is nearly free there; (b) SQL cells on the data track; (c) wait for
   dewlab's build to be in front of a class. *Assumed: (a), after dewlab's
   runtime exists to port.*
2. **The web track.** (a) JavaScript-pane Run only, when it comes; (b)
   leave the web track out until an `expect` against the preview DOM is
   designed; (c) out for good, hints there stay always-visible folds.
   *Assumed: (b).*
3. **`expect` as SQL.** (a) yes, `holds(db, expr)` beside the `check_*`
   functions; (b) no, write a `check_*` function per task as now.
   *Assumed: (b) until dewlab's `expect` has settled.*

The ledger in `CONSOLIDATION_PLAN.md` and `NEXT_STEPS.md` should carry a
line for this once any of it is built.
