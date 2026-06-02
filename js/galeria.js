// Atrapamos los elementos de nuestro HTML
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const images = document.querySelectorAll('.gallery-img');
const closeBtn = document.querySelector('.close-lightbox');

// 1. Abrir la imagen: Le ponemos una "oreja" (listener) a cada imagen del collage
images.forEach(img => {
    img.addEventListener('click', function() {
        lightbox.style.display = 'flex'; // Mostramos el fondo negro
        lightboxImg.src = this.src;      // Le pasamos la ruta de la imagen clickeada a la imagen gigante
    });
});

// 2. Cerrar la imagen al hacer clic en la "X"
closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

// 3. Cerrar la imagen si haces clic en cualquier parte del fondo negro
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
});