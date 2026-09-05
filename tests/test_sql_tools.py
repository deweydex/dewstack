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


# --- the tentacular-plushies quiz's self-check --------------------------

def test_products_table_check_fails_before_the_table_exists():
    html = sql_tools.check_products_table("quiz")
    assert "dl-check-fail" in html
    assert "no products table" in html.lower()


def test_products_table_check_passes_with_every_required_column():
    sql_tools.run_sql("quiz", """
        CREATE TABLE products (
            id INTEGER PRIMARY KEY,
            product_name TEXT,
            category TEXT,
            price REAL,
            stock_quantity INTEGER
        );
    """)
    html = sql_tools.check_products_table("quiz")
    assert "dl-check-pass" in html


def test_products_table_check_names_a_missing_column():
    sql_tools.run_sql("quiz", "CREATE TABLE products (id INTEGER, product_name TEXT);")
    html = sql_tools.check_products_table("quiz")
    assert "dl-check-fail" in html
    assert "category" in html


def test_transactions_table_check_passes_with_every_required_column():
    sql_tools.run_sql("quiz", """
        CREATE TABLE transactions (
            id INTEGER PRIMARY KEY,
            product_id INTEGER,
            customer_name TEXT,
            quantity INTEGER
        );
    """)
    html = sql_tools.check_transactions_table("quiz")
    assert "dl-check-pass" in html


def test_products_rows_check_needs_four_rows_and_three_categories():
    sql_tools.run_sql("quiz", """
        CREATE TABLE products (id INTEGER, product_name TEXT, category TEXT, price REAL, stock_quantity INTEGER);
        INSERT INTO products VALUES (1, 'Squishy', 'Octopus', 20, 10), (2, 'Wiggly', 'Squid', 25, 10);
    """)
    html = sql_tools.check_products_rows("quiz")
    assert "dl-check-fail" in html

    sql_tools.run_sql("quiz", """
        INSERT INTO products VALUES (3, 'Roundy', 'Cuttlefish', 30, 10), (4, 'Spiraly', 'Nautilus', 35, 10);
    """)
    html = sql_tools.check_products_rows("quiz")
    assert "dl-check-pass" in html


def test_transactions_rows_check_needs_three_rows():
    sql_tools.run_sql("quiz", "CREATE TABLE transactions (id INTEGER, product_id INTEGER, customer_name TEXT, quantity INTEGER);")
    assert "dl-check-fail" in sql_tools.check_transactions_rows("quiz")
    sql_tools.run_sql("quiz", "INSERT INTO transactions VALUES (1, 1, 'A', 1), (2, 1, 'B', 2), (3, 1, 'C', 1);")
    assert "dl-check-pass" in sql_tools.check_transactions_rows("quiz")


def test_quiz_queries_check_needs_a_product_over_30_and_under_15_stock():
    sql_tools.run_sql("quiz", """
        CREATE TABLE products (id INTEGER, product_name TEXT, category TEXT, price REAL, stock_quantity INTEGER);
        CREATE TABLE transactions (id INTEGER, product_id INTEGER, customer_name TEXT, quantity INTEGER);
        INSERT INTO products VALUES (1, 'Squishy', 'Octopus', 20, 40);
    """)
    html = sql_tools.check_quiz_queries("quiz")
    assert "dl-check-fail" in html
    assert "price over 30" in html.lower() or "stock_quantity under 15" in html.lower()

    sql_tools.run_sql("quiz", "INSERT INTO products VALUES (2, 'Wiggly', 'Squid', 40, 5);")
    html = sql_tools.check_quiz_queries("quiz")
    assert "dl-check-pass" in html
