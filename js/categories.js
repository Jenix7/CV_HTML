// Función para calcular la configuración óptima del grid TODO
function calculateOptimalTodoGrid(numProjects) {
	// Obtener dimensiones del contenedor
	const container = document.getElementById('categoriesContainer');
	const containerWidth = window.innerWidth - 60; // Restamos padding
	const containerHeight = window.innerHeight - 140; // Restamos header y padding

	const gap = 12;
	const aspectRatio = 16 / 9; // Proporción de las tarjetas

	let bestConfig = { cols: 1, rows: 1, cardSize: 0 };

	// Probar diferentes configuraciones
	for (let cols = 1; cols <= numProjects; cols++) {
		const rows = Math.ceil(numProjects / cols);

		// Calcular el tamaño de tarjeta que resultaría con esta configuración
		const availableWidth = containerWidth - (gap * (cols - 1));
		const availableHeight = containerHeight - (gap * (rows - 1));

		const cardWidthByColumns = availableWidth / cols;
		const cardHeightByWidth = cardWidthByColumns / aspectRatio;

		const cardHeightByRows = availableHeight / rows;
		const cardWidthByHeight = cardHeightByRows * aspectRatio;

		// La tarjeta debe caber tanto horizontal como verticalmente
		let cardWidth, cardHeight;

		if (cardHeightByWidth <= cardHeightByRows) {
			// Limitado por el ancho
			cardWidth = cardWidthByColumns;
			cardHeight = cardHeightByWidth;
		} else {
			// Limitado por el alto
			cardWidth = cardWidthByHeight;
			cardHeight = cardHeightByRows;
		}

		const cardSize = cardWidth * cardHeight; // Área de la tarjeta

		// Queremos maximizar el tamaño de las tarjetas
		if (cardSize > bestConfig.cardSize) {
			bestConfig = { cols, rows, cardSize };
		}
	}

	return bestConfig;
}
function renderCategories(sectionKey) {
	const categoriesContainer = document.getElementById('categoriesContainer');
	const sectionData = portfolioData[sectionKey];

	if (!sectionData) {
		categoriesContainer.style.display = 'none';
		return;
	}

	// Manejo especial para la sección TODO
	if (sectionKey === 'todo') {
		if (!sectionData.projects || sectionData.projects.length === 0) {
			categoriesContainer.style.display = 'none';
			return;
		}

		categoriesContainer.innerHTML = '';
		categoriesContainer.classList.remove('expanded');
		categoriesContainer.classList.add('todo-grid-mode');

		const todoGrid = document.createElement('div');
		todoGrid.className = 'todo-projects-grid';

		const numProjects = sectionData.projects.length;
		todoGrid.setAttribute('data-num-projects', numProjects);

		// Calcular la configuración óptima del grid
		const optimalConfig = calculateOptimalTodoGrid(numProjects);

		// Aplicar SOLO las columnas - las filas serán automáticas
		todoGrid.style.gridTemplateColumns = `repeat(${optimalConfig.cols}, 1fr)`;
		todoGrid.style.gridAutoRows = 'auto';

		sectionData.projects.forEach((projectData, index) => {
			const projectCard = document.createElement('div');
			projectCard.className = 'todo-project-card';
			projectCard.dataset.projectIndex = index;

			const imageWrapper = document.createElement('div');
			imageWrapper.className = 'todo-project-image-wrapper';

			const img = document.createElement('img');
			const srcEncoded = projectData.src.replace(/ /g, '%20');
			img.src = srcEncoded;
			img.alt = projectData.title;

			img.addEventListener('load', function() {
				this.classList.add('loaded');
			});

			imageWrapper.appendChild(img);
			projectCard.appendChild(imageWrapper);

			projectCard.onclick = () => {
				// Abrir directamente el visor de proyecto
				openTodoProject(projectData);
			};

			todoGrid.appendChild(projectCard);

			setTimeout(() => {
				projectCard.classList.add('show');
			}, index * 30);
		});

		categoriesContainer.appendChild(todoGrid);
		categoriesContainer.style.display = 'flex';
		return;
	}

	// Código original para otras secciones
	if (sectionData.categories.length === 0) {
		categoriesContainer.style.display = 'none';
		return;
	}

	categoriesContainer.innerHTML = '';
	categoriesContainer.classList.remove('todo-grid-mode');

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

			img.addEventListener('load', function() {
				this.classList.add('loaded');
			});

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
	previousProject = null;
	if (typeof updateBackToPreviousButton === 'function') {
		updateBackToPreviousButton();
	}
	const categoriesContainer = document.getElementById('categoriesContainer');

	if (categoryDetailView && currentCategoryIndex !== null) {
		currentCategoryIndex = categoryIndex;
		renderCategoryDetail(categoryIndex);
		return;
	}

	categoryDetailView = true;
	currentCategoryIndex = categoryIndex;

	const cardsContainer = document.getElementById('cardsContainer');

	const allCardWrappers = document.querySelectorAll('.card-wrapper');
	allCardWrappers.forEach(wrapper => {
		wrapper.style.transition = 'opacity 0.3s ease';
		wrapper.style.opacity = '0';
		wrapper.style.pointerEvents = 'none';
	});

	const allPlaceholders = document.querySelectorAll('.card-placeholder');
	allPlaceholders.forEach(placeholder => {
		placeholder.style.transition = 'opacity 0.3s ease';
		placeholder.style.opacity = '0';
	});

	categoriesContainer.classList.add('expanded');
	categoriesContainer.style.opacity = '0';

	renderCategoryDetail(categoryIndex);

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			categoriesContainer.style.transition = 'opacity 0.4s ease-out';
			categoriesContainer.style.opacity = '1';
		});
	});
}

function closeCategoryDetail() {
	previousProject = null;
	if (typeof updateBackToPreviousButton === 'function') {
		updateBackToPreviousButton();
	}
	categoryDetailView = false;
	currentCategoryIndex = null;

	const cardsContainer = document.getElementById('cardsContainer');
	const categoriesContainer = document.getElementById('categoriesContainer');

	categoriesContainer.classList.remove('expanded');

	renderCategories(currentCategory);

	const allCardWrappers = document.querySelectorAll('.card-wrapper');
	allCardWrappers.forEach(wrapper => {
		wrapper.style.transition = 'opacity 0.3s ease';
		wrapper.style.opacity = '1';
		wrapper.style.pointerEvents = 'auto';

		if (wrapper.classList.contains('featured')) {
			wrapper.style.transform = 'scale(2.5)';
		} else if (wrapper.classList.contains('in-menu')) {
			wrapper.style.transform = 'scale(1.2) rotateZ(90deg)';
		}
	});

	const allPlaceholders = document.querySelectorAll('.card-placeholder');
	allPlaceholders.forEach(placeholder => {
		const wrapper = document.querySelector(`.card-wrapper[data-category="${placeholder.dataset.category}"]`);
		if (wrapper && wrapper.classList.contains('featured')) {
			placeholder.style.transition = 'opacity 0.3s ease';
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

		const title = document.createElement('div');
		title.className = 'category-detail-image-title';
		title.textContent = imageData.title || 'Sin título';

		const imageWrapper = document.createElement('div');
		imageWrapper.className = 'category-detail-image-wrapper';

		const img = document.createElement('img');
		if (typeof imageData === 'object' && imageData.src) {
			img.src = imageData.src.replace(/ /g, '%20');
		} else {
			img.src = imageData;
		}
		img.alt = imageData.title || categoryData.title;

		img.addEventListener('load', function() {
			this.classList.add('loaded');
		});

		imageWrapper.appendChild(img);

		const subtitle = document.createElement('div');
		subtitle.className = 'category-detail-image-subtitle';
		subtitle.textContent = imageData.subtitle || '';

		imageContainer.appendChild(title);
		imageContainer.appendChild(imageWrapper);
		if (imageData.subtitle) {
			imageContainer.appendChild(subtitle);
		}

		imageContainer.onclick = () => {
			if (typeof openProjectViewer === 'function') {
				openProjectViewer(categoryIndex, imgIndex);
			} else {
				console.error('openProjectViewer is not defined');
			}
		};

		detailGrid.appendChild(imageContainer);

		if (isFirstRender) {
			setTimeout(() => {
				imageContainer.classList.add('animate-in');
			}, imgIndex * 50);
		} else {
			imageContainer.style.opacity = '1';
			imageContainer.style.transform = 'translateY(0)';
		}
	});

	categoriesContainer.appendChild(detailHeader);
	categoriesContainer.appendChild(detailGrid);
}

function openTodoProject(projectData) {
	// Abrir el proyecto usando la información de sección/categoría/proyecto
	if (typeof openProjectViewer === 'function') {
		// Cambiar a la sección correspondiente primero
		const targetSection = projectData.section;
		const targetCategoryIndex = projectData.category_index;
		const targetProjectIndex = projectData.project_index;

		// Si no estamos ya en esa sección, cambiar
		if (currentCategory !== targetSection) {
			const featuredCard = document.querySelector('.card-wrapper.featured');
			if (featuredCard) {
				featuredCard.classList.remove('featured');
				featuredCard.classList.add('in-menu');
			}

			const targetCard = document.querySelector(`.card-wrapper[data-category="${targetSection}"]`);
			if (targetCard) {
				targetCard.classList.remove('in-menu');
				targetCard.classList.add('featured');

				const cardInner = targetCard.querySelector('.card-inner');
				if (cardInner) {
					cardInner.style.transform = 'rotateY(0deg)';
				}
			}

			currentCategory = targetSection;

			const sectionTitleHeader = document.getElementById('sectionTitleHeader');
			if (portfolioData[targetSection]) {
				sectionTitleHeader.textContent = portfolioData[targetSection].name;
			}

			const color = categoryColors[targetSection];
			document.body.className = `${color}-theme`;
			currentTheme = `${color}-theme`;

			updateCardPositions();
		}

		// Activar vista de categoría expandida
		categoryDetailView = true;
		currentCategoryIndex = targetCategoryIndex;

		const categoriesContainer = document.getElementById('categoriesContainer');
		if (!categoriesContainer.classList.contains('expanded')) {
			categoriesContainer.classList.add('expanded');

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
		}

		// Abrir el visor del proyecto
		openProjectViewer(targetCategoryIndex, targetProjectIndex);
	} else {
		console.error('openProjectViewer is not defined');
	}
}
