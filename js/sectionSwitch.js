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

		// Verificar si hay una tarjeta seleccionada (featured)
		const featuredCard = document.querySelector('.card-wrapper.featured');

		// Solo restaurar categoría si hay una tarjeta seleccionada
		if (featuredCard && currentCategory && portfolioData[currentCategory]) {
			const portfolioText = typeof t === 'function' ? t('header.portfolio') : 'Portfolio';
			sectionTitleHeader.textContent = portfolioText + ' - ' + portfolioData[currentCategory].name;
		} else {
			// Sin tarjeta seleccionada, mostrar solo "Portfolio"
			if (typeof t === 'function') {
				sectionTitleHeader.textContent = t('header.portfolio');
			} else {
				sectionTitleHeader.textContent = 'Portfolio';
			}
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

// Función para manejar el botón de contacto
function handleContact() {
	console.log('📞 Abriendo modal de contacto');
	if (typeof openContactModal === 'function') {
		openContactModal();
	} else {
		console.error('❌ openContactModal no está definida');
	}
}
