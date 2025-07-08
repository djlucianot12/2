document.addEventListener('DOMContentLoaded', () => {
    const mediaGallery = document.querySelector('.project-media-scroll-gallery');
    const currentIndexSpan = document.getElementById('media-current-index');
    const totalCountSpan = document.getElementById('media-total-count');
    const scrollMediaCounterElement = document.getElementById('scroll-media-counter');

    // DEBUG: Verificar selección de elementos
    console.log('Contador Scroll - Elemento scrollMediaCounterElement:', scrollMediaCounterElement);
    console.log('Contador Scroll - Elemento mediaGallery:', mediaGallery);
    console.log('Contador Scroll - Elemento currentIndexSpan:', currentIndexSpan);
    console.log('Contador Scroll - Elemento totalCountSpan:', totalCountSpan);

    if (!mediaGallery || !currentIndexSpan || !totalCountSpan || !scrollMediaCounterElement) {
        if (scrollMediaCounterElement) {
            scrollMediaCounterElement.style.display = 'none';
        }
        console.warn('Contador Scroll - Elementos no encontrados. El contador no funcionará.');
        return;
    }

    const mediaElements = Array.from(mediaGallery.querySelectorAll('img, .video-placeholder-container'));
    const totalMedia = mediaElements.length;
    console.log('Contador Scroll - mediaElements count:', mediaElements.length); // DEBUG

    if (totalMedia === 0) {
        scrollMediaCounterElement.style.display = 'none';
        return;
    }

    totalCountSpan.textContent = totalMedia;
    currentIndexSpan.textContent = '1';

    function updateScrollCounterSimplified() {
        console.log('Contador Scroll - updateScrollCounterSimplified triggered'); // DEBUG
        let elementInViewIndex = 0; // Default to 0 (index for 1st item)
        const windowHeight = window.innerHeight;
        // Punto de activación: considera un elemento "actual" si su parte superior
        // ha pasado el 30% superior de la ventana, pero aún no ha salido completamente por arriba.
        const activationPoint = windowHeight * 0.3;

        for (let i = 0; i < mediaElements.length; i++) {
            const el = mediaElements[i];
            const rect = el.getBoundingClientRect();

            // console.log(`Media ${i}: top: ${rect.top}, bottom: ${rect.bottom}, height: ${rect.height}`); // DEBUG

            // Si la parte superior del elemento está por encima del punto de activación
            // Y la parte inferior del elemento está por debajo del punto de activación (o sea, el punto está DENTRO del elemento)
            // O si la parte superior del elemento está visible y es el último elemento (para asegurar que el último se marque)
            if (rect.top <= activationPoint && rect.bottom >= activationPoint) {
                elementInViewIndex = i;
                break; // Encontramos el primero que cumple, es el actual
            }
            // Si estamos al final y el último elemento está parcialmente visible desde abajo
            if (i === mediaElements.length -1 && rect.top < windowHeight && rect.bottom >=0) {
                 elementInViewIndex = i;
            }
        }

        console.log('Contador Scroll - Índice simplificado detectado:', elementInViewIndex);

        if (currentIndexSpan) { // Doble chequeo por si acaso
            const newIndexText = String(elementInViewIndex + 1);
            if (currentIndexSpan.textContent !== newIndexText) {
                console.log('Contador Scroll - ACTUALIZANDO contador a:', newIndexText);
                currentIndexSpan.textContent = newIndexText;
            }
        }
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // console.log('Scroll event fired'); // DEBUG - Muy verboso, usar con cuidado
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateScrollCounterSimplified, 60); // Ajustado a 60ms
    }, { passive: true });

    // Llamada inicial para establecer el contador correctamente
    setTimeout(updateScrollCounterSimplified, 150); // Pequeño delay para asegurar que el layout esté estable
});
