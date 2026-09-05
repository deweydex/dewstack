---
title: "Troubleshooting"
slug: troubleshooting
module: reference
module_title: "Reference"
series: shelf
version: 2026.09.04.1
---

# Troubleshooting

Sometimes code gives a result we did not expect. This page offers checks
we can try to find the cause. You can begin with the description closest
to what you see, or ask your teacher to look with you.

Changing one thing at a time can help us see which change makes a
difference. If you want to keep the current version, you can save a copy
before trying a change.

## A page or a style doesn't look right

### The page is blank

A useful first check is the address in the browser. Is it the file you
have been editing? A different file may explain why your text is missing.

In the editor, you can look for the text you expected to see. Page
content belongs inside `<body>`, between its opening and closing tags:

```html
<body>
  <p>This text appears on the page.</p>
</body>
```

If your file has similar content, saving it and refreshing the browser
may help. [The skeleton](tutorial:the-skeleton) shows the parts of an
HTML page if you want an example to compare.

### The CSS isn't doing anything

The browser may be unable to find your stylesheet, the file containing
CSS rules. These checks can help:

- Does the `href` in the `<link>` tag match the CSS file's name and folder?
- Is that `<link>` tag inside `<head>`?
- Does the file contain the rule you expected to apply?

[A rule and where it lives](tutorial:a-rule-and-where-it-lives) shows
how an HTML page links to CSS.

### Only some of the styles apply

A *selector* names the elements a CSS rule applies to. A rule for `.card`
applies to an element with `class="card"`. Comparing the selector with
your HTML is one place to begin.

More than one rule can apply to an element. A more specific selector,
such as a class name, usually takes priority over a tag name. The
[inspector](tutorial:the-inspector) can show which rules the browser uses.

A value may also need a unit. For example, `font-size: 16px;` sets the
text size in pixels. `font-size: 16;` is not a valid size.

### An image won't show

The `src` in an image tag tells the browser where to find the image.
You can compare it with the file's name and folder, including capital
letters and the ending, such as `.jpg` or `.png`.

On many systems, `Photo.jpg` and `photo.jpg` are different names. If the
names match, the file may be missing, damaged, or unavailable to the
browser. The text in `alt` can appear when an image cannot load; it does
not tell us which of these caused the problem.

### My file won't open in the browser

An HTML file usually has a name ending in `.html`. You can check whether
your editor saved it with another ending, such as `.txt`.

If the file opens in an editor, the **Open with** option in your file
manager lets you choose a browser. You can also open a file from the
browser with `Ctrl+O` on Windows or `Cmd+O` on a Mac.

## My code has a mistake I can't find

### An unclosed tag

Many HTML elements use an opening and closing tag. A missing closing
tag can change how the browser groups the content that follows.

```html
<p>This paragraph has an opening and a closing tag.</p>
```

You can compare your tags with the example. Some elements, including
`<img>` and `<br>`, do not use closing tags. [The
skeleton](tutorial:the-skeleton) has a complete page to compare with yours.

### An unclosed brace in CSS

Braces group a rule's declarations, which say how an element should look.
A missing `}` can affect the rules that follow it.

```css
p {
    color: blue;
}
```

Many editors highlight the matching brace when the cursor is beside
`{` or `}`. This can help us find where a rule begins and ends.

### A missing semicolon

A semicolon separates one CSS declaration from the next. Without it,
the browser may read two lines as one invalid value.

```css
/* Each declaration ends with a semicolon. */
p {
    color: blue;
    font-size: 16px;
}

/* The missing semicolon joins the two declarations. */
p {
    color: blue
    font-size: 16px;
}
```

In the second example, neither the colour nor the size is applied by
this rule. Adding the missing semicolon lets the browser read both.

## Nothing changed after I edited something

### The page still shows the old version

We can check the steps between editing a file and seeing its result:

1. Is the file saved? Some editors show a dot on the tab for unsaved changes.
2. Has the browser loaded it again? Refresh loads the page again.
3. Is the browser showing the file you edited? Two copies can have similar names.

Browsers sometimes keep an older copy of a page. A *hard refresh* asks
for a fresh copy. You can try `Ctrl+F5` on Windows or `Cmd+Shift+R` on a Mac.

### GitHub Pages still shows the old version

Publishing can take a few minutes. If the old version stays visible,
these questions may help:

- Are the changes on GitHub? Saving a file on your computer does not send it there.
- Are they on the branch used for publishing? A branch is a version of the project;
  the publishing branch is often called `main`.
- Does a hard refresh show the new version?

[The two loops](tutorial:the-two-loops) explains saving and publishing.
Your teacher can help you check the publishing settings if you are unsure.

## GitHub won't take my changes

GitHub needs to recognise your account before it accepts changes. If
there is a sign-in message, signing in through your editor may help.

An error message may say that GitHub has changes your computer does not
have yet. You can keep the message and ask your teacher to look with
you before combining the two versions. [The two
loops](tutorial:the-two-loops) explains the usual steps for sending work
to GitHub.

The message, the action you tried, and the result are useful details to
share. You do not need to understand the message before asking for help.

## This site itself

### The Settings panel doesn't do anything

The **Settings** button opens choices for colours, font, text size, and
line width. Changes should appear while the panel is open.

If the panel does not open, or a choice has no effect, you can tell your
teacher. The report link at the bottom of the page is another option.
The name of the setting and your browser are useful details to include.

Settings are saved in this browser. A different browser or device will
have its own settings.

### The search box finds nothing

**Search the tutorials** is on the front page. It searches page titles
and the terms each page introduces. It does not search every sentence.
You could try a topic name, such as "flexbox" or "images".

### My SQL work is missing

A box labelled **Your table** saves its SQL text when you use **Run** or
**Load**. Typing alone does not save it. Other SQL boxes do not keep
changes between visits.

Are you using the same browser and device? Was browser data cleared, or
was **Reset** used? These can explain why saved work is missing. Browser
settings or full storage can also prevent saving.

If you downloaded a `.sql` file, **Load** puts its text back in the box.
**Run** then runs that text. The [FAQ](tutorial:faq) explains saving and
resetting in more detail.

## Still stuck

You can ask your teacher to look at the problem with you. The page name,
the step you tried, and what happened are useful places to begin.

You can also return to an earlier example or take a break. A problem may
need more time or another explanation. If the instructions on this site
are unclear, the report link below lets you tell us which part needs help.
