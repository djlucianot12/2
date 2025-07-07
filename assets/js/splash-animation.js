document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.querySelector('.splash-particles');
    if (particlesContainer) {
        const numberOfParticles = 80;
        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            const delay = Math.random() * 3;
            particle.style.animationDelay = `${delay}s`;
            const twinkleDuration = Math.random() * 2 + 2;
            particle.style.animationDuration = `0.3s, ${twinkleDuration}s`;
            particlesContainer.appendChild(particle);
        }
    }

    function typeTextEffect(element, text, charDelay, callback) {
        if (!element) {
            if (callback) callback();
            return 0;
        }
        element.innerHTML = ''; // Limpiar contenido previo
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                if (callback) callback();
            }
        }, charDelay);
        return text.length * charDelay; // Devuelve la duración estimada de la animación
    }

    const logoElement = document.querySelector('.splash-logo');
    const loadingTextElement = document.querySelector('.splash-loading-text');

    const logoText = "LT STUDIO DESING";
    const loadingText = "ENTRANDO AL ESTUDIO";
    const charDisplayDelay = 80; // ms por caracter

    // Iniciar animación del logo
    const logoAnimationDuration = typeTextEffect(logoElement, logoText, charDisplayDelay, () => {
        // Iniciar animación del texto de carga después de que el logo termine + un pequeño delay
        setTimeout(() => {
            typeTextEffect(loadingTextElement, loadingText, charDisplayDelay, () => {
                // Ambas animaciones de texto han terminado
                // La lógica de la barra de progreso en splash-logic.js se activará después
            });
        }, 200); // 200ms de pausa entre logo y texto de carga
    });

    // Pasar la duración total de las animaciones de texto a splash-logic.js
    // Esto se hace para que splash-logic.js sepa cuándo empezar la barra de progreso.
    // Se usa un evento personalizado o una variable global si es necesario,
    // por ahora, splash-logic.js tendrá que tener una estimación o ser modificado
    // para esperar una señal o un tiempo fijo que considere estas animaciones.
    // La forma más simple es que splash-logic.js tenga su propio delay inicial grande
    // que cubra estas animaciones de texto.
});
