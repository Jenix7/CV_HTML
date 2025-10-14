function openProjectViewer(categoryIndex, projectIndex) {
	const categoriesContainer = document.getElementById('categoriesContainer');
	const sectionData = portfolioData[currentCategory];
	if (!sectionData || !sectionData.categories[categoryIndex]) return;

	const categoryData = sectionData.categories[categoryIndex];
	const projectData = categoryData.images[projectIndex];

	currentProjectCategory = categoryIndex;
	currentProjectIndex = projectIndex;

	let detailHeader = categoriesContainer.querySelector('.category-detail-header');
	let needsHeaderCreation = !detailHeader;

	if (needsHeaderCreation) {
		detailHeader = document.createElement('div');
		detailHeader.className = 'category-detail-header';

		const backButton = document.createElement('button');
		backButton.className = 'back-button';
		backButton.id = 'categoryBackButton';
		backButton.style.display = 'flex';
		backButton.innerHTML = '← Atrás';

		backButton.onclick = () => {
			if (currentProjectIndex !== null && currentProjectCategory !== null) {
				closeProjectViewer();
			} else {
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
		const categoryNavBtns = detailHeader.querySelectorAll('.category-nav-btn');
		categoryNavBtns.forEach((btn, idx) => {
			if (idx === categoryIndex) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
		});
	}

	const backButton = detailHeader.querySelector('.back-button');
	if (backButton) {
		const newBackButton = backButton.cloneNode(true);
		backButton.parentNode.replaceChild(newBackButton, backButton);

		newBackButton.onclick = () => {
			closeProjectViewer();
		};
	}

	const oldViewer = categoriesContainer.querySelector('.project-viewer');
	if (oldViewer) {
		oldViewer.remove();
	}

	const oldGrid = categoriesContainer.querySelector('.category-detail-grid');
	if (oldGrid) {
		oldGrid.remove();
	}

	if (needsHeaderCreation) {
		categoriesContainer.innerHTML = '';
		categoriesContainer.appendChild(detailHeader);
	}

	const projectViewer = document.createElement('div');
	projectViewer.className = 'project-viewer active';
	projectViewer.id = 'projectViewer';

	const projectContainer = document.createElement('div');
	projectContainer.className = 'project-viewer-container';

	const sidebarLeft = document.createElement('div');
	sidebarLeft.className = 'project-sidebar-left';

	const titleSection = document.createElement('div');
	titleSection.className = 'project-title-section';
	titleSection.innerHTML = `
		<div class="project-viewer-title">${projectData.title || 'Sin título'}</div>
		<div class="project-viewer-subtitle">${projectData.subtitle || ''}</div>
	`;

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
	sidebarLeft.appendChild(titleSection);
	sidebarLeft.appendChild(descSection);
	sidebarLeft.appendChild(linksSection);

	const mainViewer = document.createElement('div');
	mainViewer.className = 'project-main-viewer';

	const imagesScroll = document.createElement('div');
	imagesScroll.className = 'project-images-scroll';
	imagesScroll.id = 'projectImagesScroll';

	const prevButton = document.createElement('button');
	prevButton.className = 'project-nav-btn project-nav-prev';
	prevButton.id = 'projectPrevBtn';
	prevButton.title = 'Proyecto anterior';
	prevButton.innerHTML = '‹';

	const nextButton = document.createElement('button');
	nextButton.className = 'project-nav-btn project-nav-next';
	nextButton.id = 'projectNextBtn';
	nextButton.title = 'Proyecto siguiente';
	nextButton.innerHTML = '›';

	mainViewer.appendChild(prevButton);
	mainViewer.appendChild(imagesScroll);
	mainViewer.appendChild(nextButton);

	const sidebarRight = document.createElement('div');
	sidebarRight.className = 'project-sidebar-right';

	const thumbnailsContainer = document.createElement('div');
	thumbnailsContainer.className = 'project-thumbnails';
	thumbnailsContainer.id = 'projectThumbnails';

	sidebarRight.appendChild(thumbnailsContainer);

	projectContainer.appendChild(sidebarLeft);
	projectContainer.appendChild(mainViewer);
	projectContainer.appendChild(sidebarRight);
	projectViewer.appendChild(projectContainer);
	categoriesContainer.appendChild(projectViewer);

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

	const prevBtn = document.getElementById('projectPrevBtn');
	const nextBtn = document.getElementById('projectNextBtn');

	if (prevBtn) prevBtn.onclick = () => navigateProject(-1);
	if (nextBtn) nextBtn.onclick = () => navigateProject(1);

	setTimeout(() => {
		scrollToImage(0, imagesScroll);
	}, 100);
}

function scrollToImage(index, scrollContainer) {
	if (!scrollContainer) {
		scrollContainer = document.getElementById('projectImagesScroll');
	}
	if (!scrollContainer) return;

	const imageItem = scrollContainer.querySelector(`[data-image-index="${index}"]`);
	if (imageItem) {
		const containerRect = scrollContainer.getBoundingClientRect();
		const itemRect = imageItem.getBoundingClientRect();

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
