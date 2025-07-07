document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const progressBar = document.querySelector('.splash-screen .progress-bar');
    const mainContent = document.getElementById('wrapper'); // Asumiendo que este es el contenedor principal
    const loadingScreen = document.getElementById('loading'); // Pantalla de carga original

    if (!splashScreen || !progressBar || !mainContent || !loadingScreen) {
        console.error('Elementos de la splash screen o contenido principal no encontrados.');
        // Si no se encuentran los elementos, se intenta ocultar la splash y mostrar el contenido igualmente.
        if(splashScreen) splashScreen.style.display = 'none';
        if(loadingScreen) loadingScreen.style.display = 'none'; // Ocultar también la carga original si existe
        if(mainContent) mainContent.style.opacity = '1';
        return;
    }

    let progress = 0;
    const intervalTime = 30; // Milisegundos para cada incremento de progreso
    const totalDuration = 3000; // Duración total de la barra de carga en milisegundos
    const progressIncrement = (intervalTime / totalDuration) * 100;

    // Ocultar contenido principal y pantalla de carga original inicialmente
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.5s ease-in-out';
    loadingScreen.style.display = 'none'; // Asegurarse que la original está oculta

    const progressInterval = setInterval(() => {
        progress += progressIncrement;
        if (progress <= 100) {
            progressBar.style.width = `${progress}%`;
        } else {
            clearInterval(progressInterval);
            progressBar.style.width = '100%'; // Asegurar que llegue al 100%

            // Iniciar transición para ocultar splash screen y mostrar contenido
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
