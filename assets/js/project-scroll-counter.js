document.addEventListener('DOMContentLoaded', () => {
    const mediaGallery = document.querySelector('.project-media-scroll-gallery');
    const currentIndexSpan = document.getElementById('media-current-index');
    const totalCountSpan = document.getElementById('media-total-count'); // Este span contendrá el número total
    const scrollMediaCounterElement = document.getElementById('scroll-media-counter'); // El div contenedor completo

    if (!mediaGallery || !currentIndexSpan || !totalCountSpan || !scrollMediaCounterElement) {
        if (scrollMediaCounterElement) {
            scrollMediaCounterElement.style.display = 'none';
        }
        console.warn('Elementos para el contador de scroll no encontrados. El contador no funcionará.');
        return;
    }

    const mediaElements = Array.from(mediaGallery.querySelectorAll('img, .video-placeholder-container'));
    const totalMedia = mediaElements.length;

    if (totalMedia === 0) {
        scrollMediaCounterElement.style.display = 'none';
        return;
    }

    // Establecer el texto completo una vez, luego solo actualizar el número actual
    totalCountSpan.textContent = totalMedia; // Solo el número total
    currentIndexSpan.textContent = '1'; // Iniciar en 1


    function updateScrollCounter() {
        let mostVisibleElementIndex = 0;
        let maxVisibility = 0;
        const windowHeight = window.innerHeight;
        const viewportCenter = windowHeight / 2;

        mediaElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();

            // Considerar solo elementos que están al menos parcialmente en el viewport
            if (rect.bottom < 0 || rect.top > windowHeight) {
                return;
            }

            // Calcular el punto medio vertical del elemento
            const elementMidPoint = rect.top + rect.height / 2;
            // Calcular la distancia del punto medio del elemento al centro del viewport
            const distanceToCenter = Math.abs(elementMidPoint - viewportCenter);

            // Una forma de priorizar: el que esté más cerca del centro del viewport.
            // Se puede ajustar la lógica si se prefiere el que tiene más área visible.
            // Por ahora, nos quedaremos con el que esté más cerca del centro.

            // Inicializar si es el primer elemento evaluado en este ciclo de scroll
            if (index === 0 || distanceToCenter < maxVisibility) {
                maxVisibility = distanceToCenter; // Aquí maxVisibility representa la menor distancia al centro
                mostVisibleElementIndex = index;
            }
        });

        // Si se detectó algún elemento (maxVisibility habrá sido actualizado desde un valor alto inicial)
        // O si se prefiere la lógica anterior de porcentaje de visibilidad:
        // const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
        // const visibilityPercentage = visibleHeight / rect.height;
        // if (visibilityPercentage > maxVisibility) { ... }

        // Actualizamos el contador con el índice del elemento más cercano al centro
        currentIndexSpan.textContent = mostVisibleElementIndex + 1;
    }

    updateScrollCounter(); // Llamada inicial
    window.addEventListener('scroll', updateScrollCounter, { passive: true });
});
