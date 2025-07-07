document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const progressBar = document.querySelector('.splash-screen .progress-bar');
    const progressPercentageText = document.querySelector('.splash-screen .progress-percentage');
    const mainContent = document.getElementById('wrapper');
    const loadingScreen = document.getElementById('loading');
    const splashLoadingText = document.querySelector('.splash-loading-text');

    if (!splashScreen || !progressBar || !progressPercentageText || !mainContent || !loadingScreen || !splashLoadingText) {
        console.error('Uno o más elementos de la splash screen o contenido principal no fueron encontrados.');
        if(splashScreen) splashScreen.style.display = 'none';
        if(loadingScreen) loadingScreen.style.display = 'none';
        if(mainContent) mainContent.style.opacity = '1';
        return;
    }

    let progress = 0;
    const intervalTime = 30;
    const totalDuration = 3000;
    const progressIncrement = (intervalTime / totalDuration) * 100;

    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.5s ease-in-out';
    loadingScreen.style.display = 'none';
    progressPercentageText.textContent = '0 por ciento';

    // Calcular el delay para el texto "Entrando al estudio..." basado en la animación del logo
    // Esta es una estimación, idealmente los delays de CSS se coordinarían aquí si fueran dinámicos
    // o se asumiría que el CSS ya tiene los delays correctos.
    // Por ahora, el CSS maneja los delays de aparición de logo y texto.
    // El delay de la barra de progreso y el porcentaje se basa en el CSS.

    const progressBarAnimationDelay = parseFloat(getComputedStyle(document.querySelector('.progress-bar-container')).animationDelay) * 1000;
    const percentageAnimationDelay = parseFloat(getComputedStyle(progressPercentageText).animationDelay) * 1000;

    setTimeout(() => {
        progressPercentageText.style.opacity = '1'; // Asegurar visibilidad si la animación CSS no lo hace.
    }, percentageAnimationDelay);


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

            splashScreen.style.transition = 'opacity 0.5s ease-out, visibility 0.5s ease-out';
            splashScreen.style.transition = 'opacity 0.5s ease-out, visibility 0.5s ease-out';
            splashScreen.style.opacity = '0';
            splashScreen.style.visibility = 'hidden'; // Para removerlo del flujo y no interferir

            setTimeout(() => {
                splashScreen.style.display = 'none'; // Ocultar completamente después de la transición
                mainContent.style.opacity = '1';
                // Aquí se podría decidir si la pantalla de carga original #loading debe mostrarse
                // o si la transición es directamente al contenido principal.
                // Por ahora, vamos directo al contenido principal.
                // loadingScreen.style.display = 'block'; // O la lógica que corresponda
            }, 500); // Tiempo igual a la duración de la transición de opacidad
        }
    }, intervalTime);
});
