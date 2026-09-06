# Documentation and code-comments plan

## Context

Josh asked, 2026-09-06: every piece of code in both repositories —
tutorial cells and the runtime underneath them alike — should read as
though another teacher, or a student, could follow it and see how the
pieces connect. That might mean new files, and it will mean commenting
existing ones, which might turn up real bugs on the way. He asked for a
plan covering both `deweydex/dewlab` and `deweydex/dewstack`, not just
this one.

The two repositories are not starting from the same place, so this is
two different jobs wearing one name.

**`deweydex/dewlab` already did this once.** `planning/DOCS_AND_COMMENTS_PASS.md`
there records a full pass — pedagogical comments across every
substantial file, one `docs/<name>-explained.md` per module,
`ARCHITECTURE.md`/`README.md` brought current, a language pass over
every planning document — closed out as **Complete**, with the standing
rule now living in `CONTRIBUTING.md`'s "Keep documentation and comments
current" section: a change is not finished until the document
describing that behaviour describes the new one. The job left in dewlab
is not to redo that pass; it is to **audit whether the standing rule
actually held**, since a rule only works while people follow it. A
concrete gap already turned up while scoping this plan: `dev/label_report.py`
and `dev/report_patterns.py`, both built this session, are not mentioned
anywhere in `docs/dev-scripts-explained.md` — exactly the drift the
standing rule exists to prevent, and exactly the kind of thing an audit
should expect to find more of.

**`deweydex/dewstack` has never had this pass.** No `ARCHITECTURE.md`,
no `CONTRIBUTING.md`, no `DECISIONS_LOG.md`, no `docs/<name>-explained.md`
files, no tutorial-cell-code-review skill. This is not because the code
is undocumented — spot-checking `assets/settings.js`, `assets/search.js`
and `assets/workspace.js` found each already carrying real inline
comments, several explicitly naming what they ported from dewlab and
why. The gap is the layer *above* the inline comments: nothing ties the
pieces into a map a newcomer could start from, nothing writes the
standard down as a rule future work has to meet, and nothing tracks
which files have been read carefully enough to vouch for.

## What "done" looks like, for one file

Borrowed directly from dewlab's own bar, because it is a good bar:

- Every function has a comment saying what it does and, where it is not
  obvious, why — written so someone learning to program could follow
  it, not only someone who already knows this codebase.
- The file's own top-of-file comment (both repos already do this
  consistently) says what the file is for and how it fits into the rest
  of the runtime — dewstack's existing files already do this well; the
  plan below checks that claim file by file rather than assuming it.
- A substantial file has a matching `docs/<name>-explained.md`: how it
  is put together, its main pieces, how they call each other, why it is
  organised the way it is. Not a changelog, not an API reference — the
  inline comments already carry that.
- No comment or document describes behaviour the code no longer has. A
  stale comment is worse than no comment.

## Bugs found on the way

Reading code carefully enough to explain it is exactly how you notice
it doesn't do what it claims. When this pass turns one up:

- **Small and local** (a wrong comment, an off-by-one, a dead branch):
  fix it in the same commit as the documentation change that found it,
  and say so in the commit message.
- **Bigger, or outside this file's own scope**: do not fix it inline —
  note it in this plan's own ledger (below) or, if it is unrelated to
  documentation entirely, spawn it as its own task the way this session
  already has been for out-of-scope findings.

---

## dewstack: building the layer from scratch

Sequenced the way dewlab's own pass was — quick wins first, then the
freshest code (easiest to verify, since it was just written), then the
shared runtime, then everything else, then a whole-repo language pass.
Unlike dewlab, dewstack also needs a tutorial-cell-code-review skill
built before the tutorial-content half of this can run at all, since no
such skill exists here yet.

### Phase A — the map and the rule, before anything else

Nothing below this can cite "see ARCHITECTURE.md" or "per CONTRIBUTING.md"
until these exist.

- [x] `ARCHITECTURE.md` — written 2026-09-06: the build (`build.py`,
      markdown in, static site out, the four `extract_*`/`render_*` block
      pairs), the runtime (one Pyodide engine, three cell kinds — SQL,
      Python, full-stack `app=` — plus the site editor and its sandboxed
      preview, and the standalone workspace), the feedback pipeline
      (report doors, `tools/label_report.py`, `tools/report_patterns.py`),
      and a "where to start, by what you're changing" table at the foot,
      the way dewlab's closes. Includes the full-stack cell's own
      architecture decision (no iframe, over a `postMessage` bridge or an
      `allow-same-origin` hole), read back against
      `planning/CONSOLIDATION_PLAN.md`'s own "Built 2026-09-06" entry to
      check it matches what actually shipped.
- [x] `CONTRIBUTING.md` — written 2026-09-06: getting set up, running the
      tests (including the e2e prerequisites), what runs in CI, the
      student feedback pipeline section (`README.md`'s "For teachers"
      still carries the student-facing version; this is the
      contributor-facing one), dewlab's "Keep documentation and comments
      current" section adapted in spirit naming dewstack's own files, and
      the two traps from `CLAUDE.md` repeated here since a contributor
      reads this file, not necessarily that one.
- [x] `CLAUDE.md` — updated 2026-09-06 to point at `ARCHITECTURE.md` and
      `CONTRIBUTING.md`, with a "Where the rest lives" table and the
      one-line standing rule, matching dewlab's own `CLAUDE.md` shape.
- [ ] `DECISIONS_LOG.md` — dewstack has been recording engineering
      reasoning all along, just inside `planning/CONSOLIDATION_PLAN.md`'s
      per-item entries and `planning/NEXT_STEPS.md`'s dated "Where
      things stand" paragraphs, rather than as its own numbered,
      dated log the way dewlab keeps one. Whether to extract a real
      `DECISIONS_LOG.md` from that existing material, or to decide the
      two planning documents already do this job and a separate log
      would just be a second place to keep in sync, is Josh's call —
      flagged here rather than decided. `ARCHITECTURE.md` and
      `CONTRIBUTING.md` both point at `planning/CONSOLIDATION_PLAN.md`
      and `planning/NEXT_STEPS.md` in the meantime, not at a
      `DECISIONS_LOG.md` that does not exist.

**Found while scoping Phase A, fixed in Phase D:** `tools/fetch_pyodide.py`'s
own docstring already named the exact condition that had since happened —
"once a page uses pandas or matplotlib (Data Arc 2), the packages it
declares need to be listed here too" — but `BASELINE`, the `--packages`
flag's default, was still `["sqlite3"]` alone. Data Arc 2 shipped in the
same session that wrote this plan. Fixed 2026-09-06, alongside
`docs/tools-explained.md`: `BASELINE` now lists all three packages the
site's pages can actually declare.

### Phase B — this session's own new code, freshest and easiest to verify

- [x] `assets/sql_tools.py` (241 lines) — `query_rows()`, `run_sql()`,
      the `check_*` quiz functions. `docs/sql-tools-explained.md`, written
      2026-09-06. No stale comments found; every function already had an
      accurate docstring.
- [x] `assets/python_tools.py` (321 lines) — `read_sql()`, `load_csv()`,
      `download_csv()`, the rendering/streaming machinery ported from
      dewlab. `docs/python-tools-explained.md`, written 2026-09-06. Same
      finding: already accurate.
- [x] `assets/sql-cell.js` (522 lines) — three cell kinds' worth of
      boot/run/reset wiring, the `dlQuery` bridge, persistence.
      `docs/sql-cell-js-explained.md`, written 2026-09-06. Same finding.
- [x] `build.py`'s own cell-block sections specifically (`extract_sql_cells`,
      `extract_py_cells`, `extract_app_cells`, and the three `render_*_cell`
      functions) — read closely against what they actually do; every
      docstring already matches. Left for Phase C's own
      `docs/build-explained.md` to cover in place, as planned, rather than
      given a section of its own here.

### Phase C — the shared runtime the rest of the site leans on

- [x] `build.py` (1326 lines) — the whole file, read start to finish:
      reading/validating tutorials, the markdown pipeline, all four
      fenced-block kinds, page assembly, the front page and module
      listing, the feedback-doors rendering, the shell, `build()` and
      the `write_*` functions. `docs/build-explained.md`, written
      2026-09-06. No stale docstrings found anywhere in the file.
- [x] `assets/site-editor.js` (416 lines) — the HTML/CSS/JS panes, the
      sandboxed preview, the console and Run model PR #43 added.
      `docs/site-editor-js-explained.md`, written 2026-09-06. Same
      finding: already accurate.
- [x] `assets/workspace.js` (261 lines) — the standalone workspace page
      built on the same component. `docs/workspace-js-explained.md`,
      written 2026-09-06. Same finding.

### Phase D — the rest

- [x] `assets/settings.js` (234 lines), `assets/search.js` (213 lines) —
      read in full, 2026-09-06: both already accurate, no stale comments.
      Judged not substantial enough for a dedicated explanation file each
      — given a paragraph in `ARCHITECTURE.md` §5 instead, the size
      judgement dewlab makes too.
- [x] `tools/*.py` (`label_report.py`, `report_patterns.py`,
      `fetch_pyodide.py`, `add_course_bar.py`, `measure_sentences.py`) —
      one shared `docs/tools-explained.md`, written 2026-09-06, the way
      dewlab covers its own `dev/*.py` scripts as one file rather than
      five. This is where the `fetch_pyodide.py` bug flagged in Phase A
      actually got fixed: `BASELINE` now lists `sqlite3`, `pandas`,
      `matplotlib` (was `sqlite3` alone), and its docstring and
      `--packages` help text updated to match.

### Phase E — the tutorial-cell-code-review skill, then the tutorials

dewlab could point its own `cell-code-review` skill at every tutorial
because the skill already existed. dewstack has no equivalent, and
needs one before this half of the work can start:

- [x] `.claude/skills/cell-code-review/SKILL.md` — written 2026-09-06, as
      a repo-scoped skill sharing dewlab's own skill name rather than a
      `dewstack-`-prefixed one, per the harness's directory-scoping
      convention (both repos are in scope this session, and the one
      whose directory holds the tutorial being reviewed is the one that
      applies). Covers semantic names over single letters and why-not-
      what comments, adapted per block kind (SQL cells, Python cells,
      full-stack `app=` cells, the web track's `site=` HTML/CSS/JS
      blocks) since each has its own idiom and its own shared-state
      rules (a `db`/cell name crossing block boundaries, an app cell's
      HTML/CSS/JS panes reviewed together). **Never change what a block
      does** — a rename is only ever a rename, matching dewlab's own hard
      rule; a tutorial's `slug` and a block's own `name` are both
      contracts, neither this skill's to touch.
- [~] Run it across every tutorial, module by module, tracked in this
      file's own ledger below as each module clears.
      - [x] `full-stack` (1 tutorial) — clean. `read`/`search` app cells
            already use semantic names throughout (`draw`, `rows`,
            `filter`), `root`/`dlQuery` correctly left untouched, the
            parameterized-query pattern correctly left alone as
            deliberately taught.
      - [x] `data` (12 tutorials, 11 with runnable blocks) — clean
            throughout: table/column/variable names were already
            semantic (`dinosaurs`, `sightings`, `income_share`,
            `country_regions`), stub cells correctly skipped, the
            deliberate `'USA'`/`'United States'` join mismatch in
            `joining-two-real-tables` correctly left alone as the
            lesson itself. One real bug found and fixed, of the kind
            this pass exists to catch, not a naming one: 
            `a-form-that-writes-a-row` both linked to
            `tutorial:a-form` as an existing page and described it, one
            sentence later, as something that still needed to exist
            before the wiring it describes could happen — the web
            track's `a-form` tutorial had shipped since that sentence
            was written. Fixed.
      - [x] `getting-started` (8 tutorials), `reference` (4 tutorials) —
            no runnable blocks in either module; the two illustrative
            fences that exist (`how-the-pieces-fit`'s SQL example,
            `troubleshooting`'s correct/incorrect HTML and CSS pairs)
            are deliberately minimal UI examples, not real teaching
            code, and need no naming review.
      - [ ] `web` (30 tutorials, 27 with runnable blocks) — not started;
            by far the largest module, worth its own session.

### Phase F — the whole-repo language pass

Once A–E land, survey `planning/*.md`, `README.md`, and every doc file
for the same "already plain, or drifted into a different register"
check dewlab's own Phase E did.

**Done, 2026-09-06 — lighter, as predicted.** A grep across every
`planning/*.md`, `README.md`, and `docs/*.md` file for the consulting-
report markers dewlab's own Phase E actually found (Implementation
Guarantee, Technical Specification, Fundamental Requirement, Executive
Summary, leverage, synerg-, utiliz-, and the like) turned up nothing —
no file has drifted into a different register from the plain, direct
voice the rest of the repository already uses. `README.md`,
`planning/LEVEL6_COVERAGE.md` and `planning/PAGE_BY_PAGE.md` were read
in full to confirm rather than assume the grep's own honesty; the
larger planning documents (`planning/CONSOLIDATION_PLAN.md`,
`planning/NEXT_STEPS.md`, `planning/CONSOLE_AND_WORKSPACE.md`) were not
re-read cover to cover here, on the strength of substantial portions of
each already having been read this session and this plan's own Context
section — surveyed by the grep above rather than by a second full read.

One real staleness gap did turn up, the same shape as dewlab's own
Phase E findings: `README.md`'s "Database tutorials" section still said
"More database tutorials are being written" and listed two items —
"designing a database before typing" and "a real dataset, loaded,
queried and charted" — as still to come. Both had already shipped (the
whole `several-tables` series, Data Arc 2 included, landed earlier this
same session). Fixed: the stale "being written" list is replaced with a
real link into the now-complete series.

## Ledger

Update this table as phases clear, the same way
`planning/PLAIN_LANGUAGE_PASS.md` (dewlab) and `planning/NEXT_STEPS.md`
(here) already track progress elsewhere in these two repositories.

| Phase | Status |
|---|---|
| A — the map and the rule | `ARCHITECTURE.md`/`CONTRIBUTING.md`/`CLAUDE.md` done, 2026-09-06; `DECISIONS_LOG.md` still Josh's call |
| B — this session's new code | done, 2026-09-06 |
| C — the shared runtime | done, 2026-09-06 |
| D — the rest | done, 2026-09-06 (`tools/fetch_pyodide.py`'s `BASELINE` bug fixed along the way) |
| E — cell-code-review skill + tutorials | skill written 2026-09-06; `full-stack`/`data`/`getting-started`/`reference` cleared same day; `web` (30 tutorials) not started |
| F — whole-repo language pass | done, 2026-09-06 (one real staleness fix in `README.md`) |
