"""The dewstack workspace, in a real browser.

build.py's markup is covered by tests/test_build.py. What only a browser
can show: that assets/workspace.js mounts the component over CodeMirror
panes and the component still runs, prints and reports lines through
them; that a site survives a reload; that New, the name field, Delete
(two clicks) and Load files do what they say; and that the download
name follows the site's name. planning/CONSOLE_AND_WORKSPACE.md section
5 is the design these check.

    python3 -m pytest tests/e2e/test_workspace.py -q
"""

from __future__ import annotations

import functools
import threading
from pathlib import Path

import pytest
from conftest import DEWSTACK, _QuietHandler, _QuietServer, b as build_module

_playwright = pytest.importorskip("playwright.sync_api", reason="playwright is not installed")
expect = _playwright.expect

PAGE = "workspace/index.html"
EDITOR = "#site-editor-workspace"


@pytest.fixture(scope="module")
def workspace_site(tmp_path_factory) -> Path:
    root = tmp_path_factory.mktemp("dewstack-workspace")
    tutorials = root / "tutorials" / "fixtures"
    (tutorials / "one").mkdir(parents=True)
    (tutorials / "one" / "one.md").write_text(
        '---\ntitle: "One"\nslug: one\nmodule: fixtures\nmodule_title: "Fixtures"\n'
        "series: shelf\nversion: 2026.09.06.1\n---\n\n# One\n\nA page.\n", encoding="utf-8"
    )
    (tutorials / "shelf.order.yaml").write_text("series: Fixtures\norder:\n  - one\n", encoding="utf-8")
    out = root / "site"
    build_module.build(tutorials_dir=root / "tutorials", out_dir=out, assets_dir=DEWSTACK / "assets", front=None)
    assert (out / PAGE).exists()
    return out


@pytest.fixture(scope="module")
def workspace_url(workspace_site: Path):
    handler = functools.partial(_QuietHandler, directory=str(workspace_site))
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
def page(browser, workspace_url):
    """A fresh browser context per test, so one test's saved sites never
    reach another's; the page's own errors collected, the preview's
    deliberate ones excluded by the test that causes them."""
    context = browser.new_context(viewport={"width": 1200, "height": 900})
    tab = context.new_page()
    own_errors: list[str] = []
    tab.on("pageerror", lambda err: own_errors.append(str(err)))
    tab.own_errors = own_errors
    tab.goto(f"{workspace_url}/{PAGE}")
    expect(tab.locator(f"{EDITOR} .dl-site-cm").first).to_be_visible()
    yield tab
    context.close()


def cm(page, lang: str):
    return page.locator(f'{EDITOR} .dl-site-input[data-lang="{lang}"] + .dl-site-cm .cm-content')


def set_pane(page, lang: str, text: str):
    pane = cm(page, lang)
    pane.click()
    page.keyboard.press("Control+A")
    pane.fill(text)


def console_lines(page):
    return page.locator(f"{EDITOR} .dl-site-console-line")


def site_buttons(page):
    return page.locator(".dl-ws-list button")


class TestFirstVisit:
    def test_three_codemirror_panes_and_a_starter_site(self, page):
        assert page.locator(f"{EDITOR} .dl-site-cm").count() == 3
        for lang in ("html", "css", "js"):
            assert page.locator(f'{EDITOR} .dl-site-input[data-lang="{lang}"]').is_hidden()
        expect(site_buttons(page)).to_have_count(1)
        expect(site_buttons(page).first).to_have_text("Site 1")
        expect(page.locator(".dl-ws-name")).to_have_value("Site 1")
        expect(console_lines(page).first).to_have_text("The script ran.")
        frame = page.frame_locator(f"{EDITOR} .dl-site-frame")
        expect(frame.locator("h1")).to_have_text("Hello")
        assert page.own_errors == []


class TestSaving:
    def test_an_edit_survives_a_reload(self, page):
        set_pane(page, "html", "<h1>Kept</h1>")
        page.wait_for_timeout(400)  # past the save debounce
        page.reload()
        expect(page.locator(f"{EDITOR} .dl-site-cm").first).to_be_visible()
        expect(cm(page, "html")).to_have_text("<h1>Kept</h1>")
        frame = page.frame_locator(f"{EDITOR} .dl-site-frame")
        expect(frame.locator("h1")).to_have_text("Kept")

    def test_a_renamed_site_survives_and_names_its_files(self, page):
        page.locator(".dl-ws-name").fill("My first site")
        page.wait_for_timeout(400)
        page.reload()
        expect(page.locator(".dl-ws-name")).to_have_value("My first site")
        expect(site_buttons(page).first).to_have_text("My first site")
        assert page.locator(EDITOR).get_attribute("data-site-name") == "my-first-site"


class TestSites:
    def test_new_makes_a_second_site_and_opens_it(self, page):
        page.locator(".dl-ws-new").click()
        expect(site_buttons(page)).to_have_count(2)
        expect(site_buttons(page).nth(1)).to_have_attribute("aria-current", "true")
        expect(page.locator(".dl-ws-name")).to_have_value("Site 2")

    def test_each_site_keeps_its_own_text(self, page):
        set_pane(page, "html", "<p>first</p>")
        page.locator(".dl-ws-new").click()
        set_pane(page, "html", "<p>second</p>")
        site_buttons(page).nth(0).click()
        expect(cm(page, "html")).to_have_text("<p>first</p>")
        site_buttons(page).nth(1).click()
        expect(cm(page, "html")).to_have_text("<p>second</p>")

    def test_delete_takes_two_clicks(self, page):
        page.locator(".dl-ws-new").click()
        expect(site_buttons(page)).to_have_count(2)
        page.locator(".dl-ws-delete").click()
        expect(page.locator(".dl-ws-delete")).to_have_text("Click again to delete")
        expect(site_buttons(page)).to_have_count(2)
        page.locator(".dl-ws-delete").click()
        expect(site_buttons(page)).to_have_count(1)
        expect(page.locator(".dl-ws-delete")).to_have_text("Delete this site")

    def test_deleting_the_last_site_leaves_a_fresh_one(self, page):
        page.locator(".dl-ws-delete").click()
        page.locator(".dl-ws-delete").click()
        expect(site_buttons(page)).to_have_count(1)
        expect(cm(page, "html")).to_contain_text("Hello")


class TestFiles:
    def test_load_files_fills_the_matching_panes(self, page, tmp_path):
        (tmp_path / "page.html").write_text("<p>loaded</p>", encoding="utf-8")
        (tmp_path / "page.css").write_text("p { color: rgb(1, 2, 3); }", encoding="utf-8")
        page.locator(".dl-ws-file").set_input_files([str(tmp_path / "page.html"), str(tmp_path / "page.css")])
        expect(cm(page, "html")).to_have_text("<p>loaded</p>")
        expect(cm(page, "css")).to_contain_text("rgb(1, 2, 3)")
        expect(cm(page, "js")).to_contain_text("The script ran.")  # untouched
        frame = page.frame_locator(f"{EDITOR} .dl-site-frame")
        assert frame.locator("p").evaluate("el => getComputedStyle(el).color") == "rgb(1, 2, 3)"


class TestConsoleThroughCodeMirror:
    def test_run_and_an_error_report_the_pane_line(self, page):
        set_pane(page, "js", 'console.log("one");\nnope();')
        page.locator(f"{EDITOR} .dl-site-run").click()
        lines = console_lines(page)
        expect(lines).to_have_count(2)
        expect(lines.nth(0)).to_have_text("one")
        expect(lines.nth(1)).to_contain_text("nope is not defined (JavaScript, line 2)")

    def test_ctrl_enter_runs_from_inside_the_pane(self, page):
        set_pane(page, "js", 'console.log("keys");')
        cm(page, "js").press("Control+Enter")
        expect(console_lines(page).first).to_have_text("keys")

    def test_go_to_line_selects_the_line_in_codemirror(self, page):
        set_pane(page, "js", 'console.log("one");\nnope();')
        page.locator(f"{EDITOR} .dl-site-run").click()
        page.locator(f"{EDITOR} .dl-site-console-goto").first.click()
        selected = page.evaluate("() => window.getSelection().toString()")
        assert selected == "nope();"
