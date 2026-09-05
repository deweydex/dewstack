"""dewstack's SQL cell runtime.

A trimmed relative of dewlab's `tutorial_tools.py` (`_run_sql_cell()`):
a dewstack SQL cell never runs arbitrary Python, only SQL, so this needs
none of that file's cell-execution, traceback, or widget machinery —
just enough to turn SQL text into an HTML table. No pandas: a plain
sqlite3 cursor's columns and rows are enough for a table, and dropping
it keeps the Pyodide download to core-plus-sqlite3 alone.

Loaded once per page (assets/sql-cell.js's boot()); every `.dl-sql-cell`
on that page keeps its own named connection here, so two cells sharing a
`db` name see the same tables and rows, and two different names never do.
"""

from __future__ import annotations

import html
import sqlite3

_connections: dict[str, sqlite3.Connection] = {}


def _connection(db_name: str) -> sqlite3.Connection:
    if db_name not in _connections:
        _connections[db_name] = sqlite3.connect(":memory:")
    return _connections[db_name]


def reset(db_name: str) -> None:
    """Closes and drops a named connection, so the next run starts fresh.

    Used by a cell's Reset button: a table created by an earlier run
    would otherwise still exist, and a `CREATE TABLE` a reader runs again
    would fail as a result.
    """
    conn = _connections.pop(db_name, None)
    if conn is not None:
        conn.close()


def _strip_comments(script: str) -> str:
    """Drops a `--` line comment from each line first, so a cell holding
    only an instructional comment — a placeholder before a reader's own
    code, or exercise text copied in above it — runs as nothing rather
    than as literal text sqlite3 cannot execute."""
    return "\n".join(line.split("--", 1)[0] for line in script.splitlines())


def run_sql(db_name: str, script: str, max_rows: int = 50) -> str:
    """Runs a SQL script against the named connection and returns HTML.

    Drops `--` comments, then splits on a bare `;`, the same as dewlab's
    `_run_sql_cell()` and for the same reason: a script, not one
    statement, is the normal shape of a SQL cell (`CREATE TABLE` here,
    `INSERT` there, `SELECT` at the end). Every statement but the last
    just runs; the last statement's
    result is what renders, as a table if it returned rows, otherwise as
    a count of rows affected. Every statement commits, so a `CREATE
    TABLE`/`INSERT` a reader runs is still there on the next run.

    A `sqlite3.Error` (a typo, a missing table) renders as a plain
    message rather than a Python traceback: nothing here runs the
    reader's own Python, so a traceback pointing at this file's own code
    would only confuse.
    """
    conn = _connection(db_name)
    statements = [s.strip() for s in _strip_comments(script).split(";") if s.strip()]
    if not statements:
        return '<p class="dl-sql-note">Nothing to run.</p>'

    try:
        for statement in statements[:-1]:
            conn.execute(statement)
        cursor = conn.execute(statements[-1])
        columns = [description[0] for description in cursor.description or []]
        if columns:
            rows = cursor.fetchmany(max_rows)
            more = cursor.fetchone() is not None
            result = _table_html(columns, rows, max_rows, more)
        else:
            noun = "row" if cursor.rowcount == 1 else "rows"
            result = f'<p class="dl-sql-note">{cursor.rowcount} {noun} affected.</p>'
        conn.commit()
        return result
    except sqlite3.Error as exc:
        return f'<p class="dl-sql-error">{html.escape(str(exc))}</p>'


def _table_html(columns: list[str], rows: list[tuple], max_rows: int, more: bool) -> str:
    head = "".join(f"<th>{html.escape(str(c))}</th>" for c in columns)
    body = "".join(
        "<tr>" + "".join(f"<td>{html.escape('' if v is None else str(v))}</td>" for v in row) + "</tr>"
        for row in rows
    )
    parts = [
        '<div class="dl-sql-result">',
        f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>",
        "</div>",
    ]
    if more:
        parts.append(f'<p class="dl-sql-note">Showing the first {max_rows} rows.</p>')
    return "".join(parts)
