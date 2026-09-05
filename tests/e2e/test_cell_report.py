"""A SQL or Python cell's own report panel, in a real browser.

The icon and the panel's shell are static, built by build.py's
cell_report_markup() and covered by tests/test_build.py already. What can
only be checked in a real browser is the live half: that
updateCellReportLinks() in assets/sql-cell.js actually reads the cell's
current code and output at the moment the panel opens, not whatever was
there at page load. Paired with dewlab's own tests/e2e/test_cell_report.py.

    python3 -m pytest tests/e2e/test_cell_report.py -q
"""

from __future__ import annotations

from urllib.parse import parse_qs, urlparse

# The fixture's two SQL cells share one data-db name (creatures), so
# they are told apart by position: the first succeeds, the second
# queries a table that does not exist.
SQL_OK = ".dl-sql-cell:nth-of-type(1)"
SQL_ERROR = ".dl-sql-cell:nth-of-type(2)"
PY_CELL = ".dl-py-cell"


def icon(page, selector: str):
    return page.locator(f"{selector} .dl-report-icon")


def panel(page, selector: str):
    return page.locator(f"{selector} .dl-report-doors")


def issue_link_params(page, selector: str, which: str) -> dict:
    links = page.locator(f"{selector} .dl-report-issue-link")
    for i in range(links.count()):
        link = links.nth(i)
        if which in link.inner_text().lower():
            return parse_qs(urlparse(link.get_attribute("href")).query)
    raise AssertionError(f"no report link contains {which!r}")


class TestCellReportPanel:
    def test_starts_closed(self, page):
        assert panel(page, SQL_OK).is_hidden()
        assert icon(page, SQL_OK).get_attribute("aria-expanded") == "false"

    def test_a_click_opens_it_in_place_not_as_a_floating_popover(self, page):
        icon(page, SQL_OK).click()
        assert panel(page, SQL_OK).is_visible()
        assert icon(page, SQL_OK).get_attribute("aria-expanded") == "true"
        box = panel(page, SQL_OK).bounding_box()
        assert box["height"] > 0
        position = panel(page, SQL_OK).evaluate("el => getComputedStyle(el).position")
        assert position == "static"

    def test_a_second_click_closes_it_again(self, page):
        icon(page, SQL_OK).click()
        assert panel(page, SQL_OK).is_visible()
        icon(page, SQL_OK).click()
        assert panel(page, SQL_OK).is_hidden()

    def test_links_carry_page_version_and_this_cell(self, page):
        icon(page, SQL_OK).click()
        params = issue_link_params(page, SQL_OK, "error")
        assert params["page"] == ["fixtures/rendering-tour"]
        assert params["template"] == ["report.yml"]
        assert "version" in params
        assert params["cell"][0].startswith("sql-cell-rendering-tour-")
        wrong = issue_link_params(page, SQL_OK, "wrong")
        assert wrong["kind"] != issue_link_params(page, SQL_OK, "error")["kind"]

    def test_code_reflects_a_live_edit_not_the_starter(self, page):
        input_box = page.locator(f"{SQL_OK} .dl-sql-input")
        input_box.click()
        page.keyboard.press("Control+End")
        page.keyboard.type("\n-- a note only this reader added")

        icon(page, SQL_OK).click()
        params = issue_link_params(page, SQL_OK, "error")
        assert "a note only this reader added" in params["code"][0]

    def test_output_is_absent_before_the_cell_has_run(self, page):
        icon(page, PY_CELL).click()
        params = issue_link_params(page, PY_CELL, "error")
        assert "output" not in params

    def test_sql_error_output_is_included_after_running(self, page):
        page.locator(f"{SQL_ERROR} .dl-sql-run").click()
        page.wait_for_function(
            "sel => document.querySelector(sel).children.length > 0",
            arg=f"{SQL_ERROR} .dl-sql-output",
            timeout=30_000,
        )
        icon(page, SQL_ERROR).click()
        params = issue_link_params(page, SQL_ERROR, "error")
        assert "not_a_real_table" in params["output"][0]
        assert "SELECT * FROM not_a_real_table" in params["code"][0]

    def test_python_output_is_included_after_running(self, page):
        page.locator(f"{PY_CELL} .dl-py-run").click()
        page.wait_for_function(
            "sel => document.querySelector(sel).children.length > 0",
            arg=f"{PY_CELL} .dl-py-output",
            timeout=30_000,
        )
        icon(page, PY_CELL).click()
        params = issue_link_params(page, PY_CELL, "error")
        assert "4" in params["output"][0]
