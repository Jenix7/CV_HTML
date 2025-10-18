const imageCache = new Map();
const projectCache = new Map();
const MAX_CACHED_PROJECTS = 8;
let cacheAccessOrder = [];

async function loadPortfolioData() {
	console.log('Loading portfolio data from JSON...');

	try {
		const response = await fetch('portfolio-data.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		portfolioData = await response.json();
		console.log('✅ Portfolio data loaded successfully:', portfolioData);

		for (const [key, data] of Object.entries(portfolioData)) {
			if (key !== 'todo') {
				const totalImages = data.categories.reduce((sum, cat) => sum + cat.images.length, 0);
				console.log(`  • ${data.name}: ${data.categories.length} categorías, ${totalImages} imágenes`);
			}
		}
	} catch (error) {
		console.error('❌ Error loading portfolio data:', error);
		console.error('⚠️ Asegúrate de que existe el archivo portfolio-data.json');
		console.error('⚠️ Ejecuta el script generate_portfolio.py primero');
	}
}

function preloadImage(src) {
	const cleanSrc = src.replace(/ /g, '%20');

	if (imageCache.has(cleanSrc)) {
		return Promise.resolve(imageCache.get(cleanSrc));
	}

	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			imageCache.set(cleanSrc, img);
			resolve(img);
		};

		img.onerror = () => {
			console.warn(`⚠️ Error cargando: ${cleanSrc}`);
			reject(new Error(`Failed to load image: ${cleanSrc}`));
		};

		img.src = cleanSrc;
	});
}

async function preloadProjectImages(categoryKey, categoryIndex, projectIndex) {
	const projectKey = `${categoryKey}-${categoryIndex}-${projectIndex}`;

	if (projectCache.has(projectKey)) {
		updateCacheAccess(projectKey);
		return projectCache.get(projectKey);
	}

	const sectionData = portfolioData[categoryKey];
	if (!sectionData || !sectionData.categories[categoryIndex]) {
		return null;
	}

	const categoryData = sectionData.categories[categoryIndex];
	const projectData = categoryData.images[projectIndex];

	if (!projectData) {
		return null;
	}

	const imagesToLoad = projectData.images || [];

	try {
		const loadPromises = imagesToLoad.map(imgSrc => preloadImage(imgSrc));
		await Promise.all(loadPromises);

		projectCache.set(projectKey, true);
		updateCacheAccess(projectKey);
		enforceCacheLimit();

		console.log(`✅ Proyecto precargado: ${projectKey} (${imagesToLoad.length} imágenes)`);
		return true;
	} catch (error) {
		console.error(`❌ Error precargando proyecto ${projectKey}:`, error);
		return false;
	}
}

function updateCacheAccess(projectKey) {
	cacheAccessOrder = cacheAccessOrder.filter(key => key !== projectKey);
	cacheAccessOrder.push(projectKey);
}

function enforceCacheLimit() {
	while (cacheAccessOrder.length > MAX_CACHED_PROJECTS) {
		const oldestKey = cacheAccessOrder.shift();
		projectCache.delete(oldestKey);

		const [categoryKey, categoryIndex, projectIndex] = oldestKey.split('-');
		const sectionData = portfolioData[categoryKey];
		if (sectionData && sectionData.categories[categoryIndex]) {
			const categoryData = sectionData.categories[categoryIndex];
			const projectData = categoryData.images[projectIndex];

			if (projectData && projectData.images) {
				projectData.images.forEach(imgSrc => {
					const cleanSrc = imgSrc.replace(/ /g, '%20');
					imageCache.delete(cleanSrc);
				});
			}
		}

		console.log(`🗑️ Proyecto eliminado de caché: ${oldestKey}`);
	}
}

async function preloadAdjacentProjects(categoryKey, categoryIndex, projectIndex) {
	const sectionData = portfolioData[categoryKey];
	if (!sectionData || !sectionData.categories[categoryIndex]) {
		return;
	}

	const categoryData = sectionData.categories[categoryIndex];
	const totalProjects = categoryData.images.length;

	const adjacentProjects = [];

	if (projectIndex > 0) {
		adjacentProjects.push(projectIndex - 1);
	}

	if (projectIndex < totalProjects - 1) {
		adjacentProjects.push(projectIndex + 1);
	}

	console.log(`🔄 Precargando proyectos adyacentes: ${adjacentProjects.join(', ')}`);

	const preloadPromises = adjacentProjects.map(adjIndex =>
		preloadProjectImages(categoryKey, categoryIndex, adjIndex)
	);

	await Promise.allSettled(preloadPromises);
}

function getCachedImage(src) {
	const cleanSrc = src.replace(/ /g, '%20');
	return imageCache.get(cleanSrc);
}

function isCached(src) {
	const cleanSrc = src.replace(/ /g, '%20');
	return imageCache.has(cleanSrc);
}

function getCacheStats() {
	return {
		totalImages: imageCache.size,
		totalProjects: projectCache.size,
		cacheOrder: [...cacheAccessOrder]
	};
}
