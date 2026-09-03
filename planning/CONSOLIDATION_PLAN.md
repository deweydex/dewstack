# Consolidation plan

How the web authoring and database materials come together in this
repository, in what order, and what "done" means for each step. Written so
that a later session can pick it up without rediscovering the reasoning.

Last updated: 2026-09-03. Nothing in this plan has been carried out yet.
The ledger in section 7 says what has moved and what has not.

---

## 1. The shape we are aiming for

**One home.** `dewadaba` becomes the single place a student is sent to for
the web authoring and database course. Everything else either feeds into it
or is linked from it.

**The main page is the README.** GitHub renders it, so it needs no build
step, no hosting and no styling to go wrong. `HTML-CSS-SQL-JS` already works
this way and its README is the model for the layout. The text itself is
rewritten to the house style (section 3).

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
| `HTML-CSS-SQL-JS` | Stays untouched until its SQL section and teacher notes have moved here. Then archived. |
| `WADB_Tutorials` | Stays untouched until its content has moved here, piece by piece. Then archived. Its Pages site stays live throughout. |
| `dewlab` | Stays. The source of the shell, settings and search we port. Not edited from here. |
| `portfoliotest` | Personal. Left alone. |
| `aiml-web-authoring`, `webauthoringdemo` | Already removed. |

---

## 2. Ground rules

**Nothing is deleted or rewritten at its source.** Content is copied here,
improved here, and the original stays where it was until the new version
has been in front of a class. Archiving a repository is Josh's action, taken
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
| Build step and hello page | `dewlab` | `build.py`, `assets/`, `tutorials/` | not started |
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
7. **The name.** `dewadaba` reads as dew, data, base and sits beside
   `dewlab`. Alternatives with the same prefix are in the session notes.
   A rename after students have the address breaks their bookmarks, so
   this is decided before phase 1 ships.

---

## 9. What the audit of `WADB_Tutorials` found, 2026-09-03

Kept here so the bar in section 3 has its reasons attached. Ten pages were
rendered at 1280 and 390 pixels and run through axe.

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
