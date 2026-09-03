# dewadaba: Web Authoring and Databases

This is the course site for two QQI Level 5 modules taught together: Web Authoring (5N1910) and Database Methods (5N0783). The front page is a plan for the course with every link a student needs. The tutorials and the database pages sit behind those links.

The site is plain HTML, CSS and JavaScript. There is no build step and no server. Open `index.html` in a browser and it works.

## Where everything is

| What | On the web | The code |
|---|---|---|
| This site, the front page | [deweydex.github.io/dewadaba](https://deweydex.github.io/dewadaba/) | [github.com/deweydex/dewadaba](https://github.com/deweydex/dewadaba) |
| The starter site students fork, with its 25 exercises | [deweydex.github.io/web](https://deweydex.github.io/web/) | [github.com/deweydex/web](https://github.com/deweydex/web) |
| The tutorials: thirteen lessons, GitHub guides, templates, examples, troubleshooting, quick reference | [dewadaba/tutorials](https://deweydex.github.io/dewadaba/tutorials/) | `tutorials/` in this repository |
| The SQL playground | [dewadaba/databases/playground](https://deweydex.github.io/dewadaba/databases/playground/) | `databases/playground/` |
| The SQL playground, teacher version, with solutions and notes | [teacher.html](https://deweydex.github.io/dewadaba/databases/playground/teacher.html) | `databases/playground/teacher.html` |
| The SQL quiz | [tentacular-plushies-quiz-final.html](https://deweydex.github.io/dewadaba/tutorials/tentacular-plushies-quiz-final.html) | `tutorials/tentacular-plushies-quiz-final.html` |
| The SQLite notebook | [Open in Google Colab](https://colab.research.google.com/github/deweydex/dewadaba/blob/main/databases/sqlite_tutorial.ipynb) | `databases/sqlite_tutorial.ipynb` |
| The plan for this repository | | [PLAN.md](PLAN.md) |

## For students: how to begin

The front page puts the course in four steps, and the order matters.

First, go to the starter repository and read its README. It tells you how to fork the repository and turn on GitHub Pages, and it holds the exercises. You start with three files and finish with a portfolio site published at an address you can share. That is Step 1, and most of the learning happens there.

Then use the tutorials when an exercise leaves you with a question. The lessons explain why things work. The GitHub guides are step-by-step instructions for making an account, saving your work, and publishing a site. That is Step 2.

Then, when the course turns to databases, open the SQL playground. Type a query, run it, and see the result. Everything runs inside your browser. Nothing is installed, and nothing you type is sent anywhere. That is Step 3.

Step 4 is the projects and the exam. The college sets those, and the briefs are on your course page and on Moodle.

## For teachers

Each step on the front page names what a student can do at the end of it. After Step 1 they have built and published a three-page site and changed every part of it themselves. After Step 2 they can explain the choices they made and use Flexbox and Grid for the project. After Step 3 they can write SELECT, WHERE, ORDER BY, INSERT, UPDATE, DELETE and COUNT queries against a small database and read the results. The notebook adds a join across two tables.

The playground has a teacher version at `databases/playground/teacher.html`. It is the same page with worked solutions under each exercise and teaching notes at the top. The playground's sample database has two tables, students and courses. The playground does not teach JOIN itself, but the second table is there when the course reaches it.

The tutorials under `tutorials/` are a complete site of their own, with a front page, a menu, a search box and a progress tracker. They are copied as they were from their previous home so that nothing a student bookmarked has changed. Which of them the front page points at, and in what order, is a decision recorded in [PLAN.md](PLAN.md).

## Running the site yourself

To read it, open `index.html` in a browser. Every link is relative, so the tutorials and the playground work from a folder on your computer.

To publish your own copy, first fork this repository. Then open the fork's Settings, choose Pages, and under Source choose "Deploy from a branch", with the branch `main` and the folder `/ (root)`. Save, wait a minute, and your copy is at `https://your-username.github.io/dewadaba/`.

Two things to know. File names matter: the front page must be called `index.html`, in lower case, at the top of the repository. And the SQL playground loads its database engine from the internet the first time it opens. On a computer with no connection, the playground shows an error until it is online.

## When something does not work

If the playground says the database failed to load, the page could not reach the internet to fetch the engine. Check the connection and reload. If the problem stays, open the browser's developer tools and read the message in the Console tab.

If GitHub shows "page not found" after you turn on Pages, wait a minute and try again. If it still fails, check that `index.html` is at the top of the repository, not inside a folder.

If a page shows with no styling, the link to the stylesheet is wrong. Check that the file name in the `href` matches the real file exactly, including capital letters.

If a query does not run, read the error under the editor. The usual causes are a missing semicolon, or a table or column name that does not exist. Check the spelling against the table's own names.

## What is in the repository

| Path | What it is |
|---|---|
| `index.html`, `styles.css` | The front page and its stylesheet. |
| `tutorials/` | The tutorial site: `lessons/` (thirteen lessons), `github-guides/` (seven guides, in HTML and Markdown), `examples/`, `templates/`, the troubleshooting, reference, design-resources and project-ideas pages, the SQL quiz, and the site's own `css/`, `js/` and front page. |
| `databases/playground/` | The interactive HTML, CSS and SQL tutorial. Queries run in the browser through SQL.js. `teacher.html` is the version with solutions. |
| `databases/sqlite_tutorial.ipynb` | SQLite in a Jupyter notebook, with dinosaurs for data. |
| `PLAN.md` | What this repository is for, what is in place, and the steps that follow. |

## Where the pieces came from

Everything here was copied from the repository it used to live in. Nothing was moved and nothing was edited on the way.

- `tutorials/` is `deweydex/WADB_Tutorials`, minus four working-notes files that were never part of the site.
- `databases/playground/` is `deweydex/HTML-CSS-SQL-JS`. The front page's stylesheet is a copy of the playground's.
- `databases/sqlite_tutorial.ipynb` is from the course site's assets.
- The starter site is `deweydex/web`, which stays in its own repository so that a student's fork holds their site and nothing else.

## Licence

See [LICENSE](LICENSE).
