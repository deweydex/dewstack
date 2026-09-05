"""assets/python_tools.py's own logic, testable under plain CPython for
everything that does not need Pyodide itself. `run_python()` is the one
exception — it imports `pyodide.code.eval_code_async`, so running an
actual cell is left to a live browser check, the same split dewlab's own
tests draw around `run_cell()`.
"""

from __future__ import annotations

import sys
import types
from contextlib import contextmanager
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "assets"))
import python_tools as pt  # noqa: E402
import sql_tools  # noqa: E402

try:
    import pandas as pd
except ImportError:  # pragma: no cover - exercised only where pandas is absent
    pd = None

needs_pandas = pytest.mark.skipif(pd is None, reason="pandas is not installed")


@pytest.fixture(autouse=True)
def _isolated_state():
    """Every test gets its own module state, on both sides of the
    read_sql() bridge — a namespace or a connection a previous test used
    should not leak into a test that expects a fresh one."""
    pt._namespaces.clear()
    sql_tools._connections.clear()
    yield
    pt._namespaces.clear()
    for conn in sql_tools._connections.values():
        conn.close()
    sql_tools._connections.clear()


def test_reset_drops_a_namespace():
    ns = pt._namespace("explore")
    ns["x"] = 1
    pt.reset("explore")
    assert "x" not in pt._namespace("explore")


def test_a_fresh_namespace_already_has_read_sql():
    assert pt._namespace("explore")["read_sql"] is pt.read_sql


def test_sharing_a_name_shares_the_namespace():
    pt._namespace("a")["x"] = 1
    assert pt._namespace("a")["x"] == 1


def test_different_names_do_not_share_a_namespace():
    pt._namespace("a")["x"] = 1
    assert "x" not in pt._namespace("b")


class TestReadSql:
    @pytest.fixture()
    def seeded(self):
        conn = sql_tools.get_connection("shop")
        conn.execute("create table products (id integer primary key, name text, price real)")
        conn.executemany(
            "insert into products (name, price) values (?, ?)",
            [("Mug", 8.5), ("Notebook", 3.0)],
        )
        conn.commit()
        return conn

    @needs_pandas
    def test_returns_a_dataframe_of_the_query(self, seeded):
        frame = pt.read_sql("shop", "select name, price from products order by name")
        assert list(frame["name"]) == ["Mug", "Notebook"]

    @needs_pandas
    def test_reaches_a_connection_sql_tools_already_built(self, seeded):
        # The point of read_sql: no import, no connection string, just the
        # same db name a `sql cell=` block on the same page would use.
        frame = pt.read_sql("shop", "select count(*) as n from products")
        assert frame["n"][0] == 2

    @needs_pandas
    def test_an_unknown_db_name_still_raises_on_a_missing_table(self):
        # sql_tools.get_connection() creates a fresh, empty connection for
        # a name nothing has used yet, so a bad table name is a real
        # error (pandas' own DatabaseError, wrapping sqlite3's), not a
        # silent empty frame.
        with pytest.raises(pd.errors.DatabaseError):
            pt.read_sql("nothing-yet", "select * from products")


@pytest.fixture()
def frame():
    return pd.DataFrame({"name": ["Mug", "Notebook"], "price": [8.5, 3.0]})


@needs_pandas
class TestTables:
    def test_dataframe_is_recognised(self, frame):
        assert pt._is_dataframe(frame)

    def test_series_is_recognised(self, frame):
        assert pt._is_dataframe(frame["price"])

    def test_a_plain_value_is_not_a_dataframe(self):
        assert not pt._is_dataframe([1, 2, 3])

    def test_dataframe_renders_as_a_table(self, frame):
        html = pt._table_html(frame)
        assert "dl-table-wrap" in html
        assert "<table" in html
        assert "Mug" in html

    def test_series_renders_as_a_table_too(self, frame):
        html = pt._table_html(frame["price"])
        assert "<table" in html

    def test_long_frames_are_truncated_and_say_so(self):
        big = pd.DataFrame({"n": range(100)})
        html = pt._table_html(big, max_rows=5)
        assert "first 5 of 100 rows" in html

    def test_short_frames_carry_no_truncation_note(self, frame):
        html = pt._table_html(frame, max_rows=20)
        assert "dl-table-note" not in html

    def test_cell_contents_are_escaped(self):
        nasty = pd.DataFrame({"x": ["<script>alert(1)</script>"]})
        html = pt._table_html(nasty)
        assert "<script>alert(1)</script>" not in html
        assert "&lt;script&gt;" in html


@needs_pandas
class TestRenderValue:
    def test_none_renders_nothing(self):
        sink = pt._Sink()
        pt._render_value(None, sink)
        assert sink.html == ""

    def test_a_dataframe_renders_as_a_table(self, frame):
        sink = pt._Sink()
        pt._render_value(frame, sink)
        assert "dl-table-wrap" in sink.html

    def test_a_plain_value_falls_back_to_repr(self):
        sink = pt._Sink()
        pt._render_value(42, sink)
        assert "dl-repr" in sink.html
        assert "42" in sink.html

    def test_repr_output_is_escaped(self):
        sink = pt._Sink()
        pt._render_value("<b>", sink)
        assert "<b>" not in sink.html
        assert "&lt;b&gt;" in sink.html

    def test_a_figure_renders_as_a_png(self):
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        figure, axes = plt.subplots()
        axes.plot([1, 2, 3])
        sink = pt._Sink()
        pt._render_value(figure, sink)
        plt.close(figure)
        assert "dl-figure" in sink.html
        assert "data:image/png;base64," in sink.html

    def test_a_figure_rendered_as_the_last_value_is_not_flushed_again(self):
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        figure, axes = plt.subplots()
        axes.plot([1, 2, 3])
        sink = pt._Sink()
        pt._render_value(figure, sink)
        pt._flush_figures(sink)
        plt.close(figure)
        assert sink.html.count("dl-figure") == 1


class TestStreaming:
    """Consecutive print()s of the same kind read as one block, ported
    from dewlab's own streaming sink."""

    def test_two_writes_of_the_same_kind_merge_into_one_pre(self):
        sink = pt._Sink()
        writer = pt._StreamWriter(sink, "dl-stdout")
        writer.write("rows: ")
        writer.write("2")
        assert sink.html == '<pre class="dl-stdout">rows: 2</pre>'

    def test_a_discrete_result_closes_a_stream_in_progress(self, frame):
        sink = pt._Sink()
        writer = pt._StreamWriter(sink, "dl-stdout")
        writer.write("before")
        pt._render_value(frame, sink)
        writer.write("after")
        assert sink.html == (
            '<pre class="dl-stdout">before</pre>'
            + pt._table_html(frame)
            + '<pre class="dl-stdout">after</pre>'
        )


class TestPltShowAndFlush:
    """Ported from dewlab's own TestPltShow: matplotlib is stubbed here
    so these run without it installed, even though this repo's CI
    installs the real thing for TestTables and TestRenderValue above."""

    @contextmanager
    def fake_pyplot(self):
        module = types.ModuleType("matplotlib.pyplot")
        module.calls = []
        module.show = lambda *a, **k: module.calls.append(("original", a, k))
        module.get_fignums = lambda: []
        module.close = lambda *a: module.calls.append(("close", a, {}))
        sys.modules["matplotlib.pyplot"] = module
        try:
            yield module
        finally:
            del sys.modules["matplotlib.pyplot"]

    def test_show_is_replaced(self):
        with self.fake_pyplot() as plt:
            pt._patch_pyplot_show(pt._Sink())
            assert plt.show is not None

    def test_the_replacement_flushes_instead_of_warning(self):
        with self.fake_pyplot() as plt:
            pt._patch_pyplot_show(pt._Sink())
            plt.show()
            assert ("original", (), {}) not in plt.calls
            assert ("close", ("all",), {}) in plt.calls

    def test_it_accepts_the_arguments_matplotlib_takes(self):
        with self.fake_pyplot() as plt:
            pt._patch_pyplot_show(pt._Sink())
            plt.show(block=False)  # would be a TypeError if the signature were bare

    def test_nothing_happens_when_matplotlib_was_never_imported(self):
        sys.modules.pop("matplotlib.pyplot", None)
        pt._patch_pyplot_show(pt._Sink())  # must not raise

    def test_flush_figures_does_nothing_without_matplotlib(self):
        sys.modules.pop("matplotlib.pyplot", None)
        sink = pt._Sink()
        pt._flush_figures(sink)  # must not raise
        assert sink.html == ""
