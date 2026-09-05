"""Fixtures for the e2e tests: a page built by build.py, and a server for
it.

These tests drive a real Chromium against a real Pyodide, because that is
the only way to know the SQL and Python cell engines actually work — see
dewlab's own tests/e2e/conftest.py, which this is ported from. They need
two things the unit tests don't:

  * Playwright with a Chromium (`pip install playwright && playwright
    install chromium`, or the machine's own pre-installed Chromium, which
    `_chromium_path()` below finds automatically);
  * a self-hosted Pyodide in `tests/e2e/pyodide/`
    (`python3 tools/fetch_pyodide.py --packages sqlite3 pandas matplotlib
    --out tests/e2e/pyodide`).

Missing either, the tests skip with a message saying which.

The page under test is built by `build.py` from
`fixture/rendering-tour.md`, which has one SQL cell and one Python cell —
enough to exercise both cell types' report icon without depending on
which real tutorials exist today.
"""

from __future__ import annotations

import functools
import http.server
import shutil
import socketserver
import sys
import threading
from pathlib import Path

import pytest

DEWSTACK = Path(__file__).resolve().parents[2]
PYODIDE = Path(__file__).resolve().parent / "pyodide"
FIXTURE = Path(__file__).resolve().parent / "fixture" / "rendering-tour.md"

sys.path.insert(0, str(DEWSTACK))

import build as b  # noqa: E402

MODULE = "fixtures"
SLUG = "rendering-tour"
PAGE = f"tutorials/{MODULE}/{SLUG}/index.html"


@pytest.fixture(scope="session")
def site_dir(tmp_path_factory) -> Path:
    """Build the fixture tutorial with build.py and stage Pyodide beside it."""
    if not (PYODIDE / "pyodide.mjs").exists():
        pytest.skip(
            "no self-hosted Pyodide — run `python3 tools/fetch_pyodide.py "
            "--packages sqlite3 pandas matplotlib --out tests/e2e/pyodide` first"
        )

    root = tmp_path_factory.mktemp("dewstack-e2e")
    tutorials = root / "tutorials" / MODULE
    tutorials.mkdir(parents=True)
    (tutorials / SLUG).mkdir()
    shutil.copy(FIXTURE, tutorials / SLUG / f"{SLUG}.md")
    (tutorials / "shelf.order.yaml").write_text(
        f"series: Fixtures\norder:\n  - {SLUG}\n", encoding="utf-8"
    )

    out = root / "site"
    pages = b.build(tutorials_dir=root / "tutorials", out_dir=out, assets_dir=DEWSTACK / "assets", front=None)
    assert pages, "the fixture tutorial did not build"

    # Point the runtime at the Pyodide staged in this tree rather than the
    # CDN, which is what a network with no route to jsdelivr would also
    # have to do. sql-cell.js's own pyodideBase() resolves this relative
    # to *that script's own location* (assets/sql-cell.js), not the
    # page's — "../pyodide/" is therefore correct regardless of how deep
    # a page's own URL is nested under tutorials/.
    page = out / PAGE
    html = page.read_text(encoding="utf-8")
    marker = '<script src="'
    insert_at = html.index(marker)
    page.write_text(
        html[:insert_at]
        + '<script>window.DEWSTACK_PYODIDE_BASE = "../pyodide/";</script>\n'
        + html[insert_at:],
        encoding="utf-8",
    )

    shutil.copytree(PYODIDE, out / "pyodide")
    return out


@pytest.fixture(scope="session")
def base_url(site_dir: Path):
    """Serve the built site on a free port for the duration of the session."""
    handler = functools.partial(_QuietHandler, directory=str(site_dir))
    with _QuietServer(("127.0.0.1", 0), handler) as server:
        port = server.server_address[1]
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{port}"
        finally:
            server.shutdown()
            thread.join(timeout=5)


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        """No per-request logging; a Pyodide boot is a few hundred requests."""


class _QuietServer(socketserver.TCPServer):
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        """Closing the browser resets connections mid-response. That is
        normal teardown, not a test failure, and its traceback is pure
        noise in an otherwise passing run."""


@pytest.fixture(scope="session")
def browser():
    playwright = pytest.importorskip(
        "playwright.sync_api", reason="playwright is not installed"
    )
    with playwright.sync_playwright() as driver:
        candidate = _chromium_path()
        launch = {"args": ["--no-sandbox"]}
        if candidate:
            launch["executable_path"] = candidate
        instance = driver.chromium.launch(**launch)
        try:
            yield instance
        finally:
            instance.close()


def _chromium_path() -> str | None:
    """Use a preinstalled Chromium if one is on this machine."""
    root = Path("/opt/pw-browsers")
    if not root.exists():
        return None
    for chrome in sorted(root.glob("chromium-*/chrome-linux/chrome")):
        return str(chrome)
    return None


@pytest.fixture()
def page(browser, base_url):
    """A page with the built tutorial loaded and Python already started."""
    context = browser.new_context()
    tab = context.new_page()

    problems: list[str] = []
    tab.on("pageerror", lambda err: problems.append(f"pageerror: {err}"))
    tab.on(
        "console",
        lambda msg: problems.append(f"console.{msg.type}: {msg.text}")
        if msg.type == "error"
        else None,
    )
    tab.problems = problems

    tab.goto(f"{base_url}/{PAGE}")
    yield tab
    context.close()
