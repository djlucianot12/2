document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const progressBarContainer = document.querySelector('.splash-screen .progress-bar-container');
    const progressBar = document.querySelector('.splash-screen .progress-bar');
    const progressPercentageText = document.querySelector('.splash-screen .progress-percentage');
    const mainContent = document.getElementById('wrapper');
    const loadingScreen = document.getElementById('loading');
    const logo = document.querySelector('.splash-logo');
    const splashLoadingText = document.querySelector('.splash-loading-text');

    if (!splashScreen || !progressBarContainer || !progressBar || !progressPercentageText || !mainContent || !loadingScreen || !logo || !splashLoadingText) {
        console.error('Uno o más elementos críticos de la splash screen o contenido principal no fueron encontrados.');
        if(splashScreen) splashScreen.style.display = 'none';
        if(loadingScreen) loadingScreen.style.display = 'none';
        if(mainContent) mainContent.style.opacity = '1';
        return;
    }

    let progress = 0;
    const intervalTime = 30;
    const totalDuration = 11000; // Aumentada a 11000ms (7000 + 4000)
    const progressIncrement = (intervalTime / totalDuration) * 100;

    mainContent.style.opacity = '0';
    mainContent.style.transform = 'scale(0.95)';
    mainContent.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    mainContent.style.transformOrigin = 'center center';

    loadingScreen.style.display = 'none';
    progressPercentageText.textContent = '0%'; // Cambiado a formato X%
    progressBarContainer.style.opacity = '0'; // Iniciar invisible
    progressPercentageText.style.opacity = '0'; // Iniciar invisible

    // Determinar cuándo deben aparecer la barra y el porcentaje
    let logoAnimationTotalDuration = 0;
    if (logo && logo.textContent.length > 0) {
        // Asumiendo que la animación de JS en splash-animation.js usa 80ms por caracter + 500ms de delay inicial
        // y 0.07s (70ms) por letra para la animación CSS que se aplica desde JS.
        // const logoBaseDelay = 500; // Delay inicial de la animación del logo
        // const logoCharAnimDuration = 500; // Duración de la animación de cada letra
        // const logoCharAppearStagger = 70; // Stagger entre letras
        // logoAnimationTotalDuration = logoBaseDelay + ((logo.textContent.trim().length -1) * logoCharAppearStagger) + logoCharAnimDuration;

        // Simplificación basada en cómo se configuró la animación en splash-animation.js
        // animation = `logoLetterAppear 0.5s ease forwards ${0.5 + index * 0.07}s`;
        // El último span empieza en 0.5 + (length-1)*0.07 y dura 0.5s
        const logoCharCount = logo.textContent.trim().replace(/\s/g, '').length; // Contar solo no espacios para el stagger
        if (logoCharCount > 0) {
            logoAnimationTotalDuration = (0.5 * 1000) + ((logoCharCount - 1) * (0.07 * 1000)) + (0.5 * 1000);
        } else {
             logoAnimationTotalDuration = 2500; // Fallback si no hay texto para animar
        }
    } else {
        logoAnimationTotalDuration = 2500; // Fallback
    }

    let textAnimationTotalDuration = 0;
    const loadingTextContent = splashLoadingText.textContent.trim();
    if (loadingTextElement && loadingTextContent.length > 0) {
        // Asumiendo que la animación de JS en splash-animation.js usa 80ms por caracter
        // y un delay adicional de 200ms después del logo.
        // const textBaseDelay = logoAnimationTotalDuration + 200;
        // const textCharAnimDuration = 400; // Duración de la animación de cada letra del texto de carga
        // const textCharAppearStagger = 60;
        // textAnimationTotalDuration = textBaseDelay + ((loadingTextContent.length-1) * textCharAppearStagger) + textCharAnimDuration;
        const textCharCount = loadingTextContent.replace(/\s/g, '').length;
         if (textCharCount > 0) {
            textAnimationTotalDuration = (logoAnimationTotalDuration + 200) + ((textCharCount - 1) * (0.06 * 1000)) + (0.4 * 1000);
        } else {
            textAnimationTotalDuration = logoAnimationTotalDuration + 1500; // Fallback
        }
    } else {
        textAnimationTotalDuration = logoAnimationTotalDuration + 1500; // Fallback
    }

    const barAndPercentageAppearTime = textAnimationTotalDuration + 200; // Buffer después del texto

    setTimeout(() => {
        progressBarContainer.style.opacity = '1';
        progressPercentageText.style.opacity = '1';

        const progressInterval = setInterval(() => {
            progress += progressIncrement;
            const currentDisplayProgress = Math.min(Math.floor(progress), 100);

            if (progress <= 100) {
                progressBar.style.width = `${currentDisplayProgress}%`;
                progressPercentageText.textContent = `${currentDisplayProgress}%`; // Cambiado a formato X%
            } else {
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
                progressPercentageText.textContent = '100%'; // Cambiado a formato X%

                splashScreen.style.opacity = '0';
                splashScreen.style.transform = 'scale(1.3)';
                splashScreen.style.visibility = 'hidden';

                setTimeout(() => {
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'scale(1)';
                }, 100);

                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 700);
            }
        }, intervalTime);

    }, barAndPercentageAppearTime);
});
