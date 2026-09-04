# Bonus Exercises: HTML & CSS

These additional exercises focus on HTML structure and CSS styling. They progress from basic to advanced, allowing students to deepen their understanding beyond the core tutorial.

---

## HTML Bonus Exercises

### Exercise H1: Build a Personal Bio Page

**Difficulty:** Beginner

**Objective:** Create a simple HTML page about yourself

**Requirements:**
- Use proper HTML document structure (DOCTYPE, html, head, body)
- Include a title in the head section
- Add at least one h1 heading with your name
- Add at least one h2 heading for a section (like "About Me")
- Write at least two paragraphs about yourself
- Include an unordered list with at least 3 hobbies or interests

**Learning goals:**
- Practice proper HTML structure
- Use heading hierarchy
- Understand lists

**Hint:**
Start with the basic structure from the tutorial, then add content inside the body tags.

**Extension:**
Add links to your favorite websites using the anchor tag.

---

### Exercise H2: Create a Recipe Page

**Difficulty:** Beginner-Intermediate

**Objective:** Mark up a recipe using appropriate HTML elements

**Requirements:**
- Page title and main heading with recipe name
- h2 for "Ingredients" section
- Unordered list for ingredients
- h2 for "Instructions" section
- Ordered list for step-by-step instructions
- At least one paragraph describing the recipe
- Use `<strong>` or `<em>` for emphasis on important words

**Learning goals:**
- Choose appropriate HTML elements for content
- Understand when to use ordered vs unordered lists
- Practice text emphasis

**Hint:**
Think about which type of list makes sense for each section. Should ingredients be numbered? Should instructions be in order?

**Extension:**
Add a table showing nutritional information (calories, protein, etc.)

---

### Exercise H3: Build a Contact Form

**Difficulty:** Intermediate

**Objective:** Create a functional HTML form

**Requirements:**
- Form element with proper structure
- Text input for "Name"
- Email input for "Email Address"
- Textarea for "Message"
- Radio buttons for "How did you hear about us?" (at least 3 options)
- Checkbox for "Subscribe to newsletter"
- Submit button
- All inputs should have proper labels

**Learning goals:**
- Use different form input types
- Understand label-input relationships
- Practice form structure

**Hint:**
Look at the sample form in the tutorial. Each input needs a label with a matching "for" attribute.

**Extension:**
Add a dropdown (select) menu for "Subject" with options like "Question", "Feedback", "Bug Report"

---

### Exercise H4: Create a Navigation Menu

**Difficulty:** Intermediate

**Objective:** Build a navigation bar with links

**Requirements:**
- nav element containing an unordered list
- At least 4 links: Home, About, Services, Contact
- Each link should use an anchor tag with href
- Links can point to "#home", "#about", etc. (placeholder links)
- Wrap the entire menu in a nav element

**Learning goals:**
- Semantic HTML (using nav)
- Lists for navigation
- Anchor tags and href attributes

**Hint:**
```html
<nav>
    <ul>
        <li><a href="#home">Home</a></li>
        <!-- Add more... -->
    </ul>
</nav>
```

**Extension:**
Add nested navigation (dropdown menus) using nested lists.

---

### Exercise H5: Build a Product Card

**Difficulty:** Intermediate-Advanced

**Objective:** Create an HTML structure for an e-commerce product display

**Requirements:**
- Div container for the product card
- h3 for product name
- Image placeholder (use a placeholder service like placeholder.com or just an img tag with alt text)
- Paragraph describing the product
- Price displayed in a span with class "price"
- "Add to Cart" button
- Use semantic elements where appropriate

**Learning goals:**
- Understand div containers
- Practice classes for styling hooks
- Combine multiple HTML elements

**Hint:**
Think about grouping related content in divs. Each product card is one div containing all the product information.

**Extension:**
Create three product cards side by side (you'll need CSS for layout, but HTML structure is the focus).

---

### Exercise H6: Create a Table of Data

**Difficulty:** Intermediate

**Objective:** Display tabular data properly

**Requirements:**
- Table element with proper structure
- thead section with column headers
- tbody section with data rows
- At least 4 columns and 5 rows of data
- Use th for header cells, td for data cells
- Add a caption describing the table

**Example data ideas:**
- Class schedule (Course, Day, Time, Room)
- Sports standings (Team, Wins, Losses, Points)
- Book collection (Title, Author, Year, Genre)

**Learning goals:**
- Proper table structure
- thead vs tbody
- th vs td

**Hint:**
```html
<table>
    <caption>My Table Caption</caption>
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
    </tbody>
</table>
```

**Extension:**
Add a tfoot section with totals or summary information.

---

### Exercise H7: Semantic HTML Challenge

**Difficulty:** Advanced

**Objective:** Restructure a page using semantic HTML5 elements

**Task:**
Take a page that uses only divs and spans, and replace them with semantic elements:
- header for page header
- nav for navigation
- main for main content
- article for independent content pieces
- section for thematic groupings
- aside for sidebar content
- footer for page footer

**Learning goals:**
- Understand semantic HTML
- Know when to use semantic elements vs divs
- Improve accessibility and SEO

**Starting code:**
```html
<div class="header">
    <div class="nav">
        <!-- navigation here -->
    </div>
</div>
<div class="content">
    <div class="post">
        <!-- blog post here -->
    </div>
</div>
<div class="footer">
    <!-- footer here -->
</div>
```

**Transform into:**
Proper semantic HTML using header, nav, main, article, footer, etc.

**Extension:**
Add ARIA labels for improved accessibility.

---

## CSS Bonus Exercises

### Exercise C1: Color Your Page

**Difficulty:** Beginner

**Objective:** Apply colors to HTML elements

**Requirements:**
- Change background color of body
- Change text color of all h1 elements
- Change color of all paragraphs
- Use at least 3 different colors
- Try using color names, hex codes, and rgb values

**Learning goals:**
- Use color property
- Use background-color property
- Different ways to specify colors

**Hint:**
```css
body {
    background-color: lightblue;
}
h1 {
    color: #333333;
}
p {
    color: rgb(100, 100, 100);
}
```

**Extension:**
Use HSL colors and create a color scheme with complementary colors.

---

### Exercise C2: Typography Styling

**Difficulty:** Beginner-Intermediate

**Objective:** Style text appearance

**Requirements:**
- Change font-family for the entire page
- Make all h2 elements bold and italic
- Adjust font-size for paragraphs
- Add letter-spacing to h1 elements
- Change line-height for paragraphs for better readability
- Transform some text to uppercase

**Learning goals:**
- Font properties
- Text properties
- Readability considerations

**Hint:**
```css
body {
    font-family: Arial, sans-serif;
}
h2 {
    font-weight: bold;
    font-style: italic;
}
```

**Extension:**
Use Google Fonts to import a custom font family.

---

### Exercise C3: Master the Box Model

**Difficulty:** Intermediate

**Objective:** Control spacing with margin, padding, and border

**Requirements:**
- Create a div with a visible border
- Add padding inside the div
- Add margin outside the div
- Make the border rounded with border-radius
- Set a specific width and height
- Demonstrate understanding of all four box model properties

**Learning goals:**
- Understand margin vs padding
- Control element spacing
- Border styling

**Hint:**
```css
.box {
    width: 300px;
    height: 200px;
    padding: 20px;
    margin: 10px;
    border: 2px solid black;
    border-radius: 10px;
}
```

**Extension:**
Create three boxes with different padding/margin and explain how they differ.

---

### Exercise C4: Style a Navigation Bar

**Difficulty:** Intermediate

**Objective:** Create a horizontal navigation menu

**Requirements:**
- Remove default list styling (bullets)
- Display list items horizontally (use display: inline or inline-block)
- Style links to look like buttons
- Add hover effect when mouse moves over links
- Add consistent spacing between nav items
- Change link color and remove underline

**Learning goals:**
- Override default styles
- Display property
- Hover pseudo-class
- Link styling

**Hint:**
```css
nav ul {
    list-style: none;
    padding: 0;
}
nav li {
    display: inline-block;
    margin-right: 10px;
}
nav a {
    text-decoration: none;
    padding: 10px;
    background-color: blue;
    color: white;
}
nav a:hover {
    background-color: darkblue;
}
```

**Extension:**
Make the navigation bar sticky (stays at top when scrolling).

---

### Exercise C5: Create a Card Layout

**Difficulty:** Intermediate-Advanced

**Objective:** Design a card component with CSS

**Requirements:**
- Create a card with border and shadow
- Include an image section, title, description, and button
- Add border-radius for rounded corners
- Use box-shadow for depth effect
- Style the button with hover effect
- Control spacing inside the card

**Learning goals:**
- Box-shadow property
- Component design
- Visual hierarchy

**Hint:**
```css
.card {
    width: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    padding: 20px;
}
.card img {
    width: 100%;
    border-radius: 4px;
}
.card button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
}
.card button:hover {
    background-color: #0056b3;
}
```

**Extension:**
Make the card scale up slightly when hovered using transform.

---

### Exercise C6: Responsive Design Basics

**Difficulty:** Advanced

**Objective:** Make content adapt to different screen sizes

**Requirements:**
- Use percentages instead of fixed pixels for widths
- Add a media query that changes layout on small screens
- Make images responsive (max-width: 100%)
- Change navigation from horizontal to vertical on mobile
- Adjust font sizes for different screen sizes

**Learning goals:**
- Media queries
- Responsive units
- Mobile-first thinking

**Hint:**
```css
.container {
    width: 80%;
    max-width: 1200px;
}

img {
    max-width: 100%;
    height: auto;
}

@media (max-width: 768px) {
    nav li {
        display: block;
    }
    h1 {
        font-size: 1.5em;
    }
}
```

**Extension:**
Create three breakpoints (mobile, tablet, desktop) with different layouts.

---

### Exercise C7: Flexbox Layout

**Difficulty:** Advanced

**Objective:** Use Flexbox for flexible layouts

**Requirements:**
- Create a flex container with multiple items
- Center items both horizontally and vertically
- Distribute items evenly across the container
- Make items wrap to next line when needed
- Control the order of flex items
- Make some items grow to fill available space

**Learning goals:**
- display: flex
- justify-content and align-items
- flex-wrap
- flex-grow

**Hint:**
```css
.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}
.flex-item {
    flex: 1;
    margin: 10px;
}
```

**Extension:**
Create a responsive card grid that shows 3 cards per row on desktop, 2 on tablet, 1 on mobile.

---

### Exercise C8: CSS Grid Layout

**Difficulty:** Advanced

**Objective:** Create complex layouts with CSS Grid

**Requirements:**
- Create a grid container with defined columns
- Place items in specific grid areas
- Create a header that spans full width
- Create a sidebar and main content area
- Add a footer that spans full width
- Make the layout responsive

**Learning goals:**
- display: grid
- grid-template-columns
- grid-template-areas
- Responsive grid layouts

**Hint:**
```css
.grid-container {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    gap: 20px;
}
.header {
    grid-area: header;
}
.sidebar {
    grid-area: sidebar;
}
.main {
    grid-area: main;
}
.footer {
    grid-area: footer;
}

@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
        grid-template-areas:
            "header"
            "main"
            "sidebar"
            "footer";
    }
}
```

**Extension:**
Create a photo gallery grid with varying image sizes.

---

### Exercise C9: Animations and Transitions

**Difficulty:** Advanced

**Objective:** Add motion to elements

**Requirements:**
- Create a button that changes color smoothly on hover (transition)
- Make a box slide in from the left when page loads (animation)
- Create a pulsing effect on an element
- Add easing functions to make animations natural
- Control animation duration and delay

**Learning goals:**
- transition property
- @keyframes
- animation property
- Timing functions

**Hint:**
```css
.button {
    background-color: blue;
    transition: background-color 0.3s ease;
}
.button:hover {
    background-color: darkblue;
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

.box {
    animation: slideIn 1s ease-out;
}
```

**Extension:**
Create a loading spinner using only CSS animations.

---

### Exercise C10: Complete Page Makeover

**Difficulty:** Advanced

**Objective:** Apply everything learned to style a complete page

**Requirements:**
- Take an unstyled HTML page and make it beautiful
- Use a color scheme (primary, secondary, accent colors)
- Apply typography hierarchy
- Create a responsive layout
- Add a navigation bar
- Style a form
- Include hover effects
- Use flexbox or grid for layout
- Add subtle animations
- Ensure mobile-friendly design

**Learning goals:**
- Combine all CSS skills
- Design thinking
- User experience

**Challenge:**
Make the page look professional enough to use as a portfolio piece.

**Extension:**
Add a dark mode toggle using CSS variables and JavaScript.

---

## Combined HTML/CSS Projects

### Project 1: Personal Portfolio

**Difficulty:** Intermediate-Advanced

**Objective:** Create a multi-section personal website

**Requirements:**
- HTML: Header, nav, about section, projects section, contact form, footer
- CSS: Responsive layout, styled navigation, card design for projects
- Use semantic HTML
- Mobile-friendly design
- Consistent color scheme

**Time estimate:** 2-3 hours

---

### Project 2: Restaurant Menu

**Difficulty:** Intermediate

**Objective:** Create a styled menu page

**Requirements:**
- HTML: Menu sections (appetizers, entrees, desserts), prices, descriptions
- CSS: Typography for different sections, use of color, grid or flexbox layout
- Images for some items
- Styled prices and descriptions

**Time estimate:** 1-2 hours

---

### Project 3: Blog Layout

**Difficulty:** Advanced

**Objective:** Create a blog homepage layout

**Requirements:**
- HTML: Header, nav, multiple article previews, sidebar, footer
- CSS: Grid layout, responsive design, styled article cards
- Semantic HTML (article, aside, etc.)
- Typography hierarchy
- Responsive images

**Time estimate:** 2-4 hours

---

## Assessment Rubric for Bonus Exercises

### HTML Exercises

**Criteria:**
- Proper HTML structure (DOCTYPE, html, head, body)
- Appropriate use of semantic elements
- Valid HTML (no unclosed tags, proper nesting)
- Meaningful content
- Use of correct elements for purpose

### CSS Exercises

**Criteria:**
- Correct CSS syntax
- Selectors target intended elements
- Properties used appropriately
- Visual design is coherent
- Code is organized and readable

### Advanced Projects

**Additional criteria:**
- Responsive design works on multiple screen sizes
- Consistent design system (colors, typography, spacing)
- User-friendly interface
- Clean, commented code
- Attention to detail

---

## Tips for Teachers

**Scaffolding strategies:**
- Provide HTML starter code for CSS exercises
- Give half-completed examples
- Pair exercises (one student writes HTML, partner writes CSS)

**Differentiation:**
- Allow students to choose exercises matching their interest
- Provide template code for struggling students
- Challenge advanced students with extensions

**Integration ideas:**
- Combine with other subjects (science lab report page, history timeline)
- Connect to student interests (sports stats, gaming site, music playlist)
- Real-world applications (school club page, event poster)

**Assessment approaches:**
- Self-assessment with reflection
- Peer code review
- Portfolio of completed exercises
- Focus on process and learning, not perfection
