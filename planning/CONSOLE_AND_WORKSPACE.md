# A console for the site editor, and a workspace of dewstack's own

Written 2026-09-06, on Josh's instruction: make the console happen, and
make an equivalent of dewmini for the dewstack site; think it through
first, step by step; look at what the online editors do, but look
harder at dewlab, and at whether a change there makes for one experience
across both sites rather than two.

This is the design, not the build. Each section ends with what it
decides and what it leaves to Josh. Section 8 is the order of work.
Section 9 is the list of open calls.

---

## 1. The short version

The site editor on a tutorial page can run a student's JavaScript and
cannot tell them what it did. Fix that first, and fix it in the one
component that will also be the workspace: a console under the preview
that shows `console.log` output, every uncaught error, and the line in
the JavaScript pane the error came from. A prototype run in a real
Chromium for this document shows the line numbers can be exact. The
console is a few dozen lines of code, and it unblocks the JavaScript
track.

The workspace is then the same component, on a page of its own, with
three things a tutorial page does not need: more than one site, saving
in the browser, and the ability to bring files in. It is not a copy of
dewmini. dewmini is a Python notebook that happens to be able to open a
site; a web authoring student needs a site editor that does not boot
Python at all. What the two should share is the shape and the habits a
student learns: three panes beside a preview, the console in the same
place, the same error styling, the same "your fork is where work lives"
line. Where they can share code, they should, and section 6 says where
that is honest and where it is not.

---

## 2. Where things stand

**dewstack's site editor** (`assets/site-editor.js`, 100 lines;
`build.py`'s `render_site_editor()`). A fenced block tagged `site=name`
becomes a pane; consecutive blocks sharing a name form one editor. The
panes are plain `<textarea>`s, a decision made 2026-09-04 because the
pages are read on phones and CodeMirror is heavy there
(`NEXT_STEPS.md`, Step 6). The preview is a sandboxed `srcdoc` iframe,
`allow-scripts` only, redrawn on every keystroke. Reset, Download these
files, a width slider. Nothing is saved on the page (plan, section 13).
There is no console, no error display of any kind, and no line
numbers. A student whose script throws sees the preview stop changing.

**dewstack's SQL cell** (`assets/sql-cell.js`) is the other runtime on
the site and the precedent for two things the workspace will need: a
`persist` flag that keeps a cell's text in `localStorage` under a name
and restores it on the next visit, and an error class (`.dl-sql-error`)
that the stylesheet already colours with dewlab's error tokens.

**dewlab's dewmini** (`compose/dewmini.js`, 5,400 lines) is a Python
notebook workspace with tabs, a mounted filesystem, a variables
inspector, a reference panel and a data catalogue. Two parts matter
here. Its **Site view** (`DECISIONS_LOG.md` 7.121) opens an `.html` file
with its same-name `.css` and `.js` beside it: three CodeMirror editors
on one side, a sandboxed iframe on the other, redrawn on every
keystroke, written back to real files. dewstack's site editor was
ported in shape from it. It has no console either. Its **JavaScript
cell engine** (`compose/js-cell-engine.js`) is the closer precedent: a
hidden sandboxed iframe whose own small runtime replaces `console.log`
and listens for uncaught errors and rejections, relaying each back to
the parent page by `postMessage` to be drawn as the cell's output. That
is the mechanism the console needs, already written, already reasoned
about in its file banner.

**dewlab's CodeMirror bundle** (`vendor-src/`, built by esbuild into
`assets/vendor/codemirror.bundle.js`, 618 KB before compression) already
carries the HTML, CSS and JavaScript language modes as well as Python
and SQL. `createCodeEditor()` takes a `language` option. A dewstack
build of the same recipe with three modes instead of five would be
smaller, but not small.

**Testing.** dewstack has a Playwright suite (`tests/e2e/`), ported from
dewlab's, with eight tests today. A console is exactly the kind of thing
those tests exist for: a claim about what a browser does with a
student's error is not verified until a browser has been asked.

---

## 3. What the online editors do, and what to take

Read as a survey of shapes, not a shortlist of things to adopt. Every
one of these needs either an account or a server, and dewstack has
neither by design.

**CodePen** puts a console at the bottom of the preview panel. It
captures `console.log`, `warn` and `error` and uncaught errors, marks
the failing line in the editor with an icon that reveals the message,
and, since a change in late 2020, reports the correct line number rather
than line 1. The correct-line-number point is the one to take: an error
message with no line, or the wrong line, teaches a student that error
messages are not worth reading.

**JSFiddle** has the same three panes and a console in the result pane.
Nothing it does that CodePen does not.

**The MDN Playground** is the closest in purpose: an editor that opens
from a code example on a documentation page, with a live preview and a
console, and it is what MDN's own learning pathway tells beginners to
use. That is the tutorial-page pattern dewstack already has. The
Playground adds formatting and sharing, both of which need a server.

**The p5.js web editor** is the pedagogically interesting one. p5.js
carries a "Friendly Error System" that supplements the browser's own
error with a second message in plain language: what the error usually
means, and where to look. The browser says `ReferenceError: x is not
defined`; the friendly line says the sketch does not know a name called
`x`, and asks whether it was spelled the same way each time. This is the
idea to take, done small: a short map from the handful of errors a
first-year student meets most to a plain-language second line, written
to the style guide, with no mascot.

**Replit** and its kind are cloud machines with a real terminal, real
files and accounts. Right shape for a later course, wrong shape for a
site that promises no account and nothing sent anywhere.

What to take, then: a console under the preview; exact line numbers
mapped to the pane; a marker on the failing line; a plain-language
second line for the common errors. What to leave: accounts, cloud
saving, collaboration, formatting-on-a-server.

Sources: the MDN Playground announcement
(https://developer.mozilla.org/en-US/blog/introducing-the-mdn-playground/),
p5.js's Friendly Error System page
(https://p5js.org/contribute/friendly_error_system/), CodePen's console
documentation and its line-numbers post (blog.codepen.io, which this
environment could not fetch; described from the search summary and
from memory, so the detail is approximate).

---

## 4. The console

### 4.1 The mechanism, and what the prototype verified

A small runtime script goes into the preview document's `<head>`,
before the student's CSS. It replaces `console.log`, `warn`, `error`
and `info` with versions that also `postMessage` the formatted
arguments to the parent, listens for the window's `error` event
(which fires for uncaught runtime errors and for syntax errors in an
inline script alike) and for `unhandledrejection`, and relays each with
its message, line and column. The parent page draws what arrives under
the preview. This is `js-cell-engine.js`'s runtime, reshaped from a
headless session into a visible one.

Line numbers come back relative to the whole `srcdoc` document, not
the JavaScript pane. The document is assembled by `renderPreview()`
from known pieces, so the offset is arithmetic: count the newlines
before the `<script>` tag that opens the student's JavaScript, and the
pane line is the reported line minus that count. The relay script must
sit above the student's CSS for this to hold, since the CSS and HTML
panes contribute newlines too; putting the relay first means its own
line count is a constant.

A prototype (`scratchpad`, not committed) ran four cases through a
headless Chromium with a sandboxed `srcdoc` frame:

| Case | Reported | Offset | Pane line | Right? |
|---|---|---|---|---|
| `undefinedFunction()` on JavaScript line 3, after two lines of CSS and two of HTML | 22 | 20 | 3 | yes |
| `var b = ;` on line 2 (a syntax error) | 17 | 16 | 2 | yes |
| `throw` inside a `setTimeout`, line 1 | 16 | 16 | 1 | yes |
| `nope()` inside a click handler, fired by a click, line 1 | 16 | 16 | 1 | yes |

`console.log` with an object argument arrived as `start {"a":1}`, and
a rejected promise arrived as an `unhandledrejection` with its reason.
Not verified: Firefox and Safari. Both report line numbers for inline
scripts, and the `srcdoc` case has no reason to differ, but "no reason
to differ" is the kind of claim dewlab's own log (7.92) has learned to
distrust, so it goes on the manual checklist rather than into the
design as a fact.

One edge worth naming: a student whose JavaScript contains the text
`</script>` will break the assembled document. The current editor has
this edge already; the console makes it visible rather than causing it.
Escaping `</` inside the script as `<\/` fixes it and costs one line.

### 4.2 Where it goes and when it shows

Under the preview, inside the editor block, as a strip labelled
Console. dewmini's own rule, "quiet by default, everything one press
away", says it should not take space on a page whose editor has no
JavaScript pane. So: present and open whenever the editor has a `js`
pane, since a student writing JavaScript should see where output goes
before they need it; present but collapsed to its label on an editor
with only HTML and CSS, and opened automatically the moment anything
arrives (an inline script in the HTML pane can still log or throw).

Each re-render clears it: the console shows what the current document
did, not a history.

**Revised 2026-09-06, on Josh's question: why not a Run button?** The
first draft of this section proposed a quarter-second debounce, because
half-typed JavaScript is a syntax error on most keystrokes and a console
that flashes red between every character teaches a student to ignore
it. The debounce was a patch over the wrong model. HTML and CSS are
states, and the lesson is watching the box change colour under your
hand, so they stay live. JavaScript is a program, and a program runs
when asked. So the JavaScript pane does nothing on a keystroke; a Run
button in its header, and Ctrl or Cmd plus Enter inside it, apply the
pane and run, the same shape as dewlab's Python cells. Until the next
Run the preview keeps the last script that ran, so retyping a colour
does not silently re-run a half-edited program. Run clears the console
and shows what this run did. With Run in place nothing that can fail is
evaluated on a keystroke, and the debounce is gone. Josh's reason for
asking is also a pedagogical one worth keeping: a student who presses
Run has read their own code once before asking the machine to.

### 4.3 What an entry looks like

A `console.log` line is plain text in the reading colour, one per call,
arguments joined with a space, an object rendered as short JSON rather
than `[object Object]`. That is what `js-cell-engine.js` already does
and what Python's `print` does on the other site.

An error is two lines in the error colour. The first is the browser's
own message with the pane line: *ReferenceError: undefinedFunction is
not defined — JavaScript, line 3.* The second, when the message matches
one of a small map, is the plain-language line described in section
3, written to the style guide: what a thing is before what it is not,
a verb in every sentence, no idiom. Three entries cover most of a first
term:

- *x is not defined.* The page does not know a name called `x`. Check
  the spelling, and check that the line that creates `x` runs before
  this one.
- *Unexpected token.* Something on this line is not written the way
  JavaScript expects. Look just before the marked place for a missing
  bracket, quote or comma.
- *Cannot read properties of null (reading 'addEventListener').* The
  page looked for an element and found nothing. Check that the `id` in
  the JavaScript matches the `id` in the HTML exactly, and that the
  script runs after the element exists.

The map lives in `site-editor.js` as data, so a fourth entry is a line
added, not a feature. It grows from what students hit in class, not
from a list written in advance.

The line marker in the editor is the one thing the textarea decision
limits. A `<textarea>` cannot style one of its lines. What it can do:
the console entry names the line, and clicking the entry moves the
caret to that line and focuses the pane. A gutter marker and a
highlighted line need CodeMirror, and that is section 7's question.

### 4.4 What the console cannot do, said now

It reports JavaScript. The commonest CSS problem, a rule that does not
apply, produces no error anywhere, and the commonest HTML problem, an
unclosed tag, produces a page that looks wrong and says nothing. A
console does not help with either. Two later tools might: a click on
the preview that reports which element was hit and which rules apply
to it, which is the element picker from the browser's own developer
tools done small; and a check for unclosed tags run over the HTML pane.
Both are out of scope here and listed in section 8 as later work, so
that nobody reads the console as the whole answer to "why does my page
look wrong".

**Decided here:** the relay mechanism, the offset arithmetic, escape
`</script` in the script, the two-line error entry, the data-driven
friendly map, clear on re-render. **Decided by Josh, 2026-09-06:** Run
for JavaScript, live for HTML and CSS (no debounce); the console open
whenever there is a JavaScript pane. **Built the same day**, step 1 of
section 8, with a fourth friendly line (`x is not a function`) added
from the first pass over what students type. The console on an
HTML/CSS-only editor is hidden rather than collapsed to a label, so the
pages that exist today look exactly as they did.

---

## 5. The workspace

### 5.1 What it is for

A student who has finished a tutorial page and wants to keep going has
two places today: their own fork, which is the right place for their
site and the wrong place for a five-minute experiment, and nothing else.
dewlab answers this with dewmini and a line on its front page: "Want to
experiment on your own, outside a tutorial?" dewstack needs the same
answer for a web page: somewhere to try a Grid layout or a click
handler without opening an editor, saving three files, and refreshing
a tab.

### 5.2 What it is

A page of its own, built by `build.py` the way dewlab builds
`compose/dewmini.html`, linked from the front page under the same
heading dewlab uses. On it, the site editor from section 4, the same
component, with three additions:

**More than one site.** A list of named sites down one side, the way
dewmini has tabs. New, rename, delete with the two-click "arm then
confirm" dewmini settled on. A site is three texts and a name.

**Saved in the browser.** `localStorage`, under one key, the same
pattern as the SQL cell's `persist` and dewmini's notebooks, with the
same wording the SQL cell already uses about what that means: this
device, this browser, gone if the browser's data is cleared. The
tutorial pages' rule that nothing is saved (plan, section 13) stands
for tutorial pages; it was made so that a student's fork stays the one
place real work lives, and the workspace page says the same thing in
its own first paragraph. The workspace is for trying, the fork is for
keeping. Download these files is the bridge, unchanged.

**Files in.** Load a `.html`, `.css` or `.js` from the student's own
machine into the matching pane, so a page from their fork can be
brought in, changed, and downloaded back. The SQL cell's Load button is
the precedent.

And one addition on the tutorial side: an **Open in the workspace**
button beside Download these files, which copies the editor's three
panes into a new named site on the workspace page. That is the path
from "this example on this page" to "my version of it that I keep
playing with", and it is the thing that makes the two surfaces one
experience rather than two.

### 5.3 What it is not

Not a Python notebook. It does not boot Pyodide, so it opens as fast
as a tutorial page and works on a phone. When the data track wants the
same thing, an SQL tab on this page can reuse `sql-cell.js`'s engine
and boot Pyodide only when that tab is opened. That is later work, and
the page's layout should leave room for it rather than build it.

Not a file manager. dewmini mounts a real filesystem because Python
programs read and write files; a static site is three texts, and a
list of named sites is the whole of what it needs.

Not shared or published. No links to a site, no gallery. The fork and
GitHub Pages already publish; the workspace does not compete with them.

**Decided here:** a dewstack-native page, not a link to dewmini; the
three additions; the bridge button. **Decided by Josh, 2026-09-06:** the
page is called the dewstack workspace, plain, and reads as "the
workspace" in prose. **Built the same day**, step 2 of section 8, as
designed, with one discovery recorded in `assets/site-editor.js`: the
preview frame loads only the first of several `srcdoc` writes made in
one task, so the component now writes once per frame load. The editor
is CodeMirror on this page (section 7, option 2), which also gave the
console's Go to line a real selection rather than a textarea's.

---

## 6. One experience across two sites

Josh's framing: look at dewlab and see whether there are architectural
changes that make for a unified and helpful experience for the learner.
The answer splits into what the learner sees and what the code shares.

**What the learner sees** is already mostly one thing. Both sites use
dewlab's tokens, reading frame, masthead and Settings panel; the site
editor was ported in shape from dewmini's Site view; the SQL cell from
dewlab's engine. The gaps are the ones this document fills: dewmini's
Site view has no console either, and dewstack has no workspace. After
this work, a student moving between the sites finds the same three
panes, the same preview, the same console in the same place with the
same error colours, and the same front-page door to a place to
experiment. That is the unification that matters, and it comes from
building the same shape twice with care, which is how the two
repositories have worked so far.

**What the code shares** is the harder call, and the repositories have
so far chosen "port in shape, not code" every time (`site-editor.js`'s
banner, `sql-cell.js`'s banner, `NEXT_STEPS.md` Step 6). The reason
holds: the two sites have different build scripts, different page
runtimes, and no shared package, and a shared file would need a home
and a release step neither has. One exception is worth making. The
relay runtime, the script that goes inside the preview document, is
small, self-contained, plain ES5 by necessity (it is embedded as a
string), and has to behave identically in both places or a student
will learn two consoles. It should be one file, `preview-relay.js`,
identical byte for byte in `dewlab/compose/` and `dewstack/assets/`,
with a banner in each naming the other as its twin and a test in each
that fails if the two ever differ. That is copying with a tripwire,
which is honest about the situation and cheap to keep.

The friendly-error map should be one file in the same way, since a
student should read the same plain-language line on either site.

**A change to dewlab** follows: dewmini's Site view gains the console
under its preview, built from the same relay. That is section 8's last
step, not its first, because dewstack is where the JavaScript track is
blocked.

**Decided here:** same shape on both sites; the console ported back
into dewmini's Site view. **Decided by Josh, 2026-09-06:** no twinned
files. "Port in shape, not code" stays the only rule between the
repositories, as it has been for every other shared surface; the relay
and the friendly map are written once here and ported by hand to
dewmini, and the banner on each names the other.

---

## 7. The editor itself

The one place this document disagrees with an earlier decision, and
says so rather than working around it.

The 2026-09-04 decision for textareas was made for reading on phones,
and for tutorial pages it still holds: a page a student reads on a bus
should not carry 600 KB of editor for a three-line CSS change. But the
workspace is a different page. A student opens it to work, on a screen
they can work on, for longer than a page read. There, a real editor
earns its cost: line numbers in a gutter, a marker on the line the
console names, bracket matching, syntax colouring, the same keys as
dewmini. And once the workspace loads CodeMirror, the console's line
marker stops being the textarea compromise from section 4.3.

Three ways to go, in order of cost:

1. **Textareas everywhere.** The console names the line and clicking
   moves the caret to it. Cheapest; the marker is text, not a mark.
2. **CodeMirror on the workspace page only.** A dewstack vendor build
   on dewlab's recipe with the three web modes, loaded on the workspace
   page alone. Tutorial pages keep textareas. The component has to
   work over both, which `createCodeEditor()`'s shape (a value, an
   `onChange`, a `language`) makes straightforward: one small adapter
   that gives a textarea the same three-method surface.
3. **CodeMirror everywhere, loaded on first focus.** Tutorial pages
   render textareas and swap in CodeMirror when a student first clicks
   into a pane. No cost for a reader who never edits; the same editor
   for one who does. More moving parts, and the swap has to keep the
   student's caret and text.

Recommended: 2, with 3 kept in view. It respects the phone decision
where it was made, gives the workspace a real editor where one is
wanted, and the adapter it needs is the same adapter 3 would need
later.

**Decided by Josh, 2026-09-06:** option 2, CodeMirror on the workspace
page only. Tutorial pages keep textareas.

---

## 8. The order of work

Each step ships on its own, verified in a real browser, and leaves the
site working if the next never happens.

1. **The console on tutorial pages.** `preview-relay.js`, the offset
   arithmetic in `renderPreview()`, the `</` escape, the render
   debounce, the console strip and its CSS, the two-line error entry
   with the friendly map, click-to-line on the textarea. Playwright
   tests for the four prototype cases plus a `console.log`, against a
   fixture page. Update `NEXT_STEPS.md` Step 6 and the site editor's
   banner. Also the `planned:` JavaScript entry in `modules.yaml` that
   item 15 records as added and which is not there.
2. **The workspace page.** The build target, the front-page door, the
   named-site list with new, rename and delete, `localStorage` saving,
   Load files, Download these files, the console from step 1. Tests
   for a site surviving a reload and for the two-click delete.
3. **Open in the workspace** on tutorial-page editors, carrying the
   three panes across under the tutorial's `site=` name.
4. **The editor**, whichever of section 7's three Josh picks. If 2 or
   3: the vendor build, the adapter, the gutter marker.
5. **The console in dewmini's Site view** (dewlab), from the twinned
   relay, with the twin-difference test in both repositories.
6. **Later, not scoped:** an SQL tab on the workspace; a click-to-inspect
   on the preview for CSS questions; an unclosed-tag check for HTML;
   `console.table`; a "Run again" button for scripts that only make
   sense once.

Steps 1 to 3 change nothing about the markdown contract; a `site=`
block on a page today works unchanged after them.

---

## 9. Open calls, collected — all decided 2026-09-06

1. Section 7: **CodeMirror on the workspace page only.** Tutorial pages
   keep textareas.
2. Section 5: **the dewstack workspace.**
3. Section 6: **no twinning.** Port in shape stays the only rule.
4. Section 4.2: **a Run button for JavaScript, live HTML and CSS, no
   debounce**; the console **open whenever there is a JavaScript pane.**
   Josh's own reframing of the question, recorded in 4.2.
5. Section 4.3: the friendly lines shipped with step 1 in
   `assets/site-editor.js`'s `FRIENDLY` table, four of them, for review
   there rather than here.

Step 1 is built. Steps 2 to 5 follow in section 8's order.
