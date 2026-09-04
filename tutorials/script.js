/* 
    Smooth Scrolling for Navigation Links
    
    This JavaScript makes navigation links scroll smoothly to their target
    sections instead of jumping instantly. This creates a better user experience.
    
    Students can learn how JavaScript interacts with HTML to enhance functionality.
*/

// Select all anchor links that link to sections on the same page (href starts with #)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Add a click event listener to each anchor link
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Prevent the default jump behavior
        
        // Find the target element using the href attribute
        const target = document.querySelector(this.getAttribute('href'));
        
        // If the target element exists, scroll to it smoothly
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',  // Smooth scrolling animation
                block: 'start'       // Align target element at the top of viewport
            });
        }
    });
});

/* 
    Active Navigation State
    
    This code highlights the current section in the navigation as users scroll.
    It detects which section is currently visible and updates the navigation
    to show which section the user is viewing.
*/

// Get all sections that have an id attribute (our main page sections)
const sections = document.querySelectorAll('section[id]');

// Get all navigation links
const navLinks = document.querySelectorAll('.nav-links a');

// Listen for scroll events on the window
window.addEventListener('scroll', () => {
    let current = '';  // Will store the id of the current section
    
    // Check each section to see if it's currently visible
    sections.forEach(section => {
        const sectionTop = section.offsetTop;      // Distance from top of page
        const sectionHeight = section.clientHeight; // Height of the section
        
        // If we've scrolled past the section's start (minus 200px offset)
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');  // Store this section's id
        }
    });

    // Update navigation links to show which section is active
    navLinks.forEach(link => {
        link.classList.remove('active');  // Remove active class from all links
        
        // If this link matches the current section, add active class
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* 
    Hamburger Menu Toggle with Side Overlay
    
    This code handles the hamburger menu with a side overlay navigation.
    When the menu button is clicked, a side panel slides in from the left
    with a dark backdrop overlay. This provides a mobile-friendly navigation
    experience that doesn't push content around.
    
    Students can learn about interactive UI patterns, overlay menus, and
    accessibility considerations when building navigation menus.
*/

// Wait for the DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    // Find the hamburger menu button (if it exists on the page)
    const menuToggle = document.querySelector('.menu-toggle');
    // Find the navigation links container (side overlay menu)
    const navLinks = document.querySelector('.nav-links');
    // Find the backdrop overlay
    const menuOverlay = document.querySelector('.menu-overlay');
    
    // Function to open the menu
    const openMenu = () => {
        if (navLinks) navLinks.classList.add('expanded');
        if (menuOverlay) menuOverlay.classList.add('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', 'Close navigation menu');
        }
        // Prevent body scrolling when menu is open
        document.body.style.overflow = 'hidden';
    };
    
    // Function to close the menu
    const closeMenu = () => {
        if (navLinks) navLinks.classList.remove('expanded');
        if (menuOverlay) menuOverlay.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation menu');
        }
        // Restore body scrolling
        document.body.style.overflow = '';
    };
    
    // Only set up menu toggle if elements exist
    if (menuToggle && navLinks) {
        // Toggle menu when hamburger button is clicked
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            if (navLinks.classList.contains('expanded')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on the backdrop overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                closeMenu();
            });
        }
        
        // Close menu when clicking on a link (useful on mobile)
        navLinks.addEventListener('click', (e) => {
            // Only close if clicking on an actual link, not the container
            if (e.target.tagName === 'A') {
                // Small delay to allow navigation to happen first
                setTimeout(closeMenu, 100);
            }
        });
        
        // Close menu when pressing Escape key (keyboard accessibility)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('expanded')) {
                closeMenu();
            }
        });
    }
});


