# `assets/workspace.js`, explained

This file is the standalone workspace page (`workspace/index.html`): the
site editor component from `assets/site-editor.js`, given a page of its
own, several named sites saved in the browser, and CodeMirror panes in
place of the component's plain textareas. It is short precisely because
it delegates almost everything about *running* a site — the preview, the
Run model, the console — to the component it mounts; what it owns is the
list of sites, saving, and the name field.

---

## The big idea: this file owns the sites; the component owns running one

`assets/site-editor.js` has no idea a list of sites exists at all. This
file calls `window.dewstackSiteEditor.mount()` exactly once, on the
page's one editor element, and everything after that is either "tell the
component to load different text" (`site.load(files)`, when a reader
switches sites) or "notice the component says something changed"
(the `onChange` callback, which writes the edited pane straight into
whichever site is currently active). The component itself never learns
there is more than one site.

---

## Reading order

1. **The file's own opening comment** — what this file owns versus what
   the component owns, the storage key and shape, and why CodeMirror
   loads on this page alone (tutorial pages keep textareas, since they
   are read on phones).
2. **`STARTER`** — a new site's starting HTML/CSS/JS, so the first thing
   a student sees on "New site" is a working page and a console line,
   not three empty boxes.
3. **Storage** (`readState()` through `saveState()`) — `readState()`
   falls back to one freshly-made site if `localStorage` is empty,
   unreadable, or holds something malformed, rather than erroring.
   `saveState()` debounces writes by 150ms so a fast typist does not
   serialise the whole state on every keystroke, and a `pagehide`
   listener flushes any still-pending save immediately, so a tab closed
   mid-debounce does not lose the last few keystrokes.
4. **`createPane()`** — the CodeMirror equivalent of
   `assets/site-editor.js`'s own `textareaPane()`, built against the same
   five-method surface that file defines. The underlying `<textarea>`
   stays in the document, only hidden (`field.hidden = true`), with the
   CodeMirror host inserted right after it — keeping the component's own
   markup identical on both pages, textarea included, is what lets
   `mount()` not need to know which page it is on.
5. **`mount()`'s call site** — one call, wiring `createPane` (above) and
   an `onChange` that writes straight into `activeSite()` and calls
   `saveState()`. This is the one place this file and the component
   actually meet.
6. **The site list** (`renderList()`, `openSite()`) — `openSite()` is the
   one function that makes a different site the page's current reality:
   sets `state.active`, updates the name field and the download
   filename, and calls `site.load()` to push that site's saved text into
   every pane and re-run it, so the preview and console reflect the
   newly opened site rather than whatever the previous one left behind.
7. **New and Delete** (`newButton`'s handler, the delete-arming block) —
   Delete is armed by a first click and only fires on a second click
   within four seconds, the same two-click pattern dewlab's dewmini
   settled on: a single accidental click on the wrong button should never
   cost a site.
8. **Load files** (`loadButton`, `fileInput`) — each picked file lands in
   the pane its own extension names (`.html` into the HTML pane, and so
   on), so a page brought in from a fork can be edited here and
   downloaded back out.
9. **Theme** (`isDark()`, `applyTheme()`) — a `MutationObserver` on
   `data-theme` and a `prefers-color-scheme` media query listener both
   call `applyTheme()`, so a reader changing Settings' theme control
   reaches every open CodeMirror instance immediately, with no reload.
10. **`takeIncoming()`** — the receiving half of a tutorial page's "Open
    in the workspace" link (`assets/site-editor.js`'s own handler for
    that link writes the hand-off). Reads a small JSON blob under its own
    storage key, turns it into a new site, opens it, and removes the key
    immediately — so a page reload after arriving never creates a second
    copy of the same site.

---

## Where to look for something specific

- **"Why does `openSite()` call `disarmDelete()` every time, even when a
  reader is just switching sites, not deleting one?"** — so the delete
  button's "armed" state never survives a switch to a different site;
  without this, clicking Delete once on Site A, then switching to Site B
  and clicking Delete again within the four-second window, would delete
  Site B on what the reader experienced as its *first* click.
- **"What happens to a site's saved text if the reader never explicitly
  clicks Run after loading it?"** — nothing is lost: `openSite()`'s call
  to `site.load()` both sets every pane's text *and* runs it immediately,
  the same combined behaviour Reset uses, so a site always opens already
  showing its own preview.
- **"Where does the download filename (`card.html`, not `Site 1.html`)
  actually get decided?"** — `fileBase()`, called every time the name
  field changes or a site opens, writing the sanitised result into
  `editorEl.dataset.siteName` — the same attribute
  `assets/site-editor.js`'s own `downloadFiles()` reads to build each
  file's name.
