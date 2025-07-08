document.addEventListener('DOMContentLoaded', () => {
    const mediaGallery = document.querySelector('.project-media-scroll-gallery');
    const currentIndexSpan = document.getElementById('media-current-index');
    const totalCountSpan = document.getElementById('media-total-count');
    const scrollMediaCounter = document.getElementById('scroll-media-counter');

    if (!mediaGallery || !currentIndexSpan || !totalCountSpan || !scrollMediaCounter) {
        // Si alguno de los elementos no existe, ocultamos el contador y no hacemos nada más.
        if (scrollMediaCounter) {
            scrollMediaCounter.style.display = 'none';
        }
        console.warn('Elementos para el contador de scroll no encontrados. El contador no funcionará.');
        return;
    }

    const mediaElements = Array.from(mediaGallery.querySelectorAll('img, .video-placeholder-container'));
    const totalMedia = mediaElements.length;

    if (totalMedia === 0) {
        scrollMediaCounter.style.display = 'none';
        return;
    }

    totalCountSpan.textContent = totalMedia;
    currentIndexSpan.textContent = '1'; // Iniciar en 1

    function updateScrollCounter() {
        let mostVisibleElementIndex = 0;
        let maxVisibility = 0;

        mediaElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calcular cuánto del elemento está visible en el viewport
            const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
            const visibilityPercentage = visibleHeight / rect.height;

            if (visibilityPercentage > maxVisibility) {
                maxVisibility = visibilityPercentage;
                mostVisibleElementIndex = index;
            } else if (visibilityPercentage === maxVisibility) {
                // Si hay empate, preferir el que está más cerca del centro del viewport
                const distToCenterCurrent = Math.abs(rect.top + rect.height / 2 - windowHeight / 2);
                const distToCenterMostVisible = Math.abs(mediaElements[mostVisibleElementIndex].getBoundingClientRect().top + mediaElements[mostVisibleElementIndex].getBoundingClientRect().height / 2 - windowHeight / 2);
                if (distToCenterCurrent < distToCenterMostVisible) {
                    mostVisibleElementIndex = index;
                }
            }
        });

        // Si hay al menos un poco de visibilidad (ej. > 10%) del elemento más visible, lo contamos.
        // Si no, y estamos al principio o al final, mantenemos el contador en 1 o el total.
        if (maxVisibility > 0.1) {
            currentIndexSpan.textContent = mostVisibleElementIndex + 1;
        } else {
            // Si no hay nada muy visible, verificar si estamos al principio o al final del scroll de la galería
            const galleryRect = mediaGallery.getBoundingClientRect();
            if (galleryRect.top >= 0) { // Si la galería está en la parte superior o por encima del viewport
                 currentIndexSpan.textContent = '1';
            } else if (galleryRect.bottom <= window.innerHeight) { // Si el fondo de la galería está en la parte inferior o por encima
                 currentIndexSpan.textContent = totalMedia;
            }
            // Si no, el contador se queda como está hasta que un elemento sea más visible.
        }
    }

    // Actualizar al cargar y al hacer scroll
    updateScrollCounter();
    window.addEventListener('scroll', updateScrollCounter, { passive: true });
});
