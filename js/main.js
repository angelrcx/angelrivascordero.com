document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES GLOBALES DEL MODAL ---
    const modal = document.getElementById('modal-universal');
    const contenedorMedia = document.getElementById('modal-media-contenedor');
    const textoDesc = document.getElementById('modal-descripcion'); // Se asegura de leer la etiqueta p
    const flechasNav = document.querySelectorAll('.nav-lightbox');
    
    let fotosArray = []; 
    let indiceActual = -1;

    // --- FUNCIONES DEL MODAL (LIGHTBOX) ---
    const abrirModal = (tipo, src, descripcion, esGaleria = false) => {
        contenedorMedia.innerHTML = ''; 
        
        if (tipo === 'video') {
            contenedorMedia.innerHTML = `<video src="${src}" controls autoplay playsinline></video>`;
        } else {
            contenedorMedia.innerHTML = `<img src="${src}" alt="Media expandida">`;
        }

        if (textoDesc) {
            textoDesc.style.display = descripcion ? 'block' : 'none';
            textoDesc.textContent = descripcion || '';
        }
        
        flechasNav.forEach(btn => btn.style.display = esGaleria ? 'block' : 'none');
        modal.style.display = 'flex';
    };

    const cerrarModal = () => {
        if (!modal) return;
        modal.style.display = 'none';
        contenedorMedia.innerHTML = ''; 
        indiceActual = -1;
    };

    const navegarGaleria = (direccion) => {
        if (indiceActual === -1 || fotosArray.length === 0) return;
        indiceActual += direccion;
        
        if (indiceActual >= fotosArray.length) indiceActual = 0;
        if (indiceActual < 0) indiceActual = fotosArray.length - 1;
        
        // En la galería siempre son imágenes sin texto
        abrirModal('imagen', `images/galeria/${fotosArray[indiceActual]}`, '', true);
    };

    // --- LÓGICA DE ZINE: SUELO INTERACTIVO Y ARRASTRE ---
    const floorCanvas = document.getElementById('floor-canvas');
    let floorTopZ = 20;

    function scatterPositions(count) {
        const isMobile = window.innerWidth <= 680;
        const spreadX = isMobile ? window.innerWidth * 0.26 : Math.min(window.innerWidth * 0.32, 390);
        const spreadY = isMobile ? window.innerHeight * 0.24 : Math.min(window.innerHeight * 0.25, 220);

        const coords = [];
        for (let i = 0; i < count; i++) {
            const angle = i * 2.39996 + (Math.random() * 0.45 - 0.22);
            const radius = Math.sqrt((i + 0.6) / count);
            const x = Math.cos(angle) * spreadX * radius + (Math.random() * 34 - 17);
            const y = Math.sin(angle) * spreadY * radius + (Math.random() * 30 - 15);
            const rot = (Math.random() * 22 - 11).toFixed(1);
            coords.push({ x, y, rot });
        }
        return coords;
    }

    if (floorCanvas) {
        fetch('lista-fotos.json')
            .then(respuesta => respuesta.json())
            .then(fotos => {
                fotosArray = fotos.sort(() => Math.random() - 0.5);
                floorTopZ = 20 + fotosArray.length;
                
                const layout = scatterPositions(fotosArray.length);

                fotosArray.forEach((fotoNombre, idx) => {
                    const card = document.createElement('div');
                    card.className = 'scattered-photo';
                    card.style.zIndex = 10 + idx;

                    let posX = layout[idx].x;
                    let posY = layout[idx].y;
                    const rot = layout[idx].rot;

                    card.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) rotate(${rot}deg)`;

                    const img = document.createElement('img');
                    img.src = `images/galeria/${fotoNombre}`;
                    img.draggable = false; 

                    card.appendChild(img);
                    floorCanvas.appendChild(card);

                    let draggingPhoto = false;
                    let sx = 0, sy = 0, dist = 0;

                    card.addEventListener('pointerdown', e => {
                        draggingPhoto = true;
                        dist = 0;
                        floorTopZ++; 
                        card.style.zIndex = floorTopZ;
                        sx = e.clientX - posX;
                        sy = e.clientY - posY;
                        card.setPointerCapture(e.pointerId);
                    });

                    card.addEventListener('pointermove', e => {
                        if (!draggingPhoto) return;
                        const nx = e.clientX - sx;
                        const ny = e.clientY - sy;
                        dist += Math.hypot(nx - posX, ny - posY);
                        posX = nx;
                        posY = ny;
                        card.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) rotate(${rot}deg)`;
                    });

                    card.addEventListener('pointerup', e => {
                        if (!draggingPhoto) return;
                        draggingPhoto = false;
                        card.releasePointerCapture(e.pointerId);

                        if (dist < 6) {
                            indiceActual = idx;
                            abrirModal('imagen', `images/galeria/${fotosArray[indiceActual]}`, '', true);
                        }
                    });
                });
            })
            .catch(error => console.error("Error al cargar la galería:", error));
    }

    // --- EVENTOS GLOBALES DE NAVEGACIÓN ---
    document.body.addEventListener('click', (e) => {
        // Clic en bloque del index.html
        const bloque = e.target.closest('.js-abrir-modal');
        if (bloque) {
            // Esto leerá automáticamente el data-tipo, data-src y data-desc de tu HTML
            abrirModal(bloque.dataset.tipo || 'imagen', bloque.dataset.src, bloque.dataset.desc, false);
            return;
        }

        // Clic en flechas del modal
        if (e.target.classList.contains('nav-prev')) { navegarGaleria(-1); return; }
        if (e.target.classList.contains('nav-next')) { navegarGaleria(1); return; }

        // Cerrar modal al cliquear el fondo o la X
        if (e.target.classList.contains('close-lightbox') || e.target === modal) {
            cerrarModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
        if (modal && modal.style.display === 'flex' && indiceActual !== -1) {
            if (e.key === 'ArrowLeft') navegarGaleria(-1);
            if (e.key === 'ArrowRight') navegarGaleria(1);
        }
    });

    const relojElemento = document.getElementById('reloj-vivo');
    if (relojElemento) {
        const actualizarReloj = () => {
            const ahora = new Date();
            // Formato de 24 horas (HH:MM:SS)
            const horaFormateada = ahora.toLocaleTimeString('es-MX', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            relojElemento.textContent = horaFormateada;
        };
        
        actualizarReloj(); // Llama la función inmediatamente para no mostrar vacío
        setInterval(actualizarReloj, 1000); // Actualiza cada 1000 milisegundos (1 segundo)
    }
});