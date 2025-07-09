document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.scroll-gallery');
    const currentImageSpan = document.getElementById('current-image');
    const totalImagesSpan = document.getElementById('total-images');
    const images = gallery.querySelectorAll('img');

    if (!gallery || !currentImageSpan || !totalImagesSpan || images.length === 0) {
        console.error('Counter elements not found or no images in gallery.');
        return;
    }

    console.log('Counter script loaded.');
    console.log('Gallery:', gallery);
    console.log('Current image span:', currentImageSpan);
    console.log('Total images span:', totalImagesSpan);
    console.log('Images found:', images.length);

    totalImagesSpan.textContent = images.length;
    currentImageSpan.textContent = '1'; // Initial image

    let debounceTimer;

    gallery.addEventListener('scroll', () => {
        console.log('Scroll event triggered on gallery.');
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            let currentImageIndex = 0;
            const galleryScrollLeft = gallery.scrollLeft;
            const galleryWidth = gallery.offsetWidth;

            console.log('Gallery scrollLeft:', galleryScrollLeft);

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const imageLeft = image.offsetLeft - gallery.offsetLeft; // Position relative to gallery
                const imageWidth = image.offsetWidth;

                // Check if the center of the image is within the viewport of the gallery
                // Adding a small tolerance for precision issues
                if (galleryScrollLeft >= imageLeft - imageWidth / 2 - 5 && galleryScrollLeft < imageLeft + imageWidth / 2 - 5) {
                    currentImageIndex = i + 1;
                    break;
                }
            }

            // If no image is perfectly centered, try to determine by proximity
            // This happens often at the very beginning or end of the scroll
            if (currentImageIndex === 0) {
                // Check first image
                if (galleryScrollLeft < (images[0].offsetLeft - gallery.offsetLeft + images[0].offsetWidth / 2)) {
                    currentImageIndex = 1;
                }
                // Check last image
                else if (galleryScrollLeft >= (images[images.length-1].offsetLeft - gallery.offsetLeft - images[images.length-1].offsetWidth / 2) ) {
                     currentImageIndex = images.length;
                } else {
                    // Fallback or more sophisticated proximity logic needed if issues persist
                    // For now, let's find the closest one based on scrollLeft
                    let minDiff = Infinity;
                    for (let i = 0; i < images.length; i++) {
                        const image = images[i];
                        const imageCenter = image.offsetLeft - gallery.offsetLeft + image.offsetWidth / 2;
                        const diff = Math.abs(galleryScrollLeft + galleryWidth / 2 - imageCenter);
                        if (diff < minDiff) {
                            minDiff = diff;
                            currentImageIndex = i + 1;
                        }
                    }
                }
            }


            console.log('Current image index calculated:', currentImageIndex);
            currentImageSpan.textContent = currentImageIndex;
        }, 50); // Debounce time
    });

    // Initial check in case the first image isn't perfectly aligned or for static state
    // Trigger scroll logic once to set initial state correctly if needed
    // gallery.dispatchEvent(new Event('scroll'));
    // Simpler: just set to 1 initially as per currentImageSpan.textContent = '1';
});
