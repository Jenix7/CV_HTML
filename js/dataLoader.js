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

		preloadAllImages();
	} catch (error) {
		console.error('❌ Error loading portfolio data:', error);
		console.error('⚠️ Asegúrate de que existe el archivo portfolio-data.json');
		console.error('⚠️ Ejecuta el script generate_portfolio.py primero');
	}
}

function preloadAllImages() {
	console.log('🖼️ Precargando imágenes del portfolio...');
	let totalImages = 0;
	let loadedImages = 0;

	for (const [key, data] of Object.entries(portfolioData)) {
		if (key === 'todo' || !data.categories) continue;

		data.categories.forEach(category => {
			category.images.forEach(imageSrc => {
				totalImages++;
				const img = new Image();
				img.onload = () => {
					loadedImages++;
					if (loadedImages === totalImages) {
						console.log(`✅ Todas las imágenes precargadas (${totalImages})`);
					}
				};
				img.onerror = () => {
					console.warn(`⚠️ Error cargando: ${imageSrc}`);
					loadedImages++;
				};
				img.src = imageSrc;
			});
		});
	}

	console.log(`📊 Precargando ${totalImages} imágenes en segundo plano...`);
}
