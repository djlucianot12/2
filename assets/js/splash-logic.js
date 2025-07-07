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
    const totalDuration = 7000;
    const progressIncrement = (intervalTime / totalDuration) * 100;

    mainContent.style.opacity = '0';
    mainContent.style.transform = 'scale(0.95)';
    mainContent.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    mainContent.style.transformOrigin = 'center center';

    loadingScreen.style.display = 'none';
    progressPercentageText.textContent = '0 por ciento';
    progressBarContainer.style.opacity = '0'; // Iniciar invisible
    progressPercentageText.style.opacity = '0'; // Iniciar invisible

    // Determinar cuándo deben aparecer la barra y el porcentaje
    // Esto se basa en la duración de las animaciones del logo y del texto de carga.
    // Asumimos que los delays en CSS son la fuente de verdad para la duración de aparición de letras.
    let logoDuration = 0;
    const logoSpans = logo.querySelectorAll('span');
    if (logoSpans.length > 0) {
        const lastLogoSpan = logoSpans[logoSpans.length - 1];
        // animation-delay + animation-duration
        logoDuration = (parseFloat(getComputedStyle(lastLogoSpan).animationDelay) + parseFloat(getComputedStyle(lastLogoSpan).animationDuration)) * 1000;
    } else { // Fallback si no hay spans (texto no dividido)
        logoDuration = (parseFloat(getComputedStyle(logo).animationDelay) || 0 + parseFloat(getComputedStyle(logo).animationDuration) || 0) * 1000;
        if (logoDuration === 0) logoDuration = 2500; // Estimación si no hay animación CSS directa en el contenedor
    }

    let textAnimationStartTime = logoDuration + 200; // Pequeño buffer después del logo
    let textDuration = 0;
    const textSpans = splashLoadingText.querySelectorAll('span');
    if (textSpans.length > 0) {
        const lastTextSpan = textSpans[textSpans.length - 1];
        textDuration = (parseFloat(getComputedStyle(lastTextSpan).animationDelay) + parseFloat(getComputedStyle(lastTextSpan).animationDuration)) * 1000;
         // El delay ya está aplicado en el CSS relativo al inicio, necesitamos el delay real desde el inicio de la página.
        // El JS en splash-animation.js ya calcula esto de forma más directa.
        // Aquí recalculamos o asumimos que splash-animation.js lo hizo bien.
        // Para simplificar, tomaremos el delay del CSS del último span y sumaremos su duración.
        // Este es el punto final de la animación del texto.
        const individualTextDelay = parseFloat(getComputedStyle(textSpans[0]).animationDelay) * 1000; // Delay del primer span del texto
        textAnimationStartTime = individualTextDelay; // El JS ya calcula el delay escalonado, tomamos el del primer span
        textDuration = (parseFloat(getComputedStyle(lastTextSpan).animationDelay) + parseFloat(getComputedStyle(lastTextSpan).animationDuration)) * 1000 - textAnimationStartTime;


    } else {
        textDuration = (parseFloat(getComputedStyle(splashLoadingText).animationDelay) || 0 + parseFloat(getComputedStyle(splashLoadingText).animationDuration) || 0) * 1000;
        if (textDuration === 0 && logo.textContent.length > 0) textDuration = 1500; // Estimación
    }

    const barAndPercentageAppearTime = textAnimationStartTime + textDuration + 200; // Buffer después del texto

    setTimeout(() => {
        progressBarContainer.style.opacity = '1';
        progressPercentageText.style.opacity = '1';

        const progressInterval = setInterval(() => {
            progress += progressIncrement;
            const currentDisplayProgress = Math.min(Math.floor(progress), 100);

            if (progress <= 100) {
                progressBar.style.width = `${currentDisplayProgress}%`;
                progressPercentageText.textContent = `${currentDisplayProgress} por ciento`;
            } else {
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
                progressPercentageText.textContent = '100 por ciento';

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
