"""The site editor's console and Run model, in a real browser.

build.py's markup for the console and the Run button is covered by
tests/test_build.py. What only a browser can show is the live half of
assets/site-editor.js: that a script's console.log and its uncaught
errors reach the console with the right pane line; that the JavaScript
pane runs on Run and Ctrl+Enter and not on a keystroke; that HTML and CSS
still redraw live, with the last-run script; and that Go to line lands
on the line named. planning/CONSOLE_AND_WORKSPACE.md section 4 is the
design these check.

No Pyodide is needed, unlike the SQL and Python cells' tests, so these
have their own build fixture rather than conftest's, and run wherever
Playwright and a Chromium are.

    python3 -m pytest tests/e2e/test_site_console.py -q
"""

from __future__ import annotations

import functools
import shutil
import threading
from pathlib import Path

import pytest
from conftest import DEWSTACK, _QuietHandler, _QuietServer, b as build_module

from playwright.sync_api import expect

FIXTURE = Path(__file__).resolve().parent / "fixture" / "site-console.md"
MODULE = "fixtures"
SLUG = "site-console"
PAGE = f"tutorials/{MODULE}/{SLUG}/index.html"

SCRIPTED = "#site-editor-site-console-scripted"
PLAIN = "#site-editor-site-console-plain"


@pytest.fixture(scope="module")
def console_site(tmp_path_factory) -> Path:
    root = tmp_path_factory.mktemp("dewstack-site-console")
    tutorials = root / "tutorials" / MODULE
    (tutorials / SLUG).mkdir(parents=True)
    shutil.copy(FIXTURE, tutorials / SLUG / f"{SLUG}.md")
    (tutorials / "shelf.order.yaml").write_text(
        f"series: Fixtures\norder:\n  - {SLUG}\n", encoding="utf-8"
    )
    out = root / "site"
    pages = build_module.build(
        tutorials_dir=root / "tutorials", out_dir=out, assets_dir=DEWSTACK / "assets", front=None
    )
    assert pages, "the fixture tutorial did not build"
    return out


@pytest.fixture(scope="module")
def console_url(console_site: Path):
    handler = functools.partial(_QuietHandler, directory=str(console_site))
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
def page(browser, console_url):
    """The fixture page, with the page's own (not the preview's) errors
    collected: the preview is meant to throw, this page is not."""
    context = browser.new_context()
    tab = context.new_page()
    own_errors: list[str] = []
    tab.on("pageerror", lambda err: own_errors.append(str(err)))
    tab.own_errors = own_errors
    tab.goto(f"{console_url}/{PAGE}")
    yield tab
    context.close()


def console_lines(page, editor: str):
    return page.locator(f"{editor} .dl-site-console-line")


def js_pane(page, editor: str):
    return page.locator(f'{editor} .dl-site-input[data-lang="js"]')


def preview_colour(page, editor: str, selector: str) -> str:
    frame = page.frame_locator(f"{editor} .dl-site-frame")
    return frame.locator(selector).evaluate("el => getComputedStyle(el).color")


class TestOnLoad:
    def test_console_open_with_a_script_and_hidden_without(self, page):
        expect(page.locator(f"{SCRIPTED} .dl-site-console")).to_be_visible()
        expect(page.locator(f"{PLAIN} .dl-site-console")).to_be_hidden()

    def test_the_script_ran_and_its_log_and_error_arrived(self, page):
        lines = console_lines(page, SCRIPTED)
        expect(lines).to_have_count(2)
        expect(lines.nth(0)).to_have_text('start {"a":1}')
        expect(lines.nth(1)).to_contain_text(
            "ReferenceError: undefinedFunction is not defined (JavaScript, line 3)"
        )
        # The line after the error never ran, so "never" never arrived.
        assert "never" not in page.locator(f"{SCRIPTED} .dl-site-console-output").inner_text()

    def test_the_error_has_a_plain_language_second_line(self, page):
        hint = page.locator(f"{SCRIPTED} .dl-site-console-hint")
        expect(hint).to_have_count(1)
        expect(hint).to_contain_text("does not know a name called undefinedFunction")

    def test_nothing_leaked_into_the_page_itself(self, page):
        """Playwright's pageerror fires for every frame, the sandboxed
        preview included, so the fixture's own deliberate error is
        expected there; anything else would be site-editor.js's."""
        expect(console_lines(page, SCRIPTED)).to_have_count(2)
        unexpected = [e for e in page.own_errors if "undefinedFunction" not in e]
        assert unexpected == []


class TestRunModel:
    def test_typing_in_the_js_pane_does_not_run_it(self, page):
        expect(console_lines(page, SCRIPTED)).to_have_count(2)
        js_pane(page, SCRIPTED).fill('console.log("typed");')
        page.wait_for_timeout(400)
        lines = console_lines(page, SCRIPTED)
        expect(lines).to_have_count(2)
        expect(lines.nth(0)).to_have_text('start {"a":1}')

    def test_run_applies_the_pane_and_clears_the_console(self, page):
        js_pane(page, SCRIPTED).fill('console.log("pressed");')
        page.locator(f"{SCRIPTED} .dl-site-run").click()
        lines = console_lines(page, SCRIPTED)
        expect(lines).to_have_count(1)
        expect(lines.nth(0)).to_have_text("pressed")
        expect(page.locator(f"{SCRIPTED} .dl-site-console-hint")).to_have_count(0)

    def test_ctrl_enter_in_the_pane_runs_it(self, page):
        pane = js_pane(page, SCRIPTED)
        pane.fill('console.log("keys");')
        pane.press("Control+Enter")
        expect(console_lines(page, SCRIPTED).nth(0)).to_have_text("keys")

    def test_css_typing_redraws_live_with_the_last_run_script(self, page):
        js_pane(page, SCRIPTED).fill('console.log("pressed");')
        page.locator(f"{SCRIPTED} .dl-site-run").click()
        expect(console_lines(page, SCRIPTED).nth(0)).to_have_text("pressed")
        # Now change the JS pane without running, then type CSS: the preview
        # must redraw with the new colour and the *pressed* script, not the
        # unrun one.
        js_pane(page, SCRIPTED).fill('console.log("unrun");')
        page.locator(f'{SCRIPTED} .dl-site-input[data-lang="css"]').fill("p { color: rgb(0, 128, 0); }")
        expect(page.locator(f"{SCRIPTED} .dl-site-frame")).to_be_visible()
        page.wait_for_function(
            "sel => { const f = document.querySelector(sel); return f && f.srcdoc.includes('rgb(0, 128, 0)'); }",
            arg=f"{SCRIPTED} .dl-site-frame",
        )
        lines = console_lines(page, SCRIPTED)
        expect(lines).to_have_count(1)
        expect(lines.nth(0)).to_have_text("pressed")
        assert preview_colour(page, SCRIPTED, "p") == "rgb(0, 128, 0)"

    def test_reset_restores_the_original_and_runs_it(self, page):
        js_pane(page, SCRIPTED).fill('console.log("changed");')
        page.locator(f"{SCRIPTED} .dl-site-run").click()
        expect(console_lines(page, SCRIPTED).nth(0)).to_have_text("changed")
        page.locator(f"{SCRIPTED} .dl-site-reset").click()
        lines = console_lines(page, SCRIPTED)
        expect(lines).to_have_count(2)
        expect(lines.nth(1)).to_contain_text("line 3")


class TestErrors:
    def test_a_syntax_error_names_its_pane_line(self, page):
        js_pane(page, SCRIPTED).fill("var a = 1;\nvar b = ;\nconsole.log(a);")
        page.locator(f"{SCRIPTED} .dl-site-run").click()
        lines = console_lines(page, SCRIPTED)
        expect(lines).to_have_count(1)
        expect(lines.nth(0)).to_contain_text("SyntaxError")
        expect(lines.nth(0)).to_contain_text("(JavaScript, line 2)")
        expect(page.locator(f"{SCRIPTED} .dl-site-console-hint")).to_contain_text(
            "not written the way JavaScript expects"
        )

    def test_an_error_inside_a_click_handler_arrives_when_clicked(self, page):
        js_pane(page, SCRIPTED).fill(
            'document.getElementById("go").addEventListener("click", function () {\n  nope();\n});'
        )
        page.locator(f"{SCRIPTED} .dl-site-run").click()
        expect(console_lines(page, SCRIPTED)).to_have_count(0)
        page.frame_locator(f"{SCRIPTED} .dl-site-frame").locator("#go").click()
        lines = console_lines(page, SCRIPTED)
        expect(lines).to_have_count(1)
        expect(lines.nth(0)).to_contain_text("nope is not defined (JavaScript, line 2)")

    def test_go_to_line_selects_the_named_line(self, page):
        page.locator(f"{SCRIPTED} .dl-site-console-goto").first.click()
        pane = js_pane(page, SCRIPTED)
        expect(pane).to_be_focused()
        start, end = pane.evaluate("el => [el.selectionStart, el.selectionEnd]")
        text = pane.input_value()
        assert text[start:end] == "undefinedFunction();"

    def test_a_script_end_tag_in_the_pane_does_not_end_the_script(self, page):
        js_pane(page, SCRIPTED).fill('console.log("</script>");')
        page.locator(f"{SCRIPTED} .dl-site-run").click()
        lines = console_lines(page, SCRIPTED)
        expect(lines).to_have_count(1)
        expect(lines.nth(0)).to_have_text("</script>")

    def test_an_inline_script_in_an_html_only_editor_opens_its_console(self, page):
        expect(page.locator(f"{PLAIN} .dl-site-console")).to_be_hidden()
        page.locator(f'{PLAIN} .dl-site-input[data-lang="html"]').fill(
            "<p>Only markup</p>\n<script>console.log('from html')</script>"
        )
        expect(page.locator(f"{PLAIN} .dl-site-console")).to_be_visible()
        expect(console_lines(page, PLAIN).nth(0)).to_have_text("from html")
