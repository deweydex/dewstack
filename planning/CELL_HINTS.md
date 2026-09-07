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

**Built 2026-09-07 — §6 records what shipped and how it differs from the
plan below.** dewlab's half was built first (its DECISIONS_LOG.md 7.135),
and two of its decisions changed what this note said before it was built:
the authoring surface is a ```` ```hint ```` fence with `for:`/`after:`/
`title:` header lines, not two attributes on a hand-written fold, and
`after:` reads both `5 errors` and `errors:5`. Read the examples below
with that in mind — the fold they show is what the fence *renders to*,
and what `sql-cell.js` would read. Josh's order, 2026-09-06: dewlab first,
"I am more concerned about it for python cells."

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

## 6. What was built, and how it differs from the plan above

Josh: "let's fix that bug and build the sql hints." Built for `sql-check`
blocks only — §5's question 1, answered (a), same as assumed. The web
track (question 2) and a generic SQL `expect` (question 3) are still not
built, also as assumed.

**The authoring surface is exactly §1's fence, ```` ```hint ````, with
`for:`/`after:`/`title:` header lines — dewlab's shape, not the
attributes-on-a-fold shape this note originally showed.** Two differences
from dewlab's own fence, both because a `sql-check` block is not an exec
cell:

- **`for:` is always required.** dewlab's `for:` defaults to the exec cell
  just above it in the source, because `extract_blocks()` walks the page
  once, left to right, and always knows what came last. This repo's
  `extract_hints()` is its own pass, run after `extract_sql_checks()`
  rather than interleaved with it, so there is no "the block above" to
  fall back on. `for:` names a `sql-check` block's own `task=` value —
  already unique per page, the same thing its rendered `data-task`
  attribute carries — and a hint whose `for:` names no check on the page
  fails the build.
- **`after:` only reads three signals: `failed checks` (`check-fails`),
  `runs`, and `minutes`.** §2's own table gives the reason: a check has no
  code to raise or leave unchanged, so `errors`, `same-errors` and
  `unchanged` — three of dewlab's six — have nothing to mean here. Only
  `check-fails`, `runs` and `minutes` describe what a click on "Check my
  work" can tell the runtime. `after:` with no line at all defaults to
  `check-fails:2`.

**The runtime is `assets/sql-cell.js`'s own staged-hints section** —
`collectStagedHints()`, `triggerHolds()`, `noteCheckAttempt()`,
`maybeRevealHint()`, `showStagedHint()`, `syncStagedHints()` — ported in
shape from `tutorial-runtime.js`'s. A check's counters
(`freshCheckAttempts()`: `runs`, `checkFails`, `firstRunAt`) live as a
plain object closed over by `setUpCheck()`, since there is no per-check
object the way dewlab keeps one per cell. Nothing is persisted, exactly as
§3 said it wouldn't be: a reload clears every counter and every revealed
hint, the same as leaving the page.

**One Settings row, not two.** dewlab's second row — "after a restart,
keep hints or hide them" — governs what a `Restart Python` click does to
already-revealed hints. This site has no page-wide "restart everything"
action to hook that into; a SQL cell's own Reset only restores its
starter text. So only the on/off row exists here
(`#dl-settings-hints`, `assets/shell.html`), wired by
`initStagedHintsToggle()`. It is a static section on every page, the same
way dewlab's own settings rows are, `hidden` by default and shown only
when the page has at least one `sql-check` block — not only when this
particular page happens to have a staged hint, since the setting is a
standing preference, not a per-page one.

**A small marker, not the cell bar dewlab has.** A `sql-check` block has
no equivalent of a cell's bar to put a dot on, so `render_sql_check()`
adds one `<span class="dl-hint-marker" hidden>` next to the "Check my
work" button, on every check whether or not it has a staged hint — cheap,
and inert either way.

**Tried on `data/the-tentacular-plushies-quiz`**, per §4's own plan:
`check-fails:2` hints under Task 1 (`check_products_table`) and Task 3
(`check_products_rows`), each a question and one move, in the house order
§1 sets out. `data/asking-questions-of-a-table` and
`data/charting-a-querys-result` are not done — the quiz alone is enough to
prove the shape works, and both of those still need `sql`/`py` cell
support this build does not have yet.

**Not built, on purpose, past the scope above:**

- SQL and Python cell hints (`sql cell=`/`py cell=`) — §2's `unchanged`
  and `same-error` both need a cell's current text and its last error, and
  wiring that into `sql-cell.js`'s `runCell()`/`runPyCell()` is its own
  piece of work, not a small extension of the check-only runtime above.
- The web track and a generic SQL `expect` — §5's questions 2 and 3,
  still open.
- A browser end-to-end test (`tests/e2e/test_cell_hints_staged.py`, as §4
  proposed) — the build-time half has full coverage
  (`tests/test_build.py`, the `test_staged_hint_*` tests), but a real
  click-through in Chromium is not written yet. Worth adding alongside
  whichever of the pieces above gets built next, when there is a second
  runtime path to exercise together with this one.

*Cost to change: `HINT_BLOCK`/`HINT_HEADER_RE`/`TRIGGER_KEYS`/
`parse_trigger()`/`extract_hints()`/`render_staged_hint()` in `build.py`;
the marker span in `render_sql_check()`; the staged-hints section in
`assets/sql-cell.js`; the `.dl-hint-staged`/`.dl-hint-marker` rules in
`assets/site.css`; the `#dl-settings-hints` section in `assets/shell.html`;
two `hint` fences in the quiz. Ten new tests in `tests/test_build.py`.
Full unit suite green; a fresh full-site build confirmed clean.*
