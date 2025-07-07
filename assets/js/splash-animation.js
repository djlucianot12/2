document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.querySelector('.splash-particles');
    if (!particlesContainer) return;

    const numberOfParticles = 80; // Aumentado a 80 partículas

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Posición aleatoria
        const x = Math.random() * 100; // Porcentaje del ancho
        const y = Math.random() * 100; // Porcentaje de la altura
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;

        // Tamaño aleatorio
        const size = Math.random() * 5 + 2; // Entre 2px y 7px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Retraso de animación aleatorio para efecto escalonado
        const delay = Math.random() * 3; // Retraso hasta 3 segundos
        particle.style.animationDelay = `${delay}s`;

        // Duración de la animación 'twinkle' aleatoria para más variedad
        const twinkleDuration = Math.random() * 2 + 2; // Entre 2s y 4s
        particle.style.animationDuration = `0.3s, ${twinkleDuration}s`; // fadeInParticle duration from CSS


        particlesContainer.appendChild(particle);
    }

    // Animación de aparición secuencial de letras para el logo
    const logo = document.querySelector('.splash-logo');
    let logoAnimationDuration = 0;
    if (logo) {
        const text = logo.textContent.trim();
        const logoChars = text.split('');
        logo.innerHTML = ''; // Limpiar contenido original
        logoChars.forEach((char, index) => {
            const span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
                span.style.opacity = '1';
            } else {
                span.textContent = char;
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px)';
                span.style.animation = `logoLetterAppear 0.5s ease forwards ${0.5 + index * 0.07}s`;
            }
            logo.appendChild(span);
        });
        logoAnimationDuration = 0.5 + (logoChars.length -1) * 0.07 + 0.5; // Duración total animación logo
    }

    // Animación de aparición secuencial para "Entrando al estudio..."
    const loadingText = document.querySelector('.splash-loading-text');
    if (loadingText) {
        const text = loadingText.textContent.trim();
        loadingText.innerHTML = ''; // Limpiar contenido original
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
                span.style.opacity = '1';
            } else {
                span.textContent = char;
                span.style.opacity = '0';
                span.style.transform = 'translateY(15px)';
                // Iniciar después de la animación del logo
                span.style.animation = `loadingTextLetterAppear 0.4s ease forwards ${logoAnimationDuration + 0.2 + index * 0.06}s`;
            }
            loadingText.appendChild(span);
        });
    }
});
