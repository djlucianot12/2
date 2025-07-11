document.addEventListener('DOMContentLoaded', function () {
    const mediaItems = Array.from(document.querySelectorAll('.npc-media-item'));
    const currentMediaSpan = document.getElementById('npc-current-media');
    const totalMediaSpan = document.getElementById('npc-total-media');
    const progressFill = document.getElementById('npc-progress-fill');
    const mediaGallery = document.querySelector('.npc-media-gallery'); // o el contenedor que envuelve los items

    let totalMediaItems = mediaItems.length;
    let currentItemIndex = 0;
    let autoplayTimer;
    let progressTimer;
    let isPaused = false;
    const autoplayDuration = 4000; // 4 segundos

    function updateMediaCounter(index) {
        const currentNumber = String(index + 1).padStart(2, '0');
        if (currentMediaSpan) currentMediaSpan.textContent = currentNumber;
        console.log(`Counter updated: ${currentNumber}/${totalMediaItems}`);
    }

    function resetProgressBar() {
        console.log("Resetting progress bar");
        if (progressFill) {
            progressFill.style.transition = 'none'; // Remove transition for immediate reset
            progressFill.style.width = '0%';
        }
        // Force reflow to ensure the reset is applied before new transition starts
        // void progressFill.offsetWidth;
    }

    function startProgressBar() {
        console.log("Starting progress bar for item", currentItemIndex);
        resetProgressBar(); // Reset before starting

        // Delay slightly before starting the animation to ensure reset is rendered
        setTimeout(() => {
            if (progressFill) {
                progressFill.style.transition = `width ${autoplayDuration / 1000}s linear`;
                progressFill.style.width = '100%';
                console.log("Progress bar animation started");
            }
        }, 50); // 50ms delay


        // Clear any existing progress timer
        clearTimeout(progressTimer);
        progressTimer = setTimeout(() => {
            if (!isPaused) {
                console.log("Progress bar complete, attempting to scroll to next item");
                scrollToNextItem();
            } else {
                console.log("Progress bar complete but autoplay is paused.");
            }
        }, autoplayDuration);
    }


    function scrollToNextItem() {
        console.log("scrollToNextItem called. Current index:", currentItemIndex);
        currentItemIndex++;
        if (currentItemIndex >= totalMediaItems) {
            currentItemIndex = 0; // Loop back to the first item
            console.log("Looping back to first item");
        }

        if (mediaItems[currentItemIndex]) {
            console.log("Scrolling to item index:", currentItemIndex, mediaItems[currentItemIndex]);
            mediaItems[currentItemIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            // updateMediaCounter(currentItemIndex); // Will be updated by IntersectionObserver
            // startProgressBar(); // Will be started by IntersectionObserver when item is in view
        } else {
            console.error("Next item to scroll to is undefined:", currentItemIndex);
        }
    }

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const intersectingItem = entry.target;
                const index = mediaItems.indexOf(intersectingItem);
                console.log(`Item ${index} is intersecting. Updating counter and starting progress bar.`);

                if (index !== currentItemIndex || !autoplayTimer ) { // Update only if it's a new item or if autoplay hasn't started
                    currentItemIndex = index;
                    updateMediaCounter(currentItemIndex);
                    if (!isPaused) {
                       startProgressBar();
                    } else {
                        console.log("Autoplay is paused, progress bar will not start automatically for item", currentItemIndex);
                    }
                }
            }
        });
    }

    // Set up Intersection Observer
    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.7 // item is considered visible if 70% is in view
    };
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    mediaItems.forEach(item => observer.observe(item));


    // Initial setup
    if (totalMediaSpan) totalMediaSpan.textContent = String(totalMediaItems).padStart(2, '0');
    if (mediaItems.length > 0) {
        updateMediaCounter(0); // Initialize counter for the first item
        // startProgressBar(); // Start progress for the first item - will be handled by observer
    } else {
        console.log("No media items found for counter.");
        if (currentMediaSpan) currentMediaSpan.textContent = "00";
        if (totalMediaSpan) totalMediaSpan.textContent = "00";
    }

    // Pause and Resume Autoplay on hover
    if (mediaGallery) {
        mediaGallery.addEventListener('mouseenter', () => {
            if (totalMediaItems > 0) {
                isPaused = true;
                clearTimeout(progressTimer); // Stop the current progress timer
                // Optionally, capture current progress and resume from there later
                console.log("Autoplay paused on mouseenter.");
                 if (progressFill) {
                    // Get current width and pause the animation
                    const computedStyle = window.getComputedStyle(progressFill);
                    const currentWidth = computedStyle.getPropertyValue('width');
                    progressFill.style.transition = 'none'; // Stop animation
                    progressFill.style.width = currentWidth; // Hold current width
                    console.log("Progress bar paused at width:", currentWidth);
                }
            }
        });

        mediaGallery.addEventListener('mouseleave', () => {
            if (totalMediaItems > 0 && isPaused) { // Only resume if it was paused
                isPaused = false;
                console.log("Autoplay resumed on mouseleave. Restarting progress for current item:", currentItemIndex);
                // Instead of just startProgressBar, we might need to resume it
                // For simplicity now, just restart for the current item
                startProgressBar();
            }
        });
    } else {
        console.warn(".npc-media-gallery not found, pause/resume on hover will not work.");
    }

    // Aggressive style reset for elements affected by index.html's JS
    function forceStyles() {
        const elementsToReset = [document.documentElement, document.body,
                                 document.getElementById('wrapper'),
                                 document.getElementById('page'),
                                 document.getElementById('contents')];
        elementsToReset.forEach(el => {
            if (el) {
                el.style.setProperty('transform', 'none', 'important');
                el.style.setProperty('overflow', 'auto', 'important');
                // console.log(`Forced styles on ${el.id || el.tagName}`);
            }
        });
    }

    // Apply forceStyles immediately and then repeatedly for a few seconds
    // to fight with the other script.
    forceStyles();
    let attempts = 0;
    const intervalId = setInterval(() => {
        forceStyles();
        attempts++;
        if (attempts >= 20) { // Try for 2 seconds (20 * 100ms)
            clearInterval(intervalId);
            // console.log("Finished aggressive style forcing.");
        }
    }, 100);

    console.log("New Project Counter Script Loaded. Items found:", totalMediaItems);
    if (totalMediaItems > 0) {
        console.log("Initial item:", mediaItems[0]);
    }
});
