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
 * do.
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

  async function runCell(cell, cells) {
    const input = cell.querySelector(".dl-sql-input");
    const output = cell.querySelector(".dl-sql-output");
    const runButton = cell.querySelector(".dl-sql-run");
    const dbName = cell.dataset.db;

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
    if (tools) tools.reset(cell.dataset.db);
  }

  /* Saves the cell's current text as a .sql file — the same idea as the
   * site editor's "Download these files" button, for a table built across
   * several "your turn" prompts that a reader is meant to keep. */
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
   * loaded file never runs SQL nobody chose to run. */
  function loadCell(cell, file) {
    const input = cell.querySelector(".dl-sql-input");
    file.text().then((text) => { input.value = text; });
  }

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
  }

  const cells = Array.from(document.querySelectorAll(".dl-sql-cell"));
  if (cells.length) {
    cells.forEach((cell) => setUp(cell, cells));
    ensureBooted(cells);
  }
})();
