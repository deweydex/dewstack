/* The data track's SQL cell: a fenced ```sql cell=name``` block build.py
 * turns into a `.dl-sql-cell`, running real SQLite through Pyodide in the
 * reader's own browser tab. No server, no database anywhere but here.
 *
 * Ported in shape from dewlab's assets/pyodide-engine.js (its main-thread
 * path, not the Worker one — a SQL query on a student-sized table finishes
 * fast enough that the page staying responsive during a runaway query is
 * not a problem worth a whole postMessage protocol to solve) and its
 * tutorial_tools.py, trimmed hard: dewstack's cells only ever run SQL, so
 * none of that file's cell-execution, traceback, or widget machinery
 * comes with it. assets/sql_tools.py is the trimmed Python half.
 *
 * One Pyodide boots per page, shared by every cell on it; assets/
 * sql_tools.py keeps one sqlite3 connection per `data-db` name, so cells
 * sharing a name see the same tables and cells with different names never
 * do — but that connection, like the rest of Pyodide, is gone the moment
 * the page is left. A `data-persist` cell is the exception: its script is
 * also kept in the browser's own localStorage, keyed by `data-db`, and
 * restored and rerun automatically the next time a page with a persisted
 * cell of that name loads. Download and Load still work underneath this,
 * unchanged, for taking a table out of the browser or bringing one in.
 */

(function () {
  "use strict";

  const PYODIDE_VERSION = "0.28.3";

  /* Captured now, synchronously: document.currentScript is only set while
   * this script is first executing, not once boot() below is running as a
   * later microtask after an await. */
  const OWN_SCRIPT_URL = document.currentScript ? document.currentScript.src : null;

  /* A CDN by default, the same one dewlab defaults to. A page can override
   * this before this script runs, the same way dewlab's DEWLAB_PYODIDE_BASE
   * does, to point at a self-hosted copy instead — a path relative to this
   * script's own folder, e.g. "./vendor/pyodide/" (populated by tools/
   * fetch_pyodide.py). Resolved to an absolute URL here, against this
   * script's own location the same way sql_tools.py's URL is below: Pyodide
   * re-resolves indexURL itself once it's running, against the page rather
   * than the script, so a relative value has to be made absolute before it
   * gets there, or the two resolutions disagree. */
  function pyodideBase() {
    const configured =
      window.DEWSTACK_PYODIDE_BASE ||
      `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
    return OWN_SCRIPT_URL ? new URL(configured, OWN_SCRIPT_URL).href : configured;
  }

  let booting = null; // the one boot() Promise every cell shares
  let tools = null; // the imported sql_tools Python module, once ready

  function setStatus(cells, text) {
    cells.forEach((cell) => {
      const status = cell.querySelector(".dl-sql-status");
      if (status) status.textContent = text;
    });
  }

  async function boot(cells) {
    setStatus(cells, "Starting Python…");
    const base = pyodideBase();
    const { loadPyodide } = await import(/* webpackIgnore: true */ base + "pyodide.mjs");
    const pyodide = await loadPyodide({ indexURL: base });

    setStatus(cells, "Loading sqlite3…");
    await pyodide.loadPackage(["sqlite3"]);

    setStatus(cells, "Preparing the SQL cell…");
    const toolsUrl = OWN_SCRIPT_URL ? new URL("sql_tools.py", OWN_SCRIPT_URL).href : "sql_tools.py";
    const source = await fetch(toolsUrl).then((r) => {
      if (!r.ok) throw new Error(`sql_tools.py: HTTP ${r.status}`);
      return r.text();
    });
    pyodide.FS.writeFile("/home/pyodide/sql_tools.py", source, { encoding: "utf8" });
    tools = pyodide.pyimport("sql_tools");

    setStatus(cells, "");
  }

  function ensureBooted(cells) {
    if (!booting) booting = boot(cells).catch((err) => {
      setStatus(cells, "Python didn't start. Reloading the page usually fixes this.");
      booting = null; // a later click can try again rather than staying stuck
      throw err;
    });
    return booting;
  }

  /* A `data-persist` cell's script lives in the reader's own browser
   * storage, keyed by its `data-db` name, so it survives a reload of this
   * page or a visit to a later page sharing that name — the mechanism a
   * plain cell has no use for, since its table is meant to live only as
   * long as this one page's Pyodide does. localStorage can throw (private
   * browsing, a blocked origin, a full quota); every use below is wrapped
   * so that failure just means this one visit doesn't persist, not that
   * the cell stops working. */
  function storageKey(cell) {
    return `dewstack-sql:${cell.dataset.db}`;
  }

  function isPersisted(cell) {
    return cell.dataset.persist === "true";
  }

  function savePersisted(cell) {
    if (!isPersisted(cell)) return;
    try {
      localStorage.setItem(storageKey(cell), cell.querySelector(".dl-sql-input").value);
    } catch (err) {
      /* this visit's table just won't be there on the next */
    }
  }

  function clearPersisted(cell) {
    if (!isPersisted(cell)) return;
    try {
      localStorage.removeItem(storageKey(cell));
    } catch (err) {
      /* nothing to clear if storage was never reachable */
    }
  }

  /* Restores a persisted cell's saved text into its textarea, if there is
   * any yet. Returns whether it found something, so the caller knows this
   * cell needs an automatic first run once Python is ready — the restored
   * table should already be there, not waiting on a click nobody knows to
   * make. */
  function restorePersisted(cell) {
    if (!isPersisted(cell)) return false;
    try {
      const saved = localStorage.getItem(storageKey(cell));
      if (saved === null) return false;
      cell.querySelector(".dl-sql-input").value = saved;
      return true;
    } catch (err) {
      return false;
    }
  }

  async function runCell(cell, cells) {
    const input = cell.querySelector(".dl-sql-input");
    const output = cell.querySelector(".dl-sql-output");
    const runButton = cell.querySelector(".dl-sql-run");
    const dbName = cell.dataset.db;

    savePersisted(cell);
    runButton.disabled = true;
    try {
      await ensureBooted(cells);
      output.innerHTML = tools.run_sql(dbName, input.value);
    } catch (err) {
      output.innerHTML = `<p class="dl-sql-error">${String(err)}</p>`;
    } finally {
      runButton.disabled = false;
    }
  }

  function resetCell(cell, original) {
    const input = cell.querySelector(".dl-sql-input");
    const output = cell.querySelector(".dl-sql-output");
    input.value = original;
    output.innerHTML = "";
    clearPersisted(cell);
    if (tools) tools.reset(cell.dataset.db);
  }

  /* Saves the cell's current text as a .sql file — the same idea as the
   * site editor's "Download these files" button, for taking a copy of a
   * persisted table out of the browser (a different computer, a
   * submission), or keeping one from a cell with no persistence at all. */
  function downloadCell(cell) {
    const input = cell.querySelector(".dl-sql-input");
    const blob = new Blob([input.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cell.dataset.db}.sql`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  /* Reads a file straight into the textarea. Loading only fills the box —
   * a reader still clicks Run, the same as if they had typed it, so a
   * loaded file never runs SQL nobody chose to run. A persisted cell's
   * loaded file becomes its new saved copy, so the next page still sees
   * whatever was just brought in rather than what was there before. */
  function loadCell(cell, file) {
    const input = cell.querySelector(".dl-sql-input");
    file.text().then((text) => {
      input.value = text;
      savePersisted(cell);
    });
  }

  /* Wires up one cell's buttons and restores its saved text if it is a
   * persisted cell with something already saved. Returns whether it was
   * restored, so the caller can give it its automatic first run. */
  function setUp(cell, cells) {
    const input = cell.querySelector(".dl-sql-input");
    const original = input.value;
    const loadInput = cell.querySelector(".dl-sql-load-input");

    cell.querySelector(".dl-sql-run").addEventListener("click", () => runCell(cell, cells));
    cell.querySelector(".dl-sql-reset").addEventListener("click", () => resetCell(cell, original));
    cell.querySelector(".dl-sql-download").addEventListener("click", () => downloadCell(cell));
    cell.querySelector(".dl-sql-load").addEventListener("click", () => loadInput.click());
    loadInput.addEventListener("change", () => {
      const file = loadInput.files[0];
      if (file) loadCell(cell, file);
      loadInput.value = "";
    });

    return restorePersisted(cell);
  }

  const cells = Array.from(document.querySelectorAll(".dl-sql-cell"));
  if (cells.length) {
    const restored = cells.filter((cell) => setUp(cell, cells));
    const booted = ensureBooted(cells);
    if (restored.length) {
      booted.then(() => restored.forEach((cell) => runCell(cell, cells))).catch(() => {});
    }
  }
})();
