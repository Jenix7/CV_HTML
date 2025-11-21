// ============================================
// IMAGE LANGUAGE MANAGER
// Sistema de cambio automático de imágenes según idioma
// ============================================

// Mapeo de imágenes que tienen versión en inglés
const IMAGE_LANGUAGE_MAP = {
	// CURRICULUM - Elementos del CV
	'images/Tablon.png': 'images/Tablon_EN.png',
	'images/Aptitudes.png': 'images/Aptitudes_EN.png',
	'images/Aptitudes_High.png': 'images/Aptitudes_High_EN.png',
	'images/Diseogrfico.png': 'images/Diseogrfico_EN.png',
	'images/Edicin.png': 'images/Edicin_EN.png',
	'images/Experiencia.png': 'images/Experiencia_EN.png',
	'images/Experiencia_High.png': 'images/Experiencia_High_EN.png',
	'images/Ilustracin.png': 'images/Ilustracin_EN.png',
	'images/Licenciado.png': 'images/Licenciado_EN.png',
	'images/Licenciado_High.png': 'images/Licenciado_High_EN.png',
	'images/Modelado3D.png': 'images/Modelado3D_EN.png',
	'images/ResumenPersonal.png': 'images/ResumenPersonal_EN.png',
	'images/ResumenPersonal_High.png': 'images/ResumenPersonal_High_EN.png',
	'images/TargetaJavier.png': 'images/TargetaJavier_EN.png',
	'images/TargetaJavier_High.png': 'images/TargetaJavier_High_EN.png',
	'images/Videojuegos.png': 'images/Videojuegos_EN.png',

	// PORTFOLIO - Subtítulos de tarjetas
	'images/Sub_Arte.png': 'images/Sub_Arte_EN.png',
	'images/Sub_Comunicacion.png': 'images/Sub_Comunicacion_EN.png',
	'images/Sub_Diseno.png': 'images/Sub_Diseno_EN.png',
	'images/Sub_Produccion.png': 'images/Sub_Produccion_EN.png',
	'images/Sub_Programacion.png': 'images/Sub_Programacion_EN.png',

	// PORTFOLIO - Tarjetas frontales
	'images/Targeta_Artista.png': 'images/Targeta_Artista_EN.png',
	'images/Targeta_Comunicador.png': 'images/Targeta_Comunicador_EN.png',
	'images/Targeta_Disenador.png': 'images/Targeta_Disenador_EN.png',
	'images/Targeta_Productor.png': 'images/Targeta_Productor_EN.png',
	'images/Targeta_Programador.png': 'images/Targeta_Programador_EN.png'
};

// Cache de imágenes precargadas
const imagePreloadCache = new Map();

// Cache de videos precargados
const videoPreloadCache = new Map();

// ============================================
// FUNCIONES DE PRECARGA
// ============================================

/**
 * Precarga TODAS las imágenes (ES + EN) al inicio
 */
async function preloadAllLanguageImages() {
	console.log('🖼️ Precargando todas las imágenes en ambos idiomas...');

	const allImages = new Set();

	// Agregar versiones ES
	Object.keys(IMAGE_LANGUAGE_MAP).forEach(imgES => allImages.add(imgES));

	// Agregar versiones EN
	Object.values(IMAGE_LANGUAGE_MAP).forEach(imgEN => allImages.add(imgEN));

	const loadPromises = Array.from(allImages).map(src => preloadSingleImage(src));

	try {
		await Promise.all(loadPromises);
		console.log(`✅ ${allImages.size} imágenes precargadas correctamente`);
		return true;
	} catch (error) {
		console.error('❌ Error precargando imágenes:', error);
		return false;
	}
}

/**
 * Precarga TODAS las imágenes y videos de modales CV
 */
async function preloadCVModalAssets() {
	console.log('🎬 Precargando assets de modales CV...');

	// Obtener cvInfoImages desde cvInfomodal.js
	if (typeof cvInfoImages === 'undefined') {
		console.warn('⚠️ cvInfoImages no disponible aún');
		return false;
	}

	const allAssets = [];

	// Recolectar todas las imágenes y videos
	Object.values(cvInfoImages).forEach(modalData => {
		if (modalData.image1) allAssets.push({ type: 'image', src: modalData.image1 });
		if (modalData.image2) allAssets.push({ type: 'image', src: modalData.image2 });
		if (modalData.video1) allAssets.push({ type: 'video', src: modalData.video1 });
	});

	// Precargar todos los assets
	const loadPromises = allAssets.map(asset => {
		if (asset.type === 'image') {
			return preloadSingleImage(asset.src);
		} else {
			return preloadSingleVideo(asset.src);
		}
	});

	try {
		await Promise.all(loadPromises);
		console.log(`✅ ${allAssets.length} assets de modales CV precargados`);
		return true;
	} catch (error) {
		console.error('❌ Error precargando assets de modales CV:', error);
		return false;
	}
}

/**
 * Precarga una imagen individual
 */
function preloadSingleImage(src) {
	// Si ya está en caché, retornar inmediatamente
	if (imagePreloadCache.has(src)) {
		return Promise.resolve(imagePreloadCache.get(src));
	}

	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			imagePreloadCache.set(src, img);
			resolve(img);
		};

		img.onerror = () => {
			console.warn(`⚠️ Error cargando imagen: ${src}`);
			reject(new Error(`Failed to load: ${src}`));
		};

		img.src = src;
	});
}

/**
 * Precarga un video individual
 */
function preloadSingleVideo(src) {
	// Si ya está en caché, retornar inmediatamente
	if (videoPreloadCache.has(src)) {
		return Promise.resolve(videoPreloadCache.get(src));
	}

	return new Promise((resolve, reject) => {
		const video = document.createElement('video');

		// Configurar atributos del video
		video.preload = 'auto';
		video.muted = true;
		video.playsInline = true;

		// Cuando el video tenga suficientes datos para reproducir
		video.oncanplaythrough = () => {
			videoPreloadCache.set(src, video);
			console.log(`✅ Video precargado: ${src}`);
			resolve(video);
		};

		video.onerror = () => {
			console.warn(`⚠️ Error cargando video: ${src}`);
			// No rechazamos para que no bloquee la carga completa
			resolve(null);
		};

		video.src = src;

		// Iniciar la carga
		video.load();
	});
}

// ============================================
// FUNCIONES DE OBTENCIÓN DE RUTAS
// ============================================

/**
 * Obtiene la ruta de imagen según el idioma actual
 * @param {string} baseImagePath - Ruta base (siempre la versión ES)
 * @param {string} lang - Idioma ('es' o 'en')
 * @returns {string} - Ruta de la imagen en el idioma correcto
 */
function getImagePathForLanguage(baseImagePath, lang = 'es') {
	// Si no es inglés o no tiene versión EN, retornar la original
	if (lang !== 'en' || !IMAGE_LANGUAGE_MAP[baseImagePath]) {
		return baseImagePath;
	}

	return IMAGE_LANGUAGE_MAP[baseImagePath];
}

/**
 * Obtiene la ruta base (ES) desde cualquier versión
 * @param {string} imagePath - Ruta de imagen (puede ser ES o EN)
 * @returns {string} - Ruta base en español
 */
function getBaseImagePath(imagePath) {
	// Si es una ruta EN, encontrar su versión ES
	for (const [baseES, pathEN] of Object.entries(IMAGE_LANGUAGE_MAP)) {
		if (imagePath === pathEN) {
			return baseES;
		}
	}

	// Si no tiene versión EN o ya es ES, retornar tal cual
	return imagePath;
}

// ============================================
// FUNCIONES DE ACTUALIZACIÓN DE IMÁGENES
// ============================================

/**
 * Actualiza todas las imágenes del DOM según el idioma actual
 */
function updateAllImages() {
	console.log(`🖼️ Actualizando imágenes al idioma: ${currentLanguage.toUpperCase()}`);

	// Actualizar imágenes del CV
	updateCVImages();

	// Actualizar imágenes del Portfolio
	updatePortfolioImages();

	// Actualizar imágenes en highResMap (para modales)
	updateHighResMap();

	console.log('✅ Todas las imágenes actualizadas');
}

/**
 * Actualiza imágenes del currículum
 */
function updateCVImages() {
	// Elementos del CV que son <img> directos
	const cvImageElements = [
		'cv-tablon',
		'cv-aptitudes',
		'cv-experiencia',
		'cv-licenciado',
		'cv-resumen-personal',
		'cv-targeta-javier',
		'cv-videojuegos',
		'cv-diseno-grafico',
		'cv-ilustracion',
		'cv-modelado3d',
		'cv-edicion'
	];

	cvImageElements.forEach(elementId => {
		const element = document.getElementById(elementId);
		if (!element) return;

		const img = element.querySelector('img');
		if (!img) return;

		// Obtener ruta base (ES)
		const basePath = getBaseImagePath(img.src.replace(window.location.origin + '/', ''));

		// Obtener ruta según idioma
		const newPath = getImagePathForLanguage(basePath, currentLanguage);

		// Actualizar src solo si es diferente
		const fullNewPath = window.location.origin + '/' + newPath;
		if (img.src !== fullNewPath) {
			img.src = newPath;
			console.log(`  ✓ ${elementId}: ${newPath}`);
		}
	});
}

/**
 * Actualiza imágenes del portfolio (tarjetas y subtítulos)
 */
function updatePortfolioImages() {
	// Actualizar tarjetas frontales
	const cardFronts = document.querySelectorAll('.card-front img');
	cardFronts.forEach(img => {
		const basePath = getBaseImagePath(img.src.replace(window.location.origin + '/', ''));
		const newPath = getImagePathForLanguage(basePath, currentLanguage);

		const fullNewPath = window.location.origin + '/' + newPath;
		if (img.src !== fullNewPath) {
			img.src = newPath;
		}
	});

	// Actualizar subtítulos de tarjetas
	const cardSubtitles = document.querySelectorAll('.card-subtitle img');
	cardSubtitles.forEach(img => {
		const basePath = getBaseImagePath(img.src.replace(window.location.origin + '/', ''));
		const newPath = getImagePathForLanguage(basePath, currentLanguage);

		const fullNewPath = window.location.origin + '/' + newPath;
		if (img.src !== fullNewPath) {
			img.src = newPath;
		}
	});

	// Actualizar placeholders de tarjetas
	const placeholderImages = document.querySelectorAll('.card-placeholder img');
	placeholderImages.forEach(img => {
		const basePath = getBaseImagePath(img.src.replace(window.location.origin + '/', ''));
		const newPath = getImagePathForLanguage(basePath, currentLanguage);

		const fullNewPath = window.location.origin + '/' + newPath;
		if (img.src !== fullNewPath) {
			img.src = newPath;
		}
	});
}

/**
 * Actualiza el mapa de imágenes de alta resolución
 */
function updateHighResMap() {
	if (typeof highResMap === 'undefined') return;

	// Crear nuevo mapa con rutas actualizadas
	const updatedMap = {};

	for (const [key, value] of Object.entries(highResMap)) {
		const basePath = getBaseImagePath(value);
		updatedMap[key] = getImagePathForLanguage(basePath, currentLanguage);
	}

	// Actualizar el objeto global
	Object.assign(highResMap, updatedMap);
}

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

/**
 * Inicializa el sistema de imágenes multiidioma
 */
async function initializeImageLanguageSystem() {
	console.log('🎨 Inicializando sistema de imágenes multiidioma...');

	// Precargar todas las imágenes
	await preloadAllLanguageImages();

	// Precargar assets de modales CV (imágenes y videos)
	// Esperamos un poco para que cvInfoImages esté disponible
	setTimeout(async () => {
		await preloadCVModalAssets();
	}, 100);

	// Actualizar imágenes según idioma actual
	updateAllImages();

	console.log('✅ Sistema de imágenes listo');
}

/**
 * Maneja el evento de cambio de idioma
 */
function handleLanguageChange() {
	// Actualizar todas las imágenes inmediatamente
	updateAllImages();
}

// ============================================
// EVENT LISTENERS
// ============================================

// Escuchar cambios de idioma
window.addEventListener('languageChanged', (e) => {
	console.log('🔄 Idioma cambiado, actualizando imágenes...');
	handleLanguageChange();
});

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeImageLanguageSystem);
} else {
	initializeImageLanguageSystem();
}
