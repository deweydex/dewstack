---
title: "Site console tour"
slug: site-console
module: fixtures
module_title: "Fixtures"
series: shelf
version: 2026.09.06.1
---

# Site console tour

Two site editors to exercise assets/site-editor.js's console and its Run
model in a real browser. Not a tutorial a student would read.

## With a script

The script logs, then calls a name that does not exist on its third line,
so the console has one printed line and one error to show, and the error's
pane line is known.

```html site=scripted
<p id="greeting">Hello</p>
<button id="go">Go</button>
```

```css site=scripted
p { color: rgb(0, 0, 255); }
```

```js site=scripted
console.log("start", { a: 1 });
var y = 2;
undefinedFunction();
console.log("never");
```

## Without a script

```html site=plain
<p>Only markup</p>
```

```css site=plain
p { color: rgb(255, 0, 0); }
```
