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
        progressBarFill.style.width = '0%';
        return;
    }
    // console.log(`[NPC Counter] ${mediaItems.length} mediaItems encontrados.`);

    totalMediaSpan.textContent = String(mediaItems.length).padStart(2, '0');
    // currentMediaSpan.textContent = '01'; // Se establecerá en la primera llamada a updateCounterAndProgress

    let currentMediaIndex = 0; // Iniciar en 0 para que la primera actualización a 1 se registre como cambio
    let autoplayTimeout;
    const autoplayDuration = 4000; // 4 segundos por ítem
    let isAutoplayPaused = false;
    let isScrollingProgrammatically = false;


    function scrollToItem(indexToShow) {
        const itemToScrollTo = mediaItems[indexToShow - 1]; // indexToShow es 1-based
        if (itemToScrollTo) {
            isScrollingProgrammatically = true;
            console.log(`[NPC Counter] Autoplay: Haciendo scroll a item #${indexToShow}`);
            itemToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Se espera que el evento de scroll active updateActiveMedia y luego updateCounterAndProgress
            // Para evitar un doble trigger o un trigger prematuro, se usa el flag isScrollingProgrammatically
            setTimeout(() => {
                isScrollingProgrammatically = false;
            }, 750); // Tiempo para que el scroll suave termine (ajustar si es necesario)
        }
    }

    function startAutoplayTimer() {
        clearTimeout(autoplayTimeout);
        if (isAutoplayPaused || mediaItems.length <= 1) { // No autoplay si está pausado o hay solo 1 item
            // console.log('[NPC Counter] Autoplay pausado o no necesario, no se inicia nuevo timer.');
            return;
        }
        // console.log(`[NPC Counter] Iniciando timer de autoplay para item ${currentMediaIndex} (duración: ${autoplayDuration}ms)`);
        autoplayTimeout = setTimeout(() => {
            if (isAutoplayPaused) return; // Doble chequeo
            let nextIndex = (currentMediaIndex % mediaItems.length) + 1;
            scrollToItem(nextIndex);
        }, autoplayDuration);
    }

    function updateCounterAndProgress(newIndex) {
        // console.log(`[NPC Counter] updateCounterAndProgress llamado con newIndex: ${newIndex}, currentMediaIndex: ${currentMediaIndex}`);

        // Si el índice no ha cambiado realmente Y la barra ya está llena (evitar reinicios innecesarios)
        if (newIndex === currentMediaIndex && progressBarFill.style.width === '100%') {
            // console.log(`[NPC Counter] Mismo ítem (${newIndex}) y barra llena. Reiniciando timer si no está pausado.`);
            startAutoplayTimer();
            return;
        }

        console.log(`[NPC Counter] ACTUALIZANDO a item ${newIndex}`);
        currentMediaIndex = newIndex;
        currentMediaSpan.textContent = String(currentMediaIndex).padStart(2, '0');

        progressBarFill.style.transition = 'none';
        progressBarFill.style.width = '0%';

        void progressBarFill.offsetWidth;

        progressBarFill.style.transition = `width ${autoplayDuration / 1000}s linear`;
        progressBarFill.style.width = '100%';

        startAutoplayTimer();
    }

    let ticking = false;
    function handleScroll() {
        if (isScrollingProgrammatically) {
            // console.log('[NPC Counter] Scroll programático detectado, ignorando handleScroll temporalmente.');
            return;
        }
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // console.log('[NPC Counter] requestAnimationFrame: handleScroll');
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

                if (maxVisibility < 0.05 && mediaItems.length > 0) { // Umbral muy bajo, si casi nada es visible
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
                     console.log(`[NPC Counter] Scroll manual detectó cambio. Nuevo ítem: ${newIndexToShow}. Ítem anterior: ${currentMediaIndex}`);
                    updateCounterAndProgress(newIndexToShow);
                } else if (progressBarFill.style.width !== '100%' && !autoplayTimeout && !isAutoplayPaused) {
                    // Si el scroll no cambió el índice, pero la barra no está llena y no hay timer,
                    // podría ser que el usuario hizo un pequeño scroll que no cambió el item dominante
                    // pero sí interrumpió un timer. Reiniciamos el timer para el item actual.
                    // console.log(`[NPC Counter] Scroll no cambió el ítem, pero se reinicia el timer para item ${currentMediaIndex}`);
                    // startAutoplayTimer(); // Esto puede ser muy agresivo.
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

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
            console.log('[NPC Counter] Autoplay REANUDADO post-hover. Reiniciando para item ' + currentMediaIndex);
            // Forzar reinicio de la barra y el timer para el ítem actual
            // Truco para forzar que updateCounterAndProgress reinicie la barra:
            const tempIndex = currentMediaIndex;
            currentMediaIndex = -1; // Para que la condición newIndex !== currentMediaIndex sea verdadera
            updateCounterAndProgress(tempIndex);
        });
    }

    setTimeout(() => {
        console.log('[NPC Counter] Llamada inicial a updateCounterAndProgress (después de 250ms).');
        updateCounterAndProgress(1);
    }, 250);
});
