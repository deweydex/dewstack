"""The full-stack module's own cell type, in a real browser.

build.py's markup and the CPython-testable half of assets/sql_tools.py's
query_rows() are covered by tests/test_build.py and tests/test_sql_tools.py
already. What can only be checked in a real browser is the live half:
that a JavaScript pane's dlQuery() call actually reaches the page's own
Pyodide and comes back with real rows — no iframe to cross, since there
is none (build.py's extract_app_cells() docstring says why) — and that
a failing query renders as a caught error rather than a crash.

    python3 -m pytest tests/e2e/test_full_stack_cell.py -q
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
FIXTURE = Path(__file__).resolve().parent / "fixture" / "full-stack-tour.md"

sys.path.insert(0, str(DEWSTACK))

import build as b  # noqa: E402

MODULE = "fixtures"
SLUG = "full-stack-tour"
PAGE = f"tutorials/{MODULE}/{SLUG}/index.html"


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class _QuietServer(socketserver.TCPServer):
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        """Closing the browser resets connections mid-response — normal
        teardown, not a test failure."""


@pytest.fixture(scope="module")
def app_site(tmp_path_factory) -> Path:
    if not (PYODIDE / "pyodide.mjs").exists():
        pytest.skip(
            "no self-hosted Pyodide — run `python3 tools/fetch_pyodide.py "
            "--packages sqlite3 --out tests/e2e/pyodide` first"
        )

    root = tmp_path_factory.mktemp("dewstack-e2e-fullstack")
    tutorials = root / "tutorials" / MODULE
    (tutorials / SLUG).mkdir(parents=True)
    shutil.copy(FIXTURE, tutorials / SLUG / f"{SLUG}.md")
    (tutorials / "shelf.order.yaml").write_text(
        f"series: Fixtures\norder:\n  - {SLUG}\n", encoding="utf-8"
    )

    out = root / "site"
    pages = b.build(tutorials_dir=root / "tutorials", out_dir=out, assets_dir=DEWSTACK / "assets", front=None)
    assert pages, "the fixture tutorial did not build"

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


@pytest.fixture(scope="module")
def app_url(app_site: Path):
    handler = functools.partial(_QuietHandler, directory=str(app_site))
    with _QuietServer(("127.0.0.1", 0), handler) as server:
        port = server.server_address[1]
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{port}"
        finally:
            server.shutdown()
            thread.join(timeout=5)


@pytest.fixture()
def page(browser, app_url):
    context = browser.new_context()
    tab = context.new_page()
    tab.goto(f"{app_url}/{PAGE}", wait_until="load")
    yield tab
    context.close()


def run_sql_cell(page):
    page.locator("button.dl-sql-run").first.click()
    page.wait_for_function(
        "sel => document.querySelector(sel).children.length > 0",
        arg=".dl-sql-output",
        timeout=30_000,
    )


def read_cell(page):
    # Playwright's own .nth() over the class-filtered set, not a CSS
    # :nth-of-type — that counts by tag name among ALL sibling <div>s
    # (the page's .dl-sql-cell included), not by class, so it would not
    # reliably pick "the first .dl-app-cell" here.
    return page.locator(".dl-app-cell").nth(0)


def broken_cell(page):
    return page.locator(".dl-app-cell").nth(1)


class TestAppCellRendersRealRows:
    def test_running_the_cell_draws_rows_dlquery_actually_fetched(self, page):
        run_sql_cell(page)
        cell = read_cell(page)
        cell.locator("button.dl-app-run").click()
        rows = cell.locator(".dl-app-preview tbody tr")
        rows.first.wait_for(timeout=15_000)
        # price < 10 excludes the 12.0 tote bag — two rows, not three,
        # which only a real round trip through query_rows() could produce.
        assert rows.count() == 2
        texts = [rows.nth(i).inner_text() for i in range(rows.count())]
        assert any("Mug" in t for t in texts)
        assert any("Notebook" in t for t in texts)
        assert not any("Tote bag" in t for t in texts)

    def test_editing_the_js_pane_and_rerunning_changes_what_renders(self, page):
        run_sql_cell(page)
        cell = read_cell(page)
        js_pane = cell.locator('.dl-app-input[data-lang="js"]')
        js_pane.fill(js_pane.input_value().replace("price < ?", "price > ?"))
        cell.locator("button.dl-app-run").click()
        rows = cell.locator(".dl-app-preview tbody tr")
        rows.first.wait_for(timeout=15_000)
        assert rows.count() == 1
        assert "Tote bag" in rows.first.inner_text()

    def test_reset_clears_this_cell_without_dropping_the_shared_table(self, page):
        run_sql_cell(page)
        cell = read_cell(page)
        cell.locator("button.dl-app-run").click()
        cell.locator(".dl-app-preview tbody tr").first.wait_for(timeout=15_000)
        cell.locator("button.dl-app-reset").click()
        assert cell.locator(".dl-app-preview tbody tr").count() == 0

        # A second, unrelated app cell reading the same "products" table
        # (by name, not by any binding to the first cell) still works —
        # resetting one app cell must not have dropped the connection.
        other = broken_cell(page)
        other.locator("button.dl-app-run").click()
        error = other.locator(".dl-app-error")
        page.wait_for_function(
            "el => el.textContent.length > 0", arg=error.element_handle(), timeout=15_000
        )
        assert "no such table" in error.inner_text()


class TestAppCellErrorsRenderNotCrash:
    def test_a_failing_query_shows_in_the_error_box(self, page):
        problems = []
        page.on("pageerror", lambda err: problems.append(str(err)))
        run_sql_cell(page)
        cell = broken_cell(page)
        cell.locator("button.dl-app-run").click()
        error = cell.locator(".dl-app-error")
        page.wait_for_function(
            "el => el.textContent.length > 0", arg=error.element_handle(), timeout=15_000
        )
        assert "not_a_real_table" in error.inner_text()
        assert problems == []
