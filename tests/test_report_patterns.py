"""Tests for the report-pattern grouping logic in tools/report_patterns.py
and the labelling logic in tools/label_report.py.

Neither script's actual GitHub API calls are exercised here — that needs a
live repository, which is exactly what the workflow itself provides when it
runs. What is worth protecting with a fast test is the part a live run
cannot easily catch a regression in until reports are already piling up:
parsing an issue-form body back into fields, and the threshold arithmetic
that decides whether something is a pattern at all. Paired with the
identical test file in deweydex/dewlab.

    python3 -m pytest tests/test_report_patterns.py -q
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))

import label_report  # noqa: E402
import report_patterns  # noqa: E402

# A page-level report, filed by hand rather than from a cell's own report
# icon — no Cell, code, output or browser field, which is a normal shape
# for this repository's report.yml as much as a cell-level one is.
ISSUE_BODY = """### What kind of thing is this?

The page is wrong, or I could not follow it

### Page

web/selectors

### Version

2026.09.04.1

### What happened

The example selector does not match the element the text says it should.
"""

# A report filed from a SQL or Python cell's own report icon, carrying the
# Cell, code and output fields build.py's cell_report_markup() adds.
CELL_ISSUE_BODY = """### What kind of thing is this?

It gives an error, and I have tried the checks on the Troubleshooting page

### Page

data/first-queries

### Version

2026.09.05.1

### Cell

sql-cell-first-queries-totals

### The cell's code

SELECT * FROM not_a_real_table

### What the cell showed

OperationalError: no such table: not_a_real_table

### Browser

Firefox 142, Windows

### What happened

Fails as soon as I press run, before I change anything.
"""


class TestParseFields:
    def test_reads_every_field_by_its_label(self):
        fields = report_patterns.parse_fields(ISSUE_BODY)
        assert fields["Page"] == "web/selectors"
        assert fields["What kind of thing is this?"] == "The page is wrong, or I could not follow it"
        assert "does not match" in fields["What happened"]

    def test_empty_body_gives_no_fields(self):
        assert report_patterns.parse_fields("") == {}

    def test_a_page_level_report_gives_no_cell(self):
        assert "Cell" not in report_patterns.parse_fields(ISSUE_BODY)

    def test_a_cell_level_report_gives_the_cell_id(self):
        fields = report_patterns.parse_fields(CELL_ISSUE_BODY)
        assert fields["Cell"] == "sql-cell-first-queries-totals"
        assert "not_a_real_table" in fields["What the cell showed"]

    def test_label_report_uses_the_same_parser(self):
        # Both scripts read the same rendered body; a change to one parser
        # without the other is exactly the drift worth catching here.
        assert label_report.parse_fields(ISSUE_BODY) == report_patterns.parse_fields(ISSUE_BODY)


class TestKindLabel:
    def test_error_kind(self):
        assert label_report.kind_label(
            "It gives an error, and I have tried the checks on the Troubleshooting page"
        ) == "kind: error"

    def test_wrong_or_unclear_kind(self):
        assert label_report.kind_label("The page is wrong, or I could not follow it") == "kind: unclear"

    def test_anything_else_falls_back_to_question(self):
        assert label_report.kind_label("A question, an idea, or something else") == "kind: question"
        assert label_report.kind_label("") == "kind: question"


class TestPageLabel:
    def test_short_page_is_untouched(self):
        assert label_report.page_label("web/selectors") == "page: web/selectors"

    def test_long_page_is_truncated_to_githubs_own_limit(self):
        long_page = "a-very-long-module-name/an-even-longer-tutorial-slug-name"
        name = label_report.page_label(long_page)
        assert len(name) <= 50


def issue(number: int, cell: str = "") -> dict:
    return {"number": number, "title": f"[report] #{number}", "cell": cell}


class TestWorthAPattern:
    def test_below_every_threshold_is_not_a_pattern(self):
        assert not report_patterns.worth_a_pattern([issue(1), issue(2)])

    def test_three_reports_on_one_page_is_a_pattern(self):
        assert report_patterns.worth_a_pattern([issue(1), issue(2), issue(3)])

    def test_two_reports_with_no_cell_never_trip_the_cell_threshold(self):
        assert not report_patterns.worth_a_pattern([issue(1), issue(2)])

    def test_two_reports_on_the_same_cell_is_a_pattern_even_with_few_reports(self):
        assert report_patterns.worth_a_pattern(
            [issue(1, cell="sql-cell-first-queries-totals"), issue(2, cell="sql-cell-first-queries-totals")]
        )

    def test_two_reports_on_different_cells_is_not_a_pattern(self):
        assert not report_patterns.worth_a_pattern([issue(1, cell="cell-a"), issue(2, cell="cell-b")])


class TestPatternBody:
    def test_carries_the_marker_github_search_relies_on(self):
        body = report_patterns.pattern_body("web/selectors", [issue(1), issue(2), issue(3)])
        match = report_patterns.MARKER_RE.search(body)
        assert match and match.group("page") == "web/selectors"

    def test_groups_with_no_cell_all_land_as_not_tied_to_one_cell(self):
        body = report_patterns.pattern_body("web/selectors", [issue(1), issue(2), issue(3)])
        assert "Not tied to one cell" in body
        assert "#1, #2, #3" in body

    def test_groups_by_cell_and_flags_the_one_at_threshold(self):
        body = report_patterns.pattern_body(
            "data/first-queries",
            [
                issue(1, cell="sql-cell-first-queries-totals"),
                issue(2, cell="sql-cell-first-queries-totals"),
                issue(3),
            ],
        )
        assert "#1, #2" in body
        assert "at or over the per-cell threshold" in body
        assert "#3" in body
        assert "Not tied to one cell" in body
