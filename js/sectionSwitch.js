function switchSection(section) {
	previousProject = null;
	if (typeof updateBackToPreviousButton === 'function') {
		updateBackToPreviousButton();
	}
	const curriculumSection = document.getElementById('curriculumSection');
	const portfolioSection = document.getElementById('portfolioSection');
	const sectionTitleHeader = document.getElementById('sectionTitleHeader');
	const switchCV = document.getElementById('switchCV');
	const switchPortfolio = document.getElementById('switchPortfolio');

	if (section === 'portfolio') {
		curriculumSection.classList.add('slide-left');
		portfolioSection.classList.add('slide-left');

		// Usar traducción según idioma actual
		if (typeof t === 'function') {
			sectionTitleHeader.textContent = t('header.portfolio');
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

		switchCV.classList.add('active');
		switchPortfolio.classList.remove('active');
		currentSection = 'curriculum';

		document.body.className = '';
	}
}
