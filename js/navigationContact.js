// ============================================
// NAVIGATION ARROWS - Botones laterales de navegación
// ============================================

function initializeNavigationArrows() {
	console.log('🎯 Inicializando botones de navegación en header...');

	const rightArrow = document.getElementById('navArrowRight');
	const leftArrow = document.getElementById('navArrowLeft');

	if (!rightArrow || !leftArrow) {
		console.error('❌ Botones de navegación no encontrados en el DOM');
		return;
	}

	// Event listeners
	rightArrow.addEventListener('click', () => {
		console.log('➡️ Navegando a Portfolio');
		switchSection('portfolio');
		updateNavigationArrows('portfolio');
	});

	leftArrow.addEventListener('click', () => {
		console.log('⬅️ Navegando a Curriculum');
		switchSection('curriculum');
		updateNavigationArrows('curriculum');
	});

	console.log('✅ Botones de navegación inicializados');
}

function updateNavigationArrows(section) {
	const rightArrow = document.getElementById('navArrowRight');
	const leftArrow = document.getElementById('navArrowLeft');

	if (!rightArrow || !leftArrow) return;

	if (section === 'curriculum') {
		rightArrow.style.display = 'flex';
		leftArrow.style.display = 'none';
	} else {
		rightArrow.style.display = 'none';
		leftArrow.style.display = 'flex';
	}
}

// ============================================
// BOTTOM PANEL - Panel de contacto e idioma
// ============================================

function initializeBottomPanel() {
	console.log('📱 Inicializando panel inferior...');

	// Crear estructura del panel
	const panelHTML = `
		<div class="bottom-panel" id="bottomPanel">
			<!-- Contenedor expandible -->
			<div class="panel-container" id="panelContainer">
				<div class="panel-content">
					<!-- Sección de Idioma -->
					<div class="panel-section">
						<div class="panel-section-title">
							🌐 Language
						</div>
						<div class="panel-language-selector">
							<div class="panel-lang-button active" id="panelLangES" data-lang="es">
								<div class="panel-lang-flag">
									<img src="images/icons/espanol.png" alt="ES">
								</div>
								<span class="panel-lang-name">Español</span>
							</div>
							<div class="panel-lang-button" id="panelLangEN" data-lang="en">
								<div class="panel-lang-flag">
									<img src="images/icons/ingles.png" alt="EN">
								</div>
								<span class="panel-lang-name">English</span>
							</div>
						</div>
					</div>

					<div class="panel-divider"></div>

					<!-- Sección de Contacto -->
					<div class="panel-section">
						<div class="panel-section-title">
							💬 Contact
						</div>
						<div class="contact-items">
							<a href="mailto:javimarmar11@gmail.com" class="contact-item" target="_blank">
								<div class="contact-icon">
									<span class="contact-emoji">✉️</span>
								</div>
								<div class="contact-info">
									<span class="contact-label">Email</span>
									<span class="contact-value">javimarmar11@gmail.com</span>
								</div>
							</a>

							<a href="tel:+34660734089" class="contact-item">
								<div class="contact-icon">
									<span class="contact-emoji">📞</span>
								</div>
								<div class="contact-info">
									<span class="contact-label">Phone</span>
									<span class="contact-value">+34 660 734 089</span>
								</div>
							</a>

							<a href="https://www.javiermartin.me" class="contact-item" target="_blank">
								<div class="contact-icon">
									<span class="contact-emoji">🌐</span>
								</div>
								<div class="contact-info">
									<span class="contact-label">Website</span>
									<span class="contact-value">javiermartin.me</span>
								</div>
							</a>

							<a href="https://www.instagram.com/javimarmar" class="contact-item" target="_blank">
								<div class="contact-icon">
									<span class="contact-emoji">📷</span>
								</div>
								<div class="contact-info">
									<span class="contact-label">Instagram</span>
									<span class="contact-value">@javimarmar</span>
								</div>
							</a>

							<a href="https://www.artstation.com/javimarmar" class="contact-item" target="_blank">
								<div class="contact-icon">
									<span class="contact-emoji">🎨</span>
								</div>
								<div class="contact-info">
									<span class="contact-label">ArtStation</span>
									<span class="contact-value">javimarmar</span>
								</div>
							</a>

							<a href="https://www.linkedin.com/in/javier-martin-martinez" class="contact-item" target="_blank">
								<div class="contact-icon">
									<span class="contact-emoji">💼</span>
								</div>
								<div class="contact-info">
									<span class="contact-label">LinkedIn</span>
									<span class="contact-value">Javier Martín Martínez</span>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- Botón flotante principal -->
			<div class="panel-toggle-button" id="panelToggleButton">
				<span class="panel-toggle-icon">⚙️</span>
			</div>
		</div>
	`;

	// Insertar en el DOM
	document.body.insertAdjacentHTML('beforeend', panelHTML);

	// Event listeners
	const toggleButton = document.getElementById('panelToggleButton');
	const panelContainer = document.getElementById('panelContainer');
	const panelLangES = document.getElementById('panelLangES');
	const panelLangEN = document.getElementById('panelLangEN');

	// Toggle panel
	let isPanelOpen = false;
	toggleButton.addEventListener('click', () => {
		isPanelOpen = !isPanelOpen;
		panelContainer.classList.toggle('active', isPanelOpen);

		// Rotar icono
		const icon = toggleButton.querySelector('.panel-toggle-icon');
		icon.style.transform = isPanelOpen ? 'rotate(90deg)' : 'rotate(0deg)';
	});

	// Cerrar panel al hacer click fuera
	document.addEventListener('click', (e) => {
		const bottomPanel = document.getElementById('bottomPanel');
		if (isPanelOpen && !bottomPanel.contains(e.target)) {
			isPanelOpen = false;
			panelContainer.classList.remove('active');
			const icon = toggleButton.querySelector('.panel-toggle-icon');
			icon.style.transform = 'rotate(0deg)';
		}
	});

	// Cambio de idioma
	panelLangES.addEventListener('click', () => {
		if (typeof changeLanguage === 'function') {
			changeLanguage('es');
			updatePanelLanguageButtons('es');
		}
	});

	panelLangEN.addEventListener('click', () => {
		if (typeof changeLanguage === 'function') {
			changeLanguage('en');
			updatePanelLanguageButtons('en');
		}
	});

	// Sincronizar con idioma actual
	if (typeof currentLanguage !== 'undefined') {
		updatePanelLanguageButtons(currentLanguage);
	}

	console.log('✅ Panel inferior inicializado');
}

function updatePanelLanguageButtons(lang) {
	const panelLangES = document.getElementById('panelLangES');
	const panelLangEN = document.getElementById('panelLangEN');

	if (!panelLangES || !panelLangEN) return;

	if (lang === 'es') {
		panelLangES.classList.add('active');
		panelLangEN.classList.remove('active');
	} else {
		panelLangES.classList.remove('active');
		panelLangEN.classList.add('active');
	}
}

// ============================================
// INTEGRACIÓN CON SISTEMA DE IDIOMAS
// ============================================

// Actualizar textos del panel según idioma
function updatePanelTexts() {
	if (typeof t !== 'function') return;

	// Actualizar títulos de sección
	const sectionTitles = document.querySelectorAll('.panel-section-title');
	if (sectionTitles[0]) {
		sectionTitles[0].innerHTML = `🌐 ${t('panel.language') || 'Language'}`;
	}
	if (sectionTitles[1]) {
		sectionTitles[1].innerHTML = `💬 ${t('panel.contact') || 'Contact'}`;
	}

	// Actualizar etiquetas de contacto
	const labels = {
		'Email': t('panel.email') || 'Email',
		'Phone': t('panel.phone') || 'Phone',
		'Website': t('panel.website') || 'Website',
		'Instagram': 'Instagram',
		'ArtStation': 'ArtStation',
		'LinkedIn': 'LinkedIn'
	};

	document.querySelectorAll('.contact-label').forEach((label, index) => {
		const originalText = label.textContent;
		if (labels[originalText]) {
			label.textContent = labels[originalText];
		}
	});
}

// Escuchar cambios de idioma
window.addEventListener('languageChanged', (e) => {
	if (e.detail && e.detail.language) {
		updatePanelLanguageButtons(e.detail.language);
		updatePanelTexts();
	}
});

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
	// Esperar a que el sistema de idiomas esté listo
	setTimeout(() => {
		initializeNavigationArrows();
		initializeBottomPanel();

		// Actualizar estado inicial de flechas
		updateNavigationArrows(currentSection || 'curriculum');
	}, 100);
});

// También escuchar cuando cambia de sección
window.addEventListener('sectionChanged', (e) => {
	if (e.detail && e.detail.section) {
		updateNavigationArrows(e.detail.section);
	}
});
