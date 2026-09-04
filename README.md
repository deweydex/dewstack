# Web authoring and databases

This is the home page for the web authoring and database course. It says
what the course covers, where each part lives, and where to begin.

The course is for adults who are learning to make web pages and to work
with data. Many are doing this for the first time. Nothing has to be
installed. You need a free GitHub account, a web browser and a text editor.

This page is also published as a website, at
https://deweydex.github.io/dewstack/. The website has the same parts and
the same links. It also has a reading settings button: theme, typeface,
text size, line width and high contrast, saved on your device.

## Before you begin

Three things, in this order. First, a free GitHub account: GitHub is
where your site's files live and where it is published. Second, a text
editor. VS Code is free and works on any computer; if you cannot install
programs, GitHub has an editor built into its website, and every exercise
works there too. Third, a browser you know how to refresh.

That is how the pieces fit. Your editor changes the files. GitHub keeps
them and publishes them. Your browser shows the result. The tutorials
here explain what you see. Nothing else is installed for the web track,
and nothing at all for the data track.

- Making a GitHub account, step by step:
  https://deweydex.github.io/dewstack/tutorials/github-guides/01-getting-started.html
- VS Code: https://code.visualstudio.com/

## Two ways to begin

You can start with a website, or start with data. Neither assumes the
other. If you are in a class, your teacher will say which comes first. If
you are working on your own, pick the one that interests you more.

### Start with a website

You start with nothing and finish with a personal website at its own
address on the internet. Along the way we learn how HTML gives a page its
structure and how CSS gives it its look.

The work happens in your own copy of the **web** repository. First you make
a copy of it, which GitHub calls a fork. Then you change its files, one
exercise at a time. Then GitHub publishes your changes at your own address.

Start here: https://github.com/deweydex/web

The instructions are in that repository's README. There are twenty-five
short exercises. Each one asks you to change something and look at what
happens. At the end you have three pages, a stylesheet you understand, and
an address you can share.

### Start with data

A website often needs to remember things: the products in a shop, the
members of a club, the marks in a class. A database is a program that
stores this kind of information in tables. We learn to make tables, to put
data in them, and to ask them questions. The questions are written in a
language called SQL. Most databases understand SQL, so what you learn here
is useful far beyond this course.

The database runs inside your browser. Nothing is installed, and nothing
you type is sent anywhere.

Start here: https://deweydex.github.io/dewstack/databases/playground/

The playground has short refreshers on HTML and CSS, then SQL. You type a
query, run it, and see the result. At the end you can make a table, put
rows in it, and ask it questions with SELECT, WHERE and ORDER BY. That
takes an hour or so.

## Web authoring tutorials

The exercises in the starter show you what happens. The tutorials explain
why. Use them when an exercise leaves you with a question, or when you
want more practice.

There are thirteen lessons. Lessons 1 to 10 cover the same ground as the
exercises, in more depth. Lessons 11 to 13 cover Flexbox, Grid, components
and animation, which the web authoring project needs. The same site has
seven step-by-step GitHub guides, four small example pages, eleven starter
templates, a troubleshooting page and a quick reference.

These pages were made for an earlier version of the course, and they are
here as they were. Some of them do not fit a phone screen well yet. We are
rewriting them one at a time, and each rewrite will be shorter.

- The tutorials front page, with all thirteen lessons in order:
  https://deweydex.github.io/dewstack/tutorials/
- Lesson 11, Flexbox and Grid, the first of the three for the project:
  https://deweydex.github.io/dewstack/tutorials/lessons/11-flexbox-grid-advanced.html
- The GitHub guides, from making an account to publishing a site:
  https://deweydex.github.io/dewstack/tutorials/github-guides/01-getting-started.html
- Troubleshooting, for when something does not work and you cannot see
  why: https://deweydex.github.io/dewstack/tutorials/troubleshooting.html
- Quick reference for HTML tags and CSS properties:
  https://deweydex.github.io/dewstack/tutorials/reference.html

## Database tutorials

- The SQL playground, where the data track begins:
  https://deweydex.github.io/dewstack/databases/playground/
- The SQL quiz, five tasks on a small shop database:
  https://deweydex.github.io/dewstack/tutorials/tentacular-plushies-quiz-final.html
- The SQLite notebook, the same ideas in Python, with a join across two
  tables. It opens in Google Colab:
  https://colab.research.google.com/github/deweydex/dewstack/blob/main/databases/sqlite_tutorial.ipynb
- The playground, teacher version, with solutions and notes:
  https://deweydex.github.io/dewstack/databases/playground/teacher.html

More database tutorials are being written, in this order: a table is a
list of rows; asking questions of a table; two tables and a join;
designing a database before typing; a real dataset, loaded, queried and
charted. They will appear here as they are ready.

## Full stack: putting the two together

A full-stack page is a web page that shows information from a database
and lets a visitor change it. A list of products that a form adds to. A
table of marks with a chart beside it. A search box that asks a question
of a table and shows the answer.

This part of the course is being written. The first tutorial will show a
page that reads rows from a database and draws them as a table. It uses
the same engine as the playground. It will appear here when it is ready.

## Projects and the exam

The college sets the assessments: a web authoring project, a database
project and a practical exam. The briefs and the dates are on your course
page and on Moodle. We go through each brief in class before it is due.

The web authoring project builds on your site from the starter. Lessons
11 to 13 and the templates are written for it. The database project
builds on the data track. The exam draws on both.

## Where your work is saved

If you started with a website, your work lives in your own GitHub
repository. You can return to it from any computer by signing in to
GitHub.

In the playground, the database starts again each time the page is
reloaded. If you write a query you want to keep, copy it into a file of
your own.

## All the links

| What it is | Repository | Published site |
|---|---|---|
| **This course**: the front page, the tutorials and the database pages | [deweydex/dewstack](https://github.com/deweydex/dewstack) | [Front page](https://deweydex.github.io/dewstack/) · [Web tutorials](https://deweydex.github.io/dewstack/tutorials/) · [SQL playground](https://deweydex.github.io/dewstack/databases/playground/) · [SQL quiz](https://deweydex.github.io/dewstack/tutorials/tentacular-plushies-quiz-final.html) |
| **web**: the site you fork and make your own | [deweydex/web](https://github.com/deweydex/web) | Your own fork has its own address once you turn on GitHub Pages. Exercise 2 shows how. |
| **SQLite notebook**: the data track in Python, with dinosaurs for data | `databases/sqlite_tutorial.ipynb` in this repository | [Open in Google Colab](https://colab.research.google.com/github/deweydex/dewstack/blob/main/databases/sqlite_tutorial.ipynb) |
| **HTML, CSS and SQL**: where the playground came from | [deweydex/HTML-CSS-SQL-JS](https://github.com/deweydex/HTML-CSS-SQL-JS) | [Open the page](https://deweydex.github.io/HTML-CSS-SQL-JS/) |
| **Learn HTML, CSS, GitHub and more**: where the tutorials came from | [deweydex/WADB_Tutorials](https://github.com/deweydex/WADB_Tutorials) | [Open the site](https://deweydex.github.io/WADB_Tutorials/) |
| **dewlab**: a sister project for learning Python and mathematics in the browser | [deweydex/dewlab](https://github.com/deweydex/dewlab) | See its README |

## For teachers

The planning notes are in [`planning/`](planning/).
[`planning/CONSOLIDATION_PLAN.md`](planning/CONSOLIDATION_PLAN.md) says how
the materials are being brought together here, in what order, and what has
moved so far. [`planning/PAGE_BY_PAGE.md`](planning/PAGE_BY_PAGE.md) goes
through every page of the three source sites and says what is good, what
should change, and where it belongs.

How the pages connect: `index.html` is this README as a web page. Every
tutorial page, the quiz and the playground carry a thin course bar at the
top that links back to it. The bar is the one thing added to the copied
pages. `tools/add_course_bar.py` inserts it, and can insert it again after
a copy is refreshed from its source. Templates and examples do not get the
bar, because students copy those files.

The playground has a teacher version with solutions and notes:
https://deweydex.github.io/dewstack/databases/playground/teacher.html

To publish your own copy of this site, fork the repository, then in the
fork's Settings choose Pages, and under Source choose "Deploy from a
branch" with the branch `main` and the folder `/ (root)`. There is no
build step.

Everything here is released under the MIT licence. Copy it, change it and
share it.
