document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.scroll-gallery');
    const currentImageSpan = document.getElementById('current-image');
    const totalImagesSpan = document.getElementById('total-images');

    if (!gallery || !currentImageSpan || !totalImagesSpan) {
        console.error('Essential elements for counter not found.');
        if (!gallery) console.error('Gallery element (.scroll-gallery) is missing.');
        if (!currentImageSpan) console.error('Current image span (#current-image) is missing.');
        if (!totalImagesSpan) console.error('Total images span (#total-images) is missing.');
        return;
    }

    // Query images *after* ensuring gallery exists
    const images = gallery.querySelectorAll('img');

    if (images.length === 0) {
        console.warn('No images found in the gallery. Counter will not operate.');
        totalImagesSpan.textContent = '0';
        currentImageSpan.textContent = '0';
        return;
    }

    console.log('Counter script loaded successfully.');
    console.log('Gallery element:', gallery);
    console.log('Current image span:', currentImageSpan);
    console.log('Total images span:', totalImagesSpan);
    console.log(`Found ${images.length} images.`);

    totalImagesSpan.textContent = images.length;
    // Set initial image to 1, assuming the first image is visible by default.
    // This will be updated by the scroll handler if necessary.
    currentImageSpan.textContent = '1';

    let debounceTimer;

    function updateCurrentImage() {
        // gallery.scrollLeft is the amount the content of gallery has been scrolled to the left.
        // gallery.offsetWidth is the visible width of the gallery.
        // The center of the visible part of the gallery is gallery.scrollLeft + gallery.offsetWidth / 2.
        const galleryViewCenter = gallery.scrollLeft + gallery.offsetWidth / 2;
        console.log(`Gallery scrollLeft: ${gallery.scrollLeft}, galleryViewCenter: ${galleryViewCenter.toFixed(2)}`);

        let closestImageIndex = 0;
        let smallestDistanceToCenter = Infinity;

        images.forEach((img, index) => {
            // img.offsetLeft is the position of the left edge of the image relative to gallery.
            // img.offsetWidth is the width of the image.
            // The center of the image is img.offsetLeft + img.offsetWidth / 2.
            const imageCenter = img.offsetLeft + img.offsetWidth / 2;
            const distance = Math.abs(galleryViewCenter - imageCenter);

            console.log(`Image ${index + 1}: offsetLeft=${img.offsetLeft}, width=${img.offsetWidth}, center=${imageCenter.toFixed(2)}, distanceToViewCenter=${distance.toFixed(2)}`);

            if (distance < smallestDistanceToCenter) {
                smallestDistanceToCenter = distance;
                closestImageIndex = index;
            }
        });

        const currentVisibleImage = closestImageIndex + 1;
        console.log(`Closest image index: ${closestImageIndex}, Displaying: ${currentVisibleImage}`);
        currentImageSpan.textContent = currentVisibleImage;
    }

    gallery.addEventListener('scroll', () => {
        console.log('Scroll event detected on gallery.');
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateCurrentImage, 60); // Slightly increased debounce
    });

    // Call once on load to set the initial image count correctly,
    // especially if the gallery isn't scrolled to the very beginning
    // or if images have variable widths affecting initial "center".
    // Use a small timeout to ensure layout is stable.
    setTimeout(updateCurrentImage, 100);

    // Optional: Add a resize listener if gallery/image sizes can change dynamically
    // window.addEventListener('resize', () => {
    //     clearTimeout(debounceTimer);
    //     debounceTimer = setTimeout(updateCurrentImage, 100);
    // });
});
