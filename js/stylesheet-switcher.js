/* 
    Stylesheet Switcher Functionality
    
    This script handles switching between different CSS themes/stylesheets.
    It demonstrates how CSS can completely transform a page's appearance
    without changing any HTML content - showcasing the separation of
    structure (HTML) and presentation (CSS).
    
    Students can learn:
    - How to dynamically load/swap stylesheets
    - Using localStorage to remember user preferences
    - DOM manipulation to modify link elements
    - Event handling for interactive UI components
*/

document.addEventListener('DOMContentLoaded', () => {
    // Theme configurations - each theme has a name, stylesheet path, and description
    const themes = {
        default: {
            name: 'Default',
            stylesheet: null, // No additional stylesheet for default
            changes: ['Clean, modern design', 'Blue primary color', 'Sans-serif fonts', 'Subtle shadows']
        },
        classic: {
            name: 'Classic',
            stylesheet: '../css/themes/classic.css',
            changes: ['Warm brown color palette', 'Serif fonts (Georgia)', 'Traditional styling', 'Increased spacing']
        },
        dark: {
            name: 'Dark Mode',
            stylesheet: '../css/themes/dark.css',
            changes: ['Dark background', 'Light text', 'High contrast', 'Modern dark theme']
        },
        colorful: {
            name: 'Colorful',
            stylesheet: '../css/themes/colorful.css',
            changes: ['Vibrant pink/purple colors', 'Playful fonts', 'Bold borders', 'Gradient backgrounds']
        }
    };
    
    // Get or create the stylesheet switcher element
    let switcher = document.querySelector('.stylesheet-switcher');
    if (!switcher) {
        // Create the switcher if it doesn't exist
        switcher = createSwitcherElement();
        document.body.appendChild(switcher);
    }
    
    // Get the theme selector and content
    const themeOptions = switcher.querySelector('.theme-options');
    const changeIndicators = switcher.querySelector('.change-indicators');
    const changeList = switcher.querySelector('.change-list');
    const switcherToggles = switcher.querySelectorAll('.switcher-toggle');
    
    // Create theme buttons
    Object.keys(themes).forEach(themeKey => {
        const theme = themes[themeKey];
        const button = document.createElement('button');
        button.className = 'theme-button';
        button.textContent = theme.name;
        button.setAttribute('data-theme', themeKey);
        button.addEventListener('click', () => switchTheme(themeKey));
        themeOptions.appendChild(button);
    });
    
    // Toggle switcher expanded/collapsed state for all toggle buttons
    switcherToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            switcher.classList.toggle('expanded');
            switcher.classList.toggle('collapsed');
        });
    });
    
    // Function to switch themes
    function switchTheme(themeKey) {
        const theme = themes[themeKey];
        
        // Remove existing theme stylesheet
        const existingThemeLink = document.querySelector('link[data-theme-stylesheet]');
        if (existingThemeLink) {
            existingThemeLink.remove();
        }
        
        // Add new theme stylesheet if not default
        if (theme.stylesheet) {
            // Determine correct path based on current page location
            const currentPath = window.location.pathname;
            const isLessonPage = currentPath.includes('/lessons/');
            const stylesheetPath = isLessonPage ? theme.stylesheet : theme.stylesheet.replace('../', '');
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = stylesheetPath;
            link.setAttribute('data-theme-stylesheet', 'true');
            document.head.appendChild(link);
        }
        
        // Update active button
        themeOptions.querySelectorAll('.theme-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === themeKey) {
                btn.classList.add('active');
            }
        });
        
        // Update change indicators
        updateChangeIndicators(theme);
        
        // Save preference to localStorage
        localStorage.setItem('preferred-theme', themeKey);
        
        // Update page title to show current theme
        updatePageTitle(theme.name);
    }
    
    // Function to update change indicators
    function updateChangeIndicators(theme) {
        changeList.innerHTML = '';
        theme.changes.forEach(change => {
            const li = document.createElement('li');
            li.textContent = change;
            changeList.appendChild(li);
        });
    }
    
    // Function to update page title
    function updatePageTitle(themeName) {
        const title = document.querySelector('title');
        if (title && !title.textContent.includes('(')) {
            const baseTitle = title.textContent.split(' - ')[0] || title.textContent;
            title.textContent = `${baseTitle} (${themeName} Theme)`;
        }
    }
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme && themes[savedTheme]) {
        switchTheme(savedTheme);
    } else {
        // Set default as active
        themeOptions.querySelector('[data-theme="default"]')?.classList.add('active');
        updateChangeIndicators(themes.default);
    }
    
    // Function to create switcher HTML element
    function createSwitcherElement() {
        const div = document.createElement('div');
        div.className = 'stylesheet-switcher collapsed';
        div.innerHTML = `
            <button class="switcher-toggle" aria-label="Toggle theme switcher">🎨</button>
            <div class="switcher-content">
                <div class="switcher-header">
                    <div>
                        <h3 class="switcher-title">CSS Theme Switcher</h3>
                        <p class="switcher-subtitle">Change styles without changing HTML!</p>
                    </div>
                    <button class="switcher-toggle" aria-label="Close theme switcher">✕</button>
                </div>
                <div class="theme-options"></div>
                <div class="change-indicators">
                    <strong>What's changing:</strong>
                    <ul class="change-list"></ul>
                </div>
            </div>
        `;
        return div;
    }
});

