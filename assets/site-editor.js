/* The web track's site editor: an HTML, CSS and JavaScript pane beside a
 * live preview, for the fenced `site=name` blocks build.py turns into
 * `.dl-site-editor` elements.
 *
 * Ported in shape from dewmini's Site tab (deweydex/dewlab,
 * compose/dewmini.js, openSiteFile() and renderSiteView(); plan,
 * CONSOLIDATION_PLAN.md section 13), not its code: that version reads and
 * writes a mounted workspace, which a tutorial page does not have. Nothing
 * here is saved. A reader's changes live only in the page until they
 * refresh; the student's own fork is where real work is kept, and the
 * "Download these files" button is the bridge between the two.
 *
 * The preview iframe is sandboxed to "allow-scripts" only: no
 * allow-same-origin, so a script in a reader's experiment cannot reach the
 * rest of this page or anything it can see.
 */

(function () {
  "use strict";

  function renderPreview(editor, frame) {
    const html = valueOf(editor, "html");
    const css = valueOf(editor, "css");
    const js = valueOf(editor, "js");
    frame.srcdoc = `<!DOCTYPE html><html><head><style>${css}</style></head>`
      + `<body>${html}<script>${js}<\/script></body></html>`;
  }

  function valueOf(editor, lang) {
    const field = editor.querySelector(`.dl-site-input[data-lang="${lang}"]`);
    return field ? field.value : "";
  }

  function setUp(editor) {
    const frame = editor.querySelector(".dl-site-frame");
    const inputs = editor.querySelectorAll(".dl-site-input");
    const original = new Map();
    inputs.forEach((field) => original.set(field, field.value));

    const render = () => renderPreview(editor, frame);
    inputs.forEach((field) => field.addEventListener("input", render));

    const widthControl = editor.querySelector(".dl-site-width");
    const frameWrap = editor.querySelector(".dl-site-frame-wrap");
    const widthReadout = editor.querySelector(".dl-site-preview-controls output");
    if (widthControl && frameWrap) {
      /* A percentage of the editor's own width, not a fixed pixel count:
       * the reading column itself can be anywhere from 26rem to 60rem,
       * set in Settings, so a fixed width could overflow a narrow one. */
      const applyWidth = () => {
        frameWrap.style.width = `${widthControl.value}%`;
        if (widthReadout) widthReadout.textContent = `${widthControl.value}%`;
      };
      widthControl.addEventListener("input", applyWidth);
      applyWidth();
    }

    const resetButton = editor.querySelector(".dl-site-reset");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        inputs.forEach((field) => { field.value = original.get(field); });
        render();
      });
    }

    const downloadButton = editor.querySelector(".dl-site-download");
    if (downloadButton) {
      downloadButton.addEventListener("click", () => downloadFiles(editor, inputs));
    }

    render();
  }

  const EXTENSIONS = { html: "html", css: "css", js: "js" };

  /* One file per pane, named after the page: "card.html", "card.css",
   * "card.js". A reader drops these straight into their own fork. */
  function downloadFiles(editor, inputs) {
    const base = editor.dataset.siteName || "site";
    inputs.forEach((field) => {
      const ext = EXTENSIONS[field.dataset.lang] || "txt";
      const blob = new Blob([field.value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${base}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  document.querySelectorAll(".dl-site-editor").forEach(setUp);
})();
