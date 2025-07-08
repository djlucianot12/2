document.addEventListener('DOMContentLoaded', () => {
    const mediaDataContainer = document.getElementById('media-data');
    const activeImage = document.getElementById('active-media-image');
    const activeVideo = document.getElementById('active-media-video');
    const prevButton = document.getElementById('prev-media');
    const nextButton = document.getElementById('next-media');
    const currentIndexSpan = document.getElementById('media-current-index');
    const totalCountSpan = document.getElementById('media-total-count');

    if (!mediaDataContainer || !activeImage || !activeVideo || !prevButton || !nextButton || !currentIndexSpan || !totalCountSpan) {
        console.error('Error: No se encontraron todos los elementos necesarios para la galería de proyecto.');
        return;
    }

    const mediaItems = [];
    mediaDataContainer.querySelectorAll('div[data-type]').forEach(item => {
        mediaItems.push({
            type: item.dataset.type,
            src: item.dataset.src,
            alt: item.dataset.alt || 'Medio del proyecto'
        });
    });

    let currentMediaIndex = 0;
    const totalMediaCount = mediaItems.length;

    function showMedia(index) {
        if (index < 0 || index >= totalMediaCount) {
            console.warn('Índice de medio fuera de rango:', index);
            return;
        }

        currentMediaIndex = index;
        const item = mediaItems[index];

        if (item.type === 'image') {
            activeImage.src = item.src;
            activeImage.alt = item.alt;
            activeImage.style.display = 'block';
            activeVideo.style.display = 'none';
            activeVideo.src = ''; // Detener video si estaba reproduciéndose
        } else if (item.type === 'video') {
            activeVideo.src = item.src;
            activeVideo.title = item.alt;
            activeVideo.style.display = 'block';
            activeImage.style.display = 'none';
        }

        currentIndexSpan.textContent = currentMediaIndex + 1;
        totalCountSpan.textContent = totalMediaCount;

        // Habilitar/deshabilitar botones de navegación
        prevButton.disabled = currentMediaIndex === 0;
        nextButton.disabled = currentMediaIndex === totalMediaCount - 1;
    }

    prevButton.addEventListener('click', () => {
        if (currentMediaIndex > 0) {
            showMedia(currentMediaIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentMediaIndex < totalMediaCount - 1) {
            showMedia(currentMediaIndex + 1);
        }
    });

    // Mostrar el primer medio al cargar
    if (totalMediaCount > 0) {
        showMedia(0);
    } else {
        // No hay medios, ocultar navegación y contador
        if(document.querySelector('.media-navigation')) document.querySelector('.media-navigation').style.display = 'none';
        if(document.querySelector('.media-counter-container')) document.querySelector('.media-counter-container').style.display = 'none';
        activeImage.alt = 'No hay medios disponibles para este proyecto.';
    }
});
