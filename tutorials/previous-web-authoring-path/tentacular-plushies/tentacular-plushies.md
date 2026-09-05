---
title: "Tentacular Plushies: a database of your own"
slug: tentacular-plushies
module: previous-web-authoring-path
module_title: "Previous Web Authoring Path"
series: sql-practice
version: 2026.09.05.1
---

# Tentacular Plushies: a database of your own

Tentacular Plushies sells soft toy octopuses, squid and cuttlefish, and
you are its new database administrator. Five tasks build its database
from nothing. First a table of products, then a table of sales, then
rows in both, then three questions asked of the finished thing.

Each box below keeps its own database, named `shop`, so a table one box
creates is still there for the next one. Run them in order the first
time. If a later box will not run, scroll back up and check the box
before it first.

## Task 1: a table of products

Create a table called `products` with these columns:

- `id` — `INTEGER PRIMARY KEY AUTOINCREMENT`
- `product_name` — `TEXT NOT NULL`
- `category` — `TEXT NOT NULL`
- `price` — `REAL NOT NULL`
- `stock_quantity` — `INTEGER NOT NULL`
- `description` — `TEXT`

```sql cell=shop
-- Write your CREATE TABLE products statement here, then run it.
-- End with SELECT * FROM products; to see its columns.
```

## Task 2: a table of sales

Create a second table, `transactions`, with these columns:

- `id` — `INTEGER PRIMARY KEY AUTOINCREMENT`
- `product_id` — `INTEGER NOT NULL`
- `customer_name` — `TEXT NOT NULL`
- `quantity` — `INTEGER NOT NULL`

Add `FOREIGN KEY (product_id) REFERENCES products(id)` after the columns,
naming which table's `id` a `product_id` value refers to.

```sql cell=shop
-- Write your CREATE TABLE transactions statement here, then run it.
-- End with SELECT * FROM transactions; to see its columns.
```

## Task 3: add some products

Insert at least four products, in at least three different categories,
each priced between 10 and 60. `'Octopus'`, `'Squid'` and `'Cuttlefish'`
are three categories to choose from, or invent your own.

```sql cell=shop
-- Write one or more INSERT INTO products statements here, then run them.
-- End with SELECT * FROM products; to check what was added.
```

## Task 4: add some sales

Insert at least three transactions. Run `SELECT id, product_name FROM
products;` first if you need a reminder of which `id` belongs to which
product, then give each transaction a `product_id` that really exists.

```sql cell=shop
-- Write one or more INSERT INTO transactions statements here, then run them.
-- End with SELECT * FROM transactions; to check what was added.
```

## Task 5: three questions

Write three separate queries, one per box. The first finds products
priced above 30, ordered from most to least expensive. The second finds
products with fewer than 15 left in stock. The third lists every
transaction's customer name and quantity.

```sql cell=shop
-- Products priced above 30, most expensive first.
```

```sql cell=shop
-- Products with fewer than 15 left in stock.
```

```sql cell=shop
-- Every transaction's customer name and quantity.
```

## Solutions

One way to finish every task, already filled in. These boxes keep a
database of their own, named `solution`, so running them changes nothing
in the boxes above.

```sql cell=solution
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock_quantity INTEGER NOT NULL,
    description TEXT
);

INSERT INTO products (product_name, category, price, stock_quantity, description) VALUES
    ('Giant Octopus', 'Octopus', 45.99, 12, 'Eight arms, zero complaints.'),
    ('Mini Squid', 'Squid', 12.99, 50, 'Fits in a coat pocket.'),
    ('Cuddly Cuttlefish', 'Cuttlefish', 28.50, 20, 'Changes colour in your imagination only.'),
    ('Nautilus Plushie', 'Nautilus', 34.00, 8, 'A shell you can hug.');

SELECT * FROM products;
```

```sql cell=solution
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO transactions (product_id, customer_name, quantity) VALUES
    (1, 'Sarah Murphy', 2),
    (2, 'John Smith', 1),
    (3, 'Aoife Byrne', 3);

SELECT * FROM transactions;
```

```sql cell=solution
SELECT * FROM products WHERE price > 30 ORDER BY price DESC;
```

```sql cell=solution
SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 15;
```

```sql cell=solution
SELECT customer_name, quantity FROM transactions;
```

## What you have now

A small shop's database, built one table and one statement at a time,
and three questions answered from it.

- **`FOREIGN KEY`** — a constraint naming which column in another table a
  column's values refer to, here `transactions.product_id` referring to
  `products.id`.
- **`ORDER BY … DESC`** — sorts query results, largest or latest first.
- **`WHERE` with `<` and `>`** — filters rows by comparing a column to a
  value.
