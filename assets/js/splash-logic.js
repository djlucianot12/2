document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const progressBarContainer = document.querySelector('.splash-screen .progress-bar-container');
    const progressBar = document.querySelector('.splash-screen .progress-bar');
    const progressPercentageText = document.querySelector('.splash-screen .progress-percentage');
    const mainContent = document.getElementById('wrapper');
    const loadingScreen = document.getElementById('loading');
    // const logoElement = document.querySelector('.splash-logo'); // No se usa directamente aquí para calcular delays
    // const splashLoadingText = document.querySelector('.splash-loading-text'); // No se usa aquí

    if (!splashScreen || !progressBarContainer || !progressBar || !progressPercentageText || !mainContent || !loadingScreen) {
        console.error('Uno o más elementos críticos de la splash screen o contenido principal no fueron encontrados.');
        if(splashScreen) splashScreen.style.display = 'none';
        if(loadingScreen) loadingScreen.style.display = 'none';
        if(mainContent) mainContent.style.opacity = '1';
        return;
    }

    let progress = 0;
    const intervalTime = 30;
    const totalDuration = 5000; // Reducida a 5000ms (7000 - 2000)
    const progressIncrement = (intervalTime / totalDuration) * 100;

    // Estilos iniciales para la transición de inmersión del contenido principal
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'scale(0.95)';
    mainContent.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    mainContent.style.transformOrigin = 'center center';

    loadingScreen.style.display = 'none';
    progressPercentageText.textContent = '0%';
    progressBarContainer.style.opacity = '0'; // Iniciar invisible
    progressPercentageText.style.opacity = '0'; // Iniciar invisible

    // Escuchar el evento personalizado que indica que las animaciones de texto han terminado
    document.addEventListener('textAnimationsComplete', () => {
        console.log('Evento textAnimationsComplete recibido en splash-logic.js'); // DEBUG
        // Pequeño delay para asegurar que las animaciones de texto hayan finalizado visualmente
        setTimeout(() => {
            console.log('Haciendo visible la barra de progreso y el porcentaje.'); // DEBUG
            progressBarContainer.style.opacity = '1';
            progressPercentageText.style.opacity = '1';
            console.log('Progress percentage element:', progressPercentageText); // DEBUG

            const progressInterval = setInterval(() => {
                progress += progressIncrement;
                const currentDisplayProgress = Math.min(Math.floor(progress), 100);

                if (progress <= 100) {
                    progressBar.style.width = `${currentDisplayProgress}%`;
                    progressPercentageText.textContent = `${currentDisplayProgress}%`;
                    console.log(`Actualizando porcentaje TEXT a: ${currentDisplayProgress}%`, progressPercentageText.textContent); // DEBUG
                } else {
                    clearInterval(progressInterval);
                    progressBar.style.width = '100%';
                    progressPercentageText.textContent = '100%';
                    console.log('Porcentaje finalizado en 100%'); // DEBUG

                    // Iniciar transición de inmersión
                    splashScreen.style.opacity = '0';
                    splashScreen.style.transform = 'scale(1.3)';
                    splashScreen.style.visibility = 'hidden';

                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                        mainContent.style.transform = 'scale(1)';
                    }, 100); // Ligeramente después de que la splash comience a desvanecerse/escalar

                    setTimeout(() => {
                        splashScreen.style.display = 'none';
                    }, 700); // Coincidir con la duración de la transición CSS en .splash-screen (0.7s)
                }
            }, intervalTime);
        }, 200); // 200ms de buffer después de que las animaciones de texto terminen
    });
});
