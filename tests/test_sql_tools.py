"""assets/sql_tools.py's own logic, testable under plain CPython since it
imports nothing browser-only (no `js`, no `pyodide`) — unlike dewlab's
tutorial_tools.py, which needs a DOM stub for exactly that reason.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "assets"))
import sql_tools  # noqa: E402


@pytest.fixture(autouse=True)
def _isolated_connections():
    """Every test gets its own module state: sql_tools keeps one
    connection per db name at module level, and a name a previous test
    used should not leak a table into a test that expects a fresh one."""
    sql_tools._connections.clear()
    yield
    for conn in sql_tools._connections.values():
        conn.close()
    sql_tools._connections.clear()


def test_a_select_renders_as_a_table():
    html = sql_tools.run_sql("db", "select 1 as n, 'a' as letter;")
    assert "<table>" in html
    assert "<th>n</th>" in html
    assert "<th>letter</th>" in html
    assert "<td>1</td>" in html
    assert "<td>a</td>" in html


def test_a_script_runs_every_statement_and_renders_the_last():
    script = "create table t(id integer, name text); insert into t values (1, 'Rex'); select * from t;"
    html = sql_tools.run_sql("db", script)
    assert "<td>1</td>" in html
    assert "<td>Rex</td>" in html


def test_two_cells_sharing_a_name_share_a_table():
    sql_tools.run_sql("db", "create table t(id); insert into t values (1);")
    html = sql_tools.run_sql("db", "insert into t values (2); select * from t;")
    assert "<td>1</td>" in html
    assert "<td>2</td>" in html


def test_two_different_names_never_share_a_table():
    sql_tools.run_sql("first", "create table t(id); insert into t values (1);")
    html = sql_tools.run_sql("second", "select * from t;")
    assert "no such table" in html


def test_a_non_select_reports_rows_affected_not_a_table():
    html = sql_tools.run_sql("db", "create table t(id); insert into t values (1), (2), (3);")
    assert "<table>" not in html
    assert "3 rows affected" in html


def test_a_sql_error_renders_as_a_message_not_a_crash():
    html = sql_tools.run_sql("db", "select * from a_table_that_does_not_exist;")
    assert "dl-sql-error" in html
    assert "no such table" in html


def test_max_rows_truncates_and_says_so():
    values = ", ".join(f"({n})" for n in range(1, 11))
    sql_tools.run_sql("db", f"create table t(n); insert into t values {values};")
    html = sql_tools.run_sql("db", "select * from t;", max_rows=5)
    assert html.count("<tr>") == 6  # one header row, five data rows
    assert "first 5 rows" in html


def test_reset_drops_the_table():
    sql_tools.run_sql("db", "create table t(id);")
    sql_tools.reset("db")
    html = sql_tools.run_sql("db", "select * from t;")
    assert "no such table" in html


def test_a_blank_script_says_so_without_touching_sqlite():
    html = sql_tools.run_sql("db", "   ;  ;  ")
    assert "Nothing to run" in html


def test_a_comment_only_script_says_nothing_to_run():
    html = sql_tools.run_sql("db", "-- Load your file, then run it.")
    assert "Nothing to run" in html


def test_a_trailing_comment_does_not_break_a_real_statement():
    html = sql_tools.run_sql("db", "select 1 as n; -- trailing note")
    assert "<td>1</td>" in html
