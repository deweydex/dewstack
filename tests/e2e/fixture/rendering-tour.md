---
title: "Rendering tour"
slug: rendering-tour
module: fixtures
module_title: "Fixtures"
series: shelf
version: 2026.09.05.1
---

# Rendering tour

Cells to exercise the SQL and Python engines' rendering paths, and the
report icon on each — not a tutorial a student would read.

## A table

```sql cell=creatures
CREATE TABLE creatures (name TEXT, legs INTEGER);
INSERT INTO creatures (name, legs) VALUES ('Spider', 8), ('Dog', 4);
SELECT * FROM creatures;
```

## When it goes wrong

```sql cell=creatures
SELECT * FROM not_a_real_table;
```

## A Python cell

```py cell=explore
total = 2 + 2
total
```
