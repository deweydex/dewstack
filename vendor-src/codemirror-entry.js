/* The slice of CodeMirror 6 the workspace page needs, bundled into one ES
 * module the page imports with no build step of its own and no CDN round
 * trip. Ported in shape from dewlab's vendor-src/codemirror-entry.js, cut
 * to the three web languages: no Python, no SQL, no completion sources
 * that need an interpreter behind them.
 *
 * Everything here is stock CodeMirror: line numbers, bracket matching,
 * find and replace, the default light and one-dark highlight pair. The
 * two additions the workspace asks for are a Mod-Enter binding, so
 * Ctrl/Cmd+Enter in the JavaScript pane runs it the same as the textarea
 * on a tutorial page, and selectLine(), so the console's Go to line can
 * land on a line the way it does in a textarea.
 */

import { EditorView, keymap, lineNumbers, highlightActiveLine,
         highlightActiveLineGutter, drawSelection, highlightSpecialChars,
         rectangularSelection, crosshairCursor } from "@codemirror/view";
import { EditorState, Compartment, Prec } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { syntaxHighlighting, defaultHighlightStyle, indentOnInput,
         bracketMatching, indentUnit } from "@codemirror/language";
import { search, searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";

const LANGUAGES = { html, css, javascript: () => javascript(), js: () => javascript() };

/* Theme lives in a compartment so Settings can swap light/dark without
 * tearing the editor down and losing what the student has typed. */
const themeOf = (dark) => (dark ? oneDark : syntaxHighlighting(defaultHighlightStyle));

const baseTheme = EditorView.theme({
  "&": { backgroundColor: "transparent", fontSize: "0.85rem" },
  ".cm-gutters": { backgroundColor: "transparent", border: "none", opacity: "0.65" },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "transparent" },
  ".cm-content": { fontFamily: "inherit" },
});

export function createCodeEditor(parent, doc, { dark = false, onChange = null, onRun = null, language = "html" } = {}) {
  const themeCompartment = new Compartment();
  const languageSupport = LANGUAGES[language] || LANGUAGES.html;

  const extensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    highlightSpecialChars(),
    drawSelection(),
    rectangularSelection(),
    crosshairCursor(),
    history(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    indentUnit.of("  "),
    languageSupport(),
    search({ top: true }),
    highlightSelectionMatches(),
    /* indentWithTab last so Tab indents inside the pane rather than
     * tabbing the browser out of it, with Escape still available to leave. */
    keymap.of([...closeBracketsKeymap, ...searchKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
    themeCompartment.of(themeOf(dark)),
    baseTheme,
    EditorView.lineWrapping,
  ];

  if (onRun) {
    /* Highest precedence, so Mod-Enter reaches onRun before any default
     * binding takes the Enter for a newline. */
    extensions.push(Prec.highest(keymap.of([{ key: "Mod-Enter", run: () => { onRun(); return true; } }])));
  }

  if (onChange) {
    extensions.push(EditorView.updateListener.of((update) => {
      if (update.docChanged) onChange(update.state.doc.toString());
    }));
  }

  const view = new EditorView({ parent, state: EditorState.create({ doc, extensions }) });

  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue: (text) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }),
    focus: () => view.focus(),
    /* Selects one whole line (1-based) and scrolls to it. Out of range
     * lines clamp to the last one rather than throwing. */
    selectLine: (n) => {
      const line = view.state.doc.line(Math.max(1, Math.min(n, view.state.doc.lines)));
      view.dispatch({ selection: { anchor: line.from, head: line.to }, scrollIntoView: true });
      view.focus();
    },
    setTheme: (dark) => view.dispatch({ effects: themeCompartment.reconfigure(themeOf(dark)) }),
    destroy: () => view.destroy(),
  };
}
