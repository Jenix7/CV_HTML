// Mapeo de imágenes para cada sección (según el PSD)
const cvInfoImages = {
	'Videojuegos': {
		image1: 'images/consola_Detalles.png',
		video1: 'videos/Videojeugos_Recap.mp4',
		image2: 'images/consolaback_Detalles.png'
	},
	'Modelado 3D': {
		image1: 'images/Modelado_Detalles.png'
	},
	'Diseño Gráfico': {
		image1: 'images/DisenoGrafico_Detalles.png'
	},
	'Ilustración': {
		image1: 'images/Ilustracion_Detalles.png'
	},
	'Edición de Video': {
		image1: 'images/cintavideo_Detalles.png',
		video1: 'videos/Edicion_Recap.mp4'
	},
	'Desarrollo Web': {
		video1: 'videos/Webs_Recap.mp4'
	},
	'Webs': {
		video1: 'videos/Webs_Recap.mp4'
	},
	'Edición': {
		image1: 'images/cintavideo_Detalles.png',
		video1: 'videos/Edicion_Recap.mp4'
	}
};

// Mapeo de nombres de grupos a archivos JSON
const cvInfoJSONMap = {
	'Diseño Gráfico': 'curriculum/diseno_grafico.json',
	'Modelado 3D': 'curriculum/modelado_3d.json',
	'Ilustración': 'curriculum/ilustracion.json',
	'Desarrollo Web': 'curriculum/desarrollo_web.json',
	'Webs': 'curriculum/desarrollo_web.json',
	'Videojuegos': 'curriculum/videojuegos.json',
	'Edición': 'curriculum/edicion_video.json',
	'Edición de Video': 'curriculum/edicion_video.json'
};

// Cache para almacenar JSONs cargados
const cvInfoCache = {};

// Función para cargar contenido desde JSON
async function loadCVInfoContent(groupName) {
	// Si ya está en caché, retornar inmediatamente
	if (cvInfoCache[groupName]) {
		return cvInfoCache[groupName];
	}

	const jsonFile = cvInfoJSONMap[groupName];
	if (!jsonFile) {
		console.error('No JSON file mapped for:', groupName);
		return null;
	}

	try {
		const response = await fetch(jsonFile);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();

		// Formatear el contenido HTML
		const formattedContent = {
			title: data.title,
			content: formatCVContent(data.title, data.description, groupName)
		};

		// Guardar en caché
		cvInfoCache[groupName] = formattedContent;

		console.log('✅ CV Info loaded from JSON:', groupName);
		return formattedContent;
	} catch (error) {
		console.error('❌ Error loading CV info JSON:', jsonFile, error);
		return null;
	}
}

// Función para formatear el contenido HTML
function formatCVContent(title, description, groupName) {
	// Convertir saltos de línea \n a párrafos HTML
	const paragraphs = description.split('\n\n')
		.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
		.join('\n\t\t\t\t');

	// Caso especial para Videojuegos con grid de roles
	const rolesGrid = groupName === 'Videojuegos'
		? `\n\t\t\t\t<div class="roles-grid">
					<div class="role-item">DISEÑO</div>
					<div class="role-item">ARTE</div>
					<div class="role-item">PROGRAMACIÓN</div>
					<div class="role-item">PRODUCCIÓN</div>
				</div>\n`
		: `\n\t\t\t\t<div class="separator-line"></div>\n`;

	return `
			<h3>${title}</h3>

			${paragraphs}

			${rolesGrid}
			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
		`;
}

// Función para abrir el modal de información
async function openCVInfoModal(groupName) {
	console.log('Opening info modal for:', groupName);

	const modal = document.getElementById('imageModal');

	// Cargar contenido desde JSON
	const content = await loadCVInfoContent(groupName);

	if (!content) {
		console.error('No content for:', groupName);
		return;
	}

	// Agregar clase especial para modal de información
	modal.classList.add('info-modal');

	// Mapeo de nombres de grupo a clases CSS específicas
	const modalClassMap = {
		'Webs': 'modal-webs',
		'Desarrollo Web': 'modal-webs',
		'Videojuegos': 'modal-videojuegos',
		'Modelado 3D': 'modal-modelado3d',
		'Ilustración': 'modal-ilustracion',
		'Edición': 'modal-edicion',
		'Edición de Video': 'modal-edicion',
		'Diseño Gráfico': 'modal-diseño-grafico'
	};

	const modalClass = modalClassMap[groupName];
	if (modalClass) {
		modal.classList.add(modalClass);
	}

	const images = cvInfoImages[groupName] || {};

	const image1HTML = images.image1
		? `<div class="modal-info-image-1" style="pointer-events: auto;"><img src="${images.image1}" alt="Imagen principal"></div>`
		: '';

	const video1HTML = images.video1
		? `<div class="modal-info-video-1" style="pointer-events: auto;"><video src="${images.video1}" autoplay loop muted playsinline preload="auto"></video></div>`
		: '';

	const image2HTML = images.image2
		? `<div class="modal-info-image-2" style="pointer-events: auto;"><img src="${images.image2}" alt="Imagen de fondo"></div>`
		: '';

	console.log("🔹 Video HTML:", video1HTML ? "YES" : "NO");

	const modalContent = modal.querySelector('.modal-content');

	// Hacer que modal-content no bloquee clicks al overlay
	modalContent.style.pointerEvents = 'none';

	// IMPORTANTE: Aplicar la misma animación que tienen los modales de tarjeta
	modalContent.style.animation = 'modalZoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

	modalContent.innerHTML = `
		<div class="modal-info-layout-wrapper" style="pointer-events: none;">
			<div class="modal-info-layout" id="modalInfoLayout" style="pointer-events: none;">
				<button class="modal-close" id="modalClose" style="pointer-events: auto;">&times;</button>
				${image2HTML}
				${video1HTML}
				${image1HTML}
				<div class="modal-info-text-area" style="pointer-events: auto;">
					${content.content}
				</div>
			</div>
		</div>
	`;

	// Calcular escala para ajustar el contenido a la pantalla
	setTimeout(() => {
		const layout = document.getElementById('modalInfoLayout');
		const scaleX = window.innerWidth / 1920;
		const scaleY = window.innerHeight / 1080;
		const scale = Math.min(scaleX, scaleY);

		// MEJORAS ANTI-BLUR: añadir translateZ y propiedades de renderizado
		layout.style.transform = `scale(${scale}) translateZ(0)`;
		layout.style.transformOrigin = 'center center';
		layout.style.webkitFontSmoothing = 'antialiased';
		layout.style.backfaceVisibility = 'hidden';
		layout.style.perspective = '1000px';
	}, 10);

	// Mostrar modal
	modal.classList.add('active');
	document.body.style.overflow = 'hidden';

	// Forzar reproducción del video si existe
	setTimeout(() => {
		const videoElement = modal.querySelector('.modal-info-video-1 video');
		if (videoElement) {
			videoElement.play().catch(err => {
				console.log('Error al reproducir video:', err);
			});
		}
	}, 100);

	// Configurar eventos de cierre
	const closeBtn = document.getElementById('modalClose');
	const overlay = modal.querySelector('.modal-overlay');

	// Función de cierre específica para este modal
	const handleClose = (e) => {
		if (e) e.preventDefault();
		closeCVInfoModal();
	};

	// Agregar eventos
	closeBtn.addEventListener('click', handleClose);
	overlay.addEventListener('click', handleClose);

	// Manejar tecla Escape
	const handleEscape = (e) => {
		if (e.key === 'Escape' && modal.classList.contains('info-modal')) {
			closeCVInfoModal();
			document.removeEventListener('keydown', handleEscape);
		}
	};
	document.addEventListener('keydown', handleEscape);

	// Recalcular escala al redimensionar ventana
	const handleResize = () => {
		const layout = document.getElementById('modalInfoLayout');
		if (layout) {
			const scaleX = window.innerWidth / 1920;
			const scaleY = window.innerHeight / 1080;
			const scale = Math.min(scaleX, scaleY);

			// MEJORA ANTI-BLUR: mantener translateZ en el resize
			layout.style.transform = `scale(${scale}) translateZ(0)`;
		}
	};
	window.addEventListener('resize', handleResize);

	// Guardar referencia para limpiar el evento
	modal._resizeHandler = handleResize;
}

// Función para cerrar el modal de información
function closeCVInfoModal() {
	const modal = document.getElementById('imageModal');

	// Limpiar el evento de resize si existe
	if (modal._resizeHandler) {
		window.removeEventListener('resize', modal._resizeHandler);
		modal._resizeHandler = null;
	}

	modal.classList.remove('active');
	modal.classList.remove('info-modal');

	// Remover todas las clases específicas de modales
	modal.classList.remove('modal-webs');
	modal.classList.remove('modal-videojuegos');
	modal.classList.remove('modal-modelado3d');
	modal.classList.remove('modal-ilustracion');
	modal.classList.remove('modal-edicion');
	modal.classList.remove('modal-diseño-grafico');
	document.body.style.overflow = '';

	// Restaurar estructura original del modal
	setTimeout(() => {
		const modalContent = modal.querySelector('.modal-content');

		// Restaurar pointer-events y animación del modal-content
		modalContent.style.pointerEvents = '';
		modalContent.style.animation = '';

		modalContent.innerHTML = `
			<button class="modal-close" id="modalClose">&times;</button>
			<img id="modalImage" src="" alt="">
		`;

		// RECONECTAR TODOS LOS EVENT LISTENERS DEL MODAL DE TARJETA
		const modalImage = document.getElementById('modalImage');
		const closeBtn = document.getElementById('modalClose');
		const overlay = document.querySelector('.modal-overlay');

		// Función de cierre (replicada de modal.js)
		const handleCloseModal = () => {
			modal.classList.remove('active');
			document.body.style.overflow = '';
			setTimeout(() => {
				modalImage.src = '';
			}, 300);
		};

		// Reconectar cierre con botón
		closeBtn.addEventListener('click', handleCloseModal);

		// Reconectar cierre con overlay
		overlay.addEventListener('click', handleCloseModal);

		// Reconectar efectos de tarjeta (mousemove, mouseenter, mouseleave)
		modalImage.addEventListener('mousemove', (e) => {
			if (modalImage.hasAttribute('data-no-card-effect')) {
				return;
			}

			const rect = modalImage.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const centerX = rect.width / 2;
			const centerY = rect.height / 2;

			const rotateX = ((y - centerY) / centerY) * -10;
			const rotateY = ((x - centerX) / centerX) * 10;

			modalImage.style.transition = 'transform 0.15s ease-out';
			modalImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
		});

		modalImage.addEventListener('mouseenter', () => {
			if (modalImage.hasAttribute('data-no-card-effect')) {
				return;
			}
			modalImage.style.transition = 'transform 0.6s ease-out';
		});

		modalImage.addEventListener('mouseleave', () => {
			if (modalImage.hasAttribute('data-no-card-effect')) {
				return;
			}
			modalImage.style.transition = 'transform 0.6s ease-out';
			modalImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
		});
	}, 300);
}

// Función para ir al portfolio desde el modal de Videojuegos
function goToPortfolio() {
	closeCVInfoModal();
	setTimeout(() => {
		switchSection('portfolio');
	}, 300);
}
