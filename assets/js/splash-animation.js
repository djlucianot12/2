document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.querySelector('.splash-particles');
    if (!particlesContainer) return;

    const numberOfParticles = 50; // Número de partículas

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
        particle.style.animationDuration = `0.5s, ${twinkleDuration}s`;


        particlesContainer.appendChild(particle);
    }
});
