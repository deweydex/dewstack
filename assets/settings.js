/* The Settings panel and the reading preferences it controls.
 *
 * Borrowed in shape from dewlab's tutorial-runtime.js (initTexture,
 * initSettingsPanel, trackChromeHeight, restoreSidebarState), cut down to
 * what a reading site needs. No Python, no cells, no manifest.
 *
 * State is one small object in localStorage under "dewstack:texture". The
 * inline script in shell.html applies it before first paint; this file
 * wires the controls, keeps them in step with the state, and saves changes.
 */

(function () {
  "use strict";

  const TEXTURE_KEY = "dewstack:texture";
  const SIDEBAR_KEY = "dewstack:sidebars";
  /* link is empty by default: the stylesheet then picks a colour that passes
     contrast in whichever theme is on. A reader's own choice overrides it. */
  const TEXTURE_DEFAULTS = {
    theme: "system", font: "serif", size: 18, width: 34,
    link: "", header: "full", contrast: "normal",
  };
  /* Keep in step with min= on #dl-texture-size in shell.html. */
  const TEXTURE_MIN_SIZE = 16;
  /* Below this width a panel is a bottom sheet, not a docked sidebar.
     Keep in step with the @media (max-width: 34rem) block in site.css. */
  const DOCKED_QUERY = "(min-width: 34rem)";

  /* ---------------------------------------------------------- texture */

  function loadTexture() {
    let state;
    try {
      state = { ...TEXTURE_DEFAULTS, ...JSON.parse(localStorage.getItem(TEXTURE_KEY) || "{}") };
    } catch (err) {
      return { ...TEXTURE_DEFAULTS };
    }
    if (!(state.size >= TEXTURE_MIN_SIZE)) state.size = TEXTURE_MIN_SIZE;
    return state;
  }

  function saveTexture(state) {
    try {
      localStorage.setItem(TEXTURE_KEY, JSON.stringify(state));
    } catch (err) {
      /* Private mode or blocked storage: the choice applies to this page view only. */
    }
  }

  function applyTexture(state) {
    const root = document.documentElement;
    if (state.theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", state.theme);
    if (state.font === "serif") root.removeAttribute("data-font");
    else root.setAttribute("data-font", state.font);
    if (state.header === "full") root.removeAttribute("data-header");
    else root.setAttribute("data-header", state.header);
    if (state.contrast === "normal") root.removeAttribute("data-contrast");
    else root.setAttribute("data-contrast", state.contrast);
    root.style.setProperty("--dl-font-size", state.size + "px");
    root.style.setProperty("--dl-line-width", state.width + "rem");
    if (state.link) root.style.setProperty("--dl-link", state.link);
    else root.style.removeProperty("--dl-link");
  }

  /* The colour the stylesheet is using for links right now, so the colour
     input shows something true when the reader has not chosen one. */
  function currentLinkColour() {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--dl-link-default").trim();
    return /^#[0-9a-f]{6}$/i.test(value) ? value : "#b04f1a";
  }

  function initTexture() {
    const state = loadTexture();
    applyTexture(state);

    const panel = document.getElementById("dl-settings-texture");
    if (!panel) return;

    const sizeEl = document.getElementById("dl-texture-size");
    const widthEl = document.getElementById("dl-texture-width");
    const linkEl = document.getElementById("dl-texture-link");

    function sync() {
      for (const group of panel.querySelectorAll(".dl-seg")) {
        const key = group.dataset.texture;
        /* Width is a number with three named presets and a slider behind
           them. A value between the presets leaves none of the three
           pressed, which is the honest way to show it. */
        const current = group.hasAttribute("data-number") ? String(state[key]) : state[key];
        for (const btn of group.querySelectorAll("button")) {
          btn.setAttribute("aria-pressed", String(btn.dataset.value === current));
        }
      }
      sizeEl.value = state.size;
      widthEl.value = state.width;
      linkEl.value = state.link || currentLinkColour();
    }

    function commit() {
      applyTexture(state);
      saveTexture(state);
      sync();
    }

    for (const group of panel.querySelectorAll(".dl-seg")) {
      group.addEventListener("click", (ev) => {
        const btn = ev.target.closest("button");
        if (!btn) return;
        state[group.dataset.texture] = group.hasAttribute("data-number")
          ? Number(btn.dataset.value)
          : btn.dataset.value;
        commit();
      });
    }
    sizeEl.addEventListener("input", () => { state.size = Number(sizeEl.value); commit(); });
    widthEl.addEventListener("input", () => { state.width = Number(widthEl.value); commit(); });
    linkEl.addEventListener("input", () => { state.link = linkEl.value; commit(); });

    document.getElementById("dl-texture-reset").addEventListener("click", () => {
      Object.assign(state, TEXTURE_DEFAULTS);
      commit();
    });

    sync();
  }

  /* ------------------------------------------------------------ chrome */

  /* The sticky masthead's height is not a constant: it depends on how the
     neighbouring titles wrap, which depends on the window and the reader's
     text size. So it is measured, and measured again whenever it changes.
     site.css reads --dl-chrome-h wherever something has to sit below it. */
  function trackChromeHeight() {
    const chrome = document.getElementById("dl-chrome");
    if (!chrome) return;
    const publish = () => {
      document.documentElement.style.setProperty(
        "--dl-chrome-h", Math.round(chrome.getBoundingClientRect().height) + "px"
      );
    };
    publish();
    if (window.ResizeObserver) new ResizeObserver(publish).observe(chrome);
    else window.addEventListener("resize", publish);
  }

  /* ------------------------------------------------------------- panel */

  function saveSidebarState(open) {
    try {
      localStorage.setItem(SIDEBAR_KEY, JSON.stringify({ right: open }));
    } catch (err) { /* nothing to do */ }
  }

  function readSidebarState() {
    try {
      return JSON.parse(localStorage.getItem(SIDEBAR_KEY) || "{}");
    } catch (err) {
      return {};
    }
  }

  function initSettingsPanel() {
    const toggle = document.getElementById("dl-settings-toggle");
    const panel = document.getElementById("dl-settings");
    if (!toggle || !panel) return;

    const docked = () => window.matchMedia(DOCKED_QUERY).matches;

    /* On a wide screen an open panel pushes the reading clear of itself,
       so the page never sits under the panel. On a phone the panel is a
       sheet across the bottom and the page stays put. */
    function pushPage(open) {
      const root = document.documentElement;
      if (open && docked()) {
        root.setAttribute("data-dl-panel-right", "");
        root.style.setProperty("--dl-panel-right-w", panel.getBoundingClientRect().width + "px");
      } else {
        root.removeAttribute("data-dl-panel-right");
        root.style.removeProperty("--dl-panel-right-w");
      }
    }

    function setOpen(open, { moveFocus = true, remember = true } = {}) {
      panel.toggleAttribute("hidden", !open);
      toggle.setAttribute("aria-expanded", String(open));
      pushPage(open);
      if (remember) saveSidebarState(open);
      if (open && moveFocus) panel.focus();
    }

    toggle.addEventListener("click", () => setOpen(panel.hasAttribute("hidden")));

    const close = document.getElementById("dl-settings-close");
    if (close) close.addEventListener("click", () => { setOpen(false); toggle.focus(); });

    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape" || panel.hasAttribute("hidden")) return;
      setOpen(false);
      toggle.focus();
    });

    /* On a phone the sheet covers the reading, so a tap outside it closes
       it. On a wide screen the panel is a pane a reader works beside, and
       a click on the page should not take it away. */
    document.addEventListener("click", (ev) => {
      if (panel.hasAttribute("hidden") || docked()) return;
      if (panel.contains(ev.target) || toggle.contains(ev.target)) return;
      setOpen(false);
    });

    window.addEventListener("resize", () => pushPage(!panel.hasAttribute("hidden")));

    /* Left open on the last page, so open here too. Not on a phone, where a
       sheet covering most of the screen is a momentary action, not a pane
       to leave open. Focus stays on the page: nobody asked for the panel
       just now. */
    if (docked() && readSidebarState().right) {
      setOpen(true, { moveFocus: false, remember: false });
    }
  }

  function init() {
    initTexture();
    trackChromeHeight();
    initSettingsPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
