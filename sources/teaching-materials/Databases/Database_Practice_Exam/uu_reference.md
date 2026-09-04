# 5N0783 Exam Reference
**Unseen University Registry · Practical 50% · 2 hrs**

---

## SQLite Connection

| Function | Description | Returns |
|---|---|---|
| `sqlite3.connect(path)` | Open or create a database file | `Connection` |
| `conn.cursor()` | Create a cursor to run SQL | `Cursor` |
| `cursor.execute(sql, params?)` | Run one SQL statement | `params: tuple` |
| `cursor.executemany(sql, data)` | Run same SQL for many rows | `data: list[tuple]` |
| `conn.commit()` | Save INSERT / UPDATE / DELETE | call after every write |
| `conn.close()` | Close connection when done | end of notebook |
| `cursor.fetchone()` | Get one row from results | `tuple \| None` |
| `cursor.fetchall()` | Get all rows from results | `list[tuple]` |

---

## SQL — SELECT / Filter / Sort

| Clause | Purpose | Notes |
|---|---|---|
| `SELECT *` | All columns | |
| `SELECT col1, col2` | Specific columns only | |
| `WHERE col = 'val'` | Exact match filter | also `!=` `>` `<` `>=` `<=` |
| `AND / OR` | Combine conditions | |
| `LIKE 'A%'` | Starts with A | `%` is wildcard |
| `ORDER BY col ASC` | Sort A→Z / smallest first | or `DESC` |
| `LIMIT n` | Return at most n rows | `int` |
| `COUNT(*)` | Count rows | use in SELECT |
| `GROUP BY col` | Aggregate per unique value | pair with COUNT / AVG / SUM |
| `JOIN t2 ON t1.id = t2.id` | Combine two tables via foreign key | |
| `PRAGMA table_info(t)` | Show column names + types | |

---

## SQL — Write Operations

| Statement | Purpose | Important |
|---|---|---|
| `INSERT INTO t (cols) VALUES (?)` | Add a new row — use `?` placeholders | then `commit()` |
| `UPDATE t SET col=? WHERE …` | Change existing data | always use `WHERE` |
| `DELETE FROM t WHERE …` | Remove rows | always use `WHERE` |
| `INSERT OR IGNORE …` | Skip if row already exists | safe for re-runs |

---

## pandas

| Function | Description | Notes |
|---|---|---|
| `pd.read_sql(sql, conn)` | Run SQL → DataFrame | → DataFrame |
| `df.head(n)` | First n rows (default 5) | int, default 5 |
| `df.info()` | Column names, types, nulls | |
| `df[df['col'] == val]` | Boolean filter — equal | |
| `df[df['col'] > val]` | Boolean filter — greater than | |
| `df.sort_values('col')` | Sort DataFrame | `ascending=True/False` |
| `pd.read_csv('file.csv')` | Load CSV file | → DataFrame |
| `df.to_sql(name, conn, …)` | Write DataFrame to DB table | `if_exists='append'` |

---

## ipywidgets

**Available widgets:**
`widgets.Text()` · `widgets.Dropdown()` · `widgets.IntText()` · `widgets.FloatText()` · `widgets.Button()` · `widgets.Output()` · `widgets.VBox([])` · `widgets.HBox([])`

| Attribute / Method | Description | Type |
|---|---|---|
| `widget.value` | Read the current value | any |
| `btn.on_click(fn)` | Call fn when button clicked | `fn(btn) -> None` |
| `output.clear_output()` | Wipe previous messages | inside `with output:` |
| `display(widget)` | Render widget in notebook | from `IPython.display` |
| `button_style=` | `'success'` / `'danger'` / `'warning'` / `'info'` | `str` |

---

## matplotlib

| Function | Description | Notes |
|---|---|---|
| `plt.figure(figsize=(w,h))` | New figure, set size in inches | `tuple[int, int]` |
| `plt.bar(x, y)` | Vertical bar chart | |
| `plt.barh(x, y)` | Horizontal bar chart | |
| `plt.title('text')` | Chart title | required |
| `plt.xlabel / plt.ylabel` | Axis labels | required |
| `plt.xticks(rotation=45)` | Rotate x-axis labels | int degrees |
| `plt.tight_layout()` | Prevent label clipping | required |
| `plt.show()` | Display the chart | call last |

---

## Common Fixes

| Error | Fix |
|---|---|
| `no such table` | Run the setup cell first |
| Nothing happens on click | Check `btn.on_click(fn)` was called and `display()` was run |
| Changes not saved | Add `conn.commit()` after every write |
| Cell won't run | Kernel → Restart & Run All |

---
---

## Worked Examples

---

### PRAGMA — inspect a table's columns and types

```python
cursor.execute("PRAGMA table_info(products)")
for row in cursor.fetchall():
    print(row)
# each row: (cid, column_name, type, notnull, default, pk)
```

---

### COUNT — total rows in a table

```python
cursor.execute("SELECT COUNT(*) FROM orders")
total = cursor.fetchone()[0]
print(f"Total orders: {total}")
```

---

### read\_sql — load a table into a DataFrame

```python
df = pd.read_sql("SELECT * FROM countries", conn)
df.head()   # first 5 rows
```

---

### WHERE — filter rows in SQL

```python
query = """
    SELECT title, price
    FROM books
    WHERE price < 15
"""
pd.read_sql(query, conn)
```

---

### Boolean filter — filter rows in pandas

```python
df = pd.read_sql("SELECT * FROM animals", conn)
big = df[df['weight_kg'] > 100]
big
```

---

### ORDER BY — sort results

```python
pd.read_sql(
    "SELECT * FROM cities ORDER BY population DESC", conn
)
```

---

### INSERT — add a new row

```python
cursor.execute(
    "INSERT INTO items (label, quantity) VALUES (?, ?)",
    ("Widget A", 42)
)
conn.commit()
```

---

### ipywidgets — a simple data entry form

```python
# Populate a dropdown from the database
cats = pd.read_sql("SELECT cat_id, cat_name FROM categories", conn)
cat_opts = [(row['cat_name'], row['cat_id']) for _, row in cats.iterrows()]

label_w = widgets.Text(description='Label:')
qty_w   = widgets.IntText(description='Qty:')
cat_w   = widgets.Dropdown(options=cat_opts, description='Category:')
btn     = widgets.Button(description='Save', button_style='success')
out     = widgets.Output()

def on_save(b):
    with out:
        out.clear_output()
        cursor.execute(
            "INSERT INTO items (label, qty, cat_id) VALUES (?,?,?)",
            (label_w.value, qty_w.value, cat_w.value))
        conn.commit()
        print(f"Saved: {label_w.value}")
        label_w.value = ''

btn.on_click(on_save)
display(widgets.VBox([label_w, qty_w, cat_w, btn, out]))
```

---

### JOIN + GROUP BY — count rows across two tables

```python
query = """
    SELECT c.country_name, COUNT(*) AS total
    FROM sales s
    JOIN countries c ON s.country_id = c.country_id
    GROUP BY c.country_name
"""
df_summary = pd.read_sql(query, conn)
df_summary
```

---

### bar chart — from a DataFrame column

```python
plt.figure(figsize=(7, 4))
plt.bar(df_summary['country_name'], df_summary['total'], color='steelblue')
plt.title('Sales by Country')
plt.xlabel('Country')
plt.ylabel('Sales')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

### read\_csv + to\_sql — import a CSV into the database

```python
df_new = pd.read_csv('new_records.csv')
df_new.to_sql('items', conn, if_exists='append', index=False)
# Verify the import
pd.read_sql("SELECT COUNT(*) FROM items", conn)
```
