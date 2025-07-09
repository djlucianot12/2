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
                // console.log('Project link clicked. Target URL:', targetUrl);
                this.classList.add('is-transitioning');
                // console.log('Added .is-transitioning to:', this);
                document.body.classList.add('page-transition-out');
                // console.log('Added .page-transition-out to body.');
                setTimeout(() => {
                    // console.log('Navigating to:', targetUrl);
                    window.location.href = targetUrl;
                }, 550);
            });
        }
    });

    // Lógica para páginas de detalle (project-page)
    if (document.body.classList.contains('project-page')) {
        // console.log('Página de detalle detectada (project-page class en body).');

        requestAnimationFrame(() => {
            // console.log('Añadiendo clase page-transition-in al body.');
            document.body.classList.add('page-transition-in');
            // console.log('Body classList DESPUÉS de añadir page-transition-in:', document.body.classList.toString());
        });

        setTimeout(() => {
            // console.log('Contador Scroll - Iniciando lógica del contador después de un delay de 250ms.');

            const mediaGallery = document.querySelector('.project-media-scroll-gallery');
            const currentIndexSpan = document.getElementById('media-current-index');
            const totalCountSpan = document.getElementById('media-total-count');
            const scrollMediaCounterElement = document.getElementById('scroll-media-counter');

            // console.log('Contador Scroll - Elemento scrollMediaCounterElement:', scrollMediaCounterElement);
            // console.log('Contador Scroll - Elemento mediaGallery:', mediaGallery);
            // console.log('Contador Scroll - Elemento currentIndexSpan:', currentIndexSpan);
            // console.log('Contador Scroll - Elemento totalCountSpan:', totalCountSpan);

            if (!mediaGallery || !currentIndexSpan || !totalCountSpan || !scrollMediaCounterElement) {
                if (scrollMediaCounterElement) {
                    scrollMediaCounterElement.style.display = 'none';
                }
                // console.warn('Contador Scroll - Elementos no encontrados DESPUÉS DEL DELAY. El contador no funcionará.');
                return;
            }

            const mediaElements = Array.from(mediaGallery.querySelectorAll('img, .video-placeholder-container'));
            const totalMedia = mediaElements.length;
            // console.log('Contador Scroll - mediaElements count:', mediaElements.length);

            if (totalMedia === 0) {
                scrollMediaCounterElement.style.display = 'none';
                return;
            }

            totalCountSpan.textContent = totalMedia;
            currentIndexSpan.textContent = '1'; // Restaurado a textContent normal

            function updateScrollCounterSimplified() {
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
                    if (!found && rect.top < windowHeight && rect.bottom >= 0) {
                        elementInViewIndex = i;
                    }
                }

                if (!found && mediaElements.length > 0) {
                    const firstElRect = mediaElements[0].getBoundingClientRect();
                    const lastElRect = mediaElements[mediaElements.length - 1].getBoundingClientRect();
                    if (firstElRect.bottom < activationPoint) {
                        elementInViewIndex = mediaElements.length - 1;
                    } else if (lastElRect.top > activationPoint) {
                        elementInViewIndex = 0;
                    }
                } else if (mediaElements.length === 0) {
                     elementInViewIndex = 0;
                }

                if (currentIndexSpan) {
                    const newIndexText = String(elementInViewIndex + 1);
                    if (currentIndexSpan.textContent !== newIndexText) {
                        currentIndexSpan.textContent = newIndexText; // Restaurado a textContent normal
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
        }, 250);
    }
});
