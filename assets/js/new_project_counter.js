document.addEventListener('DOMContentLoaded', function () {
    console.log('[NPC Counter] DOMContentLoaded: Script para contador con animación de números iniciado.');

    const mediaItems = document.querySelectorAll('.npc-media-item');
    // const currentMediaSpan = document.getElementById('npc-current-media'); // Ya no se usa directamente para el número
    const totalMediaSpan = document.getElementById('npc-total-media');

    // Vistas para los números animados
    const viewA_tens = document.querySelector('#npc-digits-view-a .npc-digit-tens');
    const viewA_ones = document.querySelector('#npc-digits-view-a .npc-digit-ones');
    const viewB_tens = document.querySelector('#npc-digits-view-b .npc-digit-tens');
    const viewB_ones = document.querySelector('#npc-digits-view-b .npc-digit-ones');
    const viewA_el = document.getElementById('npc-digits-view-a');
    const viewB_el = document.getElementById('npc-digits-view-b');

    if (!totalMediaSpan || !viewA_el || !viewB_el || !viewA_tens || !viewA_ones || !viewB_tens || !viewB_ones) {
        console.error('[NPC Counter] ERROR: Elementos del contador para animación no encontrados. Verifique IDs y clases.');
        return;
    }
    // console.log('[NPC Counter] Elementos del contador para animación encontrados.');

    if (!mediaItems || mediaItems.length === 0) {
        console.warn('[NPC Counter] ADVERTENCIA: No se encontraron elementos .npc-media-item.');
        if (totalMediaSpan) totalMediaSpan.textContent = '00';
        if (viewA_tens) viewA_tens.textContent = '0';
        if (viewA_ones) viewA_ones.textContent = '0';
        return;
    }
    // console.log(`[NPC Counter] ${mediaItems.length} mediaItems encontrados.`);

    totalMediaSpan.textContent = String(mediaItems.length).padStart(2, '0');

    let currentMediaIndex = 0;
    let activeView = { el: viewA_el, tens: viewA_tens, ones: viewA_ones };
    let inactiveView = { el: viewB_el, tens: viewB_tens, ones: viewB_ones };

    // Inicializar vistas
    activeView.el.classList.add('is-active');
    activeView.el.style.transform = 'translateY(0%)';
    activeView.el.style.opacity = '1';
    inactiveView.el.style.transform = 'translateY(100%)'; // Listo para entrar desde abajo
    inactiveView.el.style.opacity = '0';


    function updateDigitsInView(view, number) {
        const numStr = String(number).padStart(2, '0');
        view.tens.textContent = numStr[0];
        view.ones.textContent = numStr[1];
    }

    updateDigitsInView(activeView, 1); // Inicializar con 01
    currentMediaIndex = 1;
    console.log(`[NPC Counter] Inicializado. Total: ${totalMediaSpan.textContent}, Actual: ${activeView.tens.textContent}${activeView.ones.textContent}`);

    let autoplayTimeout;
    const autoplayDuration = 4000;
    let isAutoplayPaused = false;
    let manualScrollTimeout;

    function startAutoplay() {
        clearTimeout(autoplayTimeout);
        if (isAutoplayPaused || mediaItems.length <= 1) return;
        // console.log(`[NPC Counter DEBUG] AUTOPLAY: Iniciando timer para item ${currentMediaIndex}.`);
        autoplayTimeout = setTimeout(() => {
            if (isAutoplayPaused) return;
            let nextItemIndex = (currentMediaIndex % mediaItems.length) + 1;
            // console.log(`[NPC Counter DEBUG] AUTOPLAY: Timeout. Avanzando a ${nextItemIndex}.`);
            const itemToScrollTo = mediaItems[nextItemIndex - 1];
            if (itemToScrollTo) {
                itemToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, autoplayDuration);
    }

    function animateAndUpdateDisplay(newIndex) {
        if (newIndex === currentMediaIndex) {
             // Si es el mismo índice, pero la barra (aún no implementada aquí) se reinició,
             // o si se reanuda el autoplay, simplemente reiniciar el timer.
            startAutoplay();
            return;
        }
        console.log(`[NPC Counter] ANIMANDO display para item ${newIndex}. Anterior: ${currentMediaIndex}`);

        updateDigitsInView(inactiveView, newIndex); // Poner el nuevo número en la vista inactiva

        activeView.el.classList.remove('is-active');
        activeView.el.classList.add('is-exiting');

        inactiveView.el.classList.remove('is-exiting'); // Asegurar que no tenga esta clase
        inactiveView.el.style.transform = 'translateY(100%)'; // Asegurar que entra desde abajo
        inactiveView.el.style.opacity = '0';

        // Forzar reflujo para aplicar el estado inicial de inactiveView antes de la animación de entrada
        void inactiveView.el.offsetWidth;

        inactiveView.el.classList.add('is-active');

        // Intercambiar roles
        let tempView = activeView;
        activeView = inactiveView;
        inactiveView = tempView;

        currentMediaIndex = newIndex;

        // Después de que la transición CSS termine, resetear la vista que acaba de salir
        setTimeout(() => {
            inactiveView.el.classList.remove('is-exiting');
            // Podríamos moverlo a translateY(100%) y opacity 0 aquí también,
            // pero la clase .is-entering (o la ausencia de .is-active) debería manejarlo.
        }, 400); // Duración de la transición CSS

        startAutoplay();
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
                        animateAndUpdateDisplay(newIndexToShow);
                    }
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, 150);
    }

    window.addEventListener('scroll', handleManualScroll, { passive: true });

    const galleryElement = document.querySelector('.npc-media-gallery');
    if (galleryElement) {
        galleryElement.addEventListener('mouseenter', () => {
            if (mediaItems.length <= 1) return;
            clearTimeout(autoplayTimeout);
            isAutoplayPaused = true;
            console.log('[NPC Counter] Autoplay PAUSADO por hover.');
        });
        galleryElement.addEventListener('mouseleave', () => {
            if (mediaItems.length <= 1 || !isAutoplayPaused) return;
            isAutoplayPaused = false;
            console.log(`[NPC Counter] Autoplay REANUDADO post-hover. Reiniciando para item ${currentMediaIndex}.`);
            const tempIndex = currentMediaIndex;
            currentMediaIndex = -1;
            animateAndUpdateDisplay(tempIndex);
        });
    }

    setTimeout(() => {
        console.log('[NPC Counter] Llamada inicial a animateAndUpdateDisplay (250ms).');
        animateAndUpdateDisplay(1);
    }, 250);
});
