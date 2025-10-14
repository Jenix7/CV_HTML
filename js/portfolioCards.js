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
