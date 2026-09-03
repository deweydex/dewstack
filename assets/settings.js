/* Reading settings for the front page: theme, typeface, text size, line
 * width and high contrast. The pattern, and most of the reasoning, is
 * dewlab's texture panel (dewlab/assets/tutorial-runtime.js: loadTexture,
 * applyTexture, initTexture). The state is a small object saved in
 * localStorage; applying it means setting data-* attributes on <html> and
 * writing two CSS variables. assets/settings.css keys off exactly those.
 *
 * This script is loaded in <head> on purpose. Applying a saved choice before
 * the page first paints is what stops a reader who chose the dark theme from
 * seeing a flash of the light one on every visit.
 */
(function () {
  "use strict";

  var KEY = "dewstack:reading";
  var DEFAULTS = { theme: "system", font: "sans", size: 16, width: 60, contrast: "normal" };
  var MIN_SIZE = 14, MAX_SIZE = 24;

  /* localStorage can throw (private browsing, a browser setting that blocks
   * it), so every read and write is wrapped. A broken preference must never
   * stop the page from showing. */
  function load() {
    var state = {};
    try { state = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (err) { state = {}; }
    var merged = {};
    for (var k in DEFAULTS) merged[k] = (k in state) ? state[k] : DEFAULTS[k];
    if (!(merged.size >= MIN_SIZE && merged.size <= MAX_SIZE)) merged.size = DEFAULTS.size;
    return merged;
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* applies to this visit only */ }
  }

  /* Removing an attribute when the choice is the default keeps the CSS
   * simple: "no attribute" means default, and no rule has to spell the
   * default out. */
  function apply(state) {
    var root = document.documentElement;
    if (state.theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", state.theme);
    if (state.font === "sans") root.removeAttribute("data-font");
    else root.setAttribute("data-font", state.font);
    if (state.contrast === "normal") root.removeAttribute("data-contrast");
    else root.setAttribute("data-contrast", state.contrast);
    root.style.setProperty("--ds-size", state.size + "px");
    root.style.setProperty("--ds-width", state.width + "rem");
  }

  var state = load();
  apply(state);

  document.addEventListener("DOMContentLoaded", function () {
    var panel = document.getElementById("ds-settings");
    if (!panel) return;
    var sizeEl = document.getElementById("ds-size");
    var sizeOut = document.getElementById("ds-size-out");

    /* Make every control show the current state. Radios are grouped by
     * name, and the name is the state key. */
    function sync() {
      var radios = panel.querySelectorAll("input[type=radio]");
      for (var i = 0; i < radios.length; i++) {
        var r = radios[i];
        r.checked = String(state[r.name]) === r.value;
      }
      sizeEl.value = state.size;
      sizeOut.textContent = state.size + " px";
    }
    function commit() { apply(state); save(state); sync(); }

    panel.addEventListener("change", function (ev) {
      var el = ev.target;
      if (el.type === "radio" && el.name in state) {
        state[el.name] = (el.name === "width") ? Number(el.value) : el.value;
        commit();
      }
    });
    sizeEl.addEventListener("input", function () {
      state.size = Number(sizeEl.value);
      commit();
    });
    document.getElementById("ds-reset").addEventListener("click", function () {
      for (var k in DEFAULTS) state[k] = DEFAULTS[k];
      commit();
    });

    sync();
  });
})();
