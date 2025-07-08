document.addEventListener('DOMContentLoaded', () => {
    const projectLinks = document.querySelectorAll('.p-stage__menu__item');

    projectLinks.forEach(projectItemLi => {
        // Obtener la URL del atributo data-canvas-url del LI
        const targetUrl = projectItemLi.getAttribute('data-canvas-url');

        if (targetUrl && !targetUrl.startsWith('http') && !targetUrl.startsWith('#')) { // Solo para enlaces internos de proyectos y evitar #

            projectItemLi.addEventListener('click', function(event) {
                // Prevenir la navegación si el clic fue en un 'a' dentro del 'li' y ya lo estamos manejando.
                // O si el propio 'li' es el enlace principal (común en algunos diseños JS).
                if (event.target.tagName === 'A' && event.target.closest('.p-stage__menu__item') === this) {
                    event.preventDefault();
                } else if (event.target !== this && this.contains(event.target)) {
                    // Si el clic es en un hijo pero no un 'a' que navegue a otro sitio, prevenir si es necesario.
                    // En este caso, el data-canvas-url está en el LI, así que el LI es el "enlace".
                     event.preventDefault();
                }


                console.log('Project link clicked. Target URL:', targetUrl); // DEBUG

                // 1. Aplicar animación de salida al elemento LI clickeado
                this.classList.add('is-transitioning');
                console.log('Added .is-transitioning to:', this); // DEBUG

                // 2. Aplicar animación de salida al body
                document.body.classList.add('page-transition-out');
                console.log('Added .page-transition-out to body.');// DEBUG


                // 3. Esperar que las animaciones terminen y luego navegar
                setTimeout(() => {
                    console.log('Navigating to:', targetUrl); // DEBUG
                    window.location.href = targetUrl;
                }, 550);
            });
        }
    });

    // Para la animación de entrada en las páginas de detalle
    if (document.body.classList.contains('project-page')) {
        console.log('Página de detalle detectada (project-page class en body).'); // DEBUG
        // Forzar un reflujo para asegurar que la transición se aplique después de los estilos iniciales
        // window.getComputedStyle(document.body).opacity; // Esto puede no ser necesario con requestAnimationFrame

        requestAnimationFrame(() => {
            console.log('Añadiendo clase page-transition-in al body.'); // DEBUG
            document.body.classList.add('page-transition-in');
            console.log('Body classList DESPUÉS de añadir page-transition-in:', document.body.classList.toString()); // DEBUG
        });
    } else {
        // console.log('No es una página de detalle (no se encontró project-page class en body).'); // DEBUG
    }
});
