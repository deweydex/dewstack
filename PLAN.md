# Plan for dewstack

_Written 2026-09-03. What this repository is for, what is in place, and the steps that follow, each with a way to tell when it is done. The wider picture across all the repositories is in everlearning's `planning/2026-09-03-repo-consolidation-analysis.md`._

## 1. The brief

The `web` repository is the strongest introduction we have: a student forks it, turns on GitHub Pages, and goes from nothing to a published portfolio through 25 short exercises. dewstack is the course site around it. Its front page outlines the course as a plan, starting with `web` as a link to the repository (not to the published copy, because the README with the exercises is the thing to read first) and a short account of what a student will have done by the end of it. The front page is modelled on the HTML-CSS-SQL-JS page, and the README is an improved version of that repository's README, in line with current practice and holding every link. The tutorial content is moved in from WADB_Tutorials as a component. No tutorial is edited for now except `web`, and dewstack is the starting point for everything that follows.

## 2. What is in place

- `index.html`: the front page, one page, four steps in the order that works. Written to the plain-language rules in dewlab's `planning/PEDAGOGICAL_STYLE_GUIDE.md` section 4.
- `assets/`: the front page's reading settings, after the pattern of dewlab's texture panel: theme (device, light, dark), typeface (sans, serif, Atkinson Hyperlegible, OpenDyslexic, the last two self-hosted), text size, line width, and a high-contrast switch. Saved on the reader's device, applied before the page first paints. `settings.css` re-points the playground stylesheet's colours at variables; `settings.js` reads and writes them. Any page written here from now on can take the two files as they are.
- `README.md`: what the site is, where everything is (published address and code, both), how to begin, notes for teachers, how to run and publish a copy, what to do when something does not work, where the pieces came from.
- `tutorials/`: WADB_Tutorials, copied as it was. Every file is byte-identical to its source. Its own front page, menu, search and progress tracker still work, so nothing a student bookmarked has changed.
- `databases/playground/`: HTML-CSS-SQL-JS, copied as it was, with its teacher version.
- `databases/sqlite_tutorial.ipynb`: the SQLite notebook.

Rules that held while this was assembled, and hold from here: copy, never move; edit no tutorial except `web`; every student-facing sentence passes the eight checks in dewlab's `CLAUDE.md`; every relative link is checked by script before a push; a page that changed is rendered and looked at before a push.

## 3. The steps

### 3.1 Publish

Turn on GitHub Pages for this repository (branch `main`, folder `/ (root)`). Then change the two class pages on the course site that link to `WADB_Tutorials` and `AIML_WA`, in `Current Teaching/L5 Computer Science/Web Authoring and Databases/index.md` and `Current Teaching/CS and Machine Learning L5/AIML Web Authoring/index.md`, so that they link to `deweydex.github.io/dewstack/` and `github.com/deweydex/web`. The old addresses keep working; nothing is deleted.

Done when a student who follows the class page lands on the front page and can reach every step from it.

### 3.2 `web`, the one tutorial we edit now

Three things, in this order.

First, a plain-language pass over the README and `CONCEPTS.md` against the eight checks. The prose is already short and warm; the pass is for idioms ("sit with it for a moment"), for definitions carried by a dash, and for the odd sentence over 25 words.

Second, the gap against the assessment brief. Assignment 1 asks for `index.html`, `about.html`, `contact.html`, `styles.css`, `planning.md`, `readme.md` and an `images/` folder. The starter has the first two and the stylesheet. Add `contact.html` in the same commented style, with two or three exercises of its own after exercise 12 (navigation), and an `images/` folder with a note in it. Point at the planning and README templates on the course site from the README's last section rather than copying them, so the brief stays the one source.

Third, a closing section in the README that says plainly what the student now has: three pages, a stylesheet they understand, a repository with a history, and a published address. That is the sentence the front page's Step 1 promises.

Done when a student can go from fork to the file list Assignment 1 asks for by following the README alone, and when the README and `CONCEPTS.md` pass the eight checks.

### 3.3 The tutorials component

The tutorials stay as they are until each is rewritten on purpose. Curation happens on the front page, which already points at lessons 11 to 13 and the guides first. Two decisions are needed before any rewriting.

Which lessons the course needs beyond `web`. The measured sentence lengths (in the consolidation analysis, section 4.2) say the lessons read as a reference manual; the guides are the readable, procedural part. The project brief needs lessons 11 to 13. The rest overlap with `web`'s exercises. A reasonable first cut: rewrite 11 to 13 and the seven guides to the style guide, and leave 1 to 10 as the longer explanations they are.

Where a rewrite lives. Not in `tutorials/`, which stays verbatim. A new folder, `lessons/` at the root, one page per rewritten lesson, using the front page's stylesheet and its reading settings, so the original and the rewrite can be read side by side and the front page can switch its link when the rewrite is better.

Done, for each lesson, when the rewrite passes the eight checks, has been rendered and read, and the front page links to it.

### 3.4 Databases

The playground is a good first hour. After it there is nothing until the project. The consolidation analysis (section 4.5) outlines five tutorials in the order the dinosaur notebook already teaches and the descriptor asks for: a table is a list of rows; asking questions of a table; two tables and a join; designing before typing (keys, one-to-many, an ER diagram); a real dataset from Our World in Data, loaded, queried and charted.

Two places they could be written. In dewlab, where the SQL cell, `run_query()` and the dataset apparatus exist and each tutorial gets a practice page, a glossary and versioning. Or here, as single pages in the playground's pattern, each with its own SQL.js editor, so the whole database half stays on one site with the same look. The trade is between dewlab's machinery and dewstack's simplicity. This is the one decision in this plan that changes the shape of the work, and it is yours.

Done when a student can write every query the database project asks for from these pages alone.

### 3.5 The rest of the database material

The class pages link a database reference sheet, a practice exam and a "tutorial series so far" on Google Drive and Colab. Bring the teaching material into `databases/`. Leave the assessments where they are; a public repository is not the place for a practice exam.

Done when the class page has no Drive link for a piece of teaching material.

### 3.6 Later

One defect is known and left alone on purpose, because the playground is a verbatim copy. Its "Choose Your Learning Path" box sits inside the header and inherits the header's white text, on a near-white background, so the box is illegible at every width. The same is true in the source repository. The fix is one CSS rule, `.learning-paths { color: #333; }`, and it should be made in the source and copied here, or made here the day the no-edits rule is relaxed.

The quiz and the playground both load SQL.js from a CDN. If the college network ever blocks it, vendor the two files. The tutorials' menu, search index and progress tracker are hand-maintained in every page; if the tutorials component ever grows, that is the first thing to replace with a build step, and dewlab's `build.py` is the pattern.

## 4. Names

Every name in this family carries the `dew` prefix: dewlab, dewmini, dewmark, and now dewstack, chosen for this repository on 2026-09-03 in place of dewadaba. The GitHub repository still needs renaming to match; GitHub redirects the old name, so nothing breaks in the meantime. The alternatives that were considered:

- For the combined site: `dewsite`, `dewstack`. Both say "web" more than "database"; a stack is at least both halves.
- For a database-only home, if the two halves ever split: `dewbase`, `dewsql`, `dewquery`, `dewtable`.
- For the starter, if `web` is too plain: `dewpage`, `dewfolio`.

One consideration for the starter: a student's fork keeps the repository's name, and that name becomes part of their published address. `username.github.io/web/` is a better address for a portfolio than `username.github.io/dewpage/`, and `web` is the name the class pages already use. The recommendation is to keep `web`.

## 5. Questions only you can answer

1. Where should the database tutorials be written, dewlab or here (3.4)?
2. Is the first cut in 3.3 right: rewrite lessons 11 to 13 and the guides, leave 1 to 10 as they are?
3. Should `contact.html` and `images/` go into `web` now, before the assignment is set (3.2)?
4. Is there anything on the Drive links that is teaching material rather than assessment (3.5)?
