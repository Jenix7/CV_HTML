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

// Contenido específico para cada grupo
const cvInfoContent = {
	'Diseño Gráfico': {
		title: 'Diseño Gráfico',
		content: `
			<h3>Diseño Gráfico</h3>

			<p>Tengo amplia experiencia en diseño gráfico para proyectos de distintos ámbitos. El diseño y la edición digital siempre han sido esenciales en mi trabajo, ya que resultan fundamentales para la presentación de cualquier proyecto creativo. He realizado interfaces, branding, flyers publicitarios, tarjetas, pósters y publicaciones para redes.</p>

			<p>Trabajo con Photoshop e Illustrator, herramientas en las que tengo gran soltura. Soy meticuloso con la composición, buscando siempre armonía visual, claridad y equilibrio entre formas, espacios y colores, combinando lógica y estética en cada diseño.</p>

			<div class="separator-line"></div>

			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
		`
	},
	'Modelado 3D': {
		title: 'Modelado y Texturización 3D',
		content: `
			<h3>Modelado y Texturización 3D</h3>

			<p>Tengo experiencia en proyectos de distintos géneros y estilos, dominando el modelado 3D en hard surface y soft surface. He creado personajes, escenarios, props, ítems, renders realistas de productos y arquitectura, además de trabajar con impresión 3D.</p>

			<p>Realizo el pipeline completo: concept, high poly, low poly, bakeo, texturización, skinning, rigging, animación, iluminación, renderizado y postprocesado.</p>

			<p>Uso 3ds Max y Blender para hard surface; ZBrush para soft surface; Marmoset Toolbag, Substance Painter y Photoshop para bakeo y texturas; y Maya y Cascadeur para rigging y animación corporal y facial.</p>

			<div class="separator-line"></div>

			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
		`
	},
	'Ilustración': {
		title: 'Arte e Ilustración',
		content: `
			<h3>Arte e Ilustración</h3>

			<p>Siempre he tenido una gran pasión por el dibujo y por plasmar ideas de forma visual. He realizado ilustraciones y arte digital para una amplia variedad de proyectos relacionados con videojuegos, juegos de mesa, caricaturas y diseño de mundos. Trabajo con Photoshop e Illustrator, herramientas con las que tengo mucha experiencia y me desenvuelvo con soltura.</p>

			<p>Me gusta dar vida a mis personajes con colores vibrantes, expresiones claras y una personalidad bien definida. Disfruto especialmente de los estilos cartoon con expresiones exageradas, aunque también he creado ilustraciones semi-realistas, concept art, escenarios, personajes, planos, interfaces (UI), fotomontajes y piezas de edición digital.</p>

			<div class="separator-line"></div>

			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
		`
	},

	'Desarrollo Web': {
		title: 'Desarrollo Web',
		content: `
			<h3>Desarrollo de Webs y Software</h3>

			<p>He trabajado como freelance desarrollando páginas web y software tanto para clientes como para mis propios proyectos. He creado webs comerciales para marcas y productos, sistemas de gestión de datos, herramientas de edición 3D y pequeños programas diseñados para optimizar tareas específicas dentro de mi flujo de trabajo.</p>

			<p>Combino enfoque creativo y técnico para diseñar soluciones coherentes, funcionales y visualmente profesionales, siempre adaptadas al estilo y las necesidades del proyecto. Trabajo con HTML, CSS, JavaScript y Python, utilizando diversas librerías para crear tanto aplicaciones web como programas locales.</p>

			<div class="separator-line"></div>

			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
		`
	},
	'Videojuegos': {
		title: 'Videojuegos',
		content: `
			<h3>Desarrollo de Videojuegos</h3>

			<p>Soy licenciado en Diseño y Producción de Videojuegos y cuento con experiencia desarrollando proyectos de diversos géneros tanto en 2D como en 3D. He creado mecánicas, personajes, niveles, animaciones, interfaces, efectos y sistemas completos para juegos de acción, shooters, plataformas y experiencias narrativas.</p>

			<p>He trabajado en roles de diseño, arte, programación y producción. Me apasionan todas las áreas del desarrollo y disfruto involucrarme en cada una para tener una visión global del proyecto y comprender en profundidad todo el proceso creativo y técnico.</p>

			<div class="roles-grid">
				<div class="role-item">DISEÑO</div>
				<div class="role-item">ARTE</div>
				<div class="role-item">PROGRAMACIÓN</div>
				<div class="role-item">PRODUCCIÓN</div>
			</div>

			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
		`
	},
	'Edición': {
		title: 'Animación y Edición de Video',
		content: `
			<h3>Animación y Edición de Video</h3>

			<p>He creado diversas piezas audiovisuales para proyectos muy variados, tanto personales como para terceros. Realizo edición y montaje de vídeo, creación de efectos y composición, trabajando principalmente con Premiere Pro, After Effects y CapCut. En algunas ocasiones he combinado planos generados con IA junto con edición tradicional para lograr resultados más complejos y con mayor libertad creativa.</p>

			<p>También he desarrollado animaciones 2D y 3D, especialmente orientadas a videojuegos. En 2D trabajo con técnicas como morphing, sprite sheets y animación cuadro a cuadro. En 3D tengo experiencia en rigging, skinning, keyframe animation, cámaras, iluminación, materiales y renderizado, entre otras áreas del pipeline.</p>

			<div class="separator-line"></div>

			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
		`
	},
	'Edición de Video': {
		title: 'Animación y Edición de Video',
		content: `
			<h3>Animación y Edición de Video</h3>

			<p>He creado diversas piezas audiovisuales para proyectos muy variados, tanto personales como para terceros. Realizo edición y montaje de vídeo, creación de efectos y composición, trabajando principalmente con Premiere Pro, After Effects y CapCut. En algunas ocasiones he combinado planos generados con IA junto con edición tradicional para lograr resultados más complejos y con mayor libertad creativa.</p>

			<p>También he desarrollado animaciones 2D y 3D, especialmente orientadas a videojuegos. En 2D trabajo con técnicas como morphing, sprite sheets y animación cuadro a cuadro. En 3D tengo experiencia en rigging, skinning, keyframe animation, cámaras, iluminación, materiales y renderizado, entre otras áreas del pipeline.</p>

			<div class="separator-line"></div>

			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
		`
	},
	'Webs': {
		title: 'Desarrollo Web',
		content: `
			<h3>Desarrollo de Webs y Software</h3>

			<p>He trabajado como freelance desarrollando páginas web y software tanto para clientes como para mis propios proyectos. He creado webs comerciales para marcas y productos, sistemas de gestión de datos, herramientas de edición 3D y pequeños programas diseñados para optimizar tareas específicas dentro de mi flujo de trabajo.</p>

			<p>Combino enfoque creativo y técnico para diseñar soluciones coherentes, funcionales y visualmente profesionales, siempre adaptadas al estilo y las necesidades del proyecto. Trabajo con HTML, CSS, JavaScript y Python, utilizando diversas librerías para crear tanto aplicaciones web como programas locales.</p>

			<div class="separator-line"></div>

			<div class="cta-section">
				<p class="cta-text">Descubre más</p>
				<button class="portfolio-btn" onclick="goToPortfolio()">Ver Portfolio</button>
			</div>
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

console.log("📹 Images config for", groupName, ":", images);

	// Crear estructura del modal de información a pantalla completa

	const image1HTML = images.image1
		? `<div class="modal-info-image-1" style="pointer-events: auto;"><img src="${images.image1}" alt="Imagen principal"></div>`
		: '';

	const video1HTML = images.video1
		? `<div class="modal-info-video-1" style="pointer-events: auto;"><video src="${images.video1}" autoplay loop muted playsinline preload="auto"></video></div>`
		: '';

	const image2HTML = images.image2
		? `<div class="modal-info-image-2" style="pointer-events: auto;"><img src="${images.image2}" alt="Imagen de fondo"></div>`
		: '';

console.log("📹 Video HTML:", video1HTML ? "YES" : "NO");

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

// Función para ir al portfolio desde el modal de Videojuegos
function goToPortfolio() {
	closeCVInfoModal();
	setTimeout(() => {
		switchSection('portfolio');
	}, 300);
}
