# Contributing code to dewstack

This page is about the site's own code — the build and the runtime under
it — not the tutorials themselves. It covers getting set up, what to run
before you open a pull request, and the one standing requirement this
repository has: that documentation and comments stay accurate as the code
changes.

If you are here for something else, one of these is a better door:

- Writing or editing a tutorial → [`README.md`](README.md), then
  [`planning/CONSOLIDATION_PLAN.md`](planning/CONSOLIDATION_PLAN.md)
- Reporting a bug or a mistake → [`docs/REPORTING_A_PROBLEM.md`](docs/REPORTING_A_PROBLEM.md)
- Understanding how the code fits together → [`ARCHITECTURE.md`](ARCHITECTURE.md)
- Where things stand and what to pick up next → [`planning/NEXT_STEPS.md`](planning/NEXT_STEPS.md)

---

## Getting set up

You need Python 3.12 or later. Node is only needed if you are changing the
vendored CodeMirror bundle, covered further down.

```sh
git clone https://github.com/deweydex/dewstack
cd dewstack
pip install -r requirements-build.txt
python3 build.py --clean
python3 -m http.server -d site 8000
```

That builds the whole site into `site/` and serves it at
`http://localhost:8000`. `site/` is never committed — it is regenerated on
every push, which is what keeps a published page from drifting from the
markdown it came from.

---

## Running the tests

```sh
python3 -m pytest
```

The unit tests need nothing but Python — `pandas` and `matplotlib` besides,
for the Python-cell rendering tests, both already in the install above.

The end-to-end tests under `tests/e2e/` drive a real browser against a
real Pyodide, so they need a local copy of it first:

```sh
pip install playwright && playwright install chromium
python3 tools/fetch_pyodide.py --packages sqlite3 pandas matplotlib
```

Without both, each e2e test file's own `conftest.py` skips with a message
rather than failing. None of `tests/e2e/` runs in CI — it is a local,
manual check, run before a change that touches a cell's runtime or the
site editor.

Also worth running before writing student-facing prose:

```sh
python3 tools/measure_sentences.py README.md tutorials/**/*.md
```

Not a pass/fail gate — it surfaces the longest sentences in a file as
candidates for the plain-language trim test below, not a word count to
stay under.

---

## What runs in CI

Two workflows run on every push and pull request
(`.github/workflows/tests.yml`):

`unit` installs the Python dependencies, runs the unit test suite, and
builds the whole site with `python build.py --clean` — a build failure is
a test failure, since a build that stops midway is a build that would have
shipped a broken push.

`vendor` rebuilds `assets/vendor/` from `vendor-src/` and fails on any
difference from what is committed. The bundle is committed on purpose, so
that neither the build nor a writer previewing locally needs a Node
toolchain — which also means it can go stale the moment anyone edits the
workspace page's CodeMirror integration. If you change a pinned version in
`vendor-src/package.json`, rebuild with `npm ci && npm run build` inside
`vendor-src/` and commit the result.

Two more workflows run against the student feedback pipeline, not on a
push or pull request — see the next section.

`publish` (`.github/workflows/deploy.yml`) builds the site and deploys it
to GitHub Pages on a push to `main`.

---

## Student feedback pipeline

Most pages carry a line at the foot, "Something wrong on this page? Tell
us.", and a SQL, Python or app cell has its own smaller version of the
same thing among its own buttons. Both open the same three doors: a
question goes to GitHub Discussions, an error or a confusing page both
open a prefilled issue on `.github/ISSUE_TEMPLATE/report.yml`.
`report_doors_links()` and `report_issue_url()` in `build.py` build the
doors; `ARCHITECTURE.md` §4 has the mechanics.

`planning/feedback.yaml` is the switch — `enabled: false` turns every door
off, everywhere, without touching a tutorial.
`.claude/skills/triage-report/SKILL.md` is the order to work an incoming
issue in, so triage does not get reinvented each session. Neither of
these is optional reading before changing how a report is built, sent, or
worked — a change to one that leaves the others describing the old
behaviour is exactly the stale-doc problem the next section is about.

Two more workflows run against a report once it exists: `label-report`
fires the moment an issue opens and applies a `page:`/`kind:` label,
creating either the first time it is needed —
`tools/label_report.py` has the parsing and the label rules.
`report-patterns` runs weekly and opens or updates a `pattern` issue for
any page with three or more open reports, or any cell with two, in the
last fortnight — `tools/report_patterns.py`, tested in
`tests/test_report_patterns.py`. Both are paired, near verbatim, with the
identical scripts in `deweydex/dewlab`; if you find a bug in one, check
whether the other has it too.

---

## Keep documentation and comments current

This is not cleanup for later. A change that adds a feature, or changes
how one works, is not finished until the documentation and comments
describe the new behaviour rather than the old one.

**Update the document that describes it.** If you change what a page
does, update the document a reader would reach for — `README.md`,
`docs/REPORTING_A_PROBLEM.md`. If you change how the code works, update
`ARCHITECTURE.md`, and the matching `docs/<name>-explained.md` once one
exists for that file (`planning/DOCS_AND_COMMENTS_PLAN.md` tracks which
files have one so far).

**Comment every function you touch or add**, not only the ones with
tricky logic. A comment should say what the function does and, where it
is not obvious, why — written so that someone learning to program could
follow it, not only someone who already knows this codebase. The existing
top-of-file comments in `assets/*.py` and `assets/*.js` are the house
style to match: what the file is for, what it is a trimmed or ported
relative of, and why it is organised the way it is.

**Never leave a comment or document describing behaviour that no longer
exists.** A stale comment is worse than no comment, because it misleads
the next person to read it. If you are not sure whether a comment is
still accurate, check it against the code before you leave it alone.

### Explanation files

A substantial code file gets a matching file in `docs/` named
`<file>-explained.md`. These walk through how the file is put together:
what its main pieces are, how they call each other, and why it is
organised the way it is. They are for someone reading the code for the
first time. They are not a changelog and not an API reference — the
inline comments already cover the details of any one function. Not every
file earns one; a small, already-well-commented file can be covered by a
paragraph in `ARCHITECTURE.md` instead. `planning/DOCS_AND_COMMENTS_PLAN.md`
has the current judgement call, file by file.

If you add a file substantial enough to need its own inline comments,
decide whether it needs an explanation file too. If you restructure an
existing file, update its explanation file to match — a walkthrough
describing a structure the code no longer has is worse than confusing.

### Who reads what

**Student-facing pages** (`README.md`'s student-addressed sections,
`docs/REPORTING_A_PROBLEM.md`, every tutorial): the plain-language rules
in `CLAUDE.md`, sourced from dewlab's
`planning/PEDAGOGICAL_STYLE_GUIDE.md` §4 — every sentence has a verb,
every clause earns its place, the meaning comes before any dash, say what
a thing is before what it is not, mark sequences, no metaphor in place of
a plain statement, no idiom from any dialect and no rare word where a
common one works, hedge what is not a binary. "We" for the learning, "you"
for what is the student's own. No emoji.

**Contributor and maintainer documentation** (`README.md`'s own map
sections, `ARCHITECTURE.md`, `planning/*.md`): plain and direct in the
same way, but addressed to the reader who is there — a teacher deciding
whether to build a course here, or a developer changing the code. Do not
rewrite these to address a student; that is not who reads them, and it
would make them harder to use for the people who do.

---

## Before you open a pull request

- Run `python3 -m pytest` and `python3 build.py --clean` to confirm the
  site still builds.
- Read back the documentation and comments you touched as if you had
  never seen this codebase. If something needs reading twice to make
  sense, it needs another pass.
- If you are unsure whether a change needs a new explanation file or an
  update to an existing one, write it. A missing explanation costs the
  next person more time than a redundant one.

---

## Two traps

**A slug is a contract once a class has seen the page.** It is the page's
address and the key any saved work will live under. Change the title
freely; leave the slug alone.

**Nothing moves from a source repository by deletion.** Content is copied
into `tutorials/` and improved here. The verbatim copies in `sources/`
stay until `planning/CONSOLIDATION_PLAN.md`'s ledger says a replacement
has been in front of a class.

---

## If this page is wrong

If something here does not match what you find in the code, the code is
more likely to be right and this page more likely to be stale — but say
so anyway, so it can be fixed. Open an issue, or fix it yourself and
mention the mismatch in your pull request.
