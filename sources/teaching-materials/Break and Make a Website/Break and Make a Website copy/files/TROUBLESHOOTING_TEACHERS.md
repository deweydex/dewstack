# Troubleshooting Guide for Teachers

This guide helps you diagnose and fix issues students encounter, plus solutions to deployment and classroom management challenges.

## Quick Reference

**Common Student Issues:**
- Database won't load → Check internet/firewall
- SQL syntax errors → Review error message patterns
- CSS not loading → Verify file structure
- Buttons don't work → Check JavaScript console

**Deployment Issues:**
- GitHub Pages not working → Verify settings and wait time
- Updates not showing → Clear cache, check commit history
- Files missing → Verify upload, check repository

---

## Student Computer Issues

### Database Won't Initialize

**Symptoms:**
- Status shows "Initializing database..." indefinitely
- Red error message appears
- Students report blank query results area

**Diagnostic steps:**

1. **Check Browser Console** (most important!)
   - Have student press F12
   - Look at Console tab
   - Red errors will point to the issue

2. **Verify Internet Connection**
   - SQL.js loads from cdnjs.cloudflare.com (about 1MB)
   - Test by visiting https://cdnjs.cloudflare.com in browser
   - Slow connections may timeout

3. **Check School Firewall**
   - IT departments often block CDN domains
   - Contact IT to whitelist: cdnjs.cloudflare.com
   - Or provide offline version (instructions below)

4. **Browser Compatibility**
   - Requires WebAssembly support
   - Chrome 57+, Firefox 52+, Safari 11+, Edge 16+
   - Internet Explorer NOT supported

**Solutions:**

**For Firewall Issues:**
Option 1: Ask IT to whitelist cdnjs.cloudflare.com

Option 2: Self-host SQL.js
```html
<!-- In index.html, replace the CDN script tag with: -->
<script src="sql-wasm.js"></script>
<!-- Download sql-wasm.js and sql-wasm.wasm from sql.js GitHub -->
<!-- Place in same directory as index.html -->
```

Option 3: Use different CDN
```html
<script src="https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.js"></script>
```

**For Slow Connections:**
Add loading indicator, increase timeout, or provide offline labs

### SQL Query Errors - Pattern Recognition

**Error Pattern 1: "no such table"**
```
Error: no such table: student
```
**Cause:** Typo in table name (forgot 's' in 'students')
**Student fix:** Check spelling - tables are `students` and `courses`

**Error Pattern 2: "no such column"**
```
Error: no such column: grades
```
**Cause:** Column name wrong (it's `grade` not `grades`)
**Student fix:** Use `SELECT * FROM students;` to see column names

**Error Pattern 3: "near WHERE: syntax error"**
```
Error: near "WHERE": syntax error
```
**Cause:** Missing SELECT or FROM before WHERE
**Student fix:** Full query needs: `SELECT ... FROM ... WHERE ...`

**Error Pattern 4: "unrecognized token"**
```
Error: unrecognized token: "Alice"
```
**Cause:** Using double quotes instead of single quotes, or no quotes
**Student fix:** Use single quotes: `'Alice'` not `"Alice"` or `Alice`

**Error Pattern 5: Silent failure (no error, no results)**
**Cause:** WHERE condition too strict or wrong
**Student fix:** Test with simpler WHERE or remove WHERE entirely

**Teaching tip:** Have students read error messages aloud. Often they self-diagnose while explaining.

### CSS Not Loading

**Symptoms:**
- Page is unstyled (black text on white)
- No colors, no formatting
- Looks like plain HTML

**Diagnostic steps:**

1. **Check Browser Console**
   - F12 → Console tab
   - Look for: "Failed to load resource: styles.css"

2. **Verify File Structure**
   - All files must be in same directory
   - Case-sensitive on some systems (styles.css not Styles.css)

3. **Check HTML Link Tag**
   ```html
   <link rel="stylesheet" href="styles.css">
   ```
   - Must be in <head> section
   - Path must be correct

**Solutions:**

1. **Files in wrong location**
   - Move all files to same folder
   - No subdirectories

2. **Browser cache**
   - Hard refresh: Ctrl+Shift+R
   - Or clear browser cache
   - Or use incognito mode

3. **File extension hidden**
   - Windows might hide .css extension
   - File might actually be "styles.css.txt"
   - Change Windows settings to show file extensions

### JavaScript Not Working

**Symptoms:**
- Buttons don't respond
- Example queries don't load
- Can't run queries

**Diagnostic steps:**

1. **Check Browser Console**
   - Look for JavaScript errors
   - Common: "Uncaught ReferenceError"
   - Common: "executeQuery is not defined"

2. **Verify tutorial.js is loaded**
   - F12 → Sources tab
   - Look for tutorial.js in file list

3. **Check if JavaScript is disabled**
   - Some schools disable JavaScript
   - Browser settings → JavaScript → Enabled

**Solutions:**

1. **File missing or misnamed**
   - Ensure tutorial.js in same folder
   - Check spelling (case-sensitive)

2. **Script tag incorrect**
   ```html
   <!-- Should be at end of body: -->
   <script src="tutorial.js"></script>
   ```

3. **Browser restrictions**
   - Some browsers block local scripts
   - Deploy to GitHub Pages instead
   - Or use local server

---

## Classroom Management Issues

### Different Students, Different Paces

**Challenge:**
Some students finish in 20 minutes, others need 2 hours

**Solutions:**

1. **Bonus Exercises**
   - See bonus exercises file for advanced challenges
   - Have fast students help slower students (peer teaching)
   - Introduce JOINs or subqueries to advanced students

2. **Differentiated Checkpoints**
   - Minimum: Complete exercises 1-3
   - Expected: Complete exercises 1-5
   - Advanced: Complete all + bonus exercises

3. **Flexible Grouping**
   - Pair fast finishers to work on challenges
   - Give struggling students more scaffolding
   - Allow self-paced progression

### Students Copy Without Understanding

**Challenge:**
Students copy solutions without learning concepts

**Prevention strategies:**

1. **Require Explanations**
   - "Explain what this query does line by line"
   - "What would happen if we changed > to <?"
   - Have students explain to partner before submitting

2. **Modified Exercises**
   - Change the exercise slightly for each student
   - "Find students over age 21" vs "over age 19"
   - Same concept, different implementation

3. **Live Demonstrations**
   - Call on students to demonstrate at front
   - Random selection keeps everyone engaged
   - Build positive classroom culture around mistakes

4. **Process Over Product**
   - Grade on explanation, not just correct answer
   - Give points for showing work/thinking
   - Value attempted solutions with good reasoning

### Limited Computer Access

**Challenge:**
Not enough computers, or computer lab time limited

**Solutions:**

1. **Pair Programming**
   - Two students per computer
   - Rotate driver/navigator every 10 minutes
   - Both names on submission

2. **Demonstration Mode**
   - Project your screen
   - Type what students suggest
   - Discuss results together

3. **Homework Access**
   - Deploy to GitHub Pages for 24/7 access
   - Students work on personal devices at home
   - Library computers during free periods

4. **Paper Exercises**
   - Print exercises
   - Students write queries on paper
   - Check work during next lab session

### Students Afraid to Experiment

**Challenge:**
Students scared to try things, fear breaking something

**Strategies:**

1. **Emphasize Reset Button**
   - "You cannot permanently break this"
   - "Click Reset Database to start over"
   - Demonstrate intentionally "breaking" something

2. **Celebrate Productive Failures**
   - "Good error messages teach us!"
   - "Who got an interesting error today?"
   - Share your own mistakes

3. **Scaffolded Risk-Taking**
   - Start with: "Try changing this number"
   - Then: "Add your own WHERE clause"
   - Finally: "Write query from scratch"

4. **Sandbox Time**
   - Give 10 minutes of "experiment time"
   - No grades, no pressure
   - Share cool discoveries

---

## Deployment Issues

### GitHub Pages Not Loading

**Symptoms:**
- 404 error when visiting site
- "Page not found"
- Site worked before, doesn't now

**Diagnostic steps:**

1. **Check Pages is Enabled**
   - Repository → Settings → Pages
   - Source should show: "main" branch, "/ (root)" folder
   - Should show: "Your site is live at..."

2. **Verify URL**
   - Correct format: `https://USERNAME.github.io/REPO-NAME/`
   - Check capitalization (case-sensitive)
   - Include trailing slash

3. **Check Build Status**
   - Repository → Actions tab
   - Should show green checkmark for latest deployment
   - If red X, click to see error details

4. **Wait Time**
   - Initial deployment: up to 10 minutes
   - Updates: 2-5 minutes
   - Be patient!

**Solutions:**

1. **Rebuild Pages**
   - Settings → Pages
   - Change source to "None", save
   - Wait 30 seconds
   - Change source back to "main", save

2. **Check File Names**
   - Must be exactly: index.html (lowercase)
   - Not: Index.html or home.html

3. **Verify Repository is Public**
   - Private repositories need GitHub Pro for Pages
   - Settings → General → Change visibility

### Updates Not Showing

**Symptoms:**
- Pushed changes to GitHub
- Site still shows old version

**Solutions:**

1. **Clear Your Cache**
   - Hard refresh: Ctrl+Shift+R
   - Or use incognito mode
   - GitHub Pages uses aggressive caching

2. **Verify Commit Went Through**
   - Check repository file list
   - Click on file, view recent changes
   - Make sure your edit is there

3. **Check Build Completed**
   - Actions tab → Should show completed build
   - If pending, wait for completion

4. **Wait Longer**
   - Sometimes takes 5-10 minutes
   - Be patient

### Files Missing After Upload

**Symptoms:**
- Uploaded files but some are missing
- Repository shows incomplete file list

**Solutions:**

1. **Check File Names**
   - No spaces in file names
   - Use lowercase
   - Watch for hidden extensions

2. **Upload One at a Time**
   - Large bulk uploads sometimes fail
   - Upload each file individually

3. **Check File Size**
   - GitHub has 100MB file limit
   - (This tutorial files are tiny, not an issue)

---

## Content/Pedagogical Issues

### Exercises Too Easy or Too Hard

**Too Easy?**
- Add bonus exercises from supplementary material
- Introduce JOINs (multiple tables)
- Have students create their own tables
- Challenge: "Design a database for X"

**Too Hard?**
- Break exercises into smaller steps
- Provide more hints
- Do first exercise together as class
- Allow open-note/open-book approach

### Students Don't Understand Error Messages

**Teaching strategy:**

1. **Error Message Deconstruction**
   - Write error on board
   - Break down each part
   - "What does 'no such table' tell us?"

2. **Error Message Game**
   - Intentionally cause errors
   - Students diagnose cause
   - Points for correct diagnosis

3. **Error Dictionary**
   - Create class reference sheet
   - Common errors and meanings
   - Students add to it as they discover

### Concept Not Sticking

**HTML not sticking?**
- Use paper to draw box model
- Build with blocks/LEGO (physical nesting)
- Play "HTML tag" game (human elements)

**CSS not sticking?**
- Use fashion design analogy (style the model)
- DevTools live editing (see immediate results)
- Create terrible designs on purpose (learn what not to do)

**SQL not sticking?**
- Use filing cabinet analogy (drawer=table, folder=row)
- Physical database (index cards)
- Real-world examples (Netflix: users table, shows table)

---

## Assessment Issues

### Grading Takes Too Long

**Solutions:**

1. **Rubric-Based Grading**
   - Use provided rubric
   - Focus on understanding, not perfection
   - Assign point values to each criterion

2. **Self-Assessment**
   - Students grade their own work first
   - You verify and adjust
   - Builds metacognition

3. **Peer Review**
   - Partners check each other's work
   - Discuss reasoning
   - You spot-check

4. **Completion-Based**
   - Full credit for reasonable attempt + reflection
   - Reserve detailed grading for projects

### Detecting Copy-Paste

**Signs of copying:**
- All students have identical queries
- Advanced syntax not taught yet
- Can't explain their own code

**Prevention:**
- Walk around during lab time
- Ask students to explain queries
- Small variations in exercises
- Focus on process over product

**Response:**
- Talk to student privately
- Have them explain query line-by-line
- If they can explain, they learned (goal achieved)
- If they can't, have them redo with support

---

## Technical Debt / Future Improvements

### Adding Features

**Want to add JOIN exercises?**
```javascript
// In tutorial.js, create enrollment table:
const createEnrollmentTable = `
    CREATE TABLE enrollments (
        student_id INTEGER,
        course_id INTEGER
    );
`;
db.run(createEnrollmentTable);

// Add sample enrollments
const enrollments = [
    { student_id: 1, course_id: 1 },
    { student_id: 1, course_id: 2 },
    // etc...
];
```

**Want to add more sample data?**
Edit the `students` and `courses` arrays in tutorial.js

**Want to add validation?**
Modify the `executeQuery()` function to check for dangerous patterns

### Offline Version

For schools with no internet:

1. **Download SQL.js**
   - Visit https://github.com/sql-js/sql.js/releases
   - Download sql-wasm.js and sql-wasm.wasm
   - Place in same folder as HTML files

2. **Update index.html**
   ```html
   <!-- Replace CDN script with: -->
   <script src="sql-wasm.js"></script>
   ```

3. **Distribute via:**
   - USB drives
   - Network share
   - School server

### Tracking Student Progress

**Option 1: Manual Tracking**
- Observation during lab
- Exit tickets
- Check completion at end of class

**Option 2: LMS Integration**
- Embed in Canvas/Blackboard as external tool
- Link from LMS for tracking access

**Option 3: Add Logging** (Advanced)
```javascript
// Add to tutorial.js
function logQueryAttempt(query, success) {
    // Send to your server
    // Or save to localStorage
    // Or display to teacher dashboard
}
```

---

## Getting Help

### When to Contact IT

Contact your school IT if:
- SQL.js won't load (firewall issue)
- All students having same problem (network issue)
- Need to whitelist domains
- Need to install on school computers

### External Resources

**SQL.js Issues:**
- GitHub: https://github.com/sql-js/sql.js
- Documentation: https://sql.js.org

**GitHub Pages Issues:**
- Docs: https://docs.github.com/en/pages
- Community: https://github.community

**Teaching Strategies:**
- CS education communities (CSTA, CS4All)
- Stack Overflow for technical questions
- Education technology forums

---

## Quick Solutions Reference

| Problem | Quick Fix |
|---------|-----------|
| Database won't load | Check internet, try different browser |
| SQL syntax error | Read error message, check quotes/spelling |
| CSS not showing | Hard refresh (Ctrl+Shift+R) |
| Buttons don't work | Check console, verify tutorial.js exists |
| GitHub Pages 404 | Wait 10 minutes, verify Settings→Pages enabled |
| Updates not showing | Clear cache, wait 5 minutes |
| Students stuck | Point to hint, ask guiding questions |
| Too fast/slow | Bonus exercises or additional scaffolding |
| Copy-paste | Ask students to explain query |

---

## Prevention Checklist

**Before Class:**
- [ ] Test tutorial on school computers
- [ ] Verify internet access to CDN
- [ ] Have offline version ready (if needed)
- [ ] Print troubleshooting guide for students
- [ ] Prepare bonus exercises for fast finishers

**During Class:**
- [ ] Demonstrate reset button early
- [ ] Show how to read error messages
- [ ] Walk around monitoring progress
- [ ] Check in with struggling students
- [ ] Celebrate good errors/questions

**After Class:**
- [ ] Note which exercises caused confusion
- [ ] Save example student queries (good and bad)
- [ ] Update teaching notes
- [ ] Plan adjustments for next time

Remember: Most "problems" are learning opportunities. Students struggling with errors are learning valuable debugging skills!
