---
name: cell-code-review
description: Review a dewstack tutorial's runnable code — every sql cell=, py cell=, app= cell, and every site= HTML/CSS/JS block — for pedagogical code quality: semantic names over single letters, comments that explain why rather than restate what, read in the context of the surrounding prose. Use when asked to review, clean up, or improve code quality/naming/comments in one or more tutorials, or after writing new tutorial code that should be checked before it ships.
---

# Reviewing a tutorial's runnable code

dewstack has no `PEDAGOGICAL_STYLE_GUIDE.md §5` of its own to point at —
that document lives in `deweydex/dewlab`, and its §4 (plain language)
already governs this site's prose (`CLAUDE.md` says so). This skill is
the code-quality half dewlab's own `cell-code-review` skill covers for
its cells, adapted to dewstack's four runnable-code kinds instead of
Python's one: SQL cells, Python cells, full-stack app cells, and the web
track's HTML/CSS/JS site editor blocks. The principles are the same
because good code is good code regardless of language; what changes
below is what each language's own idiom looks like and what each block
kind's own "id" actually protects.

**The one rule that matters more than any naming preference below: never
change what a block does.** A rename is only ever a rename — the same
queries, the same structure, the same rows returned, the same page drawn.
If making a name clearer would require restructuring the logic, that is
not this skill's job; note it and move on rather than rewriting more than
was asked.

## What you need before you start

1. **The tutorial itself**, read whole —
   `tutorials/<module>/<slug>/<slug>.md`. Not just the code: the prose is
   what tells a reader whether `row` is underspecified or exactly right
   for a loop that has not yet said what a row represents.
2. **Every runnable block in it, in document order**, whichever kind it
   is:
   - **`sql cell=name`** — SQL statements against a named connection.
   - **`sql-check db=... task=...`** — no code of its own (`task` names a
     function in `assets/sql_tools.py`); nothing to review here.
   - **`py cell=name`** — Python, pandas/matplotlib.
   - **`html app=name` / `css app=name` / `js app=name`** — a full-stack
     cell's three panes, always reviewed together as one unit; splitting
     the review across them separately misses that its JavaScript reads
     the HTML pane's own structure and the CSS pane's own class names.
   - **`html site=name` / `css site=name` / `js site=name`** — the web
     track's live-preview blocks, the same three-panes-as-one-unit rule.
   - **An untagged fence** — illustrative, not runnable. Still worth the
     same naming and comment care if it is real code a reader is meant to
     read closely (not every illustrative fence is; a one-line fragment
     demonstrating syntax needs no review).
3. A cell name (`cell=name`, `app=name`, `site=name`) is not the same
   thing as an in-code identifier, and both matter, separately: the block
   *name* is the persistence key (below); an in-code *variable, column,
   or function name* is what this skill is actually reviewing.

## Reading for context, before touching anything

**What does the prose around this block already say?** A one-letter SQL
alias (`p` for `products`) right under a paragraph that has just been
using "p" as shorthand is matching the page; a `p` with no such setup is
just underspecified. A generic `row`/`result` name in a full-stack cell's
JavaScript, when the prose has not yet named what the query represents,
may be doing its job correctly rather than failing to name itself — see
"discover first" below.

**Is this a "discover first, name afterwards" moment?** Read forward, not
just at the block itself — does the tutorial's prose, shortly after,
introduce a term the code is building toward? `a-page-that-reads-from-a-
database.md` names `result set` right after its first `app=read` cell
uses a plain `rows` — that is not an oversight, it is the term arriving
in prose exactly where it is meant to. A rename to something more
specific there would spoil the sequencing the tutorial is deliberately
building.

**Does an earlier block in this tutorial already use this name?**
Several block kinds share state by name across a whole page, not just
within one block: two `sql cell=` blocks (or a `py cell=` block's
`read_sql()`) sharing a `db`/connection name see the same tables; two
`app=` blocks can both call `dlQuery()` against the same SQL cell's name;
a full-stack cell's HTML pane and its own JS pane share element ids and
classes within that one cell. Renaming a column, a variable, or a
selector in one block without checking every other block that reads it
back breaks the tutorial, not improves it. Read every block first, note
which names cross block boundaries, and treat a rename as a
whole-tutorial operation for any name that does.

**Is there anything to review at all?** A stub (`-- Your query here.`,
`// Your code here.`) has nothing to name and needs no comment — leave it
alone. A `sql-check` block carries no code of its own.

## Deciding what to change, by block kind

**SQL cells.** Table and column names should read as words a query's
result set is self-explanatory from — `products`/`price`, not `t1`/`c2`.
A query built for teaching parameterized placeholders (`?` plus a
`params` list) should never be "simplified" to string interpolation — see
`tutorials/full-stack/a-page-that-reads-from-a-database/`'s own search
cell for the pattern this site teaches deliberately, not a bug to fix. A
comment before a multi-statement script is worth having only when the
*order* of statements matters in a way the SQL itself doesn't make
obvious (a foreign key that needs its parent table created first, say);
never a comment restating what a `CREATE TABLE` already says in its own
column list.

**Python cells.** The same rules dewlab's own skill applies to Python:
`count`/`total`/`is_valid`, not `n`/`s`/`ok`; `i`/`j` for a loop index and
`x`/`y` for a coordinate need no defence; a formula's own letters
matching the prose above it are the one common exception. A DataFrame
variable earns a name that says what each row *is*
(`income_share`, not `df`) once a cell does anything beyond load and
immediately chart one table — a cell that only ever holds one DataFrame,
briefly, before charting it, does not need `df` replaced just for the
sake of it.

**Full-stack (`app=`) cells.** `root` and `dlQuery` are the two names
this site's own runtime supplies to every cell — never rename them, and
never write a comment explaining what they are more than once per
tutorial (the first cell that uses either is where that explanation
belongs, in prose, not in a repeated code comment). Inside a cell's own
JavaScript: a function that draws the page from a query's rows earns a
name that says so (`draw`, `render`, not `go` or `update` with nothing to
say what it updates); a variable holding a result set reads as what the
rows represent (`products`, `rows` when the tutorial has not yet named
what a row is — see "discover first" above) — not `data`, which says
nothing a reader could not already guess. A `<tr>`/`<td>` built by hand in
a loop needs no comment explaining what a loop does; it may need one
explaining *why* the columns are the ones chosen, if that is not obvious
from the query right above it.

**Web track (`site=`) blocks.** CSS class names in the HTML pane and the
selectors in the CSS pane have to agree exactly — check both panes
together, not just the CSS pane, when a class name changes. `CSS
variables and BEM`-style naming, where a tutorial teaches it, should stay
consistent with what that tutorial's own prose just taught, not silently
reverted to a different convention mid-page. JavaScript here follows the
same Python-adjacent rules as an app cell's own JS pane: semantic
function and variable names, no comment repeating what a DOM method call
already says.

**Every kind, together:**

- **A single-letter or abbreviated name with nothing earning its
  brevity** — propose a semantic replacement, applied consistently
  everywhere that name appears in this block and every other block in the
  tutorial that shares it (by connection name, by `dlQuery` target, or by
  selector).
- **A comment that restates what the line already says** — remove it, or
  replace it with one that says why this step matters, if there is a real
  "why" worth having.
- **Code with no comments where one would genuinely help** — a
  non-obvious step, a choice a reader might question, something the prose
  around the block does not already explain. One short comment, in the
  tutorial's own voice — not one for every line.
- **Anything that looks wrong but is a deliberate "discover first" name,
  a formula-matching letter, a stub, the runtime's own supplied names
  (`root`, `dlQuery`), or a deliberately-taught pattern (a parameterized
  query)** — leave it, and say why in your report, so a second pass does
  not re-litigate a decision already made on purpose.

## Making the change

Edit the `.md` source directly, inside the fence. Two different things
are contracts here, for two different reasons, and neither is this
skill's to touch as part of a naming cleanup:

- **A tutorial's `slug`** (`CLAUDE.md`'s "Two traps") — the page's
  address and the key any saved work lives under.
- **A `cell=`/`app=`/`site=` block's own `name`** — the key a persisted
  SQL table (`data-persist`), a full-stack cell's shared connection, or a
  site editor's own state lives under within that page. Renaming a block
  from `sql cell=products` to `sql cell=inventory`, say, is a structural
  change to what the tutorial teaches, not a naming cleanup — out of
  scope here even if the new name would read better.

After editing a tutorial's blocks:

1. **Every edited block still has to be valid** in its own language — a
   SQL block still parses as SQL, a Python block still compiles
   (`python3 -c "compile(open('cell.py').read(), 'cell', 'exec')"` on the
   extracted code), a JS pane is still syntactically valid JavaScript. A
   typo introduced while renaming is worse than the problem being fixed.
2. **Rebuild the tutorial** (`python3 build.py --clean`) and confirm the
   whole site still builds clean — a naming slip inside a fence rarely
   breaks the build itself (the build does not run the code inside a
   block, only extracts it), so this step catches a broken block-name
   collision or an unclosed fence, not a runtime bug; step 3 is what
   catches those.
3. **Run the actual block** where you can — locally in a browser against
   the built page, or by hand-tracing pure SQL/Python logic with no
   dependency on the runtime's own bridges (`dlQuery`, `read_sql`) —  and
   confirm the renamed version produces the same rows, the same chart,
   the same rendered page as before the edit. A rename that silently
   changes behaviour (a SQL alias colliding with an existing column name,
   a JS variable shadowing `root`) is the one mistake this whole process
   exists to avoid.

## What to report

Per tutorial: what changed and why, in enough detail that someone who has
not read the tutorial can see the reasoning (not just "renamed `d` to
`rows`" but "renamed `d` to `rows` in the `read` and `search` cells of
`a-page-that-reads-from-a-database`, which both hold a query's result
set before drawing it"), and what was deliberately left alone and why
(discovery-moment names, the runtime's own supplied names, a
deliberately-taught pattern) — so a second pass over the same tutorial
does not re-litigate a decision already made on purpose. Flag, rather
than silently fix, anything you are not confident about — a rename you
are unsure would change behaviour, or a block where the "right" name
depends on something outside the tutorial itself.

## Tracking coverage

Nothing in this repository yet tracks which tutorials have been run
through this skill, the way `planning/PLAIN_LANGUAGE_PASS.md` tracks the
prose pass in dewlab. `planning/DOCS_AND_COMMENTS_PLAN.md`'s own Phase E
is where a module-by-module run of this skill gets recorded as it
happens — update that file's ledger after finishing a module, rather than
leaving the record only in commit history.
