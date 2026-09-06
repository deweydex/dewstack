---
title: "Full-stack tour"
slug: full-stack-tour
module: fixtures
module_title: "Fixtures"
series: shelf
version: 2026.09.06.1
---

# Full-stack tour

Cells to exercise the app-cell engine's rendering path — not a
tutorial a student would read.

```sql cell=products
CREATE TABLE products (name TEXT, price REAL);
INSERT INTO products (name, price) VALUES ('Mug', 8.5), ('Tote bag', 12.0), ('Notebook', 3.0);
```

```html app=read
<table><thead><tr><th>Name</th><th>Price</th></tr></thead><tbody></tbody></table>
```

```js app=read
const rows = await dlQuery("products", "SELECT name, price FROM products WHERE price < ? ORDER BY name", [10]);
const tbody = root.querySelector("tbody");
tbody.innerHTML = "";
for (const row of rows) {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${row.name}</td><td>${row.price}</td>`;
  tbody.appendChild(tr);
}
```

```js app=broken
const rows = await dlQuery("products", "SELECT * FROM not_a_real_table");
```
