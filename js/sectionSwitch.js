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

	// NUEVO: Tracking del historial
	if (typeof HistoryManager !== 'undefined') {
		HistoryManager.trackSectionSwitch(section);
	}
}
