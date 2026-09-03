# Consolidation plan

How the web authoring and database materials come together in this
repository, in what order, and what "done" means for each step. Written so
that a later session can pick it up without rediscovering the reasoning.

Last updated: 2026-09-03, late evening, after the front page, the reading
settings and the interim copies landed (section 7). The ledger in section 7
says what has moved and what has not.

---

## 1. The shape we are aiming for

**One home.** `dewadaba` becomes the single place a student is sent to for
the web authoring and database course. Everything else either feeds into it
or is linked from it.

**The main page is the README, and `index.html` is its published twin.**
GitHub renders the README, so it needs no build step, no hosting and no
styling to go wrong. `HTML-CSS-SQL-JS` already works this way and its README
is the model for the layout. The text itself is rewritten to the house style
(section 3). Josh also asked for the front page as a web page in the idiom
of the `HTML-CSS-SQL-JS` page, with dewlab's reading settings, so
`index.html` carries the same stages and links as the README, in the same
order, using a copy of the playground's stylesheet. When one changes, the
other changes to match; the README is the text of record.

**The README is a course map, in stages.** Each stage names what the student
will be able to do at the end of it, and links to where the work happens.

| Stage | Where the work happens | What the student ends up with |
|---|---|---|
| 1. Build a site | [`deweydex/web`](https://github.com/deweydex/web), forked by the student | A personal site with a real address, published on GitHub Pages. From nothing to a portfolio. |
| 2. Work with data | Tutorials in this repository (section 5) | A database they built and queried in the browser, and the words to talk about it. |
| 3. Put the two together | Tutorials in this repository, later | A page that shows data from a database. Scope still open (section 8). |

Stage 1 links to the repository on GitHub, not to a Pages address. The
student's first act is to fork it, so the repository page is the right
front door.

**The tutorials live in a content component here.** A build step turns
markdown into pages with a shared shell, so every page carries the same
navigation, search and settings. Section 5 says why a build step and not
hand-written HTML.

**Where each existing repository ends up.**

| Repository | Fate |
|---|---|
| `web` | Stays. Linked from the README as stage 1. The one tutorial we edit now (section 4). |
| `HTML-CSS-SQL-JS` | Stays untouched until its SQL section and teacher notes have moved here. Then archived. Meanwhile a verbatim copy sits at `databases/playground/` here, so the course has one address. |
| `WADB_Tutorials` | Stays untouched until its content has moved here, piece by piece. Then archived. Its Pages site stays live throughout. Meanwhile a verbatim copy sits at `tutorials/` here as an interim shelf; it inherits every defect in section 9 and is replaced page by page as section 7 proceeds. |
| `dewlab` | Stays. The source of the shell, settings and search we port. Not edited from here. |
| `portfoliotest` | Personal. Left alone. |
| `aiml-web-authoring`, `webauthoringdemo` | Already removed. |

---

## 2. Ground rules

**Nothing is deleted or rewritten at its source.** Content is copied here,
improved here, and the original stays where it was until the new version
has been in front of a class. The interim copies under `tutorials/` and
`databases/playground/` are byte-identical to their sources apart from one
addition, made at Josh's request so the pages link together: a course bar
at the top of each page with a link to the front page and its stages.
`tools/add_course_bar.py` inserts it, after the skip-to-content link where
there is one, and can insert it again after a copy is refreshed. Templates
and examples do not get it, because students copy those files. Archiving a repository is Josh's action, taken
after the links have moved. `web` is the one exception, because it is the
introduction and it is worth fixing in place.

**One piece per pull request.** A section of the README, one tutorial, one
resource page. Each pull request carries screenshots at desktop and phone
widths and the result of an accessibility run (section 3). Small pull
requests are how the source stays safe: a mistake is one revert, not a
rebuild.

**The designated branch for this session is
`claude/repo-consolidation-strategy-8m3miy`.** Later sessions use their own.

**Cell ids and exercise numbers are a contract once a class has seen
them.** Renaming a cell id throws away saved work. Renumbering an exercise
breaks the way students refer to it. Both are decided once and left alone.

---

## 3. The bar every student-facing word has to clear

The style guide is `planning/PEDAGOGICAL_STYLE_GUIDE.md` in `dewlab`,
section 4, including its "Plain language" subsection. It applies to the
README here, to every tutorial, and to `web` once we edit it. The eight
checks, run over anything before it is committed:

1. Every sentence has a verb.
2. No sentence is over twenty-five words. Twenty is the target.
3. The meaning comes before the dash, never after it. One dash to a
   paragraph at most.
4. Say what a thing is before what it is not.
5. Mark a sequence: first, then, then.
6. A metaphor follows a plain statement. It never replaces one.
7. No idiom that assumes Irish or British English.
8. Hedge what is not a binary.

Two more that are easy to get wrong. Use "we" for the learning and "you"
for what is the student's own. Explore first, then the principle, then the
name, with a sentence on what the name is for. No emoji in student text.

**The accessibility bar** for every page that is not a README:

- The axe engine reports no serious or critical violations.
- No sideways scrolling at a 390 pixel viewport.
- Every page has a `main` landmark and a labelled `nav`.
- The menu opens and closes from the keyboard, moves focus into itself when
  it opens, and closes on Escape.
- Text contrast of at least 4.5 to 1, including links and code spans.

These are the bars the audit of `WADB_Tutorials` on 2026-09-03 found unmet.
Section 9 has the findings.

**Skills to use.** `josh-register` for any prose. `argument-signposting` as
a review pass on the README once it has more than three sections. Once the
build step exists, `tutorial-glossary` for each tutorial's glossary file and
`cell-code-review` for its code cells. Both assume dewlab's folder layout,
which section 5 keeps.

---

## 4. Phase 1: the main page

**What.** Replace the two-line README with the course map from section 1.

**Contents, in the order a student meets them.**

1. What this course is and who it is for. Two short paragraphs.
2. The three stages, each with a heading, what the student will be able to
   do at the end, and one link to where the work happens.
3. What they need: a GitHub account, a browser, a text editor. Nothing
   installed.
4. How to use the materials: work in order, or jump to what they need.
   Where their work is saved, once section 5 exists.
5. Every link in one table: repository and published site for each of
   `web`, `WADB_Tutorials`, `HTML-CSS-SQL-JS` and this repository's own
   tutorials.
6. A short line for teachers pointing at `planning/`.

**Links to verify before the README ships.** The Pages address for
`WADB_Tutorials` is confirmed live. The Pages addresses for
`HTML-CSS-SQL-JS` and `dewlab` are assumed and have not been fetched from
this environment. A link that does not resolve is a bug, not a note.

**Done when** the eight checks pass, every link resolves, the old name
"databaseL5" is gone, and Josh has read it.

*2026-09-03, evening.* The README has the three stages as drafted, plus the
stage 2 links now that the playground is here, a section for the interim
tutorials shelf, and the published twin `index.html` with reading settings
(theme, typeface with Atkinson Hyperlegible and OpenDyslexic self-hosted,
text size, line width, high contrast; `assets/`). The Pages addresses for
`HTML-CSS-SQL-JS`, `WADB_Tutorials` and this repository could not be
fetched from the session that wrote this note either; they stay unverified.

---

## 5. Phase 2: `web`, the one tutorial we edit

`web` is a fork-and-edit tutorial. The README is the teaching text, twenty
five exercises long, and `index.html`, `about.html` and `styles.css` are the
files the student changes. `CONCEPTS.md` is optional depth. The shape is
right and stays. The work is on the sentences and on the code files'
accessibility.

**Step 1. Audit before editing.** Render the three files at desktop and
phone widths, run axe, and read the README against the eight checks. Record
what is found in the ledger before changing anything.

*Done 2026-09-03. What the audit found:*

- Both pages have a `main` landmark, one `h1`, headings in order, a focus
  style on every link, and no sideways scroll at 390 pixels. This is a
  better starting point than any page in `WADB_Tutorials`.
- Two colour choices fail contrast. The accent blue `#3498db` under white
  button text measures 3.15 to 1 on both pages. The muted grey `#7f8c8d` on
  the light background measures 3.29 to 1 on three elements of the About
  page. Both are variables in `styles.css`, so each is a one-line change.
  Exercise 13 asks the student to change these colours, which is a chance
  to say what contrast is and why the defaults were chosen.
- The `nav` has no label and there is no skip link. Both are small
  additions, and the comment beside each is a chance to teach them.
- `README.md` averages eleven words a sentence, which is well inside the
  target. It has twenty-six em dashes, most of them carrying the sense of
  the sentence, and one reversal ("that's not failure, that's
  information"). Idioms to replace: "sit with it", "wander off the path",
  "click" in the sense of understanding, "kick in", "comfort with
  indeterminacy", "feel free".
- `CONCEPTS.md` averages eleven and a half words a sentence. Eight em
  dashes, one reversal, and "boxes all the way down".
- No emoji in either file.

**Step 2. The plain-language pass on `README.md` and `CONCEPTS.md`.** What a
first read already shows:

- Em dashes carry the meaning in many sentences ("a real site with a real
  URL", "that's not failure, that's information"). Rule 3.
- Idioms a second-language reader cannot see: "sit with it", "wander off
  the path", "won't click", "kick in", "boxes all the way down", "comfort
  with indeterminacy". Rules 6 and 7.
- Definitions that arrive as contrast: "not failure, that's information".
  Rule 4.
- The "Explore" prompts are the best part of the tutorial and stay. They
  are invitational in exactly the way the style guide asks for.

Exercise numbers, headings and file names do not change. Students' forks
and the exercises they refer to depend on them.

**Step 3. The code files.** `index.html` and `about.html` are what the
student publishes, so they should pass the accessibility bar as shipped.
Check landmarks, heading order, focus styles, contrast of the default
colours, and the comment text, which is student-facing too.

**Step 4. Decide whether `web` gets a Pages site of its own.** It would let
the README link to a live example. It is not needed for the tutorial to
work.

**Step 5. The gap against the assessment brief.** Assignment 1 asks for
`index.html`, `about.html`, `contact.html`, `styles.css`, `planning.md`,
`readme.md` and an `images/` folder. The starter has the first two and the
stylesheet. Add `contact.html` in the same commented style, with two or
three exercises of its own after exercise 12, and an `images/` folder with
a note in it. Point at the planning and README templates on the course
site rather than copying them, so the brief stays the one source. Done
when a student can go from fork to the brief's file list by following the
README alone.

**Step 6. Say where the tutorial fits.** A short section after the welcome
naming this tutorial as stage 1 of the course, with links to the front
page, the tutorials and the GitHub guides. Drafted as
[deweydex/web#2](https://github.com/deweydex/web/pull/2) and closed
unmerged, because it touches the paragraph #1 rewrites; the text is in that
PR and goes in on top of #1 once #1 has merged.

**Needs before starting.** `web` is attached to this session for reading
only. Editing it needs it attached with push access, and its own branch and
pull request.

**Done when** the audit findings are closed, the eight checks pass on both
markdown files, and a fresh fork renders cleanly at both widths.

---

## 6. Phase 3: the tutorial component

**The decision: a build step, modelled on dewlab.** Markdown in
`tutorials/`, a shell template, a script that writes `site/`, and a
workflow that publishes it on every push to `main`.

**Why not hand-written HTML, as `WADB_Tutorials` is.** Every defect the
audit found there is a drift defect. Six of forty-two pages have search.
Twenty-one lack the theme switcher. Three pages overflow a phone screen for
three different reasons. The pages were correct once and stopped agreeing
with each other as features were added one file at a time. A template
removes the whole class.

**What to port from dewlab, and what not to.**

| Port | Leave |
|---|---|
| `assets/shell.html`: the masthead, the three sidebars, the settings panel with theme, typeface, size and line width | The Pyodide runtime, for now (see the open question in section 8) |
| The colour and type tokens in `assets/tutorial-style.css`, and its dark theme | The authoring editor |
| `assets/search.js` and the way the build writes its index | The topic tree and browse-by-topic pages |
| The folder layout: `tutorials/<module>/<slug>/<slug>.md`, order files, glossary files | The maths handling |
| The build's checks: a dead link fails the build, an image without alt text fails the build | |
| The deploy workflow | |

Copy `build.py` and trim rather than write a new one. The link validation,
frontmatter parsing and shell rendering are the parts worth keeping. They
are also the parts that take longest to get right from scratch.

**The runtime question.** A SQL cell needs an engine in the browser.
`HTML-CSS-SQL-JS` uses sql.js, which is light. dewlab chose Python's own
`sqlite3` through Pyodide, which is heavy but lets a SQL table and a pandas
table see each other. For a database course that never touches Python,
sql.js is the smaller thing to carry. This is Josh's call; section 8.

**First deliverable.** One page that says hello, built and published, with
the shell working at both widths and the accessibility bar met. The
pipeline is proven before any content moves.

**Done when** `python3 build.py` writes `site/` from a hello page, the
workflow publishes it, and the hello page passes the bar in section 3.

---

## 7. Phase 4: moving content, one piece at a time

Order of movement. Each item is one pull request and one ledger row.

**First, the database material**, because it is the reason this repository
exists and it has no home elsewhere.

1. The SQL section of `HTML-CSS-SQL-JS/index.html` becomes the first
   tutorial in a "Databases" module: what a table is, select, where, order
   by, insert, update, delete, with the students-and-courses sample data.
2. The exercises from the same page become its practice page.
3. `teacher.html` holds solutions and teaching notes. Decision needed on
   whether solutions stay public (section 8). The teaching notes go to
   `planning/`.
4. The quiz in `WADB_Tutorials/tentacular-plushies-quiz-final.html` is
   rebuilt as a page in the shell. Its five tasks and its reference panel
   are good. Its fixed three-panel layout is not, and does not survive a
   phone.

**Then the resource pages from `WADB_Tutorials`**, which are useful to
both stages: the quick reference, troubleshooting, project ideas and design
resources.

**Then the lessons from `WADB_Tutorials`.** Lessons 1 to 8 cover ground
that `web` now covers by doing. Lessons 9 to 13 and the seven GitHub guides
add things `web` does not. Which of the first eight survive is a decision
for Josh (section 8), taken after `web` has been through its pass.

**Not moved.** `Educational_Reference_Document.md`,
`GIT_PUSH_INSTRUCTIONS.md`, `recent_chat_ideas.md`,
`session_plan_advanced_content.md` and `.DS_Store`. These are session notes
and a prompt, not course material.

**For every piece that moves:**

1. Copy the source into `tutorials/`, converting HTML to markdown.
2. The plain-language pass, against the eight checks.
3. A glossary file, with the `tutorial-glossary` skill.
4. If it has code cells, the `cell-code-review` skill.
5. Screenshots at both widths and an axe run.
6. A ledger row.

The source file is not touched.

### The ledger

| Item | From | To | Status |
|---|---|---|---|
| README course map | this plan, section 4 | `README.md` | drafted 2026-09-03, awaiting Josh's read; the `HTML-CSS-SQL-JS` Pages link is unverified |
| `web` audit | `deweydex/web` | section 5, step 1 | done 2026-09-03 |
| `web` plain-language pass, colour fixes, skip link and nav label | `deweydex/web` | in place | done 2026-09-03, open as [deweydex/web#1](https://github.com/deweydex/web/pull/1), awaiting Josh's read |
| Front page as a web page, in the playground's idiom | this plan, sections 1 and 4 | `index.html`, `styles.css` | done 2026-09-03, [dewadaba#2](https://github.com/deweydex/dewadaba/pull/2) |
| Reading settings: theme, typeface, size, width, high contrast | `dewlab/assets/tutorial-runtime.js`, `tutorial-style.css`, `vendor/fonts` | `assets/settings.js`, `assets/settings.css`, `assets/fonts.css`, `assets/fonts/` | done 2026-09-03, dewadaba#2; the first piece of the shell in section 6 |
| Interim shelf: `WADB_Tutorials` verbatim | `deweydex/WADB_Tutorials` | `tutorials/` | done 2026-09-03, dewadaba#2; replaced page by page below |
| Interim copy of the playground | `deweydex/HTML-CSS-SQL-JS` | `databases/playground/` | done 2026-09-03, dewadaba#2 |
| SQLite notebook | course site assets | `databases/sqlite_tutorial.ipynb` | done 2026-09-03, dewadaba#2 |
| Course bar on every copied page | this plan, section 2 | `tools/add_course_bar.py` | done 2026-09-03, dewadaba#2 |
| `web` "Where this fits" section | section 5, step 6 | `deweydex/web` README | drafted as web#2, closed; lands after web#1 merges |
| Build step and hello page | `dewlab` | `build.py`, `assets/`, `tutorials/` | not started; the settings above are the first piece |
| SQL tutorial | `HTML-CSS-SQL-JS/index.html` | `tutorials/databases/` | not started |
| SQL practice page | `HTML-CSS-SQL-JS/index.html` | `tutorials/databases/` | not started |
| Teaching notes | `HTML-CSS-SQL-JS/teacher.html` | `planning/` | not started |
| Plushies quiz | `WADB_Tutorials/tentacular-plushies-quiz-final.html` | `tutorials/databases/` | not started |
| Quick reference | `WADB_Tutorials/reference.html` | `tutorials/` | not started |
| Troubleshooting | `WADB_Tutorials/troubleshooting.html` | `tutorials/` | not started |
| Project ideas | `WADB_Tutorials/project-ideas.html` | `tutorials/` | not started |
| Design resources | `WADB_Tutorials/design-resources.html` | `tutorials/` | not started |
| GitHub guides 1 to 7 | `WADB_Tutorials/github-guides/` | `tutorials/` | not started |
| Lessons 9 to 13 | `WADB_Tutorials/lessons/` | `tutorials/` | not started |
| Lessons 1 to 8 | `WADB_Tutorials/lessons/` | decision pending | not started |
| Templates and examples | `WADB_Tutorials/templates/`, `examples/` | decision pending | not started |

---

## 8. Open questions for Josh

1. **The SQL engine.** sql.js, or Pyodide with sqlite3 as dewlab does.
   sql.js is the smaller thing unless stage 3 needs Python.
2. **Public solutions.** `teacher.html` publishes every answer. Keep that,
   or move solutions behind a fold the way dewlab's practice pages do.
3. **Which of lessons 1 to 8 survive** beside `web`.
4. **Templates and examples.** Eleven templates and four examples in
   `WADB_Tutorials`. Keep as downloads, fold into project ideas, or drop.
5. **Attribution.** Every `WADB_Tutorials` page links to
   `github.com/jsaaron`. The repositories live under `deweydex`.
6. **A Pages site for `web`**, so the README can show a live example.
7. **The name.** Decided 2026-09-03: **dewstack**, beside dewlab, dewmini
   and dewmark. Every page, link and document already says dewstack; the
   GitHub repository still needs renaming to match, and GitHub redirects
   the old name. The alternatives considered: `dewsite` for the combined
   site; `dewbase`, `dewsql`, `dewquery`, `dewtable` for a database-only
   home if the halves ever split; `dewpage` or `dewfolio` for the starter,
   though `web` stays, because a student's fork keeps the name and
   `username.github.io/web/` is the better address for a portfolio.
8. **The interim shelf.** The verbatim copy of `WADB_Tutorials` under
   `tutorials/` gives the course one address now, and it carries every
   defect in section 9 under the course's own front page. The
   alternative is to link out to the `WADB_Tutorials` Pages site until
   each rewrite lands. The front page and README say plainly that these
   pages are as they were and do not all fit a phone. Keep the shelf, or
   link out?

---

## 9. What the audit of `WADB_Tutorials` found, 2026-09-03

Kept here so the bar in section 3 has its reasons attached. Ten pages were
rendered at 1280 and 390 pixels and run through axe.

One defect is worth a line of its own because it is on the page students
meet first in stage 2. The playground's "Choose Your Learning Path" box
sits inside the header and inherits the header's white text, on a
near-white background, so it is illegible at every width. The fix is one
rule, `.learning-paths { color: #333; }`, made in the source and copied, or
made here when the SQL section moves.

- Seven of ten pages scroll sideways on a phone. The home page hero clips
  its heading. Every lesson page overflows on one bibliography link whose
  text is its full address. The reference page's cards have a fixed width.
- Six of forty-two pages have the search box. Twenty-one lack the theme
  switcher, including seven of thirteen lessons.
- The menu sets its expanded state but does not move focus into itself and
  does not close on Escape. There is no close control inside it.
- Lesson pages, the reference, troubleshooting, the quiz and the templates
  have no `main` landmark. The header's `nav` has no label.
- The green example links on the home page measure 2.5 to 1 against white.
  The troubleshooting page has sixty-eight contrast failures. The
  attribution links in every masthead differ from the surrounding text only
  by colour.
- A sliver of the skip link shows at the top left of every page.
- Lessons load their syntax highlighter from a CDN, so they lose it where
  the network is restricted.
- The quiz disables body scrolling and fixes three panels at set
  percentages. On a phone the task panel is one word wide.

Almost all of these are drift defects, which is the case for section 5.

---

## 10. The page structure, proposed 2026-09-03, late

Josh's steer, in his words: web authoring and databases exist as separate
tutorials, with combined projects and tutorials as a third option; two
"getting started" links, then tutorial links for each subject, then
combined full-stack tutorials. That replaces the strictly sequential three
stages in sections 1 and 4 with two parallel tracks and a third that joins
them. A student can start on either track, and the college's timetable
(web authoring in the autumn, databases from January) is one order among
several rather than the only one.

The front page and README would then have five parts, in this order:

1. **Getting started**, two doors side by side. *Start with a website*:
   fork `web`, the exercises, a published portfolio. *Start with data*: the
   SQL playground, a first query in a minute. Each door says what the
   student will have at the end of it, and neither assumes the other.
2. **Web authoring tutorials**: the lessons, the GitHub guides, the
   templates and examples, the reference and troubleshooting, in the order
   a student who has done the starter needs them (project-facing lessons
   11 to 13 first).
3. **Database tutorials**: the playground, the quiz, the notebook, then
   the five tutorials in section 7 as they are written (a table is a list
   of rows; asking questions of a table; two tables; designing before
   typing; a real dataset).
4. **Full stack: putting the two together**. Combined tutorials and
   projects: a page that shows rows from a database, a form that adds a
   row, a chart drawn from a query. This is the former stage 3, now a
   track of its own rather than a finish line. Nothing exists here yet.
5. **Projects and the exam**: what the college sets, and which track each
   project draws on.

The course bar on every copied page then carries: front page, Start with
a website, Start with data, Web tutorials, Database tutorials.

What the next session should do with this, in order: (a) settle the
structure with Josh and rewrite the README and `index.html` to it; (b) go
through every page on each of the three source sites and say, page by
page, what is good, what should change, and whether it belongs in track 2,
3 or 4, extending the ledger in section 7 with a row per page; (c) write
down the style considerations for the rewrites: one shell and one set of
reading settings across all tracks, the plain-language bar, the
accessibility bar in section 3, the SQL engine decision, and how the
`web` starter's deliberately student-changeable design sits beside the
fixed design of the tutorials; (d) begin the full-stack track with one
small worked example, because it is the part with nothing behind it.

