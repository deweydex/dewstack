# `tools/*.py`, explained

`tools/` holds standalone scripts a maintainer runs by hand, or CI runs
automatically — none of them are part of the actual website build. Each
one is short enough to read on its own; this document is a map of what
each does and why it exists.

---

## `tools/fetch_pyodide.py`

Downloads a **trimmed** copy of Pyodide — the core runtime plus only the
package wheels this site's pages actually declare — into
`assets/vendor/pyodide/`, for the self-hosted-Pyodide escape hatch (a
school network that blocks the CDN `assets/sql-cell.js` defaults to) and
for the end-to-end test suite, so it does not need a live CDN.

`BASELINE` is `sqlite3`, `pandas`, `matplotlib` — every package any page
on the site can actually declare, since a SQL cell, check, or app cell
needs `sqlite3` alone and a Python cell adds the other two
(`ARCHITECTURE.md` §3). Keep it in step with `build.py`'s
`render_body()`, the one place that decides a page's real package list —
this file was found stale against that exact rule while writing this
document (`BASELINE` was still `sqlite3` alone, left over from before
Data Arc 2 added Python cells to the site) and fixed here, 2026-09-06.
`resolve()` is the same breadth-first dependency walk dewlab's own
`dev/fetch_pyodide.py` uses — start with the packages asked for, and keep
pulling in whatever *those* depend on until nothing new is left to add.

## `tools/label_report.py`

Called once, right after a report issue opens
(`.github/workflows/label-report.yml`), to apply the two labels the issue
form itself cannot: `.github/ISSUE_TEMPLATE/report.yml` can put fixed
text on every report, but not a label whose *value* depends on what the
student actually typed — which page, which kind. `parse_fields()` reads
the issue body back out (GitHub renders every form field as
`### <label>\n\n<value>`, in field order — `FIELD_RE` at the top of the
file is built to read that shape regardless of which fields a given
report filled in), `kind_label()` turns the free-text "what kind of thing
is this?" answer into one of three fixed labels, and `ensure_label()`
creates a label the first time anything needs it rather than requiring a
maintainer to set one up by hand in GitHub's settings first.

No `kind:` label exists for "a question, an idea, or something else" on
purpose — see the file's own docstring for why.

## `tools/report_patterns.py`

Runs weekly (`.github/workflows/report-patterns.yml`), reading every open
report issue and asking one question: does any single page, or any
single cell on a page, have enough open reports recently to be worth a
person looking at as a group rather than one at a time? `gather()` groups
issues by page (and, within a page, by cell, when the report came from a
cell's own report icon and so carries one), `worth_a_pattern()` applies
the threshold (three reports on a page, or two naming the same cell,
within the last fortnight), and `pattern_body()` writes the issue text a
human triager reads.

Idempotent by design: a hidden `<!-- pattern-key: <page> -->` marker in
the issue body is how a second run finds the pattern issue it already
opened for a page, rather than opening a duplicate — the body is replaced
wholesale each run, so an issue nobody has looked at yet still reflects
the current count, not the count from whenever it was first opened.
`.claude/skills/triage-report/SKILL.md`'s own "Working a pattern issue"
section is what a person (or an agent) actually does with the result.

`parse_fields()` here is deliberately the same regex as
`label_report.py`'s own, copied rather than imported from a shared
module — each script is meant to be readable and runnable on its own.
`tests/test_report_patterns.py` covers this file's own logic directly.

## `tools/add_course_bar.py`

Puts a thin navigation strip at the top of every page copied verbatim
into `sources/` — the one thing added to those otherwise-untouched
copies, so a reader who lands on a lesson from a search or a bookmark can
find the rest of the course. Inserted right after `<body>` (or after a
skip-to-content link, so keyboard users still meet that link first) by
plain regex, not by editing the page's own markup: `add_bar()` strips any
bar an earlier run already added first, so changing the bar's own links
reaches every page with one command rather than needing each page
re-copied from its source. Templates and examples in `TARGETS` are
skipped on purpose, since students copy those files to start their own
pages and the bar must not travel with them.

Worth knowing if you're wondering why `sources/` pages carry a course bar
at all despite not being part of the build: they are read directly from
the repository sometimes (a maintainer comparing a rewrite to its
source), and the bar is what tells a reader looking at one of those
copies what it belongs to — its links only actually resolve on a page
GitHub Pages serves, per the file's own closing note.

## `tools/measure_sentences.py`

Shows the longest sentences in a markdown file, as candidates for the
plain-language trim test (`CLAUDE.md`'s "Before you write a word a
student will read," sourced from dewlab's own
`PEDAGOGICAL_STYLE_GUIDE.md` §4): read a sentence back, then try a
shorter version — if it still says the same thing, the words that
vanished were never necessary. Not a pass/fail gate, and deliberately so:
there is no fixed word count a sentence has to stay under, since a list
of four things may run long because the reader is counting, and a short
sentence can still hide a clause that does not survive the trim.
`sentences()` strips out everything that should not count toward a
sentence's length (frontmatter, code blocks, tables, headings, link
targets) before splitting what remains, and treats each bulleted list
item as its own sentence.
