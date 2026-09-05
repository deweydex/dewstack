/* The data track's cell engine: a fenced ```sql cell=name``` block
 * build.py turns into a `.dl-sql-cell`, and a fenced ```py cell=name```
 * block into a `.dl-py-cell`, both running real Python (SQLite for one,
 * pandas and matplotlib for the other) through Pyodide in the reader's
 * own browser tab. No server, no database anywhere but here.
 *
 * Ported in shape from dewlab's assets/pyodide-engine.js (its main-thread
 * path, not the Worker one — a query or a chart on a student-sized
 * table finishes fast enough that the page staying responsive during a
 * runaway one is not a problem worth a whole postMessage protocol to
 * solve) and its tutorial_tools.py, trimmed hard: dewstack's cells have
 * no widgets and no notebook-wide state, so none of that file's
 * check()/widget machinery comes with it. assets/sql_tools.py and
 * assets/python_tools.py are the two trimmed Python halves, one per
 * cell kind.
 *
 * One Pyodide, one engine, everywhere — decided 2026-09-05, so a page
 * that needs pandas and matplotlib (Data Arc 2) and a page that only
 * ever needs sqlite3 (Data Arc 1) still share the same code path,
 * rather than two engines to keep in step, and a page mixing both cell
 * kinds (a query charted in the next cell down) shares one Pyodide
 * between them rather than running two. What actually downloads is not
 * one fixed bundle, though: build.py already knows, at build time,
 * exactly which fenced blocks are on a page, so it writes that page's
 * own real package list into `window.DEWSTACK_SQL_PACKAGES` — sqlite3
 * alone for a page with only SQL cells, sqlite3 plus pandas and
 * matplotlib once a page has a Python cell. No page pays for a package
 * its own content never imports; python_tools.py is only fetched and
 * imported at all when the page has at least one `.dl-py-cell`.
 *
 * One Pyodide boots per page, shared by every cell on it; assets/
 * sql_tools.py keeps one sqlite3 connection per `data-db` name and
 * assets/python_tools.py keeps one namespace per `data-name`, so cells
 * sharing a name see the same tables or variables and cells with
 * different names never do — but that state, like the rest of Pyodide,
 * is gone the moment the page is left. A `data-persist` SQL cell is the
 * exception: its script is also kept in the browser's own localStorage,
 * keyed by `data-db`, and restored and rerun automatically the next
 * time a page with a persisted cell of that name loads. Download and
 * Load still work underneath this, unchanged, for taking a table out of
 * the browser or bringing one in.
 *
 * A fenced ```sql-check db=... task=...``` block becomes a `.dl-sql-check`
 * button instead: clicking it calls the named `check_*` function in
 * sql_tools.py against `db`'s connection and shows what it says. A quiz's
 * self-check, not a grade — instant, and nothing here sends the result
 * anywhere.
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
  let pyTools = null; // the imported python_tools Python module, once ready (only if the page has a py cell)

  function statusElements(cells, pyCells) {
    const sqlStatus = cells.map((cell) => cell.querySelector(".dl-sql-status"));
    const pyStatus = pyCells.map((cell) => cell.querySelector(".dl-py-status"));
    return sqlStatus.concat(pyStatus).filter(Boolean);
  }

  function setStatus(statuses, text) {
    statuses.forEach((status) => {
      status.textContent = text;
    });
  }

  /* Fetches one Python module's source and writes it into Pyodide's own
   * filesystem so `pyimport()` can find it — the same two steps for
   * sql_tools.py and, when the page has a py cell, python_tools.py. */
  async function loadModule(pyodide, filename) {
    const url = OWN_SCRIPT_URL ? new URL(filename, OWN_SCRIPT_URL).href : filename;
    const source = await fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${filename}: HTTP ${r.status}`);
      return r.text();
    });
    pyodide.FS.writeFile(`/home/pyodide/${filename}`, source, { encoding: "utf8" });
    return pyodide.pyimport(filename.replace(/\.py$/, ""));
  }

  async function boot(cells, pyCells) {
    const statuses = statusElements(cells, pyCells);
    setStatus(statuses, "Starting Python…");
    const base = pyodideBase();
    const { loadPyodide } = await import(/* webpackIgnore: true */ base + "pyodide.mjs");
    const pyodide = await loadPyodide({ indexURL: base });

    /* build.py writes this page's own real package list — just what its
     * fenced blocks actually need, no more. Falls back to sqlite3 alone
     * if the variable is somehow missing, since every page using this
     * script has at least one SQL cell, check, or Python cell. */
    const packages = window.DEWSTACK_SQL_PACKAGES || ["sqlite3"];
    setStatus(statuses, `Loading ${packages.join(", ")}…`);
    await pyodide.loadPackage(packages);

    setStatus(statuses, "Preparing the cell…");
    tools = await loadModule(pyodide, "sql_tools.py");
    if (pyCells.length) pyTools = await loadModule(pyodide, "python_tools.py");

    setStatus(statuses, "");
  }

  function ensureBooted(cells, pyCells) {
    if (!booting) booting = boot(cells, pyCells).catch((err) => {
      setStatus(statusElements(cells, pyCells), "Python didn't start. Reloading the page usually fixes this.");
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

  async function runCell(cell, cells, pyCells) {
    const input = cell.querySelector(".dl-sql-input");
    const output = cell.querySelector(".dl-sql-output");
    const runButton = cell.querySelector(".dl-sql-run");
    const dbName = cell.dataset.db;

    savePersisted(cell);
    runButton.disabled = true;
    try {
      await ensureBooted(cells, pyCells);
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
  function setUp(cell, cells, pyCells) {
    const input = cell.querySelector(".dl-sql-input");
    const original = input.value;
    const loadInput = cell.querySelector(".dl-sql-load-input");

    cell.querySelector(".dl-sql-run").addEventListener("click", () => runCell(cell, cells, pyCells));
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

  /* One self-check button: calls the named check_* function in
   * sql_tools.py against the named connection and shows what it says.
   * Instant, and never sent anywhere — a check, not a grade. */
  function setUpCheck(check, cells, pyCells) {
    const button = check.querySelector(".dl-sql-check-run");
    const output = check.querySelector(".dl-sql-check-output");
    const dbName = check.dataset.db;
    const task = check.dataset.task;

    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        await ensureBooted(cells, pyCells);
        const fn = tools[task];
        output.innerHTML = fn
          ? fn(dbName)
          : `<p class="dl-sql-error">No such check: ${task}</p>`;
      } catch (err) {
        output.innerHTML = `<p class="dl-sql-error">${String(err)}</p>`;
      } finally {
        button.disabled = false;
      }
    });
  }

  /* A Python cell's own Run: calls python_tools.py's run_python() with
   * this cell's namespace name and current text, and drops whatever
   * HTML comes back straight into the output area — python_tools.py has
   * already turned any DataFrame, figure, print, or error into HTML. */
  async function runPyCell(cell, cells, pyCells) {
    const input = cell.querySelector(".dl-py-input");
    const output = cell.querySelector(".dl-py-output");
    const runButton = cell.querySelector(".dl-py-run");
    const name = cell.dataset.name;

    runButton.disabled = true;
    try {
      await ensureBooted(cells, pyCells);
      output.innerHTML = await pyTools.run_python(name, input.value);
    } catch (err) {
      output.innerHTML = `<p class="dl-sql-error">${String(err)}</p>`;
    } finally {
      runButton.disabled = false;
    }
  }

  function resetPyCell(cell, original) {
    const input = cell.querySelector(".dl-py-input");
    const output = cell.querySelector(".dl-py-output");
    input.value = original;
    output.innerHTML = "";
    if (pyTools) pyTools.reset(cell.dataset.name);
  }

  function setUpPy(cell, cells, pyCells) {
    const input = cell.querySelector(".dl-py-input");
    const original = input.value;
    cell.querySelector(".dl-py-run").addEventListener("click", () => runPyCell(cell, cells, pyCells));
    cell.querySelector(".dl-py-reset").addEventListener("click", () => resetPyCell(cell, original));
  }

  const cells = Array.from(document.querySelectorAll(".dl-sql-cell"));
  const checks = Array.from(document.querySelectorAll(".dl-sql-check"));
  const pyCells = Array.from(document.querySelectorAll(".dl-py-cell"));
  if (cells.length || checks.length || pyCells.length) {
    const restored = cells.filter((cell) => setUp(cell, cells, pyCells));
    checks.forEach((check) => setUpCheck(check, cells, pyCells));
    pyCells.forEach((cell) => setUpPy(cell, cells, pyCells));
    const booted = ensureBooted(cells, pyCells);
    if (restored.length) {
      booted.then(() => restored.forEach((cell) => runCell(cell, cells, pyCells))).catch(() => {});
    }
  }
})();
