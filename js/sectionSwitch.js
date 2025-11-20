function switchSection(section) {
	previousProject = null;
	if (typeof updateBackToPreviousButton === 'function') {
		updateBackToPreviousButton();
	}
	const curriculumSection = document.getElementById('curriculumSection');
	const portfolioSection = document.getElementById('portfolioSection');
	const sectionTitleHeader = document.getElementById('sectionTitleHeader');
	const navCV = document.getElementById('navCV');
	const navPortfolio = document.getElementById('navPortfolio');

	if (section === 'portfolio') {
		curriculumSection.classList.add('slide-left');
		portfolioSection.classList.add('slide-left');

		// Usar traducción según idioma actual
		if (typeof t === 'function') {
			sectionTitleHeader.textContent = t('header.portfolio');
		} else {
			sectionTitleHeader.textContent = 'Portfolio';
		}

		navCV.classList.remove('active');
		navPortfolio.classList.add('active');
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

		// IMPORTANTE: Actualizar títulos de tarjetas cuando entras a portfolio
		// para que reflejen el idioma actual
		if (typeof updateCardTitles === 'function') {
			updateCardTitles();
		}

	} else {
		curriculumSection.classList.remove('slide-left');
		portfolioSection.classList.remove('slide-left');

		// Usar traducción según idioma actual
		if (typeof t === 'function') {
			sectionTitleHeader.textContent = t('header.curriculum');
		} else {
			sectionTitleHeader.textContent = 'Currículum';
		}

		navCV.classList.add('active');
		navPortfolio.classList.remove('active');
		currentSection = 'curriculum';

		document.body.className = '';
	}
}

// Función para manejar el botón de contacto (por ahora no hace nada)
function handleContact() {
	console.log('🟢 Botón de contacto pulsado - Funcionalidad pendiente');
	// Aquí se implementará la funcionalidad de contacto en el futuro
}
