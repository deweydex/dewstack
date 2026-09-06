# `assets/site-editor.js`, explained

This file is the web track's whole live-preview component: an HTML pane,
a CSS pane, a JavaScript pane, a sandboxed preview, and a console under
it. One tutorial page can mount several — one per `site=name` block
`build.py` found — and the standalone workspace page
(`assets/workspace.js`) mounts a fourth kind by hand, swapping in
CodeMirror panes where a tutorial page keeps plain textareas.

---

## The big idea: one component, driven through a five-method pane surface

Everything above the level of "read this pane's text, write to it" is
written exactly once, in this file, and does not know or care whether a
pane is a plain `<textarea>` (`textareaPane()`, the tutorial-page
default) or a CodeMirror instance (`assets/workspace.js`'s own
`createPane()`). Both implement the same five methods — `get`, `set`,
`focus`, `selectLine`, `onInput` (plus `onRun`, for the JavaScript pane
alone) — and `mount()`'s `createPane` option is the one seam where a
caller can supply a different implementation. Read `textareaPane()`
first: it is the whole contract, in its simplest form.

---

## Reading order

1. **The file's own opening comment** — read it before anything else. It
   explains the two run models (HTML/CSS live, JavaScript on Run), the
   console's relay mechanism, why the preview iframe is sandboxed with no
   `allow-same-origin`, and the "one component, two pages" split with
   `assets/workspace.js`.
2. **`RELAY`** — not JavaScript that runs in this file at all: a string
   of plain ES5 that becomes part of the preview document's own HTML.
   Read it as a small, separate program, the same way
   dewlab's `js-cell-engine.js`'s own `RUNTIME_SRC` should be read (see
   that file's own explanation, if dewlab's approach is unfamiliar).
   Inside the sandboxed iframe, it replaces `console.log`/`info`/`warn`/
   `error` with versions that also `postMessage` the formatted arguments
   back to this page, and listens for `error`/`unhandledrejection` to
   report an uncaught exception the same way.
3. **`FRIENDLY`** — a small, ordered list of regular expressions matched
   against a browser's own error message, each with a plain-language
   second line for the mistake a first-term student meets most
   (`ReferenceError`, `SyntaxError`, `TypeError` from a missing element,
   `TypeError` from calling something that is not a function). Data, not
   a feature: a new entry is a line added here from what students
   actually hit in class, matched in order, first match wins.
4. **`buildPreview()`** — assembles the whole preview document as one
   string: the relay first, then the reader's CSS, then their HTML, then
   their JavaScript (with `</script` inside it escaped, so a reader's own
   string containing that text cannot end the wrapping `<script>` tag
   early). It also records `htmlStart`/`jsStart`, the line each pane's
   own content begins on *within that assembled document* — the
   necessary bridge for turning a reported error's document-relative line
   number back into "line 4 of your JavaScript pane."
5. **`render()`/`flush()`** — why a *pending* document exists at all
   rather than writing `srcdoc` immediately: four synchronous writes to
   `srcdoc` in one JavaScript task were traced, in a real Chromium, to
   produce exactly one `load` event — for the *first* document written,
   not the last. `flush()` only ever writes when nothing is still
   loading; a later `render()` mid-load just replaces `pendingDoc`, and
   the frame's own `load` handler calls `flush()` again once it is safe
   to write. Coalescing this way, rather than debouncing on a timer, is
   what keeps a fast typist's very last keystroke from being the one that
   gets silently dropped.
6. **`run()`** — captures the JavaScript pane's current text into
   `state.lastRunJs` before calling `render()`. This one line is the
   entire "JavaScript runs on Run, not on every keystroke" behaviour:
   `render()` itself always rebuilds the preview from `lastRunJs`, never
   from the live pane, so an HTML/CSS-only edit redraws the preview with
   whatever script last ran, unchanged.
7. **The console section** (`clearConsole()` through `appendConsoleLine()`) —
   `locate()` is the line-number bridge described above, working out
   which pane (and which line inside it) a document-relative line number
   belongs to. `appendConsoleLine()` renders one relayed message: a plain
   line for `console.*` output, or an error line carrying a "Go to line"
   button (when the error's pane and line could be identified) and,
   where `FRIENDLY` matches, a plain-language hint underneath.
8. **`window.addEventListener("message", …)`** — matches an incoming
   relayed message back to its editor by `event.source`, the sending
   frame's own `window` object, rather than by any string identifier —
   which is also what stops one preview frame from ever writing into a
   *different* editor's console, sandboxed or not.
9. **`mount()`** — the entry point. Reads every `.dl-site-input` in one
   `.dl-site-editor`, builds a pane for each (the default, or whatever
   `createPane` returns), wires Run, Reset, Download, the width slider,
   and "Open in the workspace," and returns a small handle
   (`values()`/`load()`/`run()`/`focus()`) the workspace page drives.
10. **`downloadFiles()`** — one file per pane, named after the block
    (`card.html`, `card.css`, `card.js`), the same "drop this into your
    fork" idea `assets/sql-cell.js`'s own Download button follows for a
    SQL cell's script.
11. **The bottom of the file** — mounts every `.dl-site-editor` on the
    page automatically, except one marked `data-mount="manual"` (the
    workspace page's own, which `assets/workspace.js` mounts itself with
    CodeMirror panes), and exposes `mount`/`textareaPane` on
    `window.dewstackSiteEditor` for that other file to call.

---

## Two things worth understanding on their own

**Why the preview iframe's document sets `<base href="about:srcdoc">`.**
Without it, a relative link or anchor inside a reader's own HTML would
resolve against *this page's* address, not the preview's own —
`about:srcdoc` is what keeps a same-page link like `href="#two"` working
inside the preview instead of trying to navigate the outer page. Small,
easy to miss, and exactly the kind of thing only surfaces by actually
clicking a link inside a live preview.

**Why line numbers are counted at all, rather than trusting whatever the
browser reports.** A browser's `error` event reports a line number
relative to the *whole document it fired in* — the assembled preview,
relay and all — not relative to any one pane. `buildPreview()` counts
newlines up to each pane's own start as it assembles the document
specifically so `locate()` can subtract that offset back out afterward.
Get the offset wrong, and "Go to line" points at the wrong line in the
wrong pane, silently — this is why the file's own comment says it was
"verified in a headless Chromium for runtime, syntax, async and handler
errors," rather than assumed correct from reading the spec.

---

## Where to look for something specific

- **"Why does the console stay hidden on an HTML/CSS-only editor until
  something arrives?"** — `build.py`'s `site_editor_markup()` decides the
  starting `hidden` state (present only when the block has no `js` pane);
  `showConsole()` here un-hides it the first time any message actually
  arrives, since an inline `<script>` typed into the HTML pane can still
  log or throw even without a JavaScript pane of its own.
- **"What happens to the console and the preview's line offsets on a
  page that never actually runs JavaScript?"** — nothing different:
  `buildPreview()` always assembles the relay and computes both offsets,
  whether or not the JavaScript pane exists. An editor with no `js` pane
  simply never has anything land past `jsStart`.
- **"Why is `Object.entries(panes).forEach()` used for Reset and Load,
  rather than three separate calls naming `html`/`css`/`js`?"** — because
  a block's own set of panes is not fixed; `extract_site_editors()` in
  `build.py` allows any subset of the three languages. Iterating
  `panes` itself, rather than three hardcoded keys, is what makes an
  HTML-only or CSS-only block behave correctly without a special case.
