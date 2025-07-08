document.addEventListener('DOMContentLoaded', () => {
    const mediaGallery = document.querySelector('.project-media-scroll-gallery');
    const currentIndexSpan = document.getElementById('media-current-index');
    const totalCountSpan = document.getElementById('media-total-count');
    const scrollMediaCounterElement = document.getElementById('scroll-media-counter');

    // DEBUG: Verificar selección de elementos
    console.log('scrollMediaCounterElement:', scrollMediaCounterElement);
    console.log('mediaGallery:', mediaGallery);
    console.log('currentIndexSpan:', currentIndexSpan);
    console.log('totalCountSpan:', totalCountSpan);

    if (!mediaGallery || !currentIndexSpan || !totalCountSpan || !scrollMediaCounterElement) {
        if (scrollMediaCounterElement) {
            scrollMediaCounterElement.style.display = 'none';
        }
        console.warn('Elementos para el contador de scroll no encontrados. El contador no funcionará.');
        return;
    }

    const mediaElements = Array.from(mediaGallery.querySelectorAll('img, .video-placeholder-container'));
    const totalMedia = mediaElements.length;
    console.log('mediaElements count:', mediaElements.length); // DEBUG

    if (totalMedia === 0) {
        scrollMediaCounterElement.style.display = 'none';
        return;
    }

    totalCountSpan.textContent = totalMedia;
    currentIndexSpan.textContent = '1';

    function updateScrollCounter() {
        console.log('updateScrollCounter triggered by scroll'); // DEBUG
        let mostVisibleElementIndex = -1; // Iniciar con -1 para saber si se encontró alguno
        let minDistanceToCenter = Infinity; // Usaremos la menor distancia al centro

        const windowHeight = window.innerHeight;
        const viewportCenterY = windowHeight / 2;

        mediaElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();

            // Considerar solo elementos que están al menos parcialmente en el viewport
            // O un poco fuera, para detectar el que está "a punto de entrar" o "acaba de salir"
            if (rect.bottom < -50 || rect.top > windowHeight + 50) { // Añadido un pequeño umbral
                // console.log(`Media ${index}: Fuera de viewport (top: ${rect.top}, bottom: ${rect.bottom})`); // DEBUG
                return;
            }

            const elementMidPointY = rect.top + rect.height / 2;
            const distanceToCenter = Math.abs(elementMidPointY - viewportCenterY);

            // DEBUG: Loguear info de cada elemento evaluado
            // console.log(`Media ${index}: top=${rect.top.toFixed(0)}, midY=${elementMidPointY.toFixed(0)}, distToCenter=${distanceToCenter.toFixed(0)}`);

            if (distanceToCenter < minDistanceToCenter) {
                minDistanceToCenter = distanceToCenter;
                mostVisibleElementIndex = index;
            }
        });

        console.log('Most visible element index:', mostVisibleElementIndex, 'Min distance to center:', minDistanceToCenter.toFixed(0)); // DEBUG

        if (mostVisibleElementIndex !== -1) {
            const newIndexText = String(mostVisibleElementIndex + 1);
            if (currentIndexSpan.textContent !== newIndexText) {
                console.log('Attempting to update currentIndexSpan.textContent to:', newIndexText); // DEBUG
                currentIndexSpan.textContent = newIndexText;
                console.log('textContent después de actualizar:', currentIndexSpan.textContent); // DEBUG
            }
        } else {
            // Si ningún elemento se considera "más visible" (ej. durante scroll muy rápido o si la galería está fuera de vista)
            // podríamos optar por no actualizar o volver al primero/último si es el caso.
            // Por ahora, si no se encuentra ninguno, el contador no se actualiza desde el último valor válido.
            console.log('No se encontró un elemento predominantemente visible para actualizar el contador.'); //DEBUG
        }
    }

    // Throttle/Debounce para el evento de scroll para no sobrecargar el navegador
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateScrollCounter, 50); // Ajustar delay según necesidad (50-100ms es usual)
    }, { passive: true });

    // Llamada inicial para establecer el contador correctamente
    setTimeout(updateScrollCounter, 100); // Pequeño delay para asegurar que el layout esté estable
});
