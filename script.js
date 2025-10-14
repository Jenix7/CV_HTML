let currentSection = 'curriculum';
let currentCategory = 'todo';
let currentTheme = '';
let animationComplete = false;
let portfolioAnimated = false;
let selectedCard = null;
let categoryDetailView = false;
let currentCategoryIndex = null;

const tooltip = document.getElementById('customTooltip');
const tooltipText = tooltip.querySelector('.tooltip-text');
let tooltipTimeout = null;

const categoryColors = {
	'todo': 'green',
	'arte': 'red',
	'programacion': 'blue',
	'diseño': 'yellow',
	'produccion': 'purple',
	'comunicacion': 'pink'
};

let portfolioData = {
	'arte': { name: 'ARTE', categories: [] },
	'programacion': { name: 'PROGRAMACIÓN', categories: [] },
	'diseño': { name: 'DISEÑO', categories: [] },
	'produccion': { name: 'PRODUCCIÓN', categories: [] },
	'comunicacion': { name: 'COMUNICACIÓN', categories: [] },
	'todo': { name: 'TODO', categories: [] }
};

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

const elementNames = {
	'cv-targeta-javier': { name: 'Tarjeta Personal', icon: '👤', clickable: true },
	'cv-resumen-personal': { name: 'Resumen Personal', icon: '📄', clickable: true },
	'cv-experiencia': { name: 'Experiencia', icon: '💼', clickable: true },
	'cv-aptitudes': { name: 'Aptitudes', icon: '⭐', clickable: true },
	'cv-licenciado': { name: 'Título Universitario', icon: '🎓', clickable: true },
	'cv-photoshop': { name: 'Photoshop', icon: '🎨', clickable: false },
	'cv-zbrush': { name: 'ZBrush', icon: '🗿', clickable: false },
	'cv-opentoonz': { name: 'OpenToonz', icon: '🎬', clickable: false },
	'cv-premiere': { name: 'Premiere', icon: '🎞️', clickable: false },
	'cv-after-effects': { name: 'After Effects', icon: '✨', clickable: false },
	'cv-unreal': { name: 'Unreal Engine', icon: '🎮', clickable: false },
	'cv-cascadeur': { name: 'Cascadeur', icon: '🤸', clickable: false },
	'cv-marmoset': { name: 'Marmoset', icon: '🦊', clickable: false },
	'cv-substance': { name: 'Substance', icon: '🧪', clickable: false },
	'cv-3dmax': { name: '3D Max', icon: '📦', clickable: false },
	'cv-maya': { name: 'Maya', icon: '🛕', clickable: false },
	'cv-blender': { name: 'Blender', icon: '🌀', clickable: false },
	'cv-unity': { name: 'Unity', icon: '🎯', clickable: false },
	'cv-illustrator': { name: 'Illustrator', icon: '✏️', clickable: false },
	'cv-portfolio-titulo': { name: 'Portfolio', icon: '📂', clickable: false },
	'cv-entrada1': { name: 'Diseño Gráfico', icon: '🎨', clickable: false },
	'cv-entrada2': { name: 'Diseño Gráfico', icon: '🎨', clickable: false },
	'cv-diseno-grafico': { name: 'Diseño Gráfico', icon: '🎨', clickable: false },
	'cv-coral': { name: 'Modelado 3D', icon: '🪸', clickable: false },
	'cv-zapato': { name: 'Modelado 3D', icon: '👟', clickable: false },
	'cv-modelado3d': { name: 'Modelado 3D', icon: '📦', clickable: false },
	'cv-porky': { name: 'Ilustración', icon: '🐷', clickable: false },
	'cv-sydan': { name: 'Ilustración', icon: '🦌', clickable: false },
	'cv-ilustracion': { name: 'Ilustración', icon: '🖼️', clickable: false },
	'cv-cinta-video1': { name: 'Edición de Video', icon: '📹', clickable: false },
	'cv-cinta-video2': { name: 'Edición de Video', icon: '📹', clickable: false },
	'cv-edicion': { name: 'Edición', icon: '✂️', clickable: false },
	'cv-artilugio': { name: 'Webs', icon: '🌐', clickable: false },
	'cv-webs': { name: 'Desarrollo Web', icon: '💻', clickable: false },
	'cv-consola': { name: 'Videojuegos', icon: '🎮', clickable: false },
	'cv-videojuegos': { name: 'Videojuegos', icon: '🕹️', clickable: false }
};

function showTooltip(element, x, y) {
	const data = elementNames[element.id];
	if (!data) return;

	clearTimeout(tooltipTimeout);

	tooltipTimeout = setTimeout(() => {
		tooltipText.textContent = data.name;

		tooltip.classList.remove('clickable');

		tooltip.style.left = x + 'px';
		tooltip.style.top = y + 'px';
		tooltip.classList.add('show');
	}, 500);
}

function hideTooltip() {
	clearTimeout(tooltipTimeout);
	tooltip.classList.remove('show');
}

function updateTooltipPosition(x, y) {
	tooltip.style.left = x + 'px';
	tooltip.style.top = y + 'px';
}

window.addEventListener('load', () => {
	loadPortfolioData().then(() => {
		console.log('Portfolio data ready');
	});

	const cvElements = document.querySelectorAll('.cv-background > div');

	cvElements.forEach(element => {
		element.style.pointerEvents = 'none';
	});

	const tablonGroupElements = [
		'cv-tablon',
		'cv-sobre'
	];

	const compactGroupElements = [
		'cv-webs',
		'cv-artilugio',
		'cv-coral',
		'cv-zapato',
		'cv-modelado3d',
		'cv-edicion',
		'cv-cinta-video1',
		'cv-cinta-video2',
		'cv-ilustracion',
		'cv-porky',
		'cv-sydan',
		'cv-diseno-grafico',
		'cv-entrada1',
		'cv-entrada2',
		'cv-videojuegos',
		'cv-consola',
		'cv-chincheta-verde',
		'cv-portfolio-titulo'
	];

	const smallIconElements = [
		'cv-photoshop',
		'cv-unity',
		'cv-premiere',
		'cv-3dmax',
		'cv-blender',
		'cv-maya',
		'cv-illustrator',
		'cv-substance',
		'cv-unreal',
		'cv-zbrush',
		'cv-cascadeur',
		'cv-marmoset',
		'cv-after-effects',
		'cv-opentoonz'
	];

	const directions = [
		{ x: '-200vw', y: '0', rotate: '-180deg' },
		{ x: '200vw', y: '0', rotate: '180deg' },
		{ x: '0', y: '-200vh', rotate: '-360deg' },
		{ x: '0', y: '200vh', rotate: '360deg' },
		{ x: '-150vw', y: '-150vh', rotate: '-270deg' },
		{ x: '150vw', y: '-150vh', rotate: '270deg' },
		{ x: '-150vw', y: '150vh', rotate: '-90deg' },
		{ x: '150vw', y: '150vh', rotate: '90deg' }
	];

	const tablonGroupDirection = directions[Math.floor(Math.random() * directions.length)];
	const groupDirection = directions[Math.floor(Math.random() * directions.length)];

	let maxDelay = 0;
	let animationsCount = 0;
	let completedAnimations = 0;

	cvElements.forEach((element, index) => {
		if (tablonGroupElements.includes(element.id)) {
			element.style.setProperty('--start-x', tablonGroupDirection.x);
			element.style.setProperty('--start-y', tablonGroupDirection.y);
			element.style.setProperty('--start-rotate', tablonGroupDirection.rotate);

			animationsCount++;
			const delay = 0;
			maxDelay = Math.max(maxDelay, delay + 850);

			setTimeout(() => {
				element.classList.add('animate-in');

				setTimeout(() => {
					element.classList.remove('animate-in');
					element.classList.add('animation-complete');
					element.style.animation = '';
					element.style.transform = '';
					element.style.removeProperty('--start-x');
					element.style.removeProperty('--start-y');
					element.style.removeProperty('--start-rotate');
					completedAnimations++;
					checkAllAnimationsComplete();
				}, 850);
			}, delay);
		}
		else if (compactGroupElements.includes(element.id)) {
			element.style.setProperty('--start-x', groupDirection.x);
			element.style.setProperty('--start-y', groupDirection.y);
			element.style.setProperty('--start-rotate', groupDirection.rotate);

			animationsCount++;
			const delay = 600;
			maxDelay = Math.max(maxDelay, delay + 850);

			setTimeout(() => {
				element.classList.add('animate-in');

				setTimeout(() => {
					element.classList.remove('animate-in');
					element.classList.add('animation-complete');
					element.style.animation = '';
					element.style.transform = '';
					element.style.removeProperty('--start-x');
					element.style.removeProperty('--start-y');
					element.style.removeProperty('--start-rotate');
					completedAnimations++;
					checkAllAnimationsComplete();
				}, 850);
			}, delay);
		}
		else if (smallIconElements.includes(element.id)) {
			const randomDirection = directions[Math.floor(Math.random() * directions.length)];

			element.style.setProperty('--start-x', randomDirection.x);
			element.style.setProperty('--start-y', randomDirection.y);
			element.style.setProperty('--start-rotate', randomDirection.rotate);

			animationsCount++;
			const delay = index * 50;
			maxDelay = Math.max(maxDelay, delay + 850);

			setTimeout(() => {
				element.classList.add('animate-in-subtle');

				setTimeout(() => {
					element.classList.remove('animate-in-subtle');
					element.classList.add('animation-complete');
					element.style.animation = '';
					element.style.transform = '';
					element.style.removeProperty('--start-x');
					element.style.removeProperty('--start-y');
					element.style.removeProperty('--start-rotate');
					completedAnimations++;
					checkAllAnimationsComplete();
				}, 850);
			}, delay);
		} else {
			const randomDirection = directions[Math.floor(Math.random() * directions.length)];

			element.style.setProperty('--start-x', randomDirection.x);
			element.style.setProperty('--start-y', randomDirection.y);
			element.style.setProperty('--start-rotate', randomDirection.rotate);

			animationsCount++;
			const delay = index * 50;
			maxDelay = Math.max(maxDelay, delay + 850);

			setTimeout(() => {
				element.classList.add('animate-in');

				setTimeout(() => {
					element.classList.remove('animate-in');
					element.classList.add('animation-complete');
					element.style.animation = '';
					element.style.transform = '';
					element.style.removeProperty('--start-x');
					element.style.removeProperty('--start-y');
					element.style.removeProperty('--start-rotate');
					completedAnimations++;
					checkAllAnimationsComplete();
				}, 850);
			}, delay);
		}
	});

	function checkAllAnimationsComplete() {
		if (completedAnimations === animationsCount && !animationComplete) {
			animationComplete = true;
			cvElements.forEach(element => {
				if (element.id !== 'cv-sobre') {
					element.style.pointerEvents = 'auto';
				}
			});

			const cvContainer = document.querySelector('.cv-container');
			cvContainer.style.overflow = 'hidden';
		}
	}
});

const hoverGroups = {
	group1: ['cv-entrada2', 'cv-entrada1', 'cv-diseno-grafico'],
	group2: ['cv-coral', 'cv-zapato', 'cv-modelado3d'],
	group3: ['cv-porky', 'cv-sydan', 'cv-ilustracion'],
	group4: ['cv-cinta-video2', 'cv-cinta-video1', 'cv-edicion'],
	group5: ['cv-artilugio', 'cv-webs'],
	group6: ['cv-consola', 'cv-videojuegos']
};

Object.values(hoverGroups).forEach(group => {
	group.forEach(elementId => {
		const element = document.getElementById(elementId);
		if (element) {
			element.addEventListener('mouseenter', (e) => {
				showTooltip(element, e.clientX, e.clientY);
				group.forEach(id => {
					const el = document.getElementById(id);
					if (el) {
						el.style.transform = 'scale(1.05) translateY(-2px)';
						el.style.zIndex = '999';
						el.style.filter = 'drop-shadow(0 0 3px rgba(74, 222, 128, 0.9)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) brightness(1.12) contrast(1.05) saturate(1.15)';
						el.style.animation = 'pulse-glow 1.5s ease-in-out infinite';
					}
				});
			});

			element.addEventListener('mousemove', (e) => {
				updateTooltipPosition(e.clientX, e.clientY);
			});

			element.addEventListener('mouseleave', () => {
				hideTooltip();
				group.forEach(id => {
					const el = document.getElementById(id);
					if (el) {
						el.style.transform = '';
						el.style.zIndex = '';
						el.style.filter = '';
						el.style.animation = '';
					}
				});
			});
		}
	});
});

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');

const highResMap = {
	'cv-targeta-javier': 'images/TargetaJavier_High.png',
	'cv-resumen-personal': 'images/ResumenPersonal_High.png',
	'cv-experiencia': 'images/Experiencia_High.png',
	'cv-aptitudes': 'images/Aptitudes_High.png',
	'cv-licenciado': 'images/Licenciado_High.png'
};

const clickableElements = [
	'cv-targeta-javier',
	'cv-resumen-personal',
	'cv-experiencia',
	'cv-aptitudes',
	'cv-licenciado'
];

clickableElements.forEach(elementId => {
	const element = document.getElementById(elementId);
	if (element) {
		element.addEventListener('mouseenter', (e) => {
			showTooltip(element, e.clientX, e.clientY);
		});

		element.addEventListener('mousemove', (e) => {
			updateTooltipPosition(e.clientX, e.clientY);
		});

		element.addEventListener('mouseleave', () => {
			hideTooltip();
		});

		element.addEventListener('click', () => {
			hideTooltip();
			const highResImage = highResMap[elementId];
			if (highResImage) {
				modalImage.src = highResImage;

				if (elementId === 'cv-licenciado') {
					modalImage.setAttribute('data-no-card-effect', 'true');
				} else {
					modalImage.removeAttribute('data-no-card-effect');
				}
			} else {
				const img = element.querySelector('img');
				if (img) {
					modalImage.src = img.src;
					modalImage.removeAttribute('data-no-card-effect');
				}
			}
			modal.classList.add('active');
			document.body.style.overflow = 'hidden';
		});
	}
});

const individualHoverElements = [
	'cv-photoshop', 'cv-zbrush', 'cv-opentoonz', 'cv-premiere',
	'cv-after-effects', 'cv-unreal', 'cv-cascadeur', 'cv-marmoset',
	'cv-substance', 'cv-3dmax', 'cv-maya', 'cv-blender', 'cv-unity',
	'cv-illustrator', 'cv-portfolio-titulo'
];

individualHoverElements.forEach(elementId => {
	const element = document.getElementById(elementId);
	if (element) {
		element.addEventListener('mouseenter', (e) => {
			showTooltip(element, e.clientX, e.clientY);
		});

		element.addEventListener('mousemove', (e) => {
			updateTooltipPosition(e.clientX, e.clientY);
		});

		element.addEventListener('mouseleave', () => {
			hideTooltip();
		});
	}
});

modalOverlay.addEventListener('click', closeModal);

modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && modal.classList.contains('active')) {
		closeModal();
	}
});

function closeModal() {
	modal.classList.remove('active');
	document.body.style.overflow = '';
	setTimeout(() => {
		modalImage.src = '';
	}, 300);
}

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

const contentData = {
	todo: {
		title: '',
		content: ''
	},
	arte: {
		title: '',
		content: ''
	},
	diseño: {
		title: '',
		content: ''
	},
	programacion: {
		title: '',
		content: ''
	},
	produccion: {
		title: '',
		content: ''
	},
	comunicacion: {
		title: '',
		content: ''
	}
};

function switchSection(section) {
	const curriculumSection = document.getElementById('curriculumSection');
	const portfolioSection = document.getElementById('portfolioSection');
	const sectionTitleHeader = document.getElementById('sectionTitleHeader');
	const switchCV = document.getElementById('switchCV');
	const switchPortfolio = document.getElementById('switchPortfolio');

	if (section === 'portfolio') {
		curriculumSection.classList.add('slide-left');
		portfolioSection.classList.add('slide-left');

		if (currentCategory && portfolioData[currentCategory]) {
			sectionTitleHeader.textContent = portfolioData[currentCategory].name;
		} else {
			sectionTitleHeader.textContent = 'Portfolio';
		}

		switchCV.classList.remove('active');
		switchPortfolio.classList.add('active');
		currentSection = 'portfolio';

		if (currentTheme) {
			document.body.className = currentTheme;
		}

		if (!portfolioAnimated) {
			setTimeout(() => {
				animatePortfolioCards();
				portfolioAnimated = true;
			}, 200);
		}
	} else {
		curriculumSection.classList.remove('slide-left');
		portfolioSection.classList.remove('slide-left');
		sectionTitleHeader.textContent = 'Currículum';
		switchCV.classList.add('active');
		switchPortfolio.classList.remove('active');
		currentSection = 'curriculum';

		document.body.className = '';
	}
}

function animatePortfolioCards() {
	const cards = document.querySelectorAll('.card-wrapper');
	cards.forEach((card, index) => {
		setTimeout(() => {
			card.classList.add('animate-in');
		}, index * 100);
	});

	setTimeout(() => {
		createPlaceholders();

		const portfolioCards = document.querySelectorAll('.portfolio-card');
		portfolioCards.forEach(card => {
			card.addEventListener('click', handleCardClick);

			const cardInner = card.querySelector('.card-inner');
			cardInner.addEventListener('mousemove', handleCardHover);
			cardInner.addEventListener('mouseleave', handleCardLeave);
			cardInner.addEventListener('mouseenter', handleCardEnter);
		});

		const categoriesContainer = document.getElementById('categoriesContainer');
		categoriesContainer.addEventListener('click', handleCategoryClick);
	}, 800);
}

const cardOrder = ['todo', 'arte', 'programacion', 'diseño', 'produccion', 'comunicacion'];

function calculateMenuPosition(index) {
	const startLeft = 0;
	const cardHeight = 280;
	const gap = 15;
	const scale = 1.2;
	const scaledHeight = cardHeight * scale;
	const scaledGap = gap * scale;

	return {
		left: startLeft + (index * (scaledHeight + scaledGap)),
		top: 80
	};
}

function createPlaceholders() {
	const cardsContainer = document.getElementById('cardsContainer');

	cardOrder.forEach((category, index) => {
		const pos = calculateMenuPosition(index);

		const originalCard = document.querySelector(`.card-wrapper[data-category="${category}"]`);
		const backImage = originalCard.querySelector('.card-back img');
		const subtitleImage = originalCard.querySelector('.card-subtitle img');

		const placeholder = document.createElement('div');
		placeholder.className = 'card-placeholder';
		placeholder.dataset.category = category;
		placeholder.style.position = 'fixed';
		placeholder.style.left = pos.left + 'px';
		placeholder.style.top = pos.top + 'px';
		placeholder.style.width = '187px';
		placeholder.style.height = '280px';
		placeholder.style.transform = 'scale(1.2) rotateZ(90deg)';
		placeholder.style.transformOrigin = 'center center';
		placeholder.style.zIndex = '800';
		placeholder.style.opacity = '0';
		placeholder.style.transition = 'opacity 0.3s ease';
		placeholder.style.pointerEvents = 'none';
		placeholder.style.overflow = 'visible';

		const cardContainer = document.createElement('div');
		cardContainer.style.position = 'relative';
		cardContainer.style.width = '100%';
		cardContainer.style.height = '100%';
		cardContainer.style.borderRadius = '16px';
		cardContainer.style.border = '2px solid rgba(255, 255, 255, 0.1)';
		cardContainer.style.overflow = 'hidden';

		if (backImage) {
			const img = document.createElement('img');
			img.src = backImage.src;
			img.style.width = '100%';
			img.style.height = '100%';
			img.style.objectFit = 'cover';
			img.style.opacity = '0.3';
			cardContainer.appendChild(img);
		}

		placeholder.appendChild(cardContainer);

		if (subtitleImage) {
			const subtitleDiv = document.createElement('div');
			subtitleDiv.className = 'placeholder-subtitle';
			subtitleDiv.style.opacity = '0.3';
			subtitleDiv.style.width = '280px';
			subtitleDiv.style.height = '1307px';
			subtitleDiv.style.position = 'absolute';
			subtitleDiv.style.left = '50%';
			subtitleDiv.style.top = '50%';
			subtitleDiv.style.transform = 'translate(-50%, -50%) translateX(-750px) rotateZ(90deg)';
			subtitleDiv.style.transformOrigin = 'center center';
			subtitleDiv.style.pointerEvents = 'none';

			const subImg = document.createElement('img');
			subImg.src = subtitleImage.src;
			subImg.style.width = '100%';
			subImg.style.height = 'auto';
			subImg.style.display = 'block';

			subtitleDiv.appendChild(subImg);
			placeholder.appendChild(subtitleDiv);
		}

		cardsContainer.appendChild(placeholder);
	});
}

function updateCardPositions() {
	cardOrder.forEach((category, index) => {
		const wrapper = document.querySelector(`.card-wrapper[data-category="${category}"]`);
		const placeholder = document.querySelector(`.card-placeholder[data-category="${category}"]`);

		if (!wrapper) return;

		const pos = calculateMenuPosition(index);

		if (wrapper.classList.contains('featured')) {
			wrapper.style.position = 'fixed';
			wrapper.style.left = '24px';
			wrapper.style.top = '100px';
			wrapper.style.zIndex = '1000';

			if (placeholder) {
				placeholder.style.opacity = '1';
			}
		} else {
			wrapper.classList.add('in-menu');
			wrapper.style.position = 'fixed';
			wrapper.style.left = pos.left + 'px';
			wrapper.style.top = pos.top + 'px';
			wrapper.style.zIndex = '900';

			if (placeholder) {
				placeholder.style.opacity = '0';
			}
		}
	});
}

function renderCategories(sectionKey) {
	const categoriesContainer = document.getElementById('categoriesContainer');
	const sectionData = portfolioData[sectionKey];

	if (!sectionData || sectionData.categories.length === 0) {
		categoriesContainer.style.display = 'none';
		return;
	}

	categoriesContainer.innerHTML = '';

	let maxImagesInAnyCategory = 0;
	sectionData.categories.forEach(cat => {
		if (cat.images.length > maxImagesInAnyCategory) {
			maxImagesInAnyCategory = cat.images.length;
		}
	});

	const numColumns = sectionData.categories.length;
	let useOneColumn = false;

	if (maxImagesInAnyCategory === 1) {
		useOneColumn = true;
	} else if (maxImagesInAnyCategory === 2) {
		if (numColumns >= 4) {
			useOneColumn = true;
		}
	}

	const containerWidth = 1200;
	const columnWidth = containerWidth / numColumns;
	const imageWidth = useOneColumn ? columnWidth : (columnWidth / 2);
	const useThumb = imageWidth < 200;

	sectionData.categories.forEach((categoryData, index) => {
		const categoryColumn = document.createElement('div');
		categoryColumn.className = 'category-column';
		categoryColumn.style.setProperty('--num-columns', numColumns);
		categoryColumn.style.setProperty('--max-images', maxImagesInAnyCategory);
		categoryColumn.dataset.categoryIndex = index;

		const categoryTitle = document.createElement('div');
		categoryTitle.className = 'category-column-title';
		categoryTitle.textContent = categoryData.title;

		const imagesGrid = document.createElement('div');
		imagesGrid.className = 'category-images-grid';

		if (useOneColumn) {
			imagesGrid.style.gridTemplateColumns = '1fr';
		}

		categoryData.images.forEach(imageData => {
			const imageWrapper = document.createElement('div');
			imageWrapper.className = 'category-image-wrapper';

			const img = document.createElement('img');

			if (typeof imageData === 'object' && imageData.src) {
				const srcEncoded = imageData.src.replace(/ /g, '%20');
				const thumbEncoded = imageData.thumb ? imageData.thumb.replace(/ /g, '%20') : null;

				img.src = (useThumb && thumbEncoded) ? thumbEncoded : srcEncoded;
			} else {
				img.src = imageData;
			}

			img.alt = categoryData.title;

			imageWrapper.appendChild(img);
			imagesGrid.appendChild(imageWrapper);
		});

		categoryColumn.appendChild(categoryTitle);
		categoryColumn.appendChild(imagesGrid);
		categoriesContainer.appendChild(categoryColumn);

		setTimeout(() => {
			categoryColumn.classList.add('show');
		}, index * 100);
	});

	categoriesContainer.style.display = 'flex';
}

function handleCategoryClick(e) {
	const categoryColumn = e.target.closest('.category-column');
	if (!categoryColumn) return;

	const categoryIndex = parseInt(categoryColumn.dataset.categoryIndex);
	console.log('Clicked category:', categoryIndex);

	openCategoryDetail(categoryIndex);
}

function openCategoryDetail(categoryIndex) {
	const categoriesContainer = document.getElementById('categoriesContainer');

	if (categoryDetailView && currentCategoryIndex !== null) {
		// Cambio directo entre categorías (sin animación)
		currentCategoryIndex = categoryIndex;
		renderCategoryDetail(categoryIndex);
		return;
	}

	// Primera vez entrando a Vista 3 (con animación)
	categoryDetailView = true;
	currentCategoryIndex = categoryIndex;

	const cardsContainer = document.getElementById('cardsContainer');

	// Ocultar cartas y placeholders sin animación
	const allCardWrappers = document.querySelectorAll('.card-wrapper');
	allCardWrappers.forEach(wrapper => {
		if (!wrapper.classList.contains('featured')) {
			wrapper.style.transition = 'none';
			wrapper.style.opacity = '0';
			wrapper.style.pointerEvents = 'none';
		}
	});

	const allPlaceholders = document.querySelectorAll('.card-placeholder');
	allPlaceholders.forEach(placeholder => {
		placeholder.style.transition = 'none';
		placeholder.style.opacity = '0';
	});

	// Expandir y animar la entrada
	categoriesContainer.classList.add('expanded');
	categoriesContainer.style.opacity = '0';

	// Renderizar contenido
	renderCategoryDetail(categoryIndex);

	// Animar entrada con un pequeño delay
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			categoriesContainer.style.transition = 'opacity 0.4s ease-out';
			categoriesContainer.style.opacity = '1';
		});
	});
}

function closeCategoryDetail() {
	categoryDetailView = false;
	currentCategoryIndex = null;

	const cardsContainer = document.getElementById('cardsContainer');
	const categoriesContainer = document.getElementById('categoriesContainer');

	// Cerrar directamente sin animación
	categoriesContainer.classList.remove('expanded');

	renderCategories(currentCategory);

	// Restaurar cartas directamente en sus posiciones finales
	const allCardWrappers = document.querySelectorAll('.card-wrapper');
	allCardWrappers.forEach(wrapper => {
		if (!wrapper.classList.contains('featured')) {
			wrapper.style.transition = 'none';
			wrapper.style.opacity = '1';
			wrapper.style.pointerEvents = 'auto';
			wrapper.style.transform = wrapper.classList.contains('in-menu') ?
				'scale(1.2) rotateZ(90deg)' : 'translateY(0)';
		}
	});

	const allPlaceholders = document.querySelectorAll('.card-placeholder');
	allPlaceholders.forEach(placeholder => {
		const wrapper = document.querySelector(`.card-wrapper[data-category="${placeholder.dataset.category}"]`);
		if (wrapper && wrapper.classList.contains('featured')) {
			placeholder.style.transition = 'none';
			placeholder.style.opacity = '1';
			placeholder.style.transform = 'scale(1.2) rotateZ(90deg)';
		}
	});
}

function renderCategoryDetail(categoryIndex) {
	const categoriesContainer = document.getElementById('categoriesContainer');
	const sectionData = portfolioData[currentCategory];

	if (!sectionData || !sectionData.categories[categoryIndex]) {
		console.error('Category not found');
		return;
	}

	const categoryData = sectionData.categories[categoryIndex];
	const isFirstRender = !categoriesContainer.querySelector('.category-detail-header');

	categoriesContainer.innerHTML = '';

	const detailHeader = document.createElement('div');
	detailHeader.className = 'category-detail-header';

	const backButton = document.createElement('button');
	backButton.className = 'back-button';
	backButton.style.display = 'flex';
	backButton.innerHTML = '← Atrás';
	backButton.onclick = closeCategoryDetail;

	const divider = document.createElement('div');
	divider.className = 'category-detail-header-divider';

	const categoryNav = document.createElement('div');
	categoryNav.className = 'category-navigation';
	categoryNav.style.display = 'flex';

	sectionData.categories.forEach((cat, idx) => {
		const navBtn = document.createElement('button');
		navBtn.className = 'category-nav-btn';
		if (idx === categoryIndex) {
			navBtn.classList.add('active');
		}
		navBtn.textContent = cat.title;
		navBtn.onclick = () => {
			if (idx !== categoryIndex) {
				openCategoryDetail(idx);
			}
		};
		categoryNav.appendChild(navBtn);
	});

	detailHeader.appendChild(backButton);
	detailHeader.appendChild(divider);
	detailHeader.appendChild(categoryNav);

	const detailGrid = document.createElement('div');
	detailGrid.className = 'category-detail-grid';

	categoryData.images.forEach((imageData, imgIndex) => {
		const imageContainer = document.createElement('div');
		imageContainer.className = 'category-detail-image';
		imageContainer.dataset.imageIndex = imgIndex;

		// Título
		const title = document.createElement('div');
		title.className = 'category-detail-image-title';
		title.textContent = imageData.title || 'Sin título';

		// Wrapper de la imagen
		const imageWrapper = document.createElement('div');
		imageWrapper.className = 'category-detail-image-wrapper';

		const img = document.createElement('img');
		if (typeof imageData === 'object' && imageData.src) {
			img.src = imageData.src.replace(/ /g, '%20');
		} else {
			img.src = imageData;
		}
		img.alt = imageData.title || categoryData.title;

		imageWrapper.appendChild(img);

		// Subtítulo
		const subtitle = document.createElement('div');
		subtitle.className = 'category-detail-image-subtitle';
		subtitle.textContent = imageData.subtitle || '';

		// Construir el contenedor
		imageContainer.appendChild(title);
		imageContainer.appendChild(imageWrapper);
		if (imageData.subtitle) {
			imageContainer.appendChild(subtitle);
		}

		// Click para abrir visualizador de proyecto
		imageContainer.onclick = () => {
			openProjectViewer(categoryIndex, imgIndex);
		};

		detailGrid.appendChild(imageContainer);

		// Animar solo en la primera entrada (Vista 2 → Vista 3)
		if (isFirstRender) {
			setTimeout(() => {
				imageContainer.classList.add('animate-in');
			}, imgIndex * 50);
		} else {
			// Sin animación al cambiar entre categorías
			imageContainer.style.opacity = '1';
			imageContainer.style.transform = 'translateY(0)';
		}
	});

	categoriesContainer.appendChild(detailHeader);
	categoriesContainer.appendChild(detailGrid);
}

function handleCardClick(e) {
	const card = e.currentTarget;
	const category = card.getAttribute('data-category');
	const color = categoryColors[category];
	const clickedWrapper = card.closest('.card-wrapper');

	console.log('Card clicked:', category);

	if (clickedWrapper.classList.contains('featured')) {
		modal.classList.add('active');
		const cardImage = clickedWrapper.querySelector('.card-front img');
		if (cardImage) {
			modalImage.src = cardImage.src;
			modalImage.removeAttribute('data-no-card-effect');
		}
		document.body.style.overflow = 'hidden';
		return;
	}

	const cardsContainer = document.getElementById('cardsContainer');
	const contentArea = document.getElementById('contentArea');
	const categoriesContainer = document.getElementById('categoriesContainer');
	const sectionTitleHeader = document.getElementById('sectionTitleHeader');

	console.log('Categories container found:', categoriesContainer);

	const previousFeatured = document.querySelector('.card-wrapper.featured');
	if (previousFeatured) {
		previousFeatured.classList.remove('featured');
		previousFeatured.classList.add('in-menu');
		const previousCardInner = previousFeatured.querySelector('.card-inner');
		if (previousCardInner) {
			previousCardInner.style.transform = 'rotateY(180deg)';
		}
	}

	clickedWrapper.classList.add('featured');
	clickedWrapper.classList.remove('in-menu');
	const clickedCardInner = clickedWrapper.querySelector('.card-inner');
	if (clickedCardInner) {
		clickedCardInner.style.transform = 'rotateY(0deg)';
	}

	const allCardWrappers = document.querySelectorAll('.card-wrapper');
	allCardWrappers.forEach(wrapper => {
		if (!wrapper.classList.contains('featured')) {
			wrapper.classList.add('in-menu');
			const cardInner = wrapper.querySelector('.card-inner');
			if (cardInner) {
				cardInner.style.transform = 'rotateY(180deg)';
			}
		}
	});

	cardsContainer.classList.add('compact');
	document.body.className = `${color}-theme`;
	currentTheme = `${color}-theme`;
	updateCardPositions();

	contentArea.style.display = 'none';
	contentArea.classList.remove('show');

	currentCategory = category;

	if (portfolioData[category]) {
		sectionTitleHeader.textContent = portfolioData[category].name;
	}

	console.log('Calling renderCategories for:', category);
	renderCategories(category);
}

function handleCardHover(e) {
	const card = e.currentTarget;
	const wrapper = card.closest('.card-wrapper');

	const rect = card.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	const centerX = rect.width / 2;
	const centerY = rect.height / 2;

	let rotateX, rotateY, rotateZ, scale;

	if (wrapper.classList.contains('featured')) {
		rotateX = ((y - centerY) / centerY) * -5;
		rotateY = ((x - centerX) / centerX) * 5;
		rotateZ = 0;
		scale = 1.02;
		card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
	} else if (wrapper.classList.contains('in-menu')) {
		rotateX = ((y - centerY) / centerY) * -8;
		rotateY = ((x - centerX) / centerX) * 8;
		rotateZ = 180;
		scale = 1.05;
		card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY + rotateZ}deg) scale(${scale})`;
	} else {
		rotateX = ((y - centerY) / centerY) * -10;
		rotateY = ((x - centerX) / centerX) * 10;
		rotateZ = 0;
		scale = 1.05;
		card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
	}
}

function handleCardEnter(e) {
	const card = e.currentTarget;
	card.style.transition = 'transform 0.15s ease-out';
}

function handleCardLeave(e) {
	const card = e.currentTarget;
	const wrapper = card.closest('.card-wrapper');
	card.style.transition = 'transform 0.6s ease-out';

	if (wrapper.classList.contains('in-menu')) {
		card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(180deg) scale(1)';
	} else {
		card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
	}
}

let currentProjectIndex = null;
let currentProjectCategory = null;

function openProjectViewer(categoryIndex, projectIndex) {
	const categoriesContainer = document.getElementById('categoriesContainer');
	const sectionData = portfolioData[currentCategory];
	if (!sectionData || !sectionData.categories[categoryIndex]) return;

	const categoryData = sectionData.categories[categoryIndex];
	const projectData = categoryData.images[projectIndex];

	currentProjectCategory = categoryIndex;
	currentProjectIndex = projectIndex;

	// Verificar si ya existe el header o crearlo
	let detailHeader = categoriesContainer.querySelector('.category-detail-header');
	let needsHeaderCreation = !detailHeader;

	if (needsHeaderCreation) {
		// CREAR EL HEADER solo si no existe
		detailHeader = document.createElement('div');
		detailHeader.className = 'category-detail-header';

		const backButton = document.createElement('button');
		backButton.className = 'back-button';
		backButton.id = 'categoryBackButton';
		backButton.style.display = 'flex';
		backButton.innerHTML = '← Atrás';

		// Función inteligente del botón Atrás
		backButton.onclick = () => {
			if (currentProjectIndex !== null && currentProjectCategory !== null) {
				// Estamos en Vista 4 → Volver a Vista 3
				closeProjectViewer();
			} else {
				// Estamos en Vista 3 → Volver a Vista 2
				closeCategoryDetail();
			}
		};

		const divider = document.createElement('div');
		divider.className = 'category-detail-header-divider';

		const categoryNav = document.createElement('div');
		categoryNav.className = 'category-navigation';
		categoryNav.style.display = 'flex';

		sectionData.categories.forEach((cat, idx) => {
			const navBtn = document.createElement('button');
			navBtn.className = 'category-nav-btn';
			if (idx === categoryIndex) {
				navBtn.classList.add('active');
			}
			navBtn.textContent = cat.title;
			navBtn.onclick = () => {
				if (idx !== categoryIndex) {
					// Cambiar a otra categoría - volver a Vista 3
					currentProjectIndex = null;
					currentProjectCategory = null;
					openCategoryDetail(idx);
				}
			};
			categoryNav.appendChild(navBtn);
		});

		detailHeader.appendChild(backButton);
		detailHeader.appendChild(divider);
		detailHeader.appendChild(categoryNav);
	} else {
		// Actualizar los botones de categoría activos
		const categoryNavBtns = detailHeader.querySelectorAll('.category-nav-btn');
		categoryNavBtns.forEach((btn, idx) => {
			if (idx === categoryIndex) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
		});
	}

	// SIEMPRE actualizar el event listener del botón Atrás cuando estamos en Vista 4
	const backButton = detailHeader.querySelector('.back-button');
	if (backButton) {
		// Remover listener anterior clonando el botón
		const newBackButton = backButton.cloneNode(true);
		backButton.parentNode.replaceChild(newBackButton, backButton);

		// Asignar nuevo listener para Vista 4
		newBackButton.onclick = () => {
			closeProjectViewer();
		};
	}

	// Eliminar solo el viewer antiguo si existe
	const oldViewer = categoriesContainer.querySelector('.project-viewer');
	if (oldViewer) {
		oldViewer.remove();
	}

	// Eliminar el grid de categorías si existe
	const oldGrid = categoriesContainer.querySelector('.category-detail-grid');
	if (oldGrid) {
		oldGrid.remove();
	}

	// Si necesitamos crear el header, limpiamos todo y lo añadimos
	if (needsHeaderCreation) {
		categoriesContainer.innerHTML = '';
		categoriesContainer.appendChild(detailHeader);
	}

	// CREAR LA VISTA 4
	const projectViewer = document.createElement('div');
	projectViewer.className = 'project-viewer active';
	projectViewer.id = 'projectViewer';

	const projectContainer = document.createElement('div');
	projectContainer.className = 'project-viewer-container';

	// SIDEBAR IZQUIERDA
	const sidebarLeft = document.createElement('div');
	sidebarLeft.className = 'project-sidebar-left';

	const descSection = document.createElement('div');
	descSection.className = 'project-description';
	descSection.innerHTML = `
		<div class="project-description-title">Descripción</div>
		<div class="project-description-text">${projectData.description || 'Sin descripción disponible'}</div>
	`;

	const linksSection = document.createElement('div');
	linksSection.className = 'project-links';
	linksSection.innerHTML = '<div class="project-links-title">Enlaces</div>';

	const linksContainer = document.createElement('div');
	if (projectData.links && projectData.links.length > 0) {
		projectData.links.forEach(link => {
			const linkEl = document.createElement('a');
			linkEl.className = 'project-link';
			linkEl.href = link.url;
			linkEl.target = '_blank';
			linkEl.rel = 'noopener noreferrer';

			linkEl.innerHTML = `
				<img class="project-link-icon" src="images/icons/${link.icon}" alt="${link.text}">
				<span class="project-link-text">${link.text}</span>
			`;

			linksContainer.appendChild(linkEl);
		});
	} else {
		linksContainer.innerHTML = '<p style="color: #666; font-size: 0.85rem;">No hay enlaces disponibles</p>';
	}

	linksSection.appendChild(linksContainer);
	sidebarLeft.appendChild(descSection);
	sidebarLeft.appendChild(linksSection);

	// VIEWER CENTRAL
	const mainViewer = document.createElement('div');
	mainViewer.className = 'project-main-viewer';

	const header = document.createElement('div');
	header.className = 'project-viewer-header';
	header.innerHTML = `
		<div class="project-viewer-title-container">
			<div class="project-viewer-title">${projectData.title || 'Sin título'}</div>
			<div class="project-viewer-subtitle">${projectData.subtitle || ''}</div>
		</div>
		<div class="project-viewer-nav">
			<button class="project-nav-btn" id="projectPrevBtn" title="Proyecto anterior">‹</button>
			<button class="project-nav-btn" id="projectNextBtn" title="Proyecto siguiente">›</button>
		</div>
	`;

	const imagesScroll = document.createElement('div');
	imagesScroll.className = 'project-images-scroll';
	imagesScroll.id = 'projectImagesScroll';

	mainViewer.appendChild(header);
	mainViewer.appendChild(imagesScroll);

	// SIDEBAR DERECHA
	const sidebarRight = document.createElement('div');
	sidebarRight.className = 'project-sidebar-right';

	const thumbnailsContainer = document.createElement('div');
	thumbnailsContainer.className = 'project-thumbnails';
	thumbnailsContainer.id = 'projectThumbnails';

	sidebarRight.appendChild(thumbnailsContainer);

	// ENSAMBLAR TODO
	projectContainer.appendChild(sidebarLeft);
	projectContainer.appendChild(mainViewer);
	projectContainer.appendChild(sidebarRight);
	projectViewer.appendChild(projectContainer);
	categoriesContainer.appendChild(projectViewer);

	// CARGAR IMÁGENES
	const allImages = projectData.images || [];

	if (allImages.length === 0) {
		imagesScroll.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">No hay imágenes disponibles</div>';
	} else {
		allImages.forEach((imageSrc, index) => {
			const imageItem = document.createElement('div');
			imageItem.className = 'project-image-item';
			imageItem.dataset.imageIndex = index;

			const img = document.createElement('img');
			img.src = imageSrc.replace(/ /g, '%20');
			img.alt = `${projectData.title} - Imagen ${index + 1}`;

			imageItem.appendChild(img);
			imagesScroll.appendChild(imageItem);

			const thumbnail = document.createElement('div');
			thumbnail.className = 'project-thumbnail';
			thumbnail.dataset.imageIndex = index;
			if (index === 0) thumbnail.classList.add('active');

			const thumbImg = document.createElement('img');
			thumbImg.src = imageSrc.replace(/ /g, '%20');
			thumbImg.alt = `Miniatura ${index + 1}`;

			thumbnail.appendChild(thumbImg);

			// Capturar la referencia al scroll container aquí
			const currentScrollContainer = imagesScroll;
			thumbnail.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				scrollToImage(index, currentScrollContainer);
			};

			thumbnailsContainer.appendChild(thumbnail);
		});

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
					const index = parseInt(entry.target.dataset.imageIndex);
					updateActiveThumbnail(index);
				}
			});
		}, {
			root: imagesScroll,
			threshold: 0.5
		});

		imagesScroll.querySelectorAll('.project-image-item').forEach(item => {
			observer.observe(item);
		});
	}

	updateProjectNavButtons();

	// EVENT LISTENERS
	const prevBtn = document.getElementById('projectPrevBtn');
	const nextBtn = document.getElementById('projectNextBtn');

	if (prevBtn) prevBtn.onclick = () => navigateProject(-1);
	if (nextBtn) nextBtn.onclick = () => navigateProject(1);
}

function scrollToImage(index, scrollContainer) {
	if (!scrollContainer) {
		scrollContainer = document.getElementById('projectImagesScroll');
	}
	if (!scrollContainer) return;

	const imageItem = scrollContainer.querySelector(`[data-image-index="${index}"]`);
	if (imageItem) {
		// Obtener la posición del elemento relativa al contenedor de scroll
		const containerRect = scrollContainer.getBoundingClientRect();
		const itemRect = imageItem.getBoundingClientRect();

		// Calcular cuánto necesitamos hacer scroll para centrar el elemento
		const currentScroll = scrollContainer.scrollTop;
		const itemRelativeTop = itemRect.top - containerRect.top;
		const scrollTarget = currentScroll + itemRelativeTop - (containerRect.height / 2) + (itemRect.height / 2);

		scrollContainer.scrollTo({
			top: scrollTarget,
			behavior: 'smooth'
		});
	}
}

function updateActiveThumbnail(index) {
	const thumbnails = document.querySelectorAll('.project-thumbnail');
	thumbnails.forEach((thumb, i) => {
		if (i === index) {
			thumb.classList.add('active');
		} else {
			thumb.classList.remove('active');
		}
	});
}

function closeProjectViewer() {
	currentProjectIndex = null;
	const tempCategory = currentProjectCategory;
	currentProjectCategory = null;
	renderCategoryDetail(tempCategory);
}

function navigateProject(direction) {
	const sectionData = portfolioData[currentCategory];
	if (!sectionData || !sectionData.categories[currentProjectCategory]) return;

	const categoryData = sectionData.categories[currentProjectCategory];
	const newIndex = currentProjectIndex + direction;

	if (newIndex >= 0 && newIndex < categoryData.images.length) {
		// Guardar el header antes de cambiar
		const categoriesContainer = document.getElementById('categoriesContainer');
		const existingHeader = categoriesContainer.querySelector('.category-detail-header');

		openProjectViewer(currentProjectCategory, newIndex);
	}
}

function updateProjectNavButtons() {
	const sectionData = portfolioData[currentCategory];
	if (!sectionData || !sectionData.categories[currentProjectCategory]) return;

	const categoryData = sectionData.categories[currentProjectCategory];
	const prevBtn = document.getElementById('projectPrevBtn');
	const nextBtn = document.getElementById('projectNextBtn');

	if (prevBtn && nextBtn) {
		prevBtn.disabled = currentProjectIndex === 0;
		nextBtn.disabled = currentProjectIndex === categoryData.images.length - 1;
	}
}

document.addEventListener('keydown', (e) => {
	if (currentProjectIndex !== null && currentProjectCategory !== null) {
		if (e.key === 'Escape') {
			closeProjectViewer();
		} else if (e.key === 'ArrowLeft') {
			navigateProject(-1);
		} else if (e.key === 'ArrowRight') {
			navigateProject(1);
		}
	}
});
