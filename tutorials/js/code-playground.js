/* 
    Interactive Code Playground
    
    This script creates an interactive code editor where students can
    edit HTML and CSS and see a live preview. This helps students
    experiment with code and learn by doing.
    
    Students can learn how JavaScript creates interactive components,
    how iframes can be used to safely execute code, and how to build
    real-time preview systems.
*/

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initializePlaygrounds();
});

/**
 * Initialize all code playground components on the page
 */
function initializePlaygrounds() {
    const playgrounds = document.querySelectorAll('.code-playground');
    
    playgrounds.forEach((playground, index) => {
        setupPlayground(playground, index);
    });
}

/**
 * Set up an individual playground component
 */
function setupPlayground(container, index) {
    // Get initial code from data attributes
    // Decode HTML entities that were escaped for data attributes
    let initialHTML = container.getAttribute('data-html') || '';
    let initialCSS = container.getAttribute('data-css') || '';
    const solutionHTML = container.getAttribute('data-solution-html') || '';
    const solutionCSS = container.getAttribute('data-solution-css') || '';
    
    // Decode HTML entities if present
    if (initialHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = initialHTML;
        initialHTML = tempDiv.textContent || tempDiv.innerText || '';
    }
    
    // Create playground structure
    const playgroundId = `playground-${index}`;
    container.id = playgroundId;
    
    // Store solution data for later use
    if (solutionHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = solutionHTML;
        container.setAttribute('data-solution-html-decoded', tempDiv.textContent || tempDiv.innerText || '');
    }
    if (solutionCSS) {
        container.setAttribute('data-solution-css-decoded', solutionCSS);
    }
    
    // Create editor section
    const editorSection = createEditorSection(playgroundId, initialHTML, initialCSS);
    
    // Create preview section
    const previewSection = createPreviewSection(playgroundId);
    
    // Create control buttons
    const controls = createControls(playgroundId, initialHTML, initialCSS, solutionHTML || initialHTML, solutionCSS || initialCSS);
    
    // Clear container and add new structure
    container.innerHTML = '';
    container.appendChild(controls);
    container.appendChild(editorSection);
    container.appendChild(previewSection);
    
    // Set up event listeners
    setupPlaygroundListeners(playgroundId, initialHTML, initialCSS);
    
    // Initial preview render
    updatePreview(playgroundId, initialHTML, initialCSS);
}

/**
 * Create the editor section with HTML and CSS textareas
 */
function createEditorSection(playgroundId, initialHTML, initialCSS) {
    const section = document.createElement('div');
    section.className = 'playground-editor';
    
    const htmlEditor = document.createElement('div');
    htmlEditor.className = 'editor-panel';
    
    const htmlLabel = document.createElement('label');
    htmlLabel.setAttribute('for', `${playgroundId}-html`);
    htmlLabel.textContent = 'HTML';
    htmlLabel.className = 'editor-label';
    
    const htmlTextarea = document.createElement('textarea');
    htmlTextarea.id = `${playgroundId}-html`;
    htmlTextarea.className = 'code-editor';
    htmlTextarea.value = initialHTML;
    htmlTextarea.setAttribute('spellcheck', 'false');
    htmlTextarea.setAttribute('placeholder', 'Enter your HTML code here...');
    
    htmlEditor.appendChild(htmlLabel);
    htmlEditor.appendChild(htmlTextarea);
    
    const cssEditor = document.createElement('div');
    cssEditor.className = 'editor-panel';
    
    const cssLabel = document.createElement('label');
    cssLabel.setAttribute('for', `${playgroundId}-css`);
    cssLabel.textContent = 'CSS';
    cssLabel.className = 'editor-label';
    
    const cssTextarea = document.createElement('textarea');
    cssTextarea.id = `${playgroundId}-css`;
    cssTextarea.className = 'code-editor';
    cssTextarea.value = initialCSS;
    cssTextarea.setAttribute('spellcheck', 'false');
    cssTextarea.setAttribute('placeholder', 'Enter your CSS code here...');
    
    cssEditor.appendChild(cssLabel);
    cssEditor.appendChild(cssTextarea);
    
    section.appendChild(htmlEditor);
    section.appendChild(cssEditor);
    
    return section;
}

/**
 * Create the preview section with iframe
 */
function createPreviewSection(playgroundId) {
    const section = document.createElement('div');
    section.className = 'playground-preview';
    
    const previewLabel = document.createElement('label');
    previewLabel.className = 'preview-label';
    previewLabel.textContent = 'Live Preview';
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';
    
    const iframe = document.createElement('iframe');
    iframe.id = `${playgroundId}-preview`;
    iframe.className = 'preview-iframe';
    iframe.setAttribute('sandbox', 'allow-same-origin');
    iframe.setAttribute('title', 'Code preview');
    
    previewContainer.appendChild(iframe);
    
    section.appendChild(previewLabel);
    section.appendChild(previewContainer);
    
    return section;
}

/**
 * Create control buttons (Reset, Show Solution)
 */
function createControls(playgroundId, initialHTML, initialCSS, solutionHTML, solutionCSS) {
    const controls = document.createElement('div');
    controls.className = 'playground-controls';
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'playground-btn playground-btn-reset';
    resetBtn.textContent = 'Reset';
    resetBtn.setAttribute('aria-label', 'Reset code to initial state');
    resetBtn.onclick = () => resetPlayground(playgroundId, initialHTML, initialCSS);
    
    // Check if solution is provided (and different from initial)
    const hasSolution = (solutionHTML && solutionHTML !== initialHTML) || (solutionCSS && solutionCSS !== initialCSS);
    
    if (hasSolution) {
        const solutionBtn = document.createElement('button');
        solutionBtn.className = 'playground-btn playground-btn-solution';
        solutionBtn.textContent = 'Show Solution';
        solutionBtn.setAttribute('aria-label', 'Show the solution code');
        solutionBtn.onclick = () => showSolution(playgroundId, solutionHTML, solutionCSS);
        controls.appendChild(solutionBtn);
    }
    
    controls.appendChild(resetBtn);
    
    return controls;
}

/**
 * Set up event listeners for a playground
 */
function setupPlaygroundListeners(playgroundId, initialHTML, initialCSS) {
    const htmlEditor = document.getElementById(`${playgroundId}-html`);
    const cssEditor = document.getElementById(`${playgroundId}-css`);
    
    if (!htmlEditor || !cssEditor) {
        return;
    }
    
    // Update preview on input (debounced for performance)
    let updateTimeout;
    
    const updateHandler = () => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            updatePreview(playgroundId, htmlEditor.value, cssEditor.value);
        }, 300); // Wait 300ms after typing stops
    };
    
    htmlEditor.addEventListener('input', updateHandler);
    cssEditor.addEventListener('input', updateHandler);
    
    // Also update on paste
    htmlEditor.addEventListener('paste', () => {
        setTimeout(updateHandler, 100);
    });
    
    cssEditor.addEventListener('paste', () => {
        setTimeout(updateHandler, 100);
    });
}

/**
 * Update the preview iframe with current code
 */
function updatePreview(playgroundId, htmlCode, cssCode) {
    const iframe = document.getElementById(`${playgroundId}-preview`);
    if (!iframe) {
        return;
    }
    
    // Create complete HTML document
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
</body>
</html>`;
    
    // Write to iframe
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(fullHTML);
        iframeDoc.close();
    } catch (error) {
        console.error('Error updating preview:', error);
    }
}

/**
 * Reset playground to initial state
 */
function resetPlayground(playgroundId, initialHTML, initialCSS) {
    const htmlEditor = document.getElementById(`${playgroundId}-html`);
    const cssEditor = document.getElementById(`${playgroundId}-css`);
    
    if (htmlEditor) {
        htmlEditor.value = initialHTML;
    }
    if (cssEditor) {
        cssEditor.value = initialCSS;
    }
    
    updatePreview(playgroundId, initialHTML, initialCSS);
}

/**
 * Show solution code
 */
function showSolution(playgroundId, solutionHTML, solutionCSS) {
    const htmlEditor = document.getElementById(`${playgroundId}-html`);
    const cssEditor = document.getElementById(`${playgroundId}-css`);
    
    // Decode HTML entities if present
    let decodedHTML = solutionHTML;
    if (solutionHTML.includes('&lt;') || solutionHTML.includes('&gt;')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = solutionHTML;
        decodedHTML = tempDiv.textContent || tempDiv.innerText || solutionHTML;
    }
    
    if (htmlEditor) {
        htmlEditor.value = decodedHTML;
    }
    if (cssEditor) {
        cssEditor.value = solutionCSS;
    }
    
    updatePreview(playgroundId, decodedHTML, solutionCSS);
    
    // Change button text temporarily
    const solutionBtn = document.querySelector(`#${playgroundId}`)?.querySelector('.playground-controls')?.querySelector('.playground-btn-solution');
    if (solutionBtn) {
        const originalText = solutionBtn.textContent;
        solutionBtn.textContent = 'Solution Shown';
        setTimeout(() => {
            solutionBtn.textContent = originalText;
        }, 2000);
    }
}

