document.addEventListener('DOMContentLoaded', function () {
    console.log('[NPC Counter] DOMContentLoaded: Script de contador con barra de progreso iniciado.');

    const mediaItems = document.querySelectorAll('.npc-media-item');
    const currentMediaSpan = document.getElementById('npc-current-media');
    const totalMediaSpan = document.getElementById('npc-total-media');
    const progressBarFill = document.getElementById('npc-progress-fill');

    if (!currentMediaSpan || !totalMediaSpan || !progressBarFill) {
        console.error('[NPC Counter] ERROR: Elementos del contador o barra de progreso no encontrados.');
        return;
    }

    if (!mediaItems || mediaItems.length === 0) {
        console.warn('[NPC Counter] ADVERTENCIA: No se encontraron elementos .npc-media-item.');
        if (totalMediaSpan) totalMediaSpan.textContent = '00';
        if (currentMediaSpan) currentMediaSpan.textContent = '00';
        if (progressBarFill) progressBarFill.style.width = '0%';
        return;
    }

    totalMediaSpan.textContent = String(mediaItems.length).padStart(2, '0');

    let currentMediaIndex = 0;
    let autoplayTimeout;
    const autoplayDuration = 4000;
    let isAutoplayPaused = false;
    let manualScrollTimeout; // Para debounce del scroll manual

    function attemptScrollToItem(indexToShow) {
        const itemToScrollTo = mediaItems[indexToShow - 1];
        if (itemToScrollTo) {
            console.log(`[NPC Counter DEBUG] AUTOPLAY: Intentando scroll SUAVE a item #${indexToShow}. Elemento:`, itemToScrollTo);
            itemToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' }); // CAMBIO IMPORTANTE AQUÍ
            console.log(`[NPC Counter DEBUG] AUTOPLAY: scrollIntoView({behavior: 'smooth'}) llamado para item #${indexToShow}.`);
            // El evento de scroll natural debería manejar la actualización del contador.
        } else {
            console.warn(`[NPC Counter DEBUG] AUTOPLAY: No se encontró item para el índice ${indexToShow}`);
        }
    }

    function startAutoplay() {
        clearTimeout(autoplayTimeout);
        if (isAutoplayPaused || mediaItems.length <= 1) {
            return;
        }
        // console.log(`[NPC Counter DEBUG] AUTOPLAY: Iniciando timer para item actual ${currentMediaIndex}. Próximo en ${autoplayDuration}ms.`);
        autoplayTimeout = setTimeout(() => {
            if (isAutoplayPaused) return;
            let nextItemIndex = (currentMediaIndex % mediaItems.length) + 1;
            console.log(`[NPC Counter DEBUG] AUTOPLAY: Timeout cumplido. Avanzando de ${currentMediaIndex} a ${nextItemIndex}.`);
            attemptScrollToItem(nextItemIndex);
        }, autoplayDuration);
    }

    function updateDisplay(newIndex) {
        // console.log(`[NPC Counter DEBUG] updateDisplay: Solicitado cambio a ${newIndex}. Actual: ${currentMediaIndex}.`);

        if (newIndex === currentMediaIndex && progressBarFill.style.width === '100%') {
            // console.log(`[NPC Counter DEBUG] Mismo ítem (${newIndex}), barra llena. Reiniciando timer.`);
            startAutoplay();
            return;
        }

        if (newIndex !== currentMediaIndex || progressBarFill.style.width !== '100%') {
            // console.log(`[NPC Counter] ACTUALIZANDO display para item ${newIndex}. Anterior: ${currentMediaIndex}`);
            currentMediaIndex = newIndex;
            currentMediaSpan.textContent = String(currentMediaIndex).padStart(2, '0');

            progressBarFill.style.transition = 'none';
            progressBarFill.style.width = '0%';

            void progressBarFill.offsetWidth;

            progressBarFill.style.transition = `width ${autoplayDuration / 1000}s linear`;
            progressBarFill.style.width = '100%';

            startAutoplay();
        }
    }

    let scrollTicking = false;
    function handleManualScroll() {
        clearTimeout(manualScrollTimeout);
        manualScrollTimeout = setTimeout(() => {
            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    let mostVisibleItemIndex = 0;
                    let maxVisibility = -1;
                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

                    mediaItems.forEach((item, index) => {
                        const rect = item.getBoundingClientRect();
                        if (rect.bottom <= 0 || rect.top >= viewportHeight) return;

                        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
                        const itemHeight = item.offsetHeight;

                        if (itemHeight > 0) {
                            const visibilityPercentage = visibleHeight / itemHeight;
                            if (visibilityPercentage > maxVisibility) {
                                maxVisibility = visibilityPercentage;
                                mostVisibleItemIndex = index;
                            }
                        }
                    });

                    let newIndexToShow = mostVisibleItemIndex + 1;
                    if (maxVisibility < 0.10 && mediaItems.length > 0) {
                        let closestDistanceToCenter = Infinity;
                        let tempClosestIndex = 0;
                        mediaItems.forEach((item, index) => {
                            const rect = item.getBoundingClientRect();
                            const itemCenterInViewport = rect.top + (rect.height / 2);
                            const distance = Math.abs((viewportHeight / 2) - itemCenterInViewport);
                            if (distance < closestDistanceToCenter) {
                                closestDistanceToCenter = distance;
                                tempClosestIndex = index;
                            }
                        });
                        newIndexToShow = tempClosestIndex + 1;
                    }

                    if (newIndexToShow !== currentMediaIndex) {
                         // console.log(`[NPC Counter DEBUG] Scroll manual (debounced) detectó cambio. Nuevo ítem: ${newIndexToShow}.`);
                        updateDisplay(newIndexToShow);
                    }
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, 150); // Debounce para el scroll manual
    }

    window.addEventListener('scroll', handleManualScroll, { passive: true });

    const galleryElement = document.querySelector('.npc-media-gallery');
    if (galleryElement) {
        galleryElement.addEventListener('mouseenter', () => {
            if (mediaItems.length <= 1) return;
            clearTimeout(autoplayTimeout);
            isAutoplayPaused = true;
            const currentWidth = window.getComputedStyle(progressBarFill).width;
            progressBarFill.style.transition = 'none';
            progressBarFill.style.width = currentWidth;
            console.log('[NPC Counter] Autoplay PAUSADO por hover.');
        });

        galleryElement.addEventListener('mouseleave', () => {
            if (mediaItems.length <= 1 || !isAutoplayPaused) return;
            isAutoplayPaused = false;
            console.log(`[NPC Counter] Autoplay REANUDADO post-hover. Reiniciando para item ${currentMediaIndex}.`);
            const tempIndex = currentMediaIndex;
            currentMediaIndex = -1;
            updateDisplay(tempIndex);
        });
    }

    setTimeout(() => {
        // console.log('[NPC Counter] Llamada inicial a updateDisplay (250ms).');
        updateDisplay(1);
    }, 250);
});
