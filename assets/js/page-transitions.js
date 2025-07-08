document.addEventListener('DOMContentLoaded', () => {
    const projectLinks = document.querySelectorAll('.p-stage__menu__item a, .p-stage__menu__item'); // Selector más amplio por si el 'a' no es el único target

    projectLinks.forEach(link => {
        // Intentar obtener el 'li' padre si el target es el 'a' o el span interno
        let projectItemLi = link;
        if (!projectItemLi.classList.contains('p-stage__menu__item')) {
            projectItemLi = link.closest('.p-stage__menu__item');
        }

        if (!projectItemLi) return;

        // Obtener la URL del atributo data-canvas-url del LI
        const targetUrl = projectItemLi.getAttribute('data-canvas-url');

        if (targetUrl && !targetUrl.startsWith('http')) { // Solo para enlaces internos de proyectos

            // Usar un event listener en el LI para capturar el clic
            projectItemLi.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation(); // Prevenir que otros listeners en elementos padres se disparen

                // 1. Aplicar animación de salida al elemento LI clickeado
                this.classList.add('is-transitioning');

                // 2. Aplicar animación de salida al body
                document.body.classList.add('page-transition-out');

                // 3. Esperar que las animaciones terminen y luego navegar
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 550); // Un poco más que la duración de la transición más larga (0.5s)
            });
        }
    });

    // Para la animación de entrada en las páginas de detalle
    // Esto se podría poner en project-detail.js o aquí si es genérico
    if (document.body.classList.contains('project-page')) {
        // Forzar un reflujo para asegurar que la transición se aplique después de los estilos iniciales
        // window.getComputedStyle(document.body).opacity;
        requestAnimationFrame(() => {
            document.body.classList.add('page-transition-in');
        });
    }
});
