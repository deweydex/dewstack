# Sample Lesson Plan: Irish Tax Simulator

## Course: Introduction to Web Development
## Duration: 8-10 class sessions (50 minutes each)
## Level: Beginner to Intermediate

---

## Learning Objectives

By the end of this unit, students will be able to:
1. Explain the structure of an HTML document
2. Apply CSS styling to control webpage appearance
3. Write JavaScript functions to perform calculations
4. Manipulate the DOM to create interactive features
5. Debug code using browser developer tools
6. Understand progressive taxation concepts
7. Analyze data and draw conclusions from visualizations

---

## Session 1: Introduction & Setup (50 min)

### Objectives:
- Understand project goals
- Set up development environment
- Explore the working application

### Activities:

**Warm-up (5 min)**
- Show the finished simulator
- Ask: "How do you think this works?"
- Discuss what makes websites interactive

**Setup (15 min)**
- Distribute project files
- Install/verify text editor (VS Code)
- Open index.html in browser
- Verify everyone can see the page

**Exploration (20 min)**
- Students experiment with sliders
- Discussion prompts:
  - "What happens when you move this slider?"
  - "Why does the chart change?"
  - "What's the difference between the two lines?"
- Introduce key terms: brackets, rates, credits

**Code Preview (10 min)**
- Open each file briefly
- Show how they connect
- Point out comments
- Assign homework: Read README.md

**Homework:**
- Read the README.md
- Come with 3 questions about how it works
- Try the Quick Start guide

---

## Session 2: HTML Structure (50 min)

### Objectives:
- Understand HTML tags and attributes
- Identify semantic HTML elements
- Modify HTML content

### Activities:

**Review (5 min)**
- Answer homework questions
- Quick recap of HTML basics

**Code Walkthrough (15 min)**
- Open index.html together
- Explain each section:
  - DOCTYPE and head
  - Header section
  - Container structure
  - Slider groups
  - Canvas elements
- Draw connection diagram on board

**Hands-on Exercise 1 (15 min)**
- Change the page title
- Modify header text
- Add your name in a new paragraph
- Change button text

**Hands-on Exercise 2 (10 min)**
- Add a new slider (copy existing one)
- Change ID and label
- Save and refresh

**Wrap-up (5 min)**
- Share interesting changes
- Preview CSS for next session

**Homework:**
- Complete HTML modification worksheet
- Read CSS section of README
- Identify 3 CSS properties in styles.css

---

## Session 3: CSS Fundamentals (50 min)

### Objectives:
- Understand CSS syntax
- Apply colors, fonts, and spacing
- Use browser inspector

### Activities:

**CSS Basics Lecture (10 min)**
- Selectors, properties, values
- Box model demonstration
- Show browser inspector

**Inspector Exercise (10 min)**
- Students open dev tools (F12)
- Find header element
- Change styles live in inspector
- Notice changes don't persist

**Hands-on Exercise 1 (15 min)**
- Change header background color
- Modify button color
- Adjust font sizes
- Change container width

**Hands-on Exercise 2 (10 min)**
- Add rounded corners
- Create hover effect
- Adjust spacing

**Gallery Walk (5 min)**
- Students show their styled pages
- Vote on favorite design

**Homework:**
- Complete CSS styling challenges
- Customize your version
- Screenshot your design

---

## Session 4: JavaScript Basics (50 min)

### Objectives:
- Understand variables and data types
- Read and trace simple functions
- Use console.log for debugging

### Activities:

**JavaScript Introduction (10 min)**
- What is JavaScript?
- Variables: const, let
- Data types: numbers, strings, arrays

**Code Reading Exercise (15 min)**
- Open script.js
- Look at incomeBands data
- Trace through calculateUSC() together
- Add console.log statements

**Console Exploration (10 min)**
- Open browser console
- Type basic commands:
  ```javascript
  console.log("Hello!");
  let x = 5;
  console.log(x * 2);
  ```
- View existing console logs in simulator

**Debugging Practice (10 min)**
- Intentionally break something
- Use console to find error
- Fix the error together

**Wrap-up (5 min)**
- Explain next session: writing functions

**Homework:**
- JavaScript variables worksheet
- Read function documentation in code
- Write down 3 questions about the code

---

## Session 5: Functions & Calculations (50 min)

### Objectives:
- Understand function parameters and returns
- Trace through tax calculations
- Modify existing functions

### Activities:

**Functions Lecture (10 min)**
- Anatomy of a function
- Parameters vs arguments
- Return values
- Example on board

**Walkthrough: calculateIncomeTax() (15 min)**
- Line-by-line explanation
- Draw diagram of brackets
- Trace with example: €50,000 income
- Students calculate on paper first

**Exercise 1: Average Tax (15 min)**
- Uncomment calculateAverageTaxPerPerson()
- Add display to HTML
- Call from recalculateAll()
- Test and verify

**Exercise 2: Modify Calculation (5 min)**
- Change USC_EXEMPTION value
- See what happens
- Discuss real-world implications

**Wrap-up (5 min)**
- Function best practices
- Preview DOM manipulation

**Homework:**
- Complete median tax rate function
- Test with different scenarios
- Document what you learned

---

## Session 6: DOM Manipulation & Events (50 min)

### Objectives:
- Select elements with getElementById
- Change content with innerText
- Respond to events

### Activities:

**DOM Lecture (10 min)**
- What is the DOM?
- Document object model tree
- Selecting elements

**Live Coding Demo (15 min)**
- Create simple HTML page together
- Add button
- Write onclick function
- Change text when clicked

**Simulator Code Analysis (10 min)**
- Find event listeners in code
- Trace what happens on slider change
- Follow recalculateAll() flow

**Exercise: Add Feature (10 min)**
- Add a new display element
- Show additional statistic
- Update on slider change

**Testing & Debugging (5 min)**
- Common issues
- Using console.log
- Reading error messages

**Homework:**
- Complete comparison feature
- Add at least one new display element
- Prepare to present your feature

---

## Session 7: Charts & Visualization (50 min)

### Objectives:
- Understand Chart.js basics
- Modify existing charts
- Create a new chart

### Activities:

**Chart.js Introduction (10 min)**
- What is Chart.js?
- Types of charts
- Chart configuration

**Code Walkthrough (15 min)**
- Find chart initialization
- Explain data structure
- Show how updates work
- Modify chart colors together

**Exercise 1: Customize Charts (10 min)**
- Change bar colors
- Modify axis labels
- Add title
- Adjust size

**Exercise 2: New Chart (10 min)**
- Use revenue by band function
- Create bar chart
- Add to HTML
- Display in UI

**Showcase (5 min)**
- Students show their charts
- Discuss effectiveness of visualization

**Homework:**
- Research another chart type
- Propose what data it could show
- Sketch design on paper

---

## Session 8: Project Completion & Presentation (50 min)

### Objectives:
- Complete chosen features
- Present work to class
- Reflect on learning

### Activities:

**Work Time (20 min)**
- Finish implementing features
- Test thoroughly
- Debug issues
- Document code

**Presentations (25 min)**
- Each student (or group) presents:
  - What feature they added
  - Challenges they faced
  - How they solved them
  - Demo the feature
- 2-3 minutes each

**Reflection & Discussion (5 min)**
- What was hardest?
- What was most interesting?
- How would you improve the project?
- What would you build next?

**Homework:**
- Write reflection essay
- Submit final code
- Complete peer evaluation

---

## Assessment Methods

### Formative Assessment (Ongoing):
- **Code reviews** - Check progress each session
- **Question quality** - Are students asking good questions?
- **Debugging process** - How do they approach problems?
- **Peer helping** - Can they explain to others?

### Summative Assessment:
- **Final project** (40%) - Working code with new features
- **Presentation** (20%) - Clear explanation and demo
- **Code quality** (20%) - Comments, style, organization
- **Reflection** (10%) - Understanding of concepts
- **Peer evaluation** (10%) - Contribution to group learning

---

## Differentiation Strategies

### For Struggling Students:
- **Pair programming** - Partner with stronger student
- **Simplified exercises** - Focus on CSS modifications only
- **Templates** - Provide more complete code to modify
- **Extra support** - Office hours or tutorial sessions
- **Visual aids** - Flowcharts, diagrams, annotated screenshots

### For Advanced Students:
- **Extension challenges** - All advanced exercises
- **Open-ended project** - Design your own feature
- **Help others** - Become teaching assistant
- **Research task** - Explore new libraries or techniques
- **Optimization** - Make code faster or more elegant

### For ELL Students:
- **Vocabulary list** - Define technical terms
- **Visual demonstrations** - Show, don't just tell
- **Peer translation** - Partner with bilingual student
- **Written instructions** - Supplement verbal directions
- **Extra processing time** - Allow more time for exercises

---

## Required Materials

### Technology:
- Computer lab with internet access
- Modern web browser (Chrome/Firefox)
- Text editor (VS Code recommended)
- Projector for demonstrations

### Handouts:
- Project files (USB or cloud)
- README.md printed reference
- Quick Start guide
- Exercise worksheets
- Assessment rubric

---

## Extension Activities

### For Additional Sessions:

**Session 9: Responsive Design**
- Media queries
- Mobile-first approach
- Test on different devices
- Touch interaction considerations

**Session 10: Version Control**
- Introduction to Git
- Creating repositories
- Committing changes
- Collaboration with branches

**Session 11: Data Analysis**
- Calculate additional statistics
- Export data to CSV
- Create summary report
- Present findings

**Session 12: Comparison Project**
- Research another country's tax system
- Add to simulator
- Compare systems
- Discuss policy implications

---

## Troubleshooting Guide

### Common Technical Issues:

**"My page is blank"**
- Check all files in same folder
- Verify file names match exactly
- Look at browser console for errors
- Try hard refresh (Ctrl+Shift+R)

**"Charts not showing"**
- Check internet connection (CDN)
- Verify canvas IDs match JavaScript
- Look for JavaScript errors
- Check Chart.js version

**"Sliders don't work"**
- Verify event listeners attached
- Check function names
- Look for typos in IDs
- Ensure JavaScript loads (defer attribute)

**"CSS not applying"**
- Check link tag in HTML
- Verify CSS file name
- Look for syntax errors (missing semicolons)
- Clear browser cache

---

## Parent/Guardian Communication

**Sample Email:**

Subject: Web Development Unit - Irish Tax Simulator

Dear Parents/Guardians,

We're beginning an exciting web development unit where students will learn HTML, CSS, and JavaScript by exploring the Irish tax system through an interactive simulator.

Students will:
- Build and customize a real web application
- Learn programming fundamentals
- Understand data visualization
- Explore economics and public policy

**What you can do at home:**
- Ask your student to show you their simulator
- Discuss how taxes work in your household
- Encourage experimentation - it's okay to break things!
- Celebrate their progress

**Resources:**
The project includes comprehensive documentation and exercises at different skill levels. All work is saved in [shared folder location].

**Questions?** Email me at [your email]

Best regards,
[Your Name]

---

## Standards Alignment

### Computer Science Standards:
- **Algorithms & Programming**: Writing and calling functions
- **Data & Analysis**: Processing and visualizing data
- **Computing Systems**: Understanding web architecture
- **Impacts of Computing**: Discussing tax policy implications

### Math Standards:
- **Percentages & Ratios**: Tax rate calculations
- **Functions**: Input-output relationships
- **Data Analysis**: Interpreting charts and statistics
- **Applied Mathematics**: Real-world problem solving

### Literacy Standards:
- **Technical Reading**: Understanding documentation
- **Technical Writing**: Commenting code, documentation
- **Presentation Skills**: Explaining technical concepts
- **Critical Thinking**: Analyzing trade-offs in tax policy

---

## Success Metrics

### Quantitative Indicators:
- 90%+ of students can create basic HTML page
- 80%+ can apply CSS styling
- 70%+ can write simple JavaScript functions
- 60%+ complete at least one advanced exercise
- 100% submit working final project

### Qualitative Indicators:
- Students demonstrate curiosity and experimentation
- Code is well-commented and organized
- Students can explain their work clearly
- Positive attitude toward programming
- Evidence of problem-solving process

---

## Future Iterations

### Ideas for Next Year:
- Create video tutorials for each session
- Build a class gallery of student versions
- Invite guest speaker (developer or economist)
- Connect with civics class for cross-curricular project
- Add unit on accessibility (screen readers, keyboard navigation)
- Explore backend development (saving scenarios to database)

---

## Additional Resources

### For Teachers:
- MDN Web Docs Teacher Resources
- Code.org curriculum materials
- CS Unplugged activities
- Teaching coding without computers

### For Students:
- FreeCodeCamp interactive lessons
- Codecademy web development track
- YouTube coding tutorials
- Local coding clubs or competitions

---

## Reflection Questions

### For Students:
1. What surprised you about building a website?
2. Which was hardest: HTML, CSS, or JavaScript? Why?
3. How did you debug when something didn't work?
4. What would you build next with these skills?
5. Did this change how you think about taxes?

### For Teachers:
1. What worked well in this unit?
2. Where did students struggle most?
3. How can I better support diverse learners?
4. What would I change for next time?
5. How can I assess learning more effectively?

---

This lesson plan is a starting point - adapt it to your context, student needs, and time constraints. The key is hands-on practice and celebrating incremental progress!
