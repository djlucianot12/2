document.addEventListener('DOMContentLoaded', function () {
    console.log('[NPC Counter] DOMContentLoaded: Script de contador con barra de progreso iniciado.');

    const mediaItems = document.querySelectorAll('.npc-media-item');
    const currentMediaSpan = document.getElementById('npc-current-media');
    const totalMediaSpan = document.getElementById('npc-total-media');
    const progressBarFill = document.getElementById('npc-progress-fill');

    if (!currentMediaSpan || !totalMediaSpan || !progressBarFill) {
        console.error('[NPC Counter] ERROR: Elementos del contador o barra de progreso no encontrados. IDs requeridos: npc-current-media, npc-total-media, npc-progress-fill.');
        return;
    }
    // console.log('[NPC Counter] Elementos del contador y barra de progreso encontrados.');

    if (!mediaItems || mediaItems.length === 0) {
        console.warn('[NPC Counter] ADVERTENCIA: No se encontraron elementos .npc-media-item.');
        if (totalMediaSpan) totalMediaSpan.textContent = '00';
        if (currentMediaSpan) currentMediaSpan.textContent = '00';
        if (progressBarFill) progressBarFill.style.width = '0%';
        return;
    }
    // console.log(`[NPC Counter] ${mediaItems.length} mediaItems encontrados.`);

    totalMediaSpan.textContent = String(mediaItems.length).padStart(2, '0');

    let currentMediaIndex = 0;
    let autoplayTimeout;
    const autoplayDuration = 4000;
    let isAutoplayPaused = false;
    let manualScrollTimeout;

    function attemptScrollToItem(indexToShow) {
        const itemToScrollTo = mediaItems[indexToShow - 1];
        if (itemToScrollTo) {
            console.log(`[NPC Counter DEBUG] AUTOPLAY: Intentando scroll a item #${indexToShow}. Elemento:`, itemToScrollTo);
            itemToScrollTo.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            console.log(`[NPC Counter DEBUG] AUTOPLAY: scrollIntoView llamado para item #${indexToShow}.`);
            // Forzar la actualización del contador inmediatamente después de intentar el scroll,
            // ya que el evento de scroll puede no ser detectado o ser anulado por isScrollingProgrammatically
            // que se setearía en el siguiente ciclo de eventos.
            // Sin embargo, esto podría ser prematuro si el scroll no ha terminado.
            // Una mejor aproximación es que updateDisplay se llame DESPUÉS del scroll.
            // Por ahora, confiaremos en que el evento de scroll se dispare, pero con logs.
        } else {
            console.warn(`[NPC Counter DEBUG] AUTOPLAY: No se encontró item para el índice ${indexToShow}`);
        }
    }

    function startAutoplay() {
        clearTimeout(autoplayTimeout);
        if (isAutoplayPaused || mediaItems.length <= 1) {
            // console.log('[NPC Counter DEBUG] Autoplay pausado o no necesario, no se inicia nuevo timer.');
            return;
        }
        console.log(`[NPC Counter DEBUG] AUTOPLAY: Iniciando timer para item actual ${currentMediaIndex}. Próximo en ${autoplayDuration}ms.`);
        autoplayTimeout = setTimeout(() => {
            if (isAutoplayPaused) {
                console.log('[NPC Counter DEBUG] Autoplay estaba pausado en el momento del timeout del autoplay.');
                return;
            }
            let nextItemIndex = (currentMediaIndex % mediaItems.length) + 1;
            console.log(`[NPC Counter DEBUG] AUTOPLAY: Timeout cumplido. Avanzando de ${currentMediaIndex} a ${nextItemIndex}.`);
            attemptScrollToItem(nextItemIndex);
        }, autoplayDuration);
    }

    function updateDisplay(newIndex, triggeredByAutoplay = false) {
        console.log(`[NPC Counter DEBUG] updateDisplay: Solicitado cambio a ${newIndex}. Actual: ${currentMediaIndex}. TriggeredByAutoplay: ${triggeredByAutoplay}`);

        // Solo actualizar si el índice realmente cambia.
        // Si es el mismo índice y la barra ya está al 100%, no hacer nada más que reiniciar el timer si es necesario.
        if (newIndex === currentMediaIndex && progressBarFill.style.width === '100%') {
            if (!triggeredByAutoplay) { // Si fue scroll manual al mismo item, y la barra está llena, reiniciar timer.
                 console.log(`[NPC Counter DEBUG] updateDisplay: Mismo ítem (${newIndex}), barra llena. Reiniciando timer.`);
                startAutoplay();
            }
            return;
        }

        console.log(`[NPC Counter] ACTUALIZANDO display para item ${newIndex}. Anterior: ${currentMediaIndex}`);
        currentMediaIndex = newIndex;
        currentMediaSpan.textContent = String(currentMediaIndex).padStart(2, '0');

        progressBarFill.style.transition = 'none';
        progressBarFill.style.width = '0%';

        void progressBarFill.offsetWidth;

        progressBarFill.style.transition = `width ${autoplayDuration / 1000}s linear`;
        progressBarFill.style.width = '100%';

        startAutoplay();
    }

    let scrollTicking = false;
    function handleManualScroll() {
        clearTimeout(manualScrollTimeout); // Limpiar timeout si el usuario sigue scrolleando
        manualScrollTimeout = setTimeout(() => { // Esperar a que el scroll manual "termine"
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
                         console.log(`[NPC Counter DEBUG] Scroll manual (debounced) detectó cambio. Nuevo ítem: ${newIndexToShow}.`);
                        updateDisplay(newIndexToShow, false); // false indica que no fue por autoplay
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
            progressBarFill.style.transition = 'none'; // Pausar animación de la barra
            progressBarFill.style.width = currentWidth;
            console.log('[NPC Counter] Autoplay PAUSADO por hover.');
        });

        galleryElement.addEventListener('mouseleave', () => {
            if (mediaItems.length <= 1 || !isAutoplayPaused) return;
            isAutoplayPaused = false;
            console.log(`[NPC Counter] Autoplay REANUDADO post-hover. Reiniciando para item ${currentMediaIndex}.`);
            // Forzar reinicio de la barra y el timer para el ítem actual
            const tempIndex = currentMediaIndex;
            currentMediaIndex = -1; // Para forzar que updateDisplay vea un cambio si el índice es el mismo
            updateDisplay(tempIndex, false); // false indica que no fue por autoplay
        });
    }

    // Llamada inicial para configurar el primer ítem
    setTimeout(() => {
        console.log('[NPC Counter] Llamada inicial a updateDisplay (250ms).');
        updateDisplay(1, true); // true indica que es el inicio, como si fuera un autoplay para el primer item
    }, 250);
});
