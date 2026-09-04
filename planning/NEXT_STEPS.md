# Next steps and open questions

Written 2026-09-04, at the end of the session that reconciled the build
step with the front page. This is the document to open at the start of
the next session. It says where everything stands, what to do next and in
what order, what each step needs, and what is still undecided. The
reasoning behind the decisions is in `CONSOLIDATION_PLAN.md`; the
assessment of every source page is in `PAGE_BY_PAGE.md`. This document
repeats neither. It points.

---

## 1. Where things stand

**Merged into `main`, all on 2026-09-04.** dewadaba#2 (the front page,
the interim copies, the reading settings, the plan and the page-by-page
assessment), dewadaba#3 (the build step, dewlab's shell and settings
panel, the hello page, the two workflows), dewadaba#4 (the morning's
decisions and plan sections 13 to 15) and dewadaba#5 (the reconciliation
of #3 with the rest: the build as the platform, the README as the front
page, the copies moved to `sources/`, dewstack throughout).

**Live.** The publish workflow's first run succeeded on the merge of #5,
so GitHub Pages is on, published by Actions from `site/`. Until the
repository is renamed the address is `deweydex.github.io/dewadaba/`. The
site is two pages: the front page, which is the README with the list of
tutorials after it, and the hello page.

**The repository is still called dewadaba.** Every page, link and
document says dewstack, including the README's own link to the site and
the Colab link to the notebook, so those two links are dead until the
rename. GitHub redirects the old name once it is done, for the repository
and for Pages.

**Open elsewhere.** [deweydex/web#1](https://github.com/deweydex/web/pull/1),
the plain-language and accessibility pass on the starter, is a draft
awaiting Josh's read. [deweydex/everlearning#6](https://github.com/deweydex/everlearning/pull/6),
the fifteen-repository analysis that started all this, is a draft with
green CI. Nothing else is open. dewlab#116 (the descriptors gathered) is
merged.

**Arrived and assessed.** The further database content, plus a Level 6
module descriptor for later. See step 0, item 5.

**What the repository holds now.**

| Path | What it is |
|---|---|
| `README.md` | The course map. GitHub shows it; the build renders it as the top of `site/index.html`. One text, two places. |
| `build.py`, `tests/`, `pytest.ini`, `requirements-build.txt` | The build and its checks. Fourteen tests. |
| `assets/` | dewlab's shell (`shell.html`), stylesheet (`site.css`), settings panel (`settings.js`), search (`search.js`), the two accessible typefaces and their CSS, a favicon. |
| `tutorials/` | The build's input. Today: `modules.yaml`, `getting-started/` (the `welcome` series and the hello page), and `reference/` (the `shelf` series: troubleshooting, quick reference, project ideas). |
| `sources/wadb/`, `sources/playground/` | Verbatim copies of `WADB_Tutorials` and `HTML-CSS-SQL-JS`, with the course bar added. Coverage material for the rewrites. Not published. |
| `sources/teaching-materials/` | The web authoring and database subset of everlearning's `Teaching materials/` folder: the Database Methods notebook sequence and live project brief, the Web Authoring briefs and templates, Break and Make a Website, exam material, and the Level 6 module descriptor. Coverage material, not published. Assessed in `PAGE_BY_PAGE.md` section 6. |
| `databases/sqlite_tutorial.ipynb` | The dinosaur notebook, opened from the README in Colab. |
| `tools/add_course_bar.py` | Puts the course bar on the copies. Its links are moot now that the copies are unpublished. Keep or delete; see the questions. |
| `tools/measure_sentences.py` | Counts sentences in a markdown file and lists the ones over twenty-five words. The first pass of the plain-language bar. |
| `planning/` | The plan, the page-by-page assessment, this, and `LEVEL6_COVERAGE.md` (a coverage map against the Level 6 module descriptor, nothing scheduled from it yet). |
| `.github/workflows/` | `tests.yml` on every pull request; `deploy.yml` on every push to `main`. |

---

## 2. The design, in one paragraph

Section 15 of the plan, decided 2026-09-04. The course is three tracks,
and each track is an artefact the student builds in arcs, with a tutorial
page behind each step of the artefact. The web track: Arc 1 is the `web`
starter and sixteen concept pages beside it, ending in a published
portfolio; Arc 2 is a second forkable starter shaped like the assessed
project and eight pages beside it; Arc 3 is a site that shows the
student's data. The data track: Arc 1 is the student's own first table,
four pages, cells as queries; Arc 2 is a designed database with a real
dataset, four pages. Before both tracks, six getting-started pages.
Beside everything, three reference pages. Forty-four pages of thirty to
fifty sentences each. The decisions that shape a page are in section 8
of the plan (sixteen of them) and section 11 (the style bar).

---

## 3. The order of work

Each numbered step is a session or two. Within a step, every page is a
pull request of its own, per the plan's ground rules. The order is the
plan's section 15 order with the housekeeping in front and the build
work put where the pages need it.

### Step 0. Housekeeping, Josh's actions

1. Rename the repository dewadaba to dewstack. Then open
   `https://deweydex.github.io/dewstack/` and the Colab link on the README
   and confirm both resolve.
2. Read and merge web#1. Then, on top of it, add the "Where this fits"
   section to the starter's README. The text is in the closed web#2 and is
   reproduced in section 6 below, with its links corrected: the closed
   draft pointed at `dewstack/tutorials/`, which no longer exists.
3. Read everlearning#6 and merge or close it. It is history now; the
   plan here superseded it the same day.
4. Point the class pages at `deweydex.github.io/dewstack/` and
   `github.com/deweydex/web`.
5. Done 2026-09-04. The further database content arrived as a
   `Teaching materials/` folder pushed to `everlearning`'s `main`; the
   web authoring and database subset is copied to
   `sources/teaching-materials/` and assessed in `PAGE_BY_PAGE.md`
   section 6. It also carried the Level 6 `Web Development 6N1277`
   module descriptor, assessed on its own in `planning/LEVEL6_COVERAGE.md`
   (nothing scheduled from it yet).

### Step 1. Assess the new database content, revise the data track

Done 2026-09-04. `PAGE_BY_PAGE.md` section 6 assesses it. It fills the
four-plus-four shape rather than changing it: the real, currently-taught
notebook sequence (pandas, matplotlib, ipywidgets, files, SQL) and the
live 50% project brief confirm Data Arc 2 almost exactly as section 15
already had it, and the exam material confirms the multi-table,
keys-and-relationships half. Two calls were needed and are made: Data
Arc 1 stays SQL-only (pandas is not pulled forward from Arc 2), and the
ipywidgets-style interactive element stays a full-stack-arc idea rather
than moving into Arc 2. Steps 6 and 7 are no longer provisional.

### Step 2. The three reference pages

Done 2026-09-04. A new module, `reference`, with one series, `shelf`.

| Page | Slug | From | Notes |
|---|---|---|---|
| Troubleshooting | `troubleshooting` | `sources/wadb/troubleshooting.html` | Written as problem-shaped cards, with the Settings panel and the search added as dewstack-specific problems. |
| Quick reference | `quick-reference` | `sources/wadb/reference.html`; `uu_reference.md` from the teaching materials | Two halves, HTML/CSS then SQL, as two-column tables rather than fixed-width cards, so nothing overflows a phone. |
| Project ideas | `project-ideas` | `sources/wadb/project-ideas.html`, `design-resources.html`, `examples/` | Re-keyed to the starter, Flexbox/Grid, a database of your own, and the full-stack page. `hello-world.html`, `first-page.html` and `resume-template.html` are bundled as downloads; the larger templates wait for the page that teaches each pattern. |

Confirmed at 1200 and 390 pixels with a headless Chromium screenshot
through Playwright: no sideways scroll on either width, one `main`
landmark, one `h1`, a labelled `nav` on each page. `python -m pytest -q`
and `tools/measure_sentences.py` both pass on all three. The README's
Troubleshooting and Quick reference links now point here instead of the
old external copies, and a Project ideas link was added.

Done when each page passes both bars in plan section 11 and renders at
1200 and 390 pixels without sideways scroll.

### Step 3. Getting started, A0 to A6

The starter depends on these and today says "clone it" without saying
how. The module `getting-started` exists; the hello page is in its
`welcome` series. Decide first whether hello stays as a page or becomes
the opening of A0 (question 3 below).

| Page | Working slug | From |
|---|---|---|
| A0 How the pieces fit | `how-the-pieces-fit` | New. One picture, one paragraph: editor, GitHub, Pages, browser, this site. The README's "Before you begin" is the seed. |
| A1 A GitHub account | `a-github-account` | `sources/wadb/github-guides/01-getting-started.html`, `lessons/06-github-setup.html` |
| A2 An editor | `an-editor` | New. VS Code installed; GitHub's own editor as the fallback (decision, 2026-09-04). |
| A3 Your copy of the starter | `your-copy-of-the-starter` | Guide 02, guide 06's fork section. Fork, then clone, download, or edit in the browser. |
| A4 Publish it | `publish-it` | Guide 05, lesson 08. GitHub Pages, and why the address looks like that. |
| A5 The two loops | `the-two-loops` | Lesson 01's first third, guide 03, lesson 07. Save and refresh; commit and wait. |
| A6 Seeing under the page | `the-inspector` | Guide 07's first third. |

The data track needs only A0 and A6; the pages should say so at the top.

### Step 4. The site editor component

Needed before any web concept page, because every one carries a live
example. Plan section 13 has the design; this is the build work.

1. Decide the editor widget (question 4): CodeMirror, as dewmini vendors
   it, or plain `textarea`s. The pages are read on phones.
2. In `build.py`, a fenced block tagged as a site file (for example
   ```` ```html site=card ````) becomes a pane, and consecutive blocks
   with the same name form one editor with a live preview in a sandboxed
   iframe. Seeding from the block's text; reset; download the files;
   a draggable preview width.
3. Port dewmini's Site tab logic from `dewlab/compose/dewmini.js`
   (`openSiteFile()` and the `SITE` view; DECISIONS_LOG 7.121). The
   `data-solution-*` idea from `sources/wadb/js/code-playground.js` is
   worth keeping for practice pages.
4. Tests: a page with one site block builds; a block with an unknown
   tag stops the build; the preview iframe has `sandbox` set.

Done when D1, Flexbox first steps, ships with it and a reader can drag
the preview narrower and watch a row wrap.

### Step 5. Web Arc 1, sixteen concept pages

In the starter's order, each page the explanation behind the exercise a
student has just done. Plan section 14's table maps every page to its
exercise and its source; the B and C rows are Arc 1. `web/CONCEPTS.md`
is the register to match and is quarried first. A new module, `web`,
with one series per arc. Each page: open with the question, something to
try in the site editor, the explanation, one "your turn" done in the
student's fork, a look back, at most three new terms listed at the end.

### Step 6. The second starter and web Arc 2

Before the project brief is issued (January, per the plan; confirm the
date). A new repository, working name `site` (question 2): a five-page
skeleton with the brief's file list, a `planning.md` and a `readme.md`
template inside, forked the same way as `web`. Then the eight Arc 2
pages (D rows in section 14, reshaped as section 15 says), quarrying
lessons 11 to 13's examples for the editors' seeds. The front page's
"Begin" part gains the second starter as the door to Arc 2.

### Step 7. Pyodide, the SQL cell, and data Arc 1

1. Copy dewlab's `pyodide-engine.js`, its worker and `tutorial_tools.py`
   (`run_query()`, `load_csv()`), and dewmini's SQL cell. Record the
   dewlab commit in the ledger. Decide where the Pyodide payload is served
   from (question 5).
2. In `build.py`, a fenced block tagged as a SQL cell becomes an editable
   cell with a result table. Tests as for the site editor.
3. Four pages in a new module, `data`: a table is a list of rows; asking
   questions of a table; changing what is in it; a second table and a
   join. The dinosaur notebook's sequence, the playground's six command
   cards and five exercises as seeds. The student's own table as the
   "your turn", kept as a file they download and load.
4. The playground's SQL section and the quiz's five tasks rebuilt as the
   practice pages beside these, solutions at the foot (decision 2), the
   quiz's after submission.

### Step 8. Data Arc 2, then the full-stack arc

Data Arc 2 is fresh: design before typing; a real dataset from Our World
in Data, loaded, cleaned, queried; questions that need two tables; a
chart from a query. Revised by step 1. Then the three full-stack pages,
with plan section 12 as the outline of the first.

### Ongoing, every step

- When a rewritten page lands, the front page links it and the ledger in
  plan section 7 gets its row. When every page a copy fed has landed,
  the copy goes from `sources/` and `PAGE_BY_PAGE.md` says so.
- `CLAUDE.md` says how to run things. Keep it true.

---

## 4. Open questions

The ones that block a step are marked. The rest can be answered when the
step arrives.

1. **Hello page or A0?** (blocks step 3). The hello page explains the
   shell. A0 explains the course. They could be one page, "How this site
   and the course fit together", or hello could stay as the first page
   of the `welcome` series with A0 to A6 as a second series. One page is
   shorter; two keep the shell's explanation out of a page a data-track
   student also reads. Recommendation: fold hello into A0 and retire the
   slug, since no class has seen it.
2. **The second starter's name and shape** (blocks step 6). Working name
   `site`. A fork, as `web` is, or a GitHub template repository, which
   gives a clean history and a "Use this template" button? A template is
   the better fit for a project whose topic must differ from the
   portfolio, and the getting-started page A3 can show both. The name
   should keep the student's address readable: `username.github.io/site/`
   is fine, `dewfolio` is not.
3. **Module and series slugs.** Settled for `reference` (module
   `reference`, series `shelf`) with step 2. Still open: `getting-started`
   (exists), `web` with series `first-site`, `several-pages`,
   `with-data`; `data` with series `first-table`, `several-tables`. A
   slug is a contract once a class has seen it, so these should be
   settled before the first page in each.
4. **The editor widget** (blocks step 4). CodeMirror is what dewmini uses
   and what dewlab vendors; it is also heavy and awkward on a phone.
   Plain `textarea`s with a monospace face are lighter and work
   everywhere, and lose highlighting and bracket matching. Recommendation:
   `textarea`s first, CodeMirror later if a page needs it; the markdown
   contract does not change either way.
5. **Where Pyodide is served from** (blocks step 7). dewlab's arrangement
   is the one to check: a CDN or self-hosted under `assets/vendor/`.
   Self-hosting is a large commit and no surprises; a CDN is small and a
   dependency. Whichever dewlab does is the default.
6. **The student's database file.** Data Arc 1 says the student's own
   table is kept as a file they download and load. Where between visits:
   the browser's storage, a file on their machine, or their fork? The
   "Where your work is saved" section of the README has to say. The
   `web` model, work lives in your fork, argues for a file the student
   commits to a repository of their own.
7. **A Pages site for `web`** (plan question 6, still open). It would let
   the starter's README show a live example. Not needed for the tutorial
   to work.
8. **The Our World in Data dataset** for data Arc 2. Small, familiar and
   with a join in it: population and life expectancy by country, say.
   Licence is CC BY; the page credits it. Josh's content may settle this.
9. **The high-contrast fix.** dewlab#114, open, fixes elements the
   high-contrast mode silently skipped. The shell's CSS was copied before
   that fix. Check whether it applies here once #114 merges.
10. **`tools/add_course_bar.py`.** The copies are unpublished, so the bar
    on them links nowhere. Delete the tool and the bars, or keep them
    until the copies go? Keeping costs nothing and deleting is one
    commit either way.
11. **The README as front page, long term.** Today the whole README,
    "For teachers" included, is the top of the site's front page. Once
    the arcs exist and the tutorials list is long, the front page may
    want its own shape, with the README staying the GitHub-facing map.
    Nothing to decide now; note the seam is in `render_front()` in
    `build.py`.
12. **Dates.** Term start, the date the project brief is issued, and the
    exam window, so that steps 3, 6 and 7 have deadlines. The plan says
    January for the brief; confirm.
13. **Level 6 reuse** (plan question 14). First pass done:
    `planning/LEVEL6_COVERAGE.md`. Open within it: three outcomes (a
    multi-tier architecture with a database server, an installed CMS,
    FTP/domain hosting) don't fit a static, no-backend site at all, and
    whether this repository is meant to satisfy 6N1277 on its own or
    alongside a separate CMS/hosting unit is Josh's call, not something
    to resolve by writing a page that doesn't really cover it.
14. **Break and Make a Website's placement.** Josh wants to consider it
    on its own rather than as plain enrichment. `LEVEL6_COVERAGE.md`
    proposes it as the vehicle for a Level 6 client-side-scripting step
    (DOM manipulation, form validation, `localStorage`) sitting after
    web Arc 2 and before the full-stack arc; the Irish Tax Simulator
    artefact itself stays enrichment either way. Not decided.

---

## 5. How to start the next session

Read, in this order: `CLAUDE.md` (two minutes), this document, plan
sections 8, 11 and 15, and the part of `PAGE_BY_PAGE.md` for whichever
source the step quarries. Then:

```bash
pip install -r requirements-build.txt
python3 -m pytest
python3 build.py --clean
python3 tools/measure_sentences.py README.md tutorials/**/*.md
```

A new page is a folder `tutorials/<module>/<slug>/<slug>.md` with this
frontmatter, listed in `tutorials/<module>/<series>.order.yaml`, with
the module in `tutorials/modules.yaml`:

```yaml
---
title: "Flexbox first steps"
slug: flexbox-first-steps
module: web
module_title: "Web authoring"
series: first-site
version: 2026.09.10.1
---
```

`status: draft` builds the page and keeps it off the front page and out
of search, which is how a page is reviewed before it is listed. A link to
another page is `tutorial:<slug>`, and the build stops if the slug does
not exist. Every image needs alt text or the build stops.

Before a page is pushed: the eight checks in `CLAUDE.md`, the sentence
tool, and a look at the built page at 1200 and 390 pixels. In this
session that look was a headless Chromium screenshot through Playwright;
any browser's device mode does the same. Then one pull request per page,
draft, with what was checked in its description.

Conventions from the sessions so far that are not written anywhere else:
no pull request is watched or scheduled unless Josh asks; nothing is
deleted from a source repository, ever; the source copies in `sources/`
are never edited; and the register for anything a student reads is the
plain-language bar, while the register for the planning documents is
this one.

---

## 6. Text held for later

**The "Where this fits" section for `web`'s README**, to go in after
web#1 merges, after the welcome paragraph. Links corrected from the
closed draft: the original pointed at tutorial pages that lived under
dewstack for a day.

> ## Where this fits
>
> This tutorial is the first step of the Web Authoring and Databases
> course. The course front page is at
> [deweydex.github.io/dewstack](https://deweydex.github.io/dewstack/).
> It holds the plan for the whole course and every link you need. When
> an exercise here leaves you with a question, the tutorials listed there
> have the longer explanation. The
> [GitHub guides](https://deweydex.github.io/WADB_Tutorials/github-guides/01-getting-started.html)
> show each step of making an account, saving your work, and publishing
> a site.

Once the getting-started pages exist, the GitHub guides link moves to
them.
