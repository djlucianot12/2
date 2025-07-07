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

    const logoElement = document.querySelector('.splash-logo');
    const loadingTextElement = document.querySelector('.splash-loading-text');

    const logoText = "LT STUDIO DESING";
    const loadingText = "ENTRANDO AL ESTUDIO";
    const charDisplayDelay = 80; // ms por caracter, ajustar para velocidad "rápida y natural"
    const initialDelayLogo = 500; // ms antes de que empiece la animación del logo
    const delayBetweenAnimations = 200; // ms de pausa entre la animación del logo y la del texto de carga

    // Ocultar textos inicialmente para evitar parpadeo del contenido original
    if (logoElement) {
        logoElement.innerHTML = '';
        logoElement.style.opacity = '0'; // Asegurar que esté oculto antes de la animación
    }
    if (loadingTextElement) {
        loadingTextElement.innerHTML = '';
        loadingTextElement.style.opacity = '0'; // Asegurar que esté oculto antes de la animación
    }

    function typeTextEffect(element, text, charDelay, startDelay, onCompleteCallback) {
        if (!element) {
            if (onCompleteCallback) onCompleteCallback();
            return; // No devuelve duración si el elemento no existe
        }

        setTimeout(() => { // Aplicar delay inicial antes de empezar a escribir
            element.innerHTML = ''; // Limpiar de nuevo por si acaso
            element.style.opacity = '1'; // Hacer visible el contenedor justo antes de escribir
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    if (onCompleteCallback) onCompleteCallback();
                }
            }, charDelay);
        }, startDelay);
    }

    // Calcular duración estimada del logo para el siguiente paso
    // (No incluye el startDelay aquí, ya que es para el inicio de esta animación específica)
    const logoAnimationOnlyDuration = logoText.length * charDisplayDelay;

    // Iniciar animación del logo
    typeTextEffect(logoElement, logoText, charDisplayDelay, initialDelayLogo, () => {
        // Iniciar animación del texto de carga después de que el logo termine + delayBetweenAnimations
        // El startDelay para el siguiente texto es relativo al inicio de la página,
        // o más bien, secuencial después del anterior.
        // El inicio real del texto de carga será: initialDelayLogo + logoAnimationOnlyDuration + delayBetweenAnimations
        typeTextEffect(loadingTextElement, loadingText, charDisplayDelay, delayBetweenAnimations, () => {
            // Ambas animaciones de texto han terminado.
            // Disparar un evento personalizado para que splash-logic.js sepa cuándo continuar.
            const event = new CustomEvent('textAnimationsComplete');
            document.dispatchEvent(event);
        });
    });
});
