// ============================================
// LANGUAGE DROPDOWN HANDLER
// ============================================

document.addEventListener('DOMContentLoaded', () => {
	const languageSelector = document.getElementById('languageSelector');
	const languageCurrent = document.getElementById('languageCurrent');
	const languageDropdown = document.getElementById('languageDropdown');
	const languageOptions = document.querySelectorAll('.language-option');
	const currentFlagImg = document.getElementById('currentFlagImg');
	const currentLanguageName = document.getElementById('currentLanguageName');

	console.log('🌐 Language Dropdown Initialized');
	console.log('Selector found:', languageSelector);
	console.log('Current button found:', languageCurrent);
	console.log('Dropdown found:', languageDropdown);
	console.log('Options found:', languageOptions.length);

	if (!languageSelector || !languageCurrent || !languageDropdown) {
		console.error('❌ Language selector elements not found!');
		return;
	}

	// Toggle dropdown al hacer click
	languageCurrent.addEventListener('click', (e) => {
		console.log('🖱️ Click on language selector');
		e.stopPropagation();
		languageSelector.classList.toggle('open');
		console.log('Dropdown open:', languageSelector.classList.contains('open'));
	});

	// Cerrar dropdown al hacer click fuera
	document.addEventListener('click', (e) => {
		if (!languageSelector.contains(e.target)) {
			languageSelector.classList.remove('open');
		}
	});

	// Manejar selección de idioma
	languageOptions.forEach(option => {
		option.addEventListener('click', (e) => {
			e.stopPropagation();

			const lang = option.getAttribute('data-lang');
			console.log('🔄 Changing language to:', lang);

			// No hacer nada si ya está activo
			if (option.classList.contains('active')) {
				languageSelector.classList.remove('open');
				return;
			}

			// Actualizar idioma
			changeLanguage(lang);

			// Actualizar UI del selector
			updateLanguageSelector(lang);

			// Cerrar dropdown
			languageSelector.classList.remove('open');
		});
	});

	// Función para actualizar el selector visual
	function updateLanguageSelector(lang) {
		// Actualizar opciones activas
		languageOptions.forEach(opt => {
			opt.classList.remove('active');
			if (opt.getAttribute('data-lang') === lang) {
				opt.classList.add('active');
			}
		});

		// Actualizar el selector actual
		if (lang === 'es') {
			currentFlagImg.src = 'images/icons/espanol.png';
			currentFlagImg.alt = 'ES';
			currentLanguageName.textContent = 'Español';
		} else {
			currentFlagImg.src = 'images/icons/ingles.png';
			currentFlagImg.alt = 'EN';
			currentLanguageName.textContent = 'English';
		}

		console.log('✅ Selector actualizado a:', lang);
	}

	// Inicializar el selector con el idioma actual
	function initializeLanguageSelector() {
		// Esperar a que currentLanguage esté definido
		if (typeof currentLanguage === 'undefined') {
			console.log('⏳ Esperando a que currentLanguage esté disponible...');
			setTimeout(initializeLanguageSelector, 50);
			return;
		}

		updateLanguageSelector(currentLanguage);
		console.log('✅ Language selector initialized with:', currentLanguage);
	}

	// Ejecutar inicialización
	initializeLanguageSelector();

	// También escuchar cambios en el idioma desde el sistema
	window.addEventListener('languageChanged', (e) => {
		if (e.detail && e.detail.language) {
			updateLanguageSelector(e.detail.language);
		}
	});
});
