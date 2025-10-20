function openProjectViewer(categoryIndex, projectIndex) {
	const categoriesContainer = document.getElementById('categoriesContainer');
	const sectionData = portfolioData[currentCategory];
	if (!sectionData || !sectionData.categories[categoryIndex]) return;

	const categoryData = sectionData.categories[categoryIndex];
	const projectData = categoryData.images[projectIndex];

	currentProjectCategory = categoryIndex;
	currentProjectIndex = projectIndex;

	const oldViewer = categoriesContainer.querySelector('.project-viewer');
	if (oldViewer) {
		oldViewer.remove();
	}

	const oldGrid = categoriesContainer.querySelector('.category-detail-grid');
	if (oldGrid) {
		oldGrid.remove();
	}

	let detailHeader = categoriesContainer.querySelector('.category-detail-header');
	if (!detailHeader) {
		detailHeader = document.createElement('div');
		detailHeader.className = 'category-detail-header';
	}

	detailHeader.className = 'category-detail-header project-mode';
	detailHeader.innerHTML = '';

	const compactRow = document.createElement('div');
	compactRow.className = 'category-compact-row';

	const categoryNav = document.createElement('div');
	categoryNav.className = 'category-navigation';

	sectionData.categories.forEach((cat, idx) => {
		const navBtn = document.createElement('button');
		navBtn.className = 'category-nav-btn';
		if (idx === categoryIndex) {
			navBtn.classList.add('active');
		}
		navBtn.textContent = cat.title;
		navBtn.onclick = () => {
			if (idx !== categoryIndex) {
				openProjectViewer(idx, 0);
			}
		};
		categoryNav.appendChild(navBtn);
	});

	const thumbnailsNav = document.createElement('div');
	thumbnailsNav.className = 'project-images-thumbnails-nav';
	thumbnailsNav.id = 'projectImagesThumbnailsNav';

	categoryData.images.forEach((project, projIdx) => {
		const thumbNavItem = document.createElement('div');
		thumbNavItem.className = 'project-thumbnail-nav-item';
		if (projIdx === projectIndex) thumbNavItem.classList.add('active');
		thumbNavItem.dataset.projectIndex = projIdx;

		const thumbImg = document.createElement('img');
		const projectSrc = typeof project === 'object' ? project.src : project;
		const cleanSrc = projectSrc.replace(/ /g, '%20');

		if (isCached(cleanSrc)) {
			const cachedImg = getCachedImage(cleanSrc);
			thumbImg.src = cachedImg.src;
		} else {
			thumbImg.src = cleanSrc;
		}

		thumbImg.alt = project.title || `Proyecto ${projIdx + 1}`;
		thumbImg.title = project.title || `Proyecto ${projIdx + 1}`;

		thumbImg.addEventListener('load', function() {
			this.classList.add('loaded');
		});

		thumbNavItem.appendChild(thumbImg);

		thumbNavItem.onclick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (projIdx !== projectIndex) {
				openProjectViewer(categoryIndex, projIdx);
			}
		};

		thumbnailsNav.appendChild(thumbNavItem);
	});

	compactRow.appendChild(categoryNav);
	compactRow.appendChild(thumbnailsNav);

	detailHeader.appendChild(compactRow);

	const projectViewer = document.createElement('div');
	projectViewer.className = 'project-viewer active';
	projectViewer.id = 'projectViewer';

	const projectContainer = document.createElement('div');
	projectContainer.className = 'project-viewer-container';

	const sidebarLeft = document.createElement('div');
	sidebarLeft.className = 'project-sidebar-left';

	const backButtonInSidebar = document.createElement('button');
	backButtonInSidebar.className = 'back-button';
	backButtonInSidebar.style.display = 'flex';
	backButtonInSidebar.style.marginBottom = '20px';
	backButtonInSidebar.innerHTML = '← Atrás';
	backButtonInSidebar.onclick = () => {
		closeProjectViewer();
	};

	sidebarLeft.appendChild(backButtonInSidebar);

	const titleSection = document.createElement('div');
	titleSection.className = 'project-title-section';
	titleSection.innerHTML = `
		<div class="project-viewer-title">${projectData.title || 'Sin título'}</div>
		<div class="project-viewer-subtitle">${projectData.subtitle || ''}</div>
	`;

	const descSection = document.createElement('div');
descSection.className = 'project-description';

const descTitle = document.createElement('div');
descTitle.className = 'project-description-title';
descTitle.textContent = 'Descripción';

const descText = document.createElement('div');
descText.className = 'project-description-text';
const description = projectData.description || 'Sin descripción disponible';
// Reemplazar saltos de línea por <br> para mostrarlos en HTML
descText.innerHTML = description.replace(/\n/g, '<br><br>');

descSection.appendChild(descTitle);
descSection.appendChild(descText);

// Si la descripción tiene más de 400 caracteres, añadir botón "Ver más"
if (description.length > 400) {
	descText.classList.add('collapsed');

	const toggleBtn = document.createElement('button');
	toggleBtn.className = 'project-description-toggle';
	toggleBtn.innerHTML = `
		<span class="project-description-toggle-text">Ver más</span>
		<span class="project-description-toggle-icon">▼</span>
	`;

	toggleBtn.onclick = () => {
		const isCollapsed = descText.classList.contains('collapsed');

		if (isCollapsed) {
			descText.classList.remove('collapsed');
			toggleBtn.classList.add('expanded');
			toggleBtn.querySelector('.project-description-toggle-text').textContent = 'Ver menos';
		} else {
			descText.classList.add('collapsed');
			toggleBtn.classList.remove('expanded');
			toggleBtn.querySelector('.project-description-toggle-text').textContent = 'Ver más';
		}
	};

	descSection.appendChild(toggleBtn);
}

	const separator1 = document.createElement('div');
	separator1.className = 'project-section-separator';

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

	const separator2 = document.createElement('div');
	separator2.className = 'project-section-separator';

	const programsSection = document.createElement('div');
	programsSection.className = 'project-programs';
	programsSection.innerHTML = '<div class="project-programs-title">Programas</div>';

	const programsContainer = document.createElement('div');
	programsContainer.className = 'project-programs-icons';

	if (projectData.programs && projectData.programs.length > 0) {
		projectData.programs.forEach(program => {
			const progIcon = document.createElement('img');
			progIcon.className = 'project-program-icon';
			progIcon.src = `images/icons/${program}`;
			progIcon.alt = program.replace('.png', '');
			progIcon.title = program.replace('.png', '');
			programsContainer.appendChild(progIcon);
		});
	} else {
		programsContainer.innerHTML = '<p style="color: #666; font-size: 0.85rem;">No hay programas especificados</p>';
	}

	programsSection.appendChild(programsContainer);

	// Orden: Título → Descripción → Separador → Enlaces → Separador → Programas
	sidebarLeft.appendChild(titleSection);
	sidebarLeft.appendChild(descSection);
	sidebarLeft.appendChild(separator1);
	sidebarLeft.appendChild(linksSection);
	sidebarLeft.appendChild(separator2);
	sidebarLeft.appendChild(programsSection);

	const sidebarRight = document.createElement('div');
	sidebarRight.className = 'project-sidebar-right';

	const thumbnailsContainer = document.createElement('div');
	thumbnailsContainer.className = 'project-thumbnails';
	thumbnailsContainer.id = 'projectThumbnails';

	sidebarRight.appendChild(thumbnailsContainer);

	const centerArea = document.createElement('div');
	centerArea.className = 'project-center-area';

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

	centerArea.appendChild(detailHeader);
	centerArea.appendChild(mainViewer);

	projectContainer.appendChild(sidebarLeft);
	projectContainer.appendChild(centerArea);
	projectContainer.appendChild(sidebarRight);
	projectViewer.appendChild(projectContainer);

	categoriesContainer.innerHTML = '';
	categoriesContainer.appendChild(projectViewer);

	const allImages = projectData.images || [];

	if (allImages.length === 0) {
		imagesScroll.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">No hay imágenes disponibles</div>';
	} else {
		allImages.forEach((mediaData, index) => {
			const imageItem = document.createElement('div');
			imageItem.className = 'project-image-item';
			imageItem.dataset.imageIndex = index;

			const mediaType = typeof mediaData === 'object' ? mediaData.type : 'image';
			const mediaSrc = typeof mediaData === 'object' ? mediaData.src : mediaData;

			if (mediaType === 'video') {
				const video = document.createElement('video');
				video.className = 'project-video';
				video.controls = true;
				video.preload = 'metadata';
				video.loop = true;
				video.muted = true;

				const cleanSrc = mediaSrc.replace(/ /g, '%20');
				video.src = cleanSrc;
				video.alt = `${projectData.title} - Video ${index + 1}`;

				video.addEventListener('loadedmetadata', function() {
					this.classList.add('loaded');
				});

				imageItem.appendChild(video);
				imageItem.dataset.videoElement = 'true';

			} else if (mediaType === 'youtube') {
				const iframeWrapper = document.createElement('div');
				iframeWrapper.className = 'project-youtube-wrapper';

				const iframe = document.createElement('iframe');
				iframe.className = 'project-youtube';

				let videoId = '';
				try {
					const url = new URL(mediaSrc);
					if (url.hostname.includes('youtube.com')) {
						videoId = url.searchParams.get('v');
					} else if (url.hostname.includes('youtu.be')) {
						videoId = url.pathname.slice(1);
					}
				} catch (e) {
					console.error('Error parsing YouTube URL:', e);
				}

				if (videoId) {
					iframe.src = `https://www.youtube.com/embed/${videoId}`;
					iframe.frameBorder = '0';
					iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
					iframe.allowFullscreen = true;
					iframe.title = `${projectData.title} - Video ${index + 1}`;

					iframe.addEventListener('load', function() {
						this.classList.add('loaded');
					});
				}

				iframeWrapper.appendChild(iframe);
				imageItem.appendChild(iframeWrapper);

			} else {
				const img = document.createElement('img');
				const cleanSrc = mediaSrc.replace(/ /g, '%20');

				if (isCached(cleanSrc)) {
					const cachedImg = getCachedImage(cleanSrc);
					img.src = cachedImg.src;
					img.setAttribute('data-cached', 'true');
				} else {
					img.src = cleanSrc;
					img.setAttribute('loading', 'lazy');
				}

				img.alt = `${projectData.title} - Imagen ${index + 1}`;

				img.addEventListener('load', function() {
					this.classList.add('loaded');
				});

				imageItem.appendChild(img);
			}

			imagesScroll.appendChild(imageItem);

			const thumbnail = document.createElement('div');
			thumbnail.className = 'project-thumbnail';
			thumbnail.dataset.imageIndex = index;
			if (index === 0) thumbnail.classList.add('active');

			if (mediaType === 'video') {
				const videoElement = document.createElement('video');
				videoElement.preload = 'metadata';
				videoElement.muted = true;
				const cleanSrc = mediaSrc.replace(/ /g, '%20');
				videoElement.src = cleanSrc;

				videoElement.addEventListener('loadeddata', function() {
					videoElement.currentTime = 0.1;
				});

				videoElement.addEventListener('seeked', function() {
					const canvas = document.createElement('canvas');
					canvas.width = videoElement.videoWidth;
					canvas.height = videoElement.videoHeight;
					const ctx = canvas.getContext('2d');
					ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

					const thumbImg = document.createElement('img');
					thumbImg.src = canvas.toDataURL();
					thumbImg.alt = `Miniatura ${index + 1}`;
					thumbImg.addEventListener('load', function() {
						this.classList.add('loaded');
					});
					thumbnail.appendChild(thumbImg);

					const overlay = document.createElement('div');
					overlay.className = 'video-thumbnail-overlay';
					const icon = document.createElement('div');
					icon.className = 'video-thumbnail-icon';
					icon.innerHTML = '▶';
					overlay.appendChild(icon);
					thumbnail.appendChild(overlay);
				});

				thumbnail.classList.add('video-thumb');

			} else if (mediaType === 'youtube') {
				let videoId = '';
				try {
					const url = new URL(mediaSrc);
					if (url.hostname.includes('youtube.com')) {
						videoId = url.searchParams.get('v');
					} else if (url.hostname.includes('youtu.be')) {
						videoId = url.pathname.slice(1);
					}
				} catch (e) {
					console.error('Error parsing YouTube URL:', e);
				}

				if (videoId) {
					const thumbImg = document.createElement('img');
					thumbImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
					thumbImg.alt = `Miniatura ${index + 1}`;
					thumbImg.addEventListener('load', function() {
						this.classList.add('loaded');
					});
					thumbnail.appendChild(thumbImg);

					const overlay = document.createElement('div');
					overlay.className = 'video-thumbnail-overlay';
					const icon = document.createElement('div');
					icon.className = 'video-thumbnail-icon';
					icon.innerHTML = '▶';
					overlay.appendChild(icon);
					thumbnail.appendChild(overlay);
				}

				thumbnail.classList.add('video-thumb');

			} else {
				const thumbImg = document.createElement('img');
				const cleanSrc = mediaSrc.replace(/ /g, '%20');

				if (isCached(cleanSrc)) {
					const cachedImg = getCachedImage(cleanSrc);
					thumbImg.src = cachedImg.src;
				} else {
					thumbImg.src = cleanSrc;
					thumbImg.setAttribute('loading', 'lazy');
				}

				thumbImg.alt = `Miniatura ${index + 1}`;

				thumbImg.addEventListener('load', function() {
					this.classList.add('loaded');
				});

				thumbnail.appendChild(thumbImg);
			}

			thumbnail.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				scrollToImage(index, imagesScroll);
			};

			thumbnailsContainer.appendChild(thumbnail);
		});

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
					const index = parseInt(entry.target.dataset.imageIndex);
					updateActiveThumbnail(index);

					const video = entry.target.querySelector('video.project-video');
					if (video) {
						video.play().catch(err => console.log('Error al reproducir video:', err));
					}
				} else {
					const video = entry.target.querySelector('video.project-video');
					if (video) {
						video.pause();
					}
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
		const media = imageItem.querySelector('img, video, .project-youtube-wrapper');
		if (!media) return;

		if (media.classList && media.classList.contains('project-youtube-wrapper')) {
			performScroll();
		} else if (media.complete || media.readyState >= 1) {
			performScroll();
		} else {
			media.onload = performScroll;
			media.onloadedmetadata = performScroll;
		}

		function performScroll() {
			const itemOffsetTop = imageItem.offsetTop;
			const mediaHeight = media.offsetHeight || imageItem.offsetHeight;
			const containerHeight = scrollContainer.offsetHeight;

			const marginCompensation = index === 0 ? 150 : 280;

			const scrollTarget = itemOffsetTop - (containerHeight / 2) + (mediaHeight / 2) + marginCompensation;

			scrollContainer.scrollTo({
				top: scrollTarget,
				behavior: 'smooth'
			});
		}
	}
}

function updateActiveThumbnail(index) {
	const thumbnails = document.querySelectorAll('.project-thumbnail');
	const sidebarRight = document.querySelector('.project-sidebar-right');

	thumbnails.forEach((thumb, i) => {
		if (i === index) {
			thumb.classList.add('active');

			if (sidebarRight && thumb) {
				const thumbTop = thumb.offsetTop;
				const thumbHeight = thumb.offsetHeight;
				const sidebarScrollTop = sidebarRight.scrollTop;
				const sidebarHeight = sidebarRight.clientHeight;

				const thumbBottom = thumbTop + thumbHeight;
				const visibleTop = sidebarScrollTop;
				const visibleBottom = sidebarScrollTop + sidebarHeight;

				if (thumbTop < visibleTop) {
					sidebarRight.scrollTo({
						top: thumbTop - 20,
						behavior: 'smooth'
					});
				} else if (thumbBottom > visibleBottom) {
					sidebarRight.scrollTo({
						top: thumbBottom - sidebarHeight + 20,
						behavior: 'smooth'
					});
				}
			}
		} else {
			thumb.classList.remove('active');
		}
	});
}

function updateActiveNavThumbnail(index) {
	const navThumbnails = document.querySelectorAll('.project-thumbnail-nav-item');
	navThumbnails.forEach((thumb, i) => {
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
