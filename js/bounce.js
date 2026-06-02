window.addEventListener('load', function() {
    function crearRebote(idElemento, posicionX, posicionY, velocidadX, velocidadY) {
        const elemento = document.getElementById(idElemento);
        if (!elemento) return; 

        let x = posicionX;
        let y = posicionY;
        let speedX = velocidadX;
        let speedY = velocidadY;

        function animar() {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const elementWidth = elemento.offsetWidth;
            const elementHeight = elemento.offsetHeight;

            x += speedX;
            y += speedY;
            if (x + elementWidth >= windowWidth) {
                speedX = -speedX;
                x = windowWidth - elementWidth;
            } else if (x <= 0) {
                speedX = -speedX;
                x = 0;
            }
            if (y + elementHeight >= windowHeight) {
                speedY = -speedY;
                y = windowHeight - elementHeight;
            } else if (y <= 0) {
                speedY = -speedY;
                y = 0;
            }

            elemento.style.left = x + 'px';
            elemento.style.top = y + 'px';
            requestAnimationFrame(animar);
        }
        animar();
    }
    crearRebote('logo-rebotando', 50, 50, 3, 2);
    crearRebote('cara-rebotando', 300, 150, -2, 3);
});