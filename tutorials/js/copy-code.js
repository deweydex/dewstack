/* 
    Copy-to-Clipboard Functionality for Code Examples
    
    This script adds "Copy Code" buttons to all code example blocks.
    When clicked, it copies the code content to the user's clipboard.
    This makes it easy for students to copy code examples and try them out.
    
    Students can learn how JavaScript can enhance user experience and
    interact with browser APIs like the Clipboard API.
*/

// Wait for the DOM to be fully loaded before running
document.addEventListener('DOMContentLoaded', () => {
    // Find all code example containers
    const codeExamples = document.querySelectorAll('.code-example');
    
    codeExamples.forEach((container, index) => {
        // Skip if button already exists (avoid duplicates)
        if (container.querySelector('.copy-code-btn')) {
            return;
        }
        
        // Get the actual code content (handles <pre><code> structure)
        const codeElement = container.querySelector('code');
        if (!codeElement) {
            return; // Skip if no code element found
        }
        
        // Get the raw text content (without HTML entities or formatting)
        const codeText = codeElement.textContent || codeElement.innerText;
        
        // Create the copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        copyButton.innerHTML = '📋 Copy';
        copyButton.title = 'Copy code to clipboard';
        
        // Make button accessible with keyboard
        copyButton.setAttribute('tabindex', '0');
        
        // Set up click handler for copy button
        copyButton.addEventListener('click', async () => {
            try {
                // Use the modern Clipboard API
                await navigator.clipboard.writeText(codeText);
                
                // Visual feedback: change button text temporarily
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '✓ Copied!';
                copyButton.style.backgroundColor = '#16a34a'; // Green for success
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                    copyButton.style.backgroundColor = '';
                }, 2000);
                
            } catch (err) {
                // Fallback for older browsers or if Clipboard API fails
                // Create a temporary textarea element
                const textarea = document.createElement('textarea');
                textarea.value = codeText;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    // Use the older execCommand method as fallback
                    document.execCommand('copy');
                    copyButton.innerHTML = '✓ Copied!';
                    copyButton.style.backgroundColor = '#16a34a';
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '📋 Copy';
                        copyButton.style.backgroundColor = '';
                    }, 2000);
                } catch (fallbackErr) {
                    // If both methods fail, show an alert
                    alert('Failed to copy code. Please select and copy manually.');
                }
                
                document.body.removeChild(textarea);
            }
        });
        
        // Also support Enter key for accessibility
        copyButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyButton.click();
            }
        });
        
        // Append button directly to the code example container
        // The button will be positioned absolutely via CSS
        container.appendChild(copyButton);
    });
});

