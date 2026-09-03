# Web authoring and databases

This is the home page for the web authoring and database course. It says
what the course covers, in what order, and where each part lives.

The course is for adults who are learning to make web pages and to work
with data. Many are doing this for the first time. Nothing has to be
installed. You need a free GitHub account, a web browser and a text editor.

This page is also published as a website, at
https://deweydex.github.io/dewstack/. The website has the same stages and
the same links. It also has a reading settings button: theme, typeface,
text size, line width and high contrast, saved on your device.

## How the course is arranged

The course has three stages. Each stage builds on the one before it. We
suggest working through them in order. If some of this is already familiar,
you can start where the material is new to you.

### Stage 1: build and publish a website

You start with nothing and finish with a personal website at its own
address on the internet. Along the way we learn how HTML gives a page its
structure and how CSS gives it its look.

The work happens in your own copy of the **web** repository. First you make
a copy of it, which GitHub calls a fork. Then you change its files, one
exercise at a time. Then GitHub publishes your changes at your own address.

Start here: https://github.com/deweydex/web

The instructions are in that repository's README. There are twenty-five
short exercises. Each one asks you to change something and look at what
happens.

### Stage 2: work with data

A website often needs to remember things: the products in a shop, the
members of a club, the marks in a class. A database is a program that
stores this kind of information in tables. We learn to make tables, to put
data in them, and to ask them questions. The questions are written in a
language called SQL. Most databases understand SQL, so what you learn here
is useful far beyond this course.

The database runs inside your browser. Nothing is installed, and nothing
you type is sent anywhere.

The database work starts with the SQL playground, which lives in this
repository: https://deweydex.github.io/dewstack/databases/playground/.
It has short refreshers on HTML and CSS, then SQL. Then try the quiz:
https://deweydex.github.io/dewstack/tutorials/tentacular-plushies-quiz-final.html.
The notebook covers the same ideas in Python and adds joining two tables.
It opens in Google Colab:
https://colab.research.google.com/github/deweydex/dewstack/blob/main/databases/sqlite_tutorial.ipynb

### Stage 3: put the two together

In the last stage we show data from a database on a web page. This stage is
still being written. Its shape will be settled once stages 1 and 2 are in
place.

## Tutorials, guides and templates

The exercises in stage 1 show you what happens. The tutorials explain why.
Use them when an exercise leaves you with a question, or when you want more
practice. There are thirteen lessons, seven GitHub guides, eleven starter
templates, four example pages, a troubleshooting page and a quick
reference. Lessons 11 to 13 cover Flexbox, Grid, components and animation,
which the web authoring project needs.

These pages were made for an earlier version of the course, and they are
here as they were. Some of them do not fit a phone screen well yet. We are
rewriting them one at a time.

Open them here: https://deweydex.github.io/dewstack/tutorials/

## Where your work is saved

In stage 1, your work lives in your own GitHub repository. You can return
to it from any computer by signing in to GitHub.

In the playground, the database starts again each time the page is
reloaded. If you write a query you want to keep, copy it into a file of
your own.

## All the links

| What it is | Repository | Published site |
|---|---|---|
| **This course**: the front page, the tutorials and the database pages | [deweydex/dewstack](https://github.com/deweydex/dewstack) | [Front page](https://deweydex.github.io/dewstack/) · [Tutorials](https://deweydex.github.io/dewstack/tutorials/) · [SQL playground](https://deweydex.github.io/dewstack/databases/playground/) · [SQL quiz](https://deweydex.github.io/dewstack/tutorials/tentacular-plushies-quiz-final.html) |
| **web**: stage 1, the site you fork and make your own | [deweydex/web](https://github.com/deweydex/web) | Your own fork has its own address once you turn on GitHub Pages. Exercise 2 shows how. |
| **SQLite notebook**: stage 2 in Python, with dinosaurs for data | `databases/sqlite_tutorial.ipynb` in this repository | [Open in Google Colab](https://colab.research.google.com/github/deweydex/dewstack/blob/main/databases/sqlite_tutorial.ipynb) |
| **HTML, CSS and SQL**: where the playground came from | [deweydex/HTML-CSS-SQL-JS](https://github.com/deweydex/HTML-CSS-SQL-JS) | [Open the page](https://deweydex.github.io/HTML-CSS-SQL-JS/) |
| **Learn HTML, CSS, GitHub and more**: where the tutorials came from | [deweydex/WADB_Tutorials](https://github.com/deweydex/WADB_Tutorials) | [Open the site](https://deweydex.github.io/WADB_Tutorials/) |
| **dewlab**: a sister project for learning Python in the browser | [deweydex/dewlab](https://github.com/deweydex/dewlab) | See its README |

## For teachers

The planning notes are in [`planning/`](planning/).
[`planning/CONSOLIDATION_PLAN.md`](planning/CONSOLIDATION_PLAN.md) says how
the materials are being brought together here, in what order, and what has
moved so far.

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
