/* 
    Progress Tracking System
    
    This script tracks which lessons students have completed using localStorage.
    It shows visual indicators (checkmarks, progress bars) and helps students
    see their learning progress.
    
    Students can learn how JavaScript interacts with browser storage and
    how to create user experience features that persist across page loads.
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress tracking
    initializeProgressTracking();
});

/**
 * Initialize progress tracking system
 * Sets up event listeners and displays current progress
 */
function initializeProgressTracking() {
    // Get all lesson cards from the homepage
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    if (lessonCards.length === 0) {
        return; // Not on homepage, exit early
    }
    
    // Load progress from localStorage
    const progress = loadProgress();
    
    // Update each lesson card with progress indicators
    lessonCards.forEach((card, index) => {
        const lessonNumber = index + 1;
        const lessonId = `lesson-${String(lessonNumber).padStart(2, '0')}`;
        const lessonStatus = progress[lessonId] || 'not-started';
        
        // Add progress indicator to the card
        addProgressIndicator(card, lessonStatus, lessonId);
        
        // Track when user clicks on a lesson
        card.addEventListener('click', () => {
            markLessonAsStarted(lessonId);
        });
    });
    
    // Update overall progress bar
    updateProgressBar(progress);
}

/**
 * Load progress data from localStorage
 * Returns an object mapping lesson IDs to their status
 */
function loadProgress() {
    try {
        const stored = localStorage.getItem('lessonProgress');
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Error loading progress:', error);
        return {};
    }
}

/**
 * Save progress data to localStorage
 */
function saveProgress(progress) {
    try {
        localStorage.setItem('lessonProgress', JSON.stringify(progress));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

/**
 * Add visual progress indicator to a lesson card
 */
function addProgressIndicator(card, status, lessonId) {
    // Create progress indicator element
    const indicator = document.createElement('div');
    indicator.className = 'progress-indicator';
    indicator.setAttribute('data-lesson-id', lessonId);
    indicator.setAttribute('aria-label', `Lesson status: ${status}`);
    
    // Add status class for styling
    indicator.classList.add(`status-${status}`);
    
    // Add appropriate icon/text based on status
    if (status === 'completed') {
        indicator.innerHTML = '<span class="progress-icon">✓</span>';
        indicator.title = 'Lesson completed';
    } else if (status === 'in-progress') {
        indicator.innerHTML = '<span class="progress-icon">⋯</span>';
        indicator.title = 'Lesson in progress';
    } else {
        indicator.innerHTML = '<span class="progress-icon">○</span>';
        indicator.title = 'Not started';
    }
    
    // Insert indicator at the beginning of the card
    card.style.position = 'relative';
    card.appendChild(indicator);
}

/**
 * Mark a lesson as started
 */
function markLessonAsStarted(lessonId) {
    const progress = loadProgress();
    
    // Only mark as in-progress if not already completed
    if (progress[lessonId] !== 'completed') {
        progress[lessonId] = 'in-progress';
        saveProgress(progress);
    }
}

/**
 * Mark a lesson as completed
 * This should be called from lesson pages when user reaches the end
 */
function markLessonAsCompleted(lessonId) {
    const progress = loadProgress();
    progress[lessonId] = 'completed';
    saveProgress(progress);
    
    // Update the indicator on homepage if it exists
    const indicator = document.querySelector(`[data-lesson-id="${lessonId}"]`);
    if (indicator) {
        indicator.className = 'progress-indicator status-completed';
        indicator.innerHTML = '<span class="progress-icon">✓</span>';
        indicator.title = 'Lesson completed';
        indicator.setAttribute('aria-label', 'Lesson status: completed');
    }
    
    // Update progress bar
    updateProgressBar(loadProgress());
}

/**
 * Update the overall progress bar
 */
function updateProgressBar(progress) {
    const progressBarContainer = document.querySelector('.overall-progress');
    if (!progressBarContainer) {
        return;
    }
    
    const totalLessons = 13; // Total number of lessons
    let completedCount = 0;

    // Count completed lessons
    for (let i = 1; i <= totalLessons; i++) {
        const lessonId = `lesson-${String(i).padStart(2, '0')}`;
        if (progress[lessonId] === 'completed') {
            completedCount++;
        }
    }
    
    // Calculate percentage
    const percentage = Math.round((completedCount / totalLessons) * 100);
    
    // Update progress bar
    const progressBarFill = progressBarContainer.querySelector('.progress-bar-fill');
    const progressText = progressBarContainer.querySelector('.progress-text');
    
    if (progressBarFill) {
        progressBarFill.style.width = `${percentage}%`;
        progressBarFill.setAttribute('aria-valuenow', percentage);
    }
    
    if (progressText) {
        progressText.textContent = `${completedCount} of ${totalLessons} lessons completed`;
    }
}

/**
 * Check if current page is a lesson and mark completion if user scrolls to bottom
 * This should be called from lesson pages
 */
function trackLessonProgress() {
    // Check if we're on a lesson page
    const lessonContainer = document.querySelector('.lesson-container');
    if (!lessonContainer) {
        return;
    }
    
    // Extract lesson number from URL or page title
    const pathname = window.location.pathname;
    const match = pathname.match(/(\d+)-.*\.html/);
    if (!match) {
        return;
    }

    const lessonNumber = parseInt(match[1], 10);
    const lessonId = `lesson-${String(lessonNumber).padStart(2, '0')}`;
    
    // Mark as started when page loads
    markLessonAsStarted(lessonId);
    
    // Track scroll position to mark as completed when user reaches bottom
    let completionTriggered = false;
    
    window.addEventListener('scroll', () => {
        if (completionTriggered) {
            return;
        }
        
        // Check if user has scrolled near the bottom (within 200px)
        const scrollPosition = window.pageYOffset + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= documentHeight - 200) {
            // User has reached (near) the bottom
            markLessonAsCompleted(lessonId);
            completionTriggered = true;
        }
    });
}

// If we're on a lesson page, track progress
if (document.querySelector('.lesson-container')) {
    trackLessonProgress();
}

// Export functions for potential use in other scripts
window.progressTracker = {
    markCompleted: markLessonAsCompleted,
    markStarted: markLessonAsStarted,
    loadProgress: loadProgress
};

