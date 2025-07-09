document.addEventListener('DOMContentLoaded', () => {
    const mediaItems = document.querySelectorAll('.ptv2-media-item');
    const currentMediaSpan = document.getElementById('ptv2-current-media');
    const totalMediaSpan = document.getElementById('ptv2-total-media');

    if (!mediaItems.length || !currentMediaSpan || !totalMediaSpan) {
        console.warn('Elementos del contador o items de media no encontrados. El contador no funcionará.');
        if (totalMediaSpan) totalMediaSpan.textContent = '0';
        if (currentMediaSpan) currentMediaSpan.textContent = '0';
        return;
    }

    totalMediaSpan.textContent = mediaItems.length;
    currentMediaSpan.textContent = '1'; // Asumir que el primero es visible inicialmente

    let debounceTimer;

    function updateActiveMedia() {
        let mostVisibleItemIndex = 0;
        let maxVisibility = 0;

        mediaItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            // Calcular qué parte del elemento es visible
            const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            const visibilityPercentage = visibleHeight / item.offsetHeight;

            if (visibilityPercentage > maxVisibility) {
                maxVisibility = visibilityPercentage;
                mostVisibleItemIndex = index;
            }
        });

        // Si un item es al menos un poco visible (ej. >10%), lo consideramos.
        // Esto ayuda a evitar que el contador se quede en un item que ya casi desapareció.
        if (maxVisibility > 0.1) {
            currentMediaSpan.textContent = mostVisibleItemIndex + 1;
        } else {
            // Si nada es suficientemente visible (ej. en un espacio grande entre items),
            // podríamos mantener el último conocido o buscar el más cercano al centro del viewport.
            // Por ahora, si no hay nada claramente visible, no actualizamos o mostramos '0' o '-'.
            // Para este caso, se mantendrá el último valor.
            // Opcionalmente, buscar el más cercano al centro del viewport si ninguno es "muy" visible:
            let closestToCenterIndex = 0;
            let minDistanceToCenter = Infinity;
            mediaItems.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const itemCenterY = rect.top + rect.height / 2;
                const viewportCenterY = viewportHeight / 2;
                const distance = Math.abs(itemCenterY - viewportCenterY);
                if (distance < minDistanceToCenter) {
                    minDistanceToCenter = distance;
                    closestToCenterIndex = index;
                }
            });
            currentMediaSpan.textContent = closestToCenterIndex + 1;
        }
    }

    function handleScroll() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateActiveMedia, 100); // Ajusta el debounce según sea necesario
    }

    window.addEventListener('scroll', handleScroll);

    // Llamada inicial para establecer el estado correcto al cargar la página
    // (puede ser que la página no esté scrolleada al inicio absoluto)
    updateActiveMedia();
});
