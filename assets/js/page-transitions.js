document.addEventListener('DOMContentLoaded', () => {
    // Lógica de transición de salida para index.html
    const projectLinks = document.querySelectorAll('.p-stage__menu__item');
    projectLinks.forEach(projectItemLi => {
        const targetUrl = projectItemLi.getAttribute('data-canvas-url');
        if (targetUrl && !targetUrl.startsWith('http') && !targetUrl.startsWith('#')) {
            projectItemLi.addEventListener('click', function(event) {
                if (event.target.tagName === 'A' && event.target.closest('.p-stage__menu__item') === this) {
                    event.preventDefault();
                } else if (event.target !== this && this.contains(event.target)) {
                     event.preventDefault();
                }
                console.log('Project link clicked. Target URL:', targetUrl); // DEBUG
                this.classList.add('is-transitioning');
                console.log('Added .is-transitioning to:', this); // DEBUG
                document.body.classList.add('page-transition-out');
                console.log('Added .page-transition-out to body.');// DEBUG
                setTimeout(() => {
                    console.log('Navigating to:', targetUrl); // DEBUG
                    window.location.href = targetUrl;
                }, 550);
            });
        }
    });

    // Lógica para páginas de detalle (project-page)
    if (document.body.classList.contains('project-page')) {
        console.log('Página de detalle detectada (project-page class en body).'); // DEBUG

        // Animación de entrada
        requestAnimationFrame(() => {
            console.log('Añadiendo clase page-transition-in al body.'); // DEBUG
            document.body.classList.add('page-transition-in');
            console.log('Body classList DESPUÉS de añadir page-transition-in:', document.body.classList.toString()); // DEBUG
        });

        // --- INICIO DE LÓGICA INTEGRADA DE project-scroll-counter.js ---
        const mediaGallery = document.querySelector('.project-media-scroll-gallery');
        const currentIndexSpan = document.getElementById('media-current-index');
        const totalCountSpan = document.getElementById('media-total-count');
        const scrollMediaCounterElement = document.getElementById('scroll-media-counter');

        // DEBUG: Verificar selección de elementos del contador
        console.log('Contador Scroll - Elemento scrollMediaCounterElement:', scrollMediaCounterElement);
        console.log('Contador Scroll - Elemento mediaGallery:', mediaGallery);
        console.log('Contador Scroll - Elemento currentIndexSpan:', currentIndexSpan);
        console.log('Contador Scroll - Elemento totalCountSpan:', totalCountSpan);

        if (!mediaGallery || !currentIndexSpan || !totalCountSpan || !scrollMediaCounterElement) {
            if (scrollMediaCounterElement) {
                scrollMediaCounterElement.style.display = 'none';
            }
            console.warn('Contador Scroll - Elementos no encontrados. El contador no funcionará.');
            return; // No continuar con la lógica del contador si faltan elementos
        }

        const mediaElements = Array.from(mediaGallery.querySelectorAll('img, .video-placeholder-container'));
        const totalMedia = mediaElements.length;
        console.log('Contador Scroll - mediaElements count:', mediaElements.length); // DEBUG

        if (totalMedia === 0) {
            scrollMediaCounterElement.style.display = 'none';
            return; // No continuar si no hay medios
        }

        totalCountSpan.textContent = totalMedia;
        currentIndexSpan.textContent = '1';

        function updateScrollCounterSimplified() {
            console.log('Contador Scroll - updateScrollCounterSimplified triggered'); // DEBUG
            let elementInViewIndex = 0;
            const windowHeight = window.innerHeight;
            const activationPoint = windowHeight * 0.3;
            let found = false;

            for (let i = 0; i < mediaElements.length; i++) {
                const el = mediaElements[i];
                const rect = el.getBoundingClientRect();

                if (rect.top <= activationPoint && rect.bottom >= activationPoint) {
                    elementInViewIndex = i;
                    found = true;
                    break;
                }
                if (!found && rect.top < windowHeight && rect.bottom >= 0) { // Si no se ha encontrado uno en el punto de activación, tomar el primero visible
                    elementInViewIndex = i;
                }
            }

            // Si después del bucle no se encontró nada (ej. todo está arriba o abajo del viewport)
            // y hay elementos, intentar deducir si estamos al principio o al final.
            if (!found && mediaElements.length > 0) {
                const firstElRect = mediaElements[0].getBoundingClientRect();
                const lastElRect = mediaElements[mediaElements.length - 1].getBoundingClientRect();
                if (firstElRect.bottom < activationPoint) { // Todos los elementos están por encima del punto de activación
                    elementInViewIndex = mediaElements.length - 1;
                } else if (lastElRect.top > activationPoint) { // Todos los elementos están por debajo
                    elementInViewIndex = 0;
                }
                // Si no, se mantiene el último elementInViewIndex asignado (el primero parcialmente visible)
            }


            console.log('Contador Scroll - Índice simplificado detectado:', elementInViewIndex);

            if (currentIndexSpan) {
                const newIndexText = String(elementInViewIndex + 1);
                if (currentIndexSpan.textContent !== newIndexText) {
                    console.log('Contador Scroll - ACTUALIZANDO contador a:', newIndexText);
                    currentIndexSpan.textContent = newIndexText;
                }
            }
        }

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateScrollCounterSimplified, 60);
        }, { passive: true });

        setTimeout(updateScrollCounterSimplified, 150);
        // --- FIN DE LÓGICA INTEGRADA DE project-scroll-counter.js ---
    }
});
