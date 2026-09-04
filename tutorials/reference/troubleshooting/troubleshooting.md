---
title: "Troubleshooting"
slug: troubleshooting
module: reference
module_title: "Reference"
series: shelf
version: 2026.09.04.1
---

# Troubleshooting

Something not working is the normal shape of building a website, not a
sign you have done anything wrong. This page groups the problems a
student meets most often, each with the checks that usually find it.

## A page or a style doesn't look right

### The page is blank

A blank page usually means the browser could not make sense of the file.

- Open the file in a text editor and check it starts with `<!DOCTYPE html>`,
  and that `<html>`, `<head>` and `<body>` are all there.
- Check that content sits between the opening and closing `<body>` tags,
  not outside them.
- Check the browser's address bar. If it shows a folder listing or a
  different file than the one you edited, open the right file.

### The CSS isn't doing anything

The usual cause is the browser not finding the stylesheet.

- Check the `href` in the `<link>` tag matches the CSS file's name and
  location exactly, including the folder if there is one.
- Check the `<link>` tag sits inside `<head>`, not `<body>`.
- Look for a missing semicolon or an unclosed `{` in the CSS file. One
  mistake near the top can stop everything below it from working.

### Only some of the styles apply

When one rule works and another does not, two rules are usually
disagreeing about the same element.

- Check the selector matches the element, class or id you meant. A rule
  for `.card` does nothing to an element with no `class="card"`.
- Two rules can both match one element. The more specific selector wins,
  so a class usually beats a plain tag name.
- Check every value has its unit. `font-size: 16;` does nothing;
  `font-size: 16px;` works.

### An image won't show

- Check the `src` matches the image's file name and location exactly,
  including capital letters. `Photo.jpg` and `photo.jpg` are different
  files on many systems.
- Check the file extension matches what is actually saved, such as
  `.jpg` against a file really saved as `.png`.
- The `alt` text still shows if the image itself fails to load. If you
  see the alt text where the picture should be, the path is wrong, not
  the file.

### My file won't open in the browser

This is usually a file extension problem rather than anything wrong with
the page itself.

- Check the file ends in `.html`, not `.txt` or `.doc`. A browser only
  recognises a page by its extension.
- If it opens in a text editor instead of a browser, right-click it,
  choose "Open with", and pick your browser instead.
- You can always open a file from inside the browser itself: press
  `Ctrl+O` (Windows) or `Cmd+O` (Mac), then find the file. This works
  regardless of which program your computer normally opens it with.

## My code has a mistake I can't find

A page can look almost right and still hide one small error. These are
the three that cause most of the trouble.

### An unclosed tag

Every opening HTML tag needs a closing one, or the browser misreads
everything that follows it.

```html
<!-- Correct -->
<p>This paragraph ends where it should.</p>

<!-- Incorrect: the closing tag is missing -->
<p>This paragraph never ends, so everything after it
```

Work through the file from the top, and check that each tag you opened
has a matching one closed in the right place. `<img>` and `<br>` are the
exception: they never need a closing tag.

### An unclosed brace in CSS

A missing `}` breaks every rule that comes after it, not just the one it
belongs to.

```css
/* Correct */
p {
    color: blue;
}

/* Incorrect: the closing brace is missing */
p {
    color: blue;
```

Most code editors highlight the brace that matches the one your cursor
is on. Use that to check each `{` has a `}` where you expect it.

### A missing semicolon

In CSS, a property without its semicolon can take the next line down
with it.

```css
/* Correct */
p {
    color: blue;
    font-size: 16px;
}

/* Incorrect: font-size is silently ignored */
p {
    color: blue
    font-size: 16px;
}
```

## Nothing changed after I edited something

### The page still shows the old version

- Check the file is saved. Editors often show a dot or a mark on the tab
  when a change is unsaved.
- Refresh the browser. If that does not work, force a hard refresh:
  `Ctrl+F5` on Windows, `Cmd+Shift+R` on a Mac. Browsers keep a copy of a
  page to load it faster next time, and a hard refresh clears that copy.
- Check you are editing the file the browser has open, not a second copy
  saved somewhere else with a similar name.

### GitHub Pages still shows the old version

Publishing takes a minute or two after you push, so the delay itself is
normal. Check these once that time has passed.

- Confirm the change was committed and pushed, not only saved on your own
  computer. Saving a file never sends it to GitHub by itself.
- Confirm the push went to the branch GitHub Pages publishes from, which
  is usually `main`.
- Force a hard refresh once the wait has passed. The old page may be
  cached in your own browser rather than still live on GitHub.

## GitHub won't take my changes

- A push needs you to be signed in. Check you are authenticated, either
  with a personal access token over HTTPS or with an SSH key.
- `git add`, `git commit` and `git push` are three separate steps.
  Skipping any one of them means the file never reaches GitHub, even if
  the other two ran without an error.
- GitHub can reject a push with a message about the remote having
  changes you don't have. Something else changed the repository since
  your last pull, so pull first, then push again.

## This site itself

### The Settings panel doesn't do anything

The **Settings** button is at the top right of every page. It opens a
panel for theme, typeface, text size and line width. If a choice does not
seem to apply, close the panel and reopen it, since some changes only
show once the panel closes. Your choices are saved in this browser, so
they will not follow you to a different browser or a different device.

### The search box finds nothing

**Search the tutorials** is on the front page. It matches a tutorial's
title and the terms that tutorial introduces, not every word in its
prose. A word used only once inside a paragraph can come back empty. Try
the name of the topic instead: "flexbox" rather than a sentence about it.

## Still stuck

Go back to the tutorial the problem came from and read the step again.
Coming back to a problem after a short break often makes the fix obvious
in a way it wasn't a few minutes before.
