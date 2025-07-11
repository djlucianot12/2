document.addEventListener('DOMContentLoaded', function () {
    console.log('Counter Script: DOMContentLoaded');

    const mediaItems = document.querySelectorAll('.npc-media-item');
    const currentMediaSpan = document.getElementById('npc-current-media');
    const totalMediaSpan = document.getElementById('npc-total-media');

    if (!currentMediaSpan) {
        console.error('Counter Script: Elemento #npc-current-media NO ENCONTRADO');
        return;
    } else {
        console.log('Counter Script: Elemento #npc-current-media ENCONTRADO');
    }

    if (!totalMediaSpan) {
        console.error('Counter Script: Elemento #npc-total-media NO ENCONTRADO');
        return;
    } else {
        console.log('Counter Script: Elemento #npc-total-media ENCONTRADO');
    }

    if (!mediaItems || mediaItems.length === 0) {
        console.warn('Counter Script: No se encontraron elementos .npc-media-item. El contador no funcionará.');
        if (totalMediaSpan) totalMediaSpan.textContent = '00'; // Pad con cero
        if (currentMediaSpan) currentMediaSpan.textContent = '00'; // Pad con cero
        return;
    } else {
        console.log(`Counter Script: ${mediaItems.length} mediaItems ENCONTRADOS.`);
    }

    totalMediaSpan.textContent = String(mediaItems.length).padStart(2, '0');
    currentMediaSpan.textContent = '01';
    console.log(`Counter Script: Inicializado - Total: ${totalMediaSpan.textContent}, Actual: ${currentMediaSpan.textContent}`);

    let ticking = false;
    let currentMediaIndex = 1;

    function updateActiveMedia() {
        let mostVisibleItemIndex = -1;
        let maxVisibilityPercentage = 0;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportCenterY = viewportHeight / 2;

        mediaItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            // Solo considerar items que están al menos parcialmente en el viewport
            if (rect.bottom < 0 || rect.top > viewportHeight) {
                return; // Saltar este item si está completamente fuera de la vista
            }

            const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            const itemHeight = item.offsetHeight;

            if (itemHeight > 0) {
                const visibilityPercentage = visibleHeight / itemHeight;
                // console.log(`Item ${index + 1}: top=${rect.top}, bottom=${rect.bottom}, visibleH=${visibleHeight}, itemH=${itemHeight}, visibility=${visibilityPercentage.toFixed(2)}`);
                if (visibilityPercentage > maxVisibilityPercentage) {
                    maxVisibilityPercentage = visibilityPercentage;
                    mostVisibleItemIndex = index;
                }
            }
        });

        let newIndex;
        // Si encontramos un item con alguna visibilidad, lo usamos
        if (mostVisibleItemIndex !== -1 && maxVisibilityPercentage >= 0.10) { // Umbral de visibilidad del 10%
            newIndex = mostVisibleItemIndex + 1;
        } else {
            // Si no, buscar el más cercano al centro (fallback)
            let closestDistanceToCenter = Infinity;
            let tempClosestIndex = 0; // Default al primer item si nada es visible
            mediaItems.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const itemCenterInViewport = rect.top + (rect.height / 2);
                const distance = Math.abs(itemCenterInViewport - viewportCenterY);
                if (distance < closestDistanceToCenter) {
                    closestDistanceToCenter = distance;
                    tempClosestIndex = index;
                }
            });
            newIndex = tempClosestIndex + 1;
        }

        if (newIndex !== currentMediaIndex) {
            currentMediaIndex = newIndex;
            const newText = String(currentMediaIndex).padStart(2, '0');
            console.log(`Counter Script: ACTUALIZANDO currentMediaSpan.textContent a: ${newText}`);
            currentMediaSpan.textContent = newText;
        } else {
            // console.log(`Counter Script: No se requiere actualización, newIndex (${newIndex}) es igual a currentMediaIndex (${currentMediaIndex})`);
        }
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveMedia();
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    setTimeout(() => {
        console.log('Counter Script: Llamada inicial a updateActiveMedia post-carga (200ms).');
        updateActiveMedia();
    }, 200);
     setTimeout(() => { // Una llamada extra un poco después por si acaso
        console.log('Counter Script: Segunda llamada a updateActiveMedia post-carga (1s).');
        updateActiveMedia();
    }, 1000);
});
