// Mapeo de imágenes para cada sección (según el PSD)
const cvInfoImages = {
	'Videojuegos': {
		image1: 'images/consola_Detalles.png',
		video1: 'videos/Videojeugos_Recap.mp4',
		image2: 'images/consolaback_Detalles.png'
	},
	'Modelado 3D': {
		image1: 'images/consola_Detalles.png' // Temporal, cambiarás esto después
	},
	'Diseño Gráfico': {
		image1: 'images/consola_Detalles.png' // Temporal, cambiarás esto después
	},
	'Ilustración': {
		image1: 'images/consola_Detalles.png' // Temporal, cambiarás esto después
	},
	'Edición de Video': {
		image1: 'images/cintavideo_Detalles.png'
	},
	'Desarrollo Web': {
		video1: 'videos/Webs_Recap.mp4'
	},
	'Webs': {
		video1: 'videos/Webs_Recap.mp4'
	},
	'Edición': {
		image1: 'images/cintavideo_Detalles.png'
	}
};

// Contenido específico para cada grupo
const cvInfoContent = {
	'Diseño Gráfico': {
		title: 'Diseño Gráfico',
		content: `
			<h3>Experiencia en Diseño Gráfico</h3>
			<p>Especializado en la creación de identidades visuales cohesivas y materiales gráficos que comunican efectivamente el mensaje de marca.</p>

			<h3>Habilidades</h3>
			<ul>
				<li>Diseño de identidad corporativa y branding</li>
				<li>Diseño editorial y maquetación</li>
				<li>Ilustración digital y vectorial</li>
				<li>Diseño de materiales publicitarios</li>
				<li>Tipografía y composición</li>
			</ul>

			<div class="modal-info-highlight">
				<strong>Herramientas:</strong> Adobe Illustrator, Photoshop, InDesign
			</div>

			<h3>Proyectos Destacados</h3>
			<p>He trabajado en diversos proyectos de branding, desde eventos hasta productos comerciales, creando soluciones visuales únicas y memorables.</p>
		`
	},
	'Modelado 3D': {
		title: 'Modelado 3D',
		content: `
			<h3>Especialización en Modelado 3D</h3>
			<p>Experiencia en la creación de assets 3D de alta calidad para videojuegos, animación y visualización arquitectónica.</p>

			<h3>Técnicas y Procesos</h3>
			<ul>
				<li>Modelado hard surface y orgánico</li>
				<li>Esculpido digital de alta resolución</li>
				<li>Retopología y optimización de mallas</li>
				<li>UV mapping y texturización PBR</li>
				<li>Rigging y preparación para animación</li>
			</ul>

			<div class="modal-info-highlight">
				<strong>Software:</strong> Blender, 3DS Max, Maya, ZBrush, Substance Painter
			</div>

			<h3>Aplicaciones</h3>
			<p>Desde personajes estilizados para videojuegos hasta props realistas para producciones audiovisuales.</p>
		`
	},
	'Ilustración': {
		title: 'Ilustración',
		content: `
			<h3>Arte e Ilustración Digital</h3>
			<p>Creación de ilustraciones originales con diversos estilos, desde concept art hasta ilustraciones finalizadas para productos comerciales.</p>

			<h3>Estilos y Técnicas</h3>
			<ul>
				<li>Ilustración digital y tradicional</li>
				<li>Concept art para videojuegos</li>
				<li>Character design y development</li>
				<li>Ilustración editorial</li>
				<li>Arte para redes sociales</li>
			</ul>

			<div class="modal-info-highlight">
				<strong>Herramientas:</strong> Photoshop, Illustrator, Procreate
			</div>

			<h3>Proyectos</h3>
			<p>He desarrollado personajes únicos y mundos visuales completos para diversos proyectos creativos.</p>
		`
	},
	'Edición de Video': {
		title: 'Edición de Video',
		content: `
			<h3>Edición y Postproducción</h3>
			<p>Experiencia en la edición de video profesional, desde cortometrajes hasta contenido para redes sociales y trailers de videojuegos.</p>

			<h3>Servicios</h3>
			<ul>
				<li>Edición de video narrativo y comercial</li>
				<li>Motion graphics y animación 2D</li>
				<li>Corrección de color y grading</li>
				<li>Diseño de sonido y mezcla de audio</li>
				<li>Efectos visuales y composición</li>
			</ul>

			<div class="modal-info-highlight">
				<strong>Software:</strong> Adobe Premiere Pro, After Effects, DaVinci Resolve
			</div>

			<h3>Tipos de Proyectos</h3>
			<p>Trailers de videojuegos, booktrailers, contenido promocional y videos corporativos.</p>
		`
	},
	'Desarrollo Web': {
		title: 'Desarrollo Web',
		content: `
			<h3>Desarrollo Web Full Stack</h3>
			<p>Creación de aplicaciones web modernas, responsivas y optimizadas, con enfoque en experiencia de usuario y rendimiento.</p>

			<h3>Tecnologías</h3>
			<ul>
				<li>HTML5, CSS3, JavaScript (ES6+)</li>
				<li>React, Vue.js</li>
				<li>Node.js, Express</li>
				<li>Bases de datos SQL y NoSQL</li>
				<li>APIs RESTful y GraphQL</li>
				<li>Control de versiones con Git</li>
			</ul>

			<div class="modal-info-highlight">
				<strong>Especialidades:</strong> UI/UX, Responsive Design, Performance Optimization
			</div>

			<h3>Proyectos</h3>
			<p>Desde portfolios personales hasta aplicaciones empresariales complejas y sistemas de gestión.</p>
		`
	},
	'Videojuegos': {
		title: 'Videojuegos',
		content: `
			<h3>Desarrollo de Videojuegos</h3>
			<p>Experiencia completa en el ciclo de desarrollo de videojuegos, desde el concepto inicial hasta el lanzamiento.</p>

			<p>Especializado en la creación de mecánicas innovadoras y experiencias de juego memorables que combinan arte, programación y diseño narrativo.</p>

			<h3>Áreas de Expertise</h3>
			<p>Programación de gameplay, diseño de niveles, implementación de sistemas de IA, optimización de rendimiento y game design.</p>

			<p>Trabajo con Unity y Unreal Engine para crear prototipos rápidos y productos finales pulidos.</p>
		`
	},
	'Edición': {
		title: 'Edición de Video',
		content: `
			<h3>Edición y Postproducción</h3>
			<p>Experiencia en la edición de video profesional, desde cortometrajes hasta contenido para redes sociales y trailers de videojuegos.</p>

			<h3>Servicios</h3>
			<ul>
				<li>Edición de video narrativo y comercial</li>
				<li>Motion graphics y animación 2D</li>
				<li>Corrección de color y grading</li>
				<li>Diseño de sonido y mezcla de audio</li>
				<li>Efectos visuales y composición</li>
			</ul>

			<div class="modal-info-highlight">
				<strong>Software:</strong> Adobe Premiere Pro, After Effects, DaVinci Resolve
			</div>

			<h3>Tipos de Proyectos</h3>
			<p>Trailers de videojuegos, booktrailers, contenido promocional y videos corporativos.</p>
		`
	},
	'Webs': {
		title: 'Desarrollo Web',
		content: `
			<h3>Desarrollo Web Full Stack</h3>
			<p>Creación de aplicaciones web modernas, responsivas y optimizadas, con enfoque en experiencia de usuario y rendimiento.</p>

			<h3>Tecnologías</h3>
			<ul>
				<li>HTML5, CSS3, JavaScript (ES6+)</li>
				<li>React, Vue.js</li>
				<li>Node.js, Express</li>
				<li>Bases de datos SQL y NoSQL</li>
				<li>APIs RESTful y GraphQL</li>
				<li>Control de versiones con Git</li>
			</ul>

			<div class="modal-info-highlight">
				<strong>Especialidades:</strong> UI/UX, Responsive Design, Performance Optimization
			</div>

			<h3>Proyectos</h3>
			<p>Desde portfolios personales hasta aplicaciones empresariales complejas y sistemas de gestión.</p>
		`
	}
};

// Función para abrir el modal de información
function openCVInfoModal(groupName) {
	console.log('Opening info modal for:', groupName);

	const modal = document.getElementById('imageModal');
	const content = cvInfoContent[groupName];

	if (!content) {
		console.error('No content for:', groupName);
		return;
	}

	// Agregar clase especial para modal de información
	modal.classList.add('info-modal');

	// Mapeo de nombres de grupo a clases CSS específicas
	const modalClassMap = {
		'Desarrollo Web': 'modal-webs',
		'Webs': 'modal-webs',
		'Videojuegos': 'modal-videojuegos',
		'Modelado 3D': 'modal-modelado3d',
		'Ilustración': 'modal-ilustracion',
		'Edición de Video': 'modal-edicion',
		'Edición': 'modal-edicion',
		'Diseño Gráfico': 'modal-diseño-grafico'
	};

	// Agregar clase específica del tipo de modal
	const modalSpecificClass = modalClassMap[groupName];
	if (modalSpecificClass) {
		modal.classList.add(modalSpecificClass);
	}

	// Obtener las imágenes según la sección
	const images = cvInfoImages[groupName] || {};

	// Crear estructura del modal de información a pantalla completa

	const image1HTML = images.image1
		? `<div class="modal-info-image-1" style="pointer-events: auto;"><img src="${images.image1}" alt="Imagen principal"></div>`
		: '';

	const video1HTML = images.video1
		? `<div class="modal-info-video-1" style="pointer-events: auto;"><video src="${images.video1}" autoplay loop muted playsinline></video></div>`
		: '';

	const image2HTML = images.image2
		? `<div class="modal-info-image-2" style="pointer-events: auto;"><img src="${images.image2}" alt="Imagen de fondo"></div>`
		: '';

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
		layout.style.transform = `scale(${scale})`;
	}, 10);

	// Mostrar modal
	modal.classList.add('active');
	document.body.style.overflow = 'hidden';

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
			layout.style.transform = `scale(${scale})`;
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
