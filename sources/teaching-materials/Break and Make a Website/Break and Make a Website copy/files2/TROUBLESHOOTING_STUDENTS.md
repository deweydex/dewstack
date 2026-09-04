# Troubleshooting Guide for Students

This guide will help you solve common problems you might encounter while using the HTML, CSS & SQL tutorial.

## Quick Diagnosis

Use this checklist to quickly identify your issue:

- Database not loading → See "Database Issues"
- SQL query errors → See "SQL Query Problems"
- CSS not showing up → See "Styling Problems"
- Page looks broken → See "Display Issues"
- Buttons not working → See "Functionality Problems"

---

## Database Issues

### Problem: "Initializing database..." never completes

**What it looks like:**
The status message stays on "Initializing database..." and never changes to "Database ready!"

**Common causes:**
1. No internet connection
2. School firewall blocking CDN
3. Browser doesn't support WebAssembly

**Solutions to try:**

**Step 1: Check your internet connection**
- Open a new tab and visit any website
- If other sites don't load, you're offline
- Connect to Wi-Fi or ethernet

**Step 2: Refresh the page**
- Press F5 (or Cmd+R on Mac)
- Or click the refresh button in your browser
- Wait 10-15 seconds

**Step 3: Try a different browser**
- Chrome (recommended)
- Firefox
- Edge
- Safari (Mac)

**Step 4: Check with your teacher**
- Your school might block cdnjs.cloudflare.com
- Teacher can provide an offline version

### Problem: "Database initialization failed" error message

**What it looks like:**
Red error message saying database couldn't start

**Solutions:**
1. Close all browser tabs and reopen
2. Clear browser cache:
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E
3. Restart your browser completely
4. Try a different browser

### Problem: Database resets when I don't want it to

**What it looks like:**
Your added data disappears

**Explanation:**
This is normal! The database runs in your browser's memory and resets when you:
- Refresh the page
- Close the tab
- Navigate away

**This is by design:**
- You can experiment without fear
- You can't permanently break anything
- Click "Reset Database" to restore original data anytime

**Solution if you want to keep data:**
There's no way to save data permanently in this tutorial (it's for learning, not production). If you want to keep your queries, copy them to a text file.

---

## SQL Query Problems

### Problem: Error: "no such table: [table name]"

**What it looks like:**
```
Error: no such table: student
```

**Common causes:**
1. Typo in table name
2. Wrong table name

**Solutions:**

Check your spelling:
- Wrong: `SELECT * FROM student;` (missing 's')
- Right: `SELECT * FROM students;`

Remember our table names:
- `students` (with an 's')
- `courses` (with an 's')

**Pro tip:** SQL is case-insensitive for keywords (SELECT, FROM), but table names should match exactly.

### Problem: Error: "no such column: [column name]"

**What it looks like:**
```
Error: no such column: grades
```

**Common causes:**
1. Typo in column name
2. Column doesn't exist in that table

**Solutions:**

Check the column names:

**students table has:**
- id
- name
- age
- grade (singular, not "grades")

**courses table has:**
- id
- name
- instructor
- credits

**How to check:**
Run `SELECT * FROM students;` to see all column names

### Problem: Error: "near WHERE: syntax error"

**What it looks like:**
```
Error: near "WHERE": syntax error
```

**Common causes:**
1. Missing something before WHERE
2. Typo in SQL keyword

**Solutions:**

Check your query structure:
- Wrong: `WHERE age > 20;`
- Right: `SELECT * FROM students WHERE age > 20;`

Every SQL query needs:
1. What to SELECT
2. Which table to get it FROM
3. Optional: conditions in WHERE

### Problem: String quotes errors

**What it looks like:**
```
Error: unrecognized token: "Alice"
```
or
```
Error: no such column: Alice
```

**Common causes:**
Forgot quotes around text values

**Solutions:**

Text values need single quotes:
- Wrong: `SELECT * FROM students WHERE name = Alice;`
- Right: `SELECT * FROM students WHERE name = 'Alice';`

Numbers don't need quotes:
- Right: `SELECT * FROM students WHERE age = 20;`
- Also right: `SELECT * FROM students WHERE age = '20';` (works but not ideal)

### Problem: UPDATE or DELETE changed everything

**What it looks like:**
All students now have the same grade, or all students disappeared

**What happened:**
You forgot the WHERE clause!

**Examples of dangerous queries:**
- `UPDATE students SET grade = 100;` ← Changes ALL students
- `DELETE FROM students;` ← Deletes ALL students

**What you meant to do:**
- `UPDATE students SET grade = 100 WHERE name = 'Alice';` ← Changes only Alice
- `DELETE FROM students WHERE id = 3;` ← Deletes only student #3

**Fix it:**
Click the "Reset Database" button to restore original data

**Prevention tip:**
Always use WHERE with UPDATE and DELETE:
- Right: `UPDATE table SET column = value WHERE condition;`
- Right: `DELETE FROM table WHERE condition;`

### Problem: Query returns no results

**What it looks like:**
"Query executed successfully! (No data to display)"

**Common causes:**
1. Your WHERE condition doesn't match any rows
2. Table is empty (maybe you deleted everything?)

**Solutions:**

**Check if your condition is too strict:**
- Try: `SELECT * FROM students WHERE grade > 50;` (should return multiple results)
- If that works, your original condition might be too specific

**Check if table has data:**
- Run: `SELECT * FROM students;`
- If empty, click "Reset Database"

**Check your comparison operator:**
- `>` means greater than
- `<` means less than
- `=` means equals
- `>=` means greater than or equal
- `<=` means less than or equal
- `!=` means not equal

---

## Styling Problems

### Problem: Page has no colors or looks plain

**What it looks like:**
Everything is black text on white background

**Common causes:**
1. styles.css file is missing
2. styles.css is in wrong location
3. Browser didn't load CSS

**Solutions:**

**Step 1: Check file location**
Make sure these files are in the SAME folder:
- index.html
- styles.css
- tutorial.js

**Step 2: Refresh the page**
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- This forces browser to reload CSS

**Step 3: Check browser console**
- Press F12
- Look for red error messages
- Look for messages about "styles.css" not loading

**Step 4: Verify the file name**
- Must be exactly: `styles.css`
- Not: `style.css` or `Styles.css` or `styles.CSS`

### Problem: Some styles work but not others

**What it looks like:**
Header has colors but exercises don't, or vice versa

**Common causes:**
1. Browser cached old version of CSS
2. CSS file was partially updated

**Solutions:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Close browser completely and reopen
4. Try incognito/private mode

---

## Display Issues

### Problem: Page elements are overlapping

**What it looks like:**
Text appears on top of other text, boxes overlap

**Common causes:**
1. Browser zoom is set wrong
2. Window is too small

**Solutions:**

**Check zoom level:**
- Press Ctrl+0 (zero) to reset zoom to 100%
- Or use browser menu: View → Zoom → Reset

**Make window bigger:**
- This tutorial works best on screens 800px wide or more
- Try maximizing the browser window
- On mobile, turn phone sideways

### Problem: Text is too small or too large

**What it looks like:**
Everything looks tiny or everything looks huge

**Solutions:**

**Reset browser zoom:**
- Ctrl+0 resets to 100%
- Ctrl+Plus zooms in
- Ctrl+Minus zooms out

**Change browser font size:**
Most browsers: Settings → Appearance → Font size

### Problem: SQL results table is cut off

**What it looks like:**
Can only see part of the results table

**Solutions:**
1. Scroll right in the results area
2. Make browser window wider
3. Query fewer columns: use `SELECT name, age FROM students;` instead of `SELECT * FROM students;`

---

## Functionality Problems

### Problem: Buttons don't do anything

**What it looks like:**
Clicking "Run Query" or example buttons has no effect

**Common causes:**
1. tutorial.js file is missing
2. JavaScript is disabled in browser
3. Browser doesn't support JavaScript

**Solutions:**

**Step 1: Check file location**
Make sure `tutorial.js` is in the same folder as `index.html`

**Step 2: Check if JavaScript is enabled**
- Chrome: Settings → Privacy and security → Site settings → JavaScript → Allowed
- Firefox: about:config → search "javascript.enabled" → should be true

**Step 3: Check browser console**
- Press F12
- Click "Console" tab
- Look for red error messages
- Share these with your teacher

**Step 4: Try different browser**
- Chrome (recommended)
- Firefox
- Edge

### Problem: Keyboard shortcut (Ctrl+Enter) doesn't work

**What it looks like:**
Pressing Ctrl+Enter does nothing

**Solutions:**
1. Click inside the query text box first
2. On Mac, try Cmd+Enter instead of Ctrl+Enter
3. Just click the "Run Query" button instead

### Problem: Can't type in the query box

**What it looks like:**
Text box won't let you type

**Solutions:**
1. Click inside the text box to focus it
2. Refresh the page
3. Try clicking outside then back inside the text box

---

## Mobile Device Issues

### Problem: Everything is too small on phone

**Solutions:**
1. Turn phone sideways (landscape mode)
2. Pinch to zoom in
3. Use tablet or computer instead (recommended)

### Problem: Can't see full query buttons on mobile

**Solutions:**
1. Scroll horizontally
2. Turn phone sideways
3. Buttons stack vertically on small screens (scroll down)

### Problem: Keyboard covers query box on mobile

**Solutions:**
1. Scroll up after keyboard appears
2. Use the "hide keyboard" button
3. Turn phone sideways for more space

---

## Browser-Specific Issues

### Chrome Problems

**Problem: "Scripts may only be loaded from..." error**

**Solution:**
Don't open the file directly from your file system. Instead:
1. Upload to a server (like GitHub Pages)
2. Or use a local development server
3. Or just open normally (should work for most users)

### Firefox Problems

**Problem: Enhanced Tracking Protection blocks SQL.js**

**Solution:**
1. Click shield icon in address bar
2. Turn off Enhanced Tracking Protection for this site
3. Refresh the page

### Safari Problems

**Problem: SQL.js doesn't load**

**Solution:**
Safari sometimes has issues with WebAssembly:
1. Make sure Safari is updated (latest version)
2. Try Chrome or Firefox instead

### Internet Explorer Problems

**Problem: Nothing works**

**Solution:**
Internet Explorer is outdated and not supported.
- Use Chrome, Firefox, Edge, or Safari instead

---

## Performance Issues

### Problem: Page loads very slowly

**Common causes:**
1. Slow internet connection
2. SQL.js CDN is slow
3. Too many browser tabs open

**Solutions:**
1. Close other tabs
2. Check internet speed
3. Be patient (SQL.js is ~1MB, takes time on slow connections)
4. Ask teacher for offline version if problem persists

### Problem: Browser freezes when running query

**Common causes:**
Very complex query or infinite loop

**Solutions:**
1. Wait 10-15 seconds (might just be slow)
2. Close the tab if it doesn't respond
3. Reopen the page
4. Simplify your query

---

## Getting Help

### Before Asking for Help

Collect this information:
1. What were you trying to do?
2. What did you expect to happen?
3. What actually happened?
4. Any error messages (copy exactly, or screenshot)
5. Which browser and version? (Help → About)
6. Did it work before, or is this the first time?

### How to Ask Your Teacher

Good question format:
"I'm trying to [what you want to do]. I wrote this query: [your query]. But I'm getting this error: [error message]. What does this mean?"

Less helpful:
"It doesn't work"
"I don't get it"
"My computer is broken"

### How to Share Your Screen

If asking for help remotely:
1. Take a screenshot (Print Screen or Snipping Tool)
2. Or describe exactly what you see
3. Copy and paste error messages
4. Share the query you tried

---

## Preventive Tips

**To avoid problems:**
1. Keep all files in the same folder
2. Don't rename files
3. Save your queries in a text file (database resets!)
4. Always use WHERE with UPDATE/DELETE
5. Test queries on SELECT before using UPDATE/DELETE
6. Read error messages carefully
7. Use the hints in exercises
8. Click "Reset Database" if you mess up

**Good habits:**
- Save your work regularly (copy queries to text file)
- Test small changes one at a time
- Read error messages before asking for help
- Use the example buttons to see correct syntax

---

## Still Stuck?

If none of these solutions work:

1. **Ask your teacher** - They might know about specific issues with your school setup
2. **Try a different computer** - Sometimes it's a specific machine issue
3. **Pair up with a classmate** - See if it works on their computer
4. **Use incognito mode** - Sometimes browser extensions cause problems

Remember: Every problem is solvable! Don't give up. Learning includes troubleshooting.
