# dewadaba

Web Authoring and Databases: the tutorial site for two QQI Level 5 modules taught together, Web Authoring (5N1910) and Database Methods (5N0783). It is published with GitHub Pages at `https://deweydex.github.io/dewadaba/`.

The site is plain HTML, CSS and JavaScript. There is no build step. Open `index.html` in a browser and it works; push to `main` and GitHub Pages serves it.

## What is here

| Path | What it is |
|---|---|
| `index.html` | The hub. Sends a student to the starter site first, then to lessons, guides, templates and the database section. |
| `lessons/` | Thirteen lessons. 01 to 10 are the longer explanations behind the starter's exercises; 11 to 13 (Flexbox and Grid, component design, animation) serve the web authoring project. |
| `github-guides/` | Seven step-by-step guides, from making an account to browser developer tools. Six are in both HTML (for the site) and Markdown (for reading on GitHub). |
| `examples/`, `templates/` | Four small example pages and eleven commented starter templates. |
| `design-resources.html`, `troubleshooting.html`, `reference.html`, `project-ideas.html`, `about.html` | The reference shelf. |
| `databases/playground/` | An interactive tutorial with a SQL playground. Queries run in the browser through SQL.js, so nothing is installed. `teacher.html` is the same page with solutions and notes. |
| `databases/quiz.html` | A SQL quiz on a small shop database, also run in the browser. |
| `databases/sqlite_tutorial.ipynb` | SQLite in a Jupyter notebook, with dinosaurs for data. The hub links it to open in Google Colab. |
| `css/`, `js/`, `script.js`, `styles.css` | Shared styles and scripts: navigation, search, theme switcher, progress tracker, code copying. |

The starter site itself, the one students fork and edit, is not here. It lives in its own repository, `deweydex/web`, because a student's fork should hold their site and nothing else. The hub links to it.

## How the pieces fit

The order a student should take is not front to back. First they fork the starter and work through its numbered exercises, which is where most of the learning happens. When an exercise raises a question, a lesson answers it. When the web authoring project begins, lessons 11 to 13 and the templates come into use. When the module turns to databases, the playground is the first stop, then the quiz, then the notebook for the Python half. The GitHub guides are procedural and are used the moment they are needed. The hub page says all of this to the student in plainer words.

## Where it came from

This repository gathers material that used to live in several places, copied rather than moved, so the originals still exist:

- The lessons, guides, examples, templates, reference shelf, styles and scripts are from `deweydex/WADB_Tutorials`.
- The SQL playground and its teacher version are from `deweydex/HTML-CSS-SQL-JS`.
- The SQL quiz is from `deweydex/WADB_Tutorials`.
- The SQLite notebook is from the course site's assets.
- The starter site is `deweydex/web` (formerly `AIML_WA`).

## Working on it

Every page carries the same navigation menu in its markup, so a new page or section means editing that menu in each page. A small script did that for the first assembly; if the menu changes again, search for `nav-section-header` and change every page together. The site search has its own index of pages in `js/search.js`, which also needs a line when a page is added.

Student-facing text follows the plain-language rules in dewlab's `planning/PEDAGOGICAL_STYLE_GUIDE.md`, section 4: short sentences, a verb in each one, the thing said before its contrast, sequences marked, no idioms that assume Irish or British English.
