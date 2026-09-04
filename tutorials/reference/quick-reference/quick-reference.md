---
title: "Quick reference"
slug: quick-reference
module: reference
module_title: "Reference"
series: shelf
version: 2026.09.04.1
---

# Quick reference

Use this page to look something up. It is not meant to be read start to
finish. HTML and CSS come first, because every track uses them; SQL comes
last, for the data track.

## HTML

| Tag | What it does |
|---|---|
| `<!DOCTYPE html>` | Tells the browser this is an HTML5 page. The first line of every file. |
| `<html>` | Wraps the whole page. |
| `<head>` | Holds information about the page, such as its title. Nothing inside it is shown on the page. |
| `<body>` | Wraps everything the page shows. |
| `<h1>` to `<h6>` | Marks a heading. Use only one `<h1>` per page; it is the most important. |
| `<p>` | Marks a paragraph. |
| `<strong>` | Marks text as important. Shown bold by default. |
| `<em>` | Marks text as emphasised. Shown in italics by default. |
| `<a href="…">` | Makes a link. `href` names the address it goes to. |
| `<img src="…" alt="…">` | Shows an image. `src` names its file; `alt` describes it for a reader who can't see it. |
| `<ul>`, `<ol>`, `<li>` | Make an unordered list, an ordered list, and one item inside either. |
| `<nav>` | Groups the links a reader uses to move around the site. |
| `<header>`, `<main>`, `<footer>` | Mark the page's header, its main content, and its footer. Use one `<main>` per page. |
| `<section>`, `<article>` | Mark a named part of the page, and a piece of content that stands on its own. |
| `<form>`, `<input>`, `<button>` | Make a form, one field in it, and a button. |
| `<table>`, `<tr>`, `<th>`, `<td>` | Make a table, one row, a header cell, and an ordinary cell. |

## CSS

| Property | What it does |
|---|---|
| `color` | Sets the text's colour. |
| `background-color` | Sets the element's background colour. |
| `font-family` | Chooses the typeface. Always list a plain fallback last, such as `sans-serif`. |
| `font-size` | Sets the text's size. Needs a unit, such as `16px` or `1rem`. |
| `font-weight` | Sets how bold the text is: `normal`, `bold`, or a number from 100 to 900. |
| `text-align` | Lines text up: `left`, `center`, `right`. |
| `line-height` | Sets the space between lines. A value between 1.5 and 1.8 is comfortable to read. |
| `margin` | Adds space outside an element's border. |
| `padding` | Adds space inside an element's border, between the border and its content. |
| `border` | Draws a line around an element, e.g. `border: 1px solid #333;`. |
| `border-radius` | Rounds an element's corners. |
| `display: flex` | Lays out an element's children in a row or column that can wrap and share space. |
| `flex-direction` | Sets which way a flex row runs: `row` or `column`. |
| `display: grid` | Lays out an element's children in a named grid of rows and columns. |
| `grid-template-columns` | Sets how many columns a grid has, and how wide each is. |
| `gap` | Adds space between flex or grid items. |
| `max-width` | Limits how wide an element is allowed to be. Keeps a line of text from stretching too far. |
| `:hover`, `:focus` | Applies only while the pointer is over an element, or while it has keyboard focus. |
| `@media (max-width: …)` | Applies a rule only below a given screen width. |

## SQL

Assumes a table already exists in the database you are querying.

| Statement | What it does |
|---|---|
| `SELECT * FROM table` | Returns every column of every row. |
| `SELECT col1, col2 FROM table` | Returns only the named columns. |
| `WHERE col = 'value'` | Keeps only the rows where the condition is true. Also `!=`, `>`, `<`, `>=`, `<=`. |
| `WHERE col LIKE 'A%'` | Keeps rows where `col` starts with `A`. `%` stands for any text. |
| `ORDER BY col ASC` | Sorts the result, smallest or earliest first. `DESC` reverses it. |
| `LIMIT n` | Returns at most `n` rows. |
| `COUNT(*)` | Counts the rows. |
| `GROUP BY col` | Puts rows with the same value in `col` together, so you can count or total each group. |
| `JOIN other ON table.id = other.id` | Combines two tables using a column they share. |
| `INSERT INTO table (col1, col2) VALUES (?, ?)` | Adds one row. Use `?` placeholders for the values, never build the text of a query out of them. |
| `UPDATE table SET col = ? WHERE …` | Changes existing rows. Always include a `WHERE`, or every row changes. |
| `DELETE FROM table WHERE …` | Removes rows. Always include a `WHERE`, or every row is deleted. |

### Common fixes

| Symptom | Usual cause |
|---|---|
| "no such table" | The table hasn't been created yet in this session, or its name is spelled differently than you typed. |
| A query runs but changes nothing | An `INSERT`, `UPDATE` or `DELETE` needs to be followed by saving the change, or it is lost. |
| A `WHERE` matches nothing you expect | Check the value's spelling and case match what's actually stored. |
