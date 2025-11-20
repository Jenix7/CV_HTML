// ============================================
// SECTION NAVIGATION BUTTONS
// Gestiona la visibilidad de los botones grandes de navegación entre secciones
// ============================================

function updateSectionNavButtons() {
	const navToCV = document.getElementById('navToCV');
	const navToPortfolio = document.getElementById('navToPortfolio');
	const curriculumSection = document.getElementById('curriculumSection');
	const portfolioSection = document.getElementById('portfolioSection');

	if (!navToCV || !navToPortfolio) {
		console.warn('⚠️ Navigation buttons not found');
		return;
	}

	// Mostrar/ocultar según la sección activa
	if (currentSection === 'curriculum') {
		// En Curriculum: mostrar solo el botón derecho (→ Portfolio)
		navToCV.style.display = 'none';
		navToPortfolio.style.display = 'flex';
	} else if (currentSection === 'portfolio') {
		// En Portfolio: mostrar solo el botón izquierdo (← Curriculum)
		navToCV.style.display = 'flex';
		navToPortfolio.style.display = 'none';
	}

	console.log('✅ Section nav buttons updated:', currentSection);
}

// Actualizar botones cuando cambia la sección
function switchSectionWithButtons(section) {
	// Llamar a la función original de cambio de sección
	if (typeof switchSection === 'function') {
		switchSection(section);
	}

	// Actualizar visibilidad de botones después de un pequeño delay
	// para permitir que la animación de transición se complete
	setTimeout(() => {
		updateSectionNavButtons();
	}, 100);
}

// Sobrescribir los onclick de los botones para usar nuestra función
window.addEventListener('DOMContentLoaded', () => {
	const navToCV = document.getElementById('navToCV');
	const navToPortfolio = document.getElementById('navToPortfolio');

	if (navToCV) {
		navToCV.onclick = () => switchSectionWithButtons('curriculum');
	}

	if (navToPortfolio) {
		navToPortfolio.onclick = () => switchSectionWithButtons('portfolio');
	}

	// Actualizar estado inicial
	updateSectionNavButtons();

	console.log('🎯 Section navigation buttons initialized');
});

// También actualizar cuando se cambia de idioma (las etiquetas pueden cambiar)
window.addEventListener('languageChanged', () => {
	const navToCV = document.getElementById('navToCV');
	const navToPortfolio = document.getElementById('navToPortfolio');

	if (navToCV) {
		const label = navToCV.querySelector('.nav-label');
		if (label && typeof t === 'function') {
			label.textContent = t('header.curriculum');
		}
	}

	if (navToPortfolio) {
		const label = navToPortfolio.querySelector('.nav-label');
		if (label && typeof t === 'function') {
			label.textContent = t('header.portfolio');
		}
	}
});
