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

  /* A CDN by default, the same one dewlab defaults to. A page can override
   * this before this script runs, the same way dewlab's DEWLAB_PYODIDE_BASE
   * does, to point at a self-hosted copy instead (assets/vendor/pyodide/,
   * populated by dev/fetch_pyodide.py --packages sqlite3). */
  function pyodideBase() {
    return (
      window.DEWSTACK_PYODIDE_BASE ||
      `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
    );
  }

  /* Captured now, synchronously: document.currentScript is only set while
   * this script is first executing, not once boot() below is running as a
   * later microtask after an await. */
  const OWN_SCRIPT_URL = document.currentScript ? document.currentScript.src : null;

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

  function setUp(cell, cells) {
    const input = cell.querySelector(".dl-sql-input");
    const original = input.value;

    cell.querySelector(".dl-sql-run").addEventListener("click", () => runCell(cell, cells));
    cell.querySelector(".dl-sql-reset").addEventListener("click", () => resetCell(cell, original));
  }

  const cells = Array.from(document.querySelectorAll(".dl-sql-cell"));
  if (cells.length) {
    cells.forEach((cell) => setUp(cell, cells));
    ensureBooted(cells);
  }
})();
