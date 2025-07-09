document.addEventListener('DOMContentLoaded', function () {
    const mediaItems = document.querySelectorAll('.npc-media-item');
    const currentMediaSpan = document.getElementById('npc-current-media');
    const totalMediaSpan = document.getElementById('npc-total-media');

    // Verificar si los elementos esenciales del contador y los items multimedia existen
    if (!currentMediaSpan) {
        console.error('Elemento span para media actual (#npc-current-media) no encontrado.');
        return;
    }
    if (!totalMediaSpan) {
        console.error('Elemento span para total de media (#npc-total-media) no encontrado.');
        return;
    }
    if (!mediaItems || mediaItems.length === 0) {
        console.warn('No se encontraron elementos .npc-media-item. El contador no funcionará.');
        totalMediaSpan.textContent = '0';
        currentMediaSpan.textContent = '0';
        return;
    }

    totalMediaSpan.textContent = mediaItems.length;
    currentMediaSpan.textContent = '1'; // Asumir el primer item visible al cargar

    let debounceTimer;
    let lastKnownScrollY = window.scrollY;
    let ticking = false;

    function updateActiveMedia() {
        let mostVisibleItemIndex = -1;
        let maxVisibilityPercentage = 0; // Porcentaje del item visible
        let itemFoundByProximity = false;

        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportCenterY = viewportHeight / 2;

        mediaItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();

            // Calcular la altura visible del item
            const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            const itemHeight = item.offsetHeight; // Altura total del item

            if (itemHeight > 0) {
                const visibilityPercentage = visibleHeight / itemHeight;

                if (visibilityPercentage > maxVisibilityPercentage) {
                    maxVisibilityPercentage = visibilityPercentage;
                    mostVisibleItemIndex = index;
                }
            }
        });

        // Si un item es al menos un 20% visible, se considera el "más visible"
        if (maxVisibilityPercentage >= 0.20) {
            currentMediaSpan.textContent = mostVisibleItemIndex + 1;
        } else {
            // Si ningún item es suficientemente visible (ej. en espacios grandes o scroll rápido),
            // buscar el más cercano al centro del viewport.
            itemFoundByProximity = true;
            let closestDistanceToCenter = Infinity;
            let tempClosestIndex = 0;

            mediaItems.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                // Distancia desde el centro del item al centro del viewport
                const itemCenterInViewport = rect.top + (rect.height / 2);
                const distance = Math.abs(itemCenterInViewport - viewportCenterY);

                if (distance < closestDistanceToCenter) {
                    closestDistanceToCenter = distance;
                    tempClosestIndex = index;
                }
            });
            currentMediaSpan.textContent = tempClosestIndex + 1;
        }

        // console.log(`Media más visible: ${mostVisibleItemIndex + 1} (Visibilidad: ${(maxVisibilityPercentage*100).toFixed(0)}%, Proximidad: ${itemFoundByProximity})`);
        ticking = false;
    }

    function onScroll() {
        lastKnownScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveMedia();
            });
            ticking = true;
        }
    }

    // Listener de scroll optimizado con requestAnimationFrame
    window.addEventListener('scroll', onScroll, { passive: true });

    // Llamada inicial para establecer el contador correctamente al cargar la página
    // (especialmente si la página no está en la parte superior absoluta)
    // Dar un pequeño respiro para que el layout se asiente completamente
    setTimeout(updateActiveMedia, 100);
});
