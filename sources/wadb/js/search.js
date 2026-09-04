/* 
    Site-Wide Search Functionality
    
    This script provides a simple search feature that searches through
    lesson titles, content, and guides to help students find what they're looking for.
    
    Students can learn how to implement search functionality using JavaScript
    and how to create dynamic content based on user input.
*/

// Search index - built when page loads
let searchIndex = [];

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
    buildSearchIndex();
    setupSearchUI();
});

/**
 * Build search index from all available content
 * This creates a searchable index of lessons, guides, and key concepts
 */
function buildSearchIndex() {
    searchIndex = [
        // Lessons
        {
            title: 'HTML Basics',
            type: 'Lesson',
            url: 'lessons/01-html-basics.html',
            keywords: ['html', 'basics', 'tags', 'elements', 'structure', 'document', 'head', 'body', 'paragraph', 'heading', 'link', 'anchor'],
            description: 'Learn the foundation of web pages: tags, elements, and structure'
        },
        {
            title: 'Semantic HTML',
            type: 'Lesson',
            url: 'lessons/02-html-semantics.html',
            keywords: ['semantic', 'html', 'meaning', 'accessibility', 'article', 'section', 'header', 'footer', 'nav', 'main', 'aside'],
            description: 'Use meaningful tags to create well-structured, accessible pages'
        },
        {
            title: 'CSS Basics',
            type: 'Lesson',
            url: 'lessons/03-css-basics.html',
            keywords: ['css', 'style', 'styling', 'color', 'font', 'background', 'selector', 'property', 'value', 'stylesheet'],
            description: 'Add style and visual appeal to your HTML pages'
        },
        {
            title: 'CSS Layout',
            type: 'Lesson',
            url: 'lessons/04-css-layout.html',
            keywords: ['layout', 'css', 'flexbox', 'grid', 'positioning', 'display', 'float', 'margin', 'padding', 'box model'],
            description: 'Master layout techniques: flexbox, grid, and positioning'
        },
        {
            title: 'Responsive Design',
            type: 'Lesson',
            url: 'lessons/05-responsive-design.html',
            keywords: ['responsive', 'mobile', 'design', 'media query', 'viewport', 'breakpoint', 'mobile-first', 'tablet', 'desktop'],
            description: 'Make your websites look great on all devices'
        },
        {
            title: 'GitHub Setup',
            type: 'Lesson',
            url: 'lessons/06-github-setup.html',
            keywords: ['github', 'setup', 'account', 'repository', 'repo', 'version control', 'git'],
            description: 'Create your GitHub account and first repository'
        },
        {
            title: 'GitHub Workflow',
            type: 'Lesson',
            url: 'lessons/07-github-workflow.html',
            keywords: ['github', 'workflow', 'commit', 'branch', 'pull request', 'push', 'clone', 'fork'],
            description: 'Learn commits, branches, and pull requests'
        },
        {
            title: 'GitHub Pages',
            type: 'Lesson',
            url: 'lessons/08-github-pages.html',
            keywords: ['github pages', 'deploy', 'hosting', 'publish', 'website', 'domain', 'free hosting'],
            description: 'Deploy your website for the world to see'
        },
        
        // Guides
        {
            title: 'Getting Started with GitHub',
            type: 'Guide',
            url: 'github-guides/01-getting-started.html',
            keywords: ['github', 'getting started', 'introduction', 'what is github', 'git vs github'],
            description: 'Create your account and understand the basics'
        },
        {
            title: 'Creating Your First Repository',
            type: 'Guide',
            url: 'github-guides/02-creating-repo.html',
            keywords: ['repository', 'create repo', 'new repository', 'initialize', 'setup'],
            description: 'Learn how to create and initialize a repo'
        },
        {
            title: 'Making Your First Commit',
            type: 'Guide',
            url: 'github-guides/03-first-commit.html',
            keywords: ['commit', 'first commit', 'save', 'version control', 'changes'],
            description: 'Save your code with version control'
        },
        {
            title: 'Branches and Pull Requests',
            type: 'Guide',
            url: 'github-guides/04-branches-prs.html',
            keywords: ['branch', 'branches', 'pull request', 'pr', 'merge', 'fork'],
            description: 'Work with different versions and collaborate'
        },
        {
            title: 'Deploying with GitHub Pages',
            type: 'Guide',
            url: 'github-guides/05-github-pages.html',
            keywords: ['github pages', 'deploy', 'deployment', 'publish', 'hosting', 'website'],
            description: 'Publish your website for free'
        },
        {
            title: 'Collaboration Workflows',
            type: 'Guide',
            url: 'github-guides/06-collaboration.html',
            keywords: ['collaboration', 'collaborate', 'team', 'workflow', 'together', 'shared'],
            description: 'Work with others on shared projects'
        },
        {
            title: 'Using Browser Developer Tools',
            type: 'Guide',
            url: 'github-guides/07-browser-devtools.html',
            keywords: ['developer tools', 'devtools', 'inspect', 'debug', 'console', 'elements', 'css'],
            description: 'Inspect elements, debug code, and test changes'
        },
        
        // Other Pages
        {
            title: 'Troubleshooting Guide',
            type: 'Resource',
            url: 'troubleshooting.html',
            keywords: ['troubleshoot', 'problem', 'error', 'fix', 'help', 'issue', 'css not working', 'blank page'],
            description: 'Common problems and step-by-step solutions'
        },
        {
            title: 'Quick Reference',
            type: 'Resource',
            url: 'reference.html',
            keywords: ['reference', 'cheat sheet', 'glossary', 'tags', 'properties', 'quick reference', 'lookup'],
            description: 'Quick lookup for HTML tags and CSS properties'
        },
        {
            title: 'Design Resources',
            type: 'Resource',
            url: 'design-resources.html',
            keywords: ['design', 'typography', 'color', 'accessibility', 'readability', 'font', 'layout'],
            description: 'Learn about typography, readability, and accessibility'
        },
        
        // Key Concepts
        {
            title: 'HTML Tags',
            type: 'Concept',
            url: 'reference.html#html-tags',
            keywords: ['tag', 'tags', 'html tag', 'element', 'h1', 'p', 'div', 'span', 'a', 'img'],
            description: 'HTML tags for structuring content'
        },
        {
            title: 'CSS Properties',
            type: 'Concept',
            url: 'reference.html#css-properties',
            keywords: ['css property', 'style', 'color', 'margin', 'padding', 'font', 'background'],
            description: 'CSS properties for styling elements'
        },
        {
            title: 'Flexbox Layout',
            type: 'Concept',
            url: 'lessons/04-css-layout.html',
            keywords: ['flexbox', 'flex', 'display flex', 'flex direction', 'justify content', 'align items'],
            description: 'CSS Flexbox for flexible layouts'
        },
        {
            title: 'CSS Grid',
            type: 'Concept',
            url: 'lessons/04-css-layout.html',
            keywords: ['grid', 'css grid', 'grid layout', 'grid template', 'grid columns'],
            description: 'CSS Grid for two-dimensional layouts'
        },
        {
            title: 'Media Queries',
            type: 'Concept',
            url: 'lessons/05-responsive-design.html',
            keywords: ['media query', 'responsive', '@media', 'breakpoint', 'mobile', 'tablet'],
            description: 'CSS media queries for responsive design'
        }
    ];
}

/**
 * Set up search UI elements
 */
function setupSearchUI() {
    // Create search container if it doesn't exist
    let searchContainer = document.querySelector('.search-container');
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'search-input';
        searchInput.className = 'search-input';
        searchInput.placeholder = 'Search lessons, guides, and concepts...';
        searchInput.setAttribute('aria-label', 'Search tutorials');
        
        const searchButton = document.createElement('button');
        searchButton.className = 'search-button';
        searchButton.innerHTML = '🔍';
        searchButton.setAttribute('aria-label', 'Search');
        searchButton.onclick = performSearch;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'search-close';
        closeButton.innerHTML = '✕';
        closeButton.setAttribute('aria-label', 'Close search');
        closeButton.onclick = closeSearch;
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        searchContainer.appendChild(closeButton);
        
        // Add search centered in the header, below the navigation bar
        const header = document.querySelector('header');
        if (header) {
            // Insert search container after the nav, centered
            header.appendChild(searchContainer);
        }
        
        // Handle Enter key in search input
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Show results on input (debounced)
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = searchInput.value.trim();
                if (query.length >= 2) {
                    performSearch();
                } else {
                    hideSearchResults();
                }
            }, 300);
        });
        
        // Handle Escape key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }
}

/**
 * Perform search and display results
 */
function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length < 2) {
        hideSearchResults();
        return;
    }
    
    const results = searchIndex.filter(item => {
        // Search in title, keywords, and description
        const searchText = `${item.title} ${item.keywords.join(' ')} ${item.description}`.toLowerCase();
        return searchText.includes(query);
    });
    
    displaySearchResults(results, query);
}

/**
 * Display search results
 */
function displaySearchResults(results, query) {
    // Remove existing results
    hideSearchResults();
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.id = 'search-results';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-results-empty">
                <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
                <p class="search-suggestions">Try different keywords or check the <a href="reference.html">Quick Reference</a> for common terms.</p>
            </div>
        `;
    } else {
        // Group results by type
        const grouped = {};
        results.forEach(item => {
            if (!grouped[item.type]) {
                grouped[item.type] = [];
            }
            grouped[item.type].push(item);
        });
        
        let resultsHTML = `<div class="search-results-header">
            <p>Found <strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''} for "<strong>${escapeHtml(query)}</strong>"</p>
        </div>`;
        
        // Display grouped results
        Object.keys(grouped).forEach(type => {
            resultsHTML += `<div class="search-results-group">
                <h3 class="search-results-type">${type}</h3>
                ${grouped[type].map(item => createResultCard(item, query)).join('')}
            </div>`;
        });
        
        resultsContainer.innerHTML = resultsHTML;
    }
    
    // Add to page
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.appendChild(resultsContainer);
    }
    
    // Scroll to results if needed
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Create a result card HTML
 */
function createResultCard(item, query) {
    // Highlight matching terms
    const highlightTitle = highlightMatch(item.title, query);
    const highlightDesc = highlightMatch(item.description, query);
    
    return `
        <div class="search-result-card">
            <h4><a href="${item.url}">${highlightTitle}</a></h4>
            <p class="search-result-description">${highlightDesc}</p>
            <span class="search-result-url">${item.url}</span>
        </div>
    `;
}

/**
 * Highlight matching text in results
 */
function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Escape special regex characters
 */
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Hide search results
 */
function hideSearchResults() {
    const existing = document.getElementById('search-results');
    if (existing) {
        existing.remove();
    }
}

/**
 * Close search interface
 */
function closeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    hideSearchResults();
}

// Export for potential external use
window.searchSystem = {
    search: performSearch,
    close: closeSearch
};

