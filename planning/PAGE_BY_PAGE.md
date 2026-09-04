# Every page, one at a time

_Written 2026-09-04, overnight; Josh's decisions of the same morning are folded in (all of lessons 1 to 8 rewritten; Pyodide with sqlite3 as the engine; solutions linked at the foot of each page; the copies kept as the material to check coverage against). A row for every page of the three sources that feed dewstack, saying what is good, what should change, which track it belongs in, and what to do with it. Companion to `CONSOLIDATION_PLAN.md`: section 7 there is the ledger of what has moved; this is the judgement behind the order._

## How the pages were measured

Every HTML page was read for its structure and rendered in Chromium at 390 pixels wide. The numbers below are: words of prose (code blocks excluded); sentences of three words or more; the mean sentence length; the share of sentences over 25 words, which is the style guide's ceiling; and whether the page scrolls sideways on a phone. "Landmark" is whether the page has a `main` element, which the accessibility bar in the plan requires.

For comparison, the shape of a dewlab tutorial, which is the model the rewrites follow: 60 to 90 sentences, a mean of 14 to 17 words, a runnable cell every few paragraphs, one idea per page, a separate practice page with folded answers, and a glossary of the terms the page introduced. dewlab's *First Steps* is 82 sentences at a mean of 14.4; *Grid of Numbers* is 59 at 17.5. A WADB lesson runs 90 to 170 sentences at a mean of 18 to 30 with no runnable cell, and opens with learning outcomes and a section on why the topic matters before anything is tried.

The columns "Track" and "Do" use these words. Track: *Web door* (the starter a student forks), *Web* (web authoring tutorials), *Data* (database tutorials), *Full stack*, *Both* (reference pages used by every track). Do: *keep* (as it is), *rewrite* (same content, shorter, to the style guide, in the shell), *split* (rewrite as several short pages), *fold* (its content goes into another page), *download* (kept as a file students copy, not a page), *drop* (its content is covered better elsewhere), *decide* (Josh's call).

---

## 1. `deweydex/web`, the starter

| Page | Measured | Good | Change | Track | Do |
|---|---|---|---|---|---|
| `README.md`, 25 exercises | 231 sentences, mean 11.3, 5 % over 25 | The shape: fork, publish, change one thing, look. Every exercise ends in an "Explore" prompt that asks the student to break something and watch. Comments in the code are the reference; the README is the path. | web#1 is already doing the plain-language pass (idioms, dashes carrying meaning). After it: the file gap against Assignment 1 (`contact.html`, `images/`, links to the planning and README templates), two or three exercises for the contact page after exercise 12, and a closing section that says what the student now has. Keep every exercise number. | Web door | keep, then extend |
| `index.html`, `about.html` | 8 and 20 sentences, mean 9; landmarks, one `h1`, no phone overflow | The best-formed pages of the three sources. Comments say what each part is and point at the exercise that changes it. | Two contrast failures (accent `#3498db` under white, muted `#7f8c8d` on light), no `nav` label, no skip link. web#1 fixes these. The comment beside each fix should say why, since the comments are student-facing. | Web door | keep |
| `styles.css` | commented, variables at the top | Custom properties at the top mean exercise 13 changes the whole site in one place. | The two colour variables above. Nothing else. | Web door | keep |
| `CONCEPTS.md` | 145 sentences, mean 11.5, 4 % over 25 | Optional depth in ten short sections: the box, how browsers build pages, semantic HTML, selectors, specificity, units, Flexbox, responsive design, variables, transitions. Each is the plain-statement-then-metaphor order the guide asks for. | Nothing in place. Its ten sections are the outline of the web tutorial track: each could become one short page with a live example. | Web door; seed for Web | keep; mirror |

## 2. `WADB_Tutorials`, copied to `sources/wadb/` (until 2026-09-04, `tutorials/`)

### The lessons

| Page | Measured | Good | Change | Track | Do |
|---|---|---|---|---|---|
| 01 HTML basics | 3536 words, 155 sentences, mean 22.8, 26 % over 25, phone overflow, no landmark | "HTML and CSS are just files" and the edit, save, refresh loop. Beginners lack exactly this and no other page says it. The worked example builds a real first page. | Too long for one sitting by three times. Cut "why HTML matters" and the learning-outcomes preamble. | Web | split into three: files and the save-refresh loop; the skeleton of a page; the six tags used most. Overlaps starter exercises 1 to 6, so second priority. |
| 02 Semantic HTML | 2058, 97, mean 21.2, 23 % | The side-by-side of semantic and non-semantic markup, and the blog-post worked example. | Open with something to try: the browser's accessibility tree or a screen reader reading the two versions. Then the names. | Web | rewrite as one page under 50 sentences, or fold into 01's third page |
| 03 CSS basics | 2867, 147, mean 19.5, 16 %, overflow | The theme switcher, the one live thing in thirteen lessons. The anatomy of a rule. | Make the switcher the opener. Cut the three-ways-to-include section to the one way we use. | Web | split into two: a rule and where it lives; the properties used first (colour, font, spacing) |
| 04 CSS layout | 2933, 156, mean 18.8, 17 %, overflow | Box model, display, Flexbox, positioning, grid-versus-Flexbox, in a sensible order. | Four ideas on one page. Each wants a live example the reader resizes. Overlaps lesson 11 and `CONCEPTS.md`. | Web | split into four: the box; display and flow; Flexbox first steps; positioning |
| 05 Responsive design | 2571, 139, mean 18.5, 19 %, overflow | The mobile-first section. Flexible images. | One page with a width slider over an iframe would replace most of the prose. Starter exercise 24 covers the same ground by doing. | Web | rewrite as one page around a live example |
| 06 GitHub setup | 3218, 143, mean 22.5, 24 %, overflow | The interface tour. | Same content as guides 01 and 02, at twice the length. | Web | rewrite, merged with guides 01 and 02 into one page per step |
| 07 GitHub workflow | 3399, 167, mean 20.3, 17 % | The complete worked example of branch, commit, pull request. | Same content as guides 03 and 04. | Web | rewrite, merged with guides 03 and 04; the worked example is the page's opener |
| 08 GitHub Pages | 2855, 159, mean 17.9, 16 %, overflow | The URL section explains why an address looks the way it does. | Same content as guide 05, which is the most readable page on the site. | Web | rewrite, merged with guide 05; its URL explanation leads |
| 09 Images | 3282, 130, mean 25.2, 30 %, 34 code blocks, overflow | File paths (relative, `../`, root) and alt text. Paths are the first cause of "my image won't load". | The longest sentences on the site after lesson 10. | Web | split into three: paths; alt text and formats; responsive images |
| 10 Links | 2692, 89, mean 30.2, 34 %, 53 code blocks, overflow | Link states, link text, a navigation menu. | The worst sentence length on the site. Fifty-three code blocks for one topic. | Web | split into three: three kinds of link; styling links and their states; a navigation menu |
| 11 Flexbox and Grid | 2493, 104, mean 24.0, 24 %, 17 headings, 20 code blocks | Named grid areas, `auto-fit` with `minmax()`, the holy-grail and dashboard examples. The project brief requires Flexbox and Grid. | Seventeen headings is two pages. Each half should open with a layout the reader resizes. | Web, project | split into two: Flexbox properties; Grid areas and `minmax()`. First priority in this track. |
| 12 Component design | 1780, 77, mean 23.1, 19 %, 17 headings, overflow | Custom properties and one card component. The theme-and-dark-mode section describes what this site's own reading settings do, which is a rare chance to point at a live example. | BEM, design tokens and file architecture are more than a Level 5 project needs. | Web, project | rewrite as one page: variables, one component, a theme switch; BEM as an aside |
| 13 CSS animations | 887, 45, mean 19.7, 16 %, 18 headings, 31 code blocks, overflow | The four worked examples (accordion, modal, cube, spinner), which are also the templates. Transitions and transforms are what a project needs. | The checkbox hack and `:target` teach tricks that a `details` element or a line of script now replaces. Cut them. | Web, project | split into two: transitions and transforms; keyframes. Worked examples become downloads. |

### The GitHub guides

The guides are the readable part of the site, because they are procedural: do this, then this. They stay as seven, rewritten to under 50 sentences each, in the order a student meets them. Guide 05 (mean 16.1) is the model for the rest.

| Page | Measured | Good | Change | Track | Do |
|---|---|---|---|---|---|
| 01 Getting started | 1497, 71, mean 21.0, 18 %, overflow | Account creation step by step. | Halve it. The "key concepts" section repeats what the starter's README says in one paragraph. | Web | rewrite |
| 02 Creating a repo | 1939, 85, mean 22.8, 26 %, overflow | Creating and verifying a repository. | The starter forks rather than creates; say when a student needs each. | Web | rewrite |
| 03 First commit | 1817, 92, mean 19.7, 22 %, overflow | Commits through the web interface, which is what the starter uses. | Shorter. The best-practices section is one list. | Web | rewrite |
| 04 Branches and PRs | 2073, 110, mean 18.8, 17 % | Complete and correct. | A Level 5 student meets branches only if the team project asks for them. Keep, mark as "later". | Web | rewrite, mark optional |
| 05 GitHub Pages | 1922, 119, mean 16.1, 14 %, overflow | The most readable page on the site. The starter's exercise 2 points here. | Absorb lesson 08's explanation of why the address looks the way it does. | Web | rewrite, lightly |
| 06 Collaboration | 1677, 112, mean 14.9, 7 % | Forking explained plainly. | The fork section belongs beside the starter's exercise 1; the rest is for the team project. | Web | rewrite; move the fork section forward |
| 07 Browser devtools | 2946, 110, mean 26.8, 25 % | Inspect, edit CSS live, the console, device mode. This is the tool behind every troubleshooting step. | Long sentences. Three pages' worth. | Both | split into three: inspect and edit; the console; device mode |

### The resource pages

| Page | Measured | Good | Change | Track | Do |
|---|---|---|---|---|---|
| Troubleshooting | 2993, 134, mean 22.3, 26 %, overflow, no landmark; the audit found 68 contrast failures | Problem-shaped headings ("My CSS isn't working"). This is the page a student opens in a panic, and its shape is right. | Each problem becomes a card of three checks. Add the two problems dewstack adds: "GitHub shows page not found" and "the playground says the database failed to load". Fix the contrast. | Both | rewrite; high priority |
| Quick reference | 807, 114, mean 7.1, 53 code blocks, overflow, no landmark | Compact and scannable. | Fixed-width cards overflow a phone; a table that wraps does not. Add a SQL half from the quiz's reference panel. | Both | rewrite as two tabs: HTML and CSS; SQL |
| Project ideas | 1173, 55, mean 21.3, 18 %, no landmark | Ideas keyed to what a student has learned so far. | Re-key to the new tracks: after the starter; after Flexbox and Grid; data projects; full-stack projects. This page is where the full-stack track can begin as a list. | Both; Full stack | rewrite |
| Design resources | 1468, 107, mean 13.7, 6 % | The most readable prose on the site. Fonts, readability, accessibility. | Point at this site's own reading settings as a worked example of every principle it names. | Web | keep, then rewrite lightly |
| About | 1228, 66, mean 18.6 | The attributions. | Its content belongs in the README's "For teachers". | none | fold into README |
| The tutorials' own front page | 1051, 47, overflow (the hero clips its heading on a phone) | The lesson grid and the progress tracker. | Redundant once the lessons are rewritten and listed on the course front page. Until then it is the shelf's index. | Web | keep for now; drop when the last lesson is rewritten |

### Templates and examples

| Files | Good | Change | Track | Do |
|---|---|---|---|---|
| Templates: portfolio, blog, landing page, website starter | Commented starting points for the web authoring project. | One-line descriptions on a templates page; `website-starter` and `basic` overlap the starter repository. | Web, project | download |
| Templates: accordion, tabbed interface, modal, rotating cube, spiral animation | The worked examples of lesson 13, as files. | List them beside the animations rewrite. The spiral overflows a phone. | Web | download |
| Templates: photo gallery | A grid gallery. | Its one sentence is 149 words: a comment written as a paragraph. | Web | download |
| Examples: hello-world, first-page | The two smallest possible pages. | Sit beside the first rewritten lesson. | Web | download |
| Examples: resume-template, portfolio-starter | Small portfolio pages. | `portfolio-starter` duplicates the starter repository. | Web | download the first; drop the second |

### The quiz

| Page | Measured | Good | Change | Track | Do |
|---|---|---|---|---|---|
| Tentacular Plushies | 782 words, 35 sentences, 26 %, six CDN loads, no landmark; fixed three-panel layout, body scroll disabled | Five tasks in a story (a shop's database), a hint under each, a SQL reference panel, and a download of the student's SQL for submission. The tasks are the right five. | Unusable on a phone (the audit: the task panel is one word wide). "Check my work" was reported broken in class in December. CodeMirror and SQL.js from a CDN. | Data | rewrite in the shell as one column, same five tasks; its reference panel becomes the SQL half of the quick reference |

## 3. `HTML-CSS-SQL-JS`, copied to `sources/playground/` (until 2026-09-04, `databases/playground/`)

| Page | Measured | Good | Change | Track | Do |
|---|---|---|---|---|---|
| `index.html` | 953 words, 43 sentences, mean 22.1, 23 %, phone overflow, landmark | The engine pattern: SQL.js in the page, a query typed and run, a result drawn as a table, nothing installed. Six command cards (SELECT to DELETE), five exercises, bonus exercises, reflection questions. | Parts 1 and 2 are thin repeats of the web track. The "Choose your learning path" box is illegible (white on near-white, in the source too). "Read first, then try" is the reverse of the order the style guide asks for. | Data | split: the SQL section becomes the first two data tutorials (a table is a list of rows; asking questions of a table), each with its own editor; Parts 1 and 2 become one line pointing at the web track |
| `teacher.html` | 2260, 69, mean 32.7, 28 % | Teaching tips per section, solutions under each exercise, the sample database described. | Teaching notes are not student-facing; they belong in `planning/`. Solutions are linked at the foot of the page they belong to (plan, question 2). | Data | fold: notes to `planning/TEACHING_NOTES.md`, solutions to the foot of each rewritten page |
| `tutorial.js`, `styles.css` | | The stylesheet is now the front page's. The script is 60 lines that create the tables and run a query. | With Pyodide as the engine (plan, section 8), the script is a reference for what the page must do, not code to keep. | Data; Full stack | keep until the playground is rewritten |

## 4. The notebook, `databases/sqlite_tutorial.ipynb`

| Page | Good | Change | Track | Do |
|---|---|---|---|---|
| SQLite with dinosaurs | 44 cells, one idea per cell, two tables and a join, the most approachable database material of the three sources. | Uses `ipython-sql` magics and a `pip install` in the notebook, so it needs Jupyter and a working install, which the rest of the course has removed. | Data, the Python half | port: either to plain `sqlite3` and pandas in a notebook, or to a browser page in the data track as the third tutorial (two tables and a join). The dinosaurs stay either way. |

## 5. The order this gives

Counting the splits, the web track is about 22 short pages and seven guides; the data track is five tutorials, a quiz and a notebook; the reference shelf is four pages. Each rewritten page is a pull request of its own, per the plan's ground rules.

1. Troubleshooting and the quick reference, because every track uses them and both fail on a phone today.
2. Lesson 11 as two pages, then 12, then 13, because the web authoring project needs them and the starter does not cover them.
3. The playground's SQL section as data tutorials 1 and 2, then the quiz, then the notebook as tutorial 3.
4. Guides 01, 02, 03, 05, in the order the starter's exercises 1 and 2 need them.
5. Lessons 09 and 10 (paths, alt text, links), which the starter touches and every student gets wrong once.
6. Lessons 01 to 05, last, because the starter covers their ground by doing and their rewrites are the longest.
7. Guides 04, 06, 07, and the templates page.

Lessons 06, 07 and 08 are rewritten together with guides 01 to 05, as one page per step rather than a lesson and a guide saying the same thing.
