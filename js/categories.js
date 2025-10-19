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
