// ============================================
// languageManager.js - COMPLETO
// ============================================

let currentLanguage = 'es';
let translationsData = { es: null, en: null };
let portfolioDataCache = { es: null, en: null };

async function preloadAllLanguages() {
	console.log('🌍 Precargando idiomas...');

	try {
		const [transES, transEN, dataES, dataEN] = await Promise.all([
			fetch('lang/es.json').then(r => r.json()),
			fetch('lang/en.json').then(r => r.json()),
			fetch('portfolio-data.json').then(r => r.json()),
			fetch('portfolio-data_en.json').then(r => r.json())
		]);

		translationsData.es = transES;
		translationsData.en = transEN;
		portfolioDataCache.es = dataES;
		portfolioDataCache.en = dataEN;

		console.log('✅ Ambos idiomas precargados');
		return true;
	} catch (error) {
		console.error('❌ Error precargando:', error);
		return false;
	}
}

function t(key) {
	const translations = translationsData[currentLanguage];
	if (!translations) return key;

	const keys = key.split('.');
	let value = translations;

	for (const k of keys) {
		if (value && value[k] !== undefined) {
			value = value[k];
		} else {
			return key;
		}
	}

	return value;
}

function changeLanguage(lang) {
	if (!translationsData[lang] || !portfolioDataCache[lang]) {
		console.error('❌ Idioma no precargado:', lang);
		return;
	}

	console.log(`🌍 Cambiando a ${lang.toUpperCase()}`);

	currentLanguage = lang;
	portfolioData = portfolioDataCache[lang];

	try {
		localStorage.setItem('preferredLanguage', lang);
	} catch (e) {}

	updateInterfaceTextsOnly();
	updateCardTitlesOnly();
	updateCurrentViewTextsOnly();
	updateLanguageButtons();

	if (typeof cvInfoCache !== 'undefined') {
		Object.keys(cvInfoCache).forEach(key => delete cvInfoCache[key]);
	}

	// Emitir evento para que otros componentes se actualicen
	window.dispatchEvent(new CustomEvent('languageChanged', {
		detail: { language: lang }
	}));

	console.log('✅ Idioma cambiado');
}

function updateInterfaceTextsOnly() {
	const navCV = document.getElementById('navCV');
	const navPortfolio = document.getElementById('navPortfolio');
	const navContact = document.getElementById('navContact');

	if (navCV) navCV.textContent = t('header.curriculum');
	if (navPortfolio) navPortfolio.textContent = t('header.portfolio');
	if (navContact) navContact.textContent = t('header.contact');

	const sectionTitleHeader = document.getElementById('sectionTitleHeader');
	if (sectionTitleHeader) {
		if (currentSection === 'curriculum') {
			sectionTitleHeader.textContent = t('header.curriculum');
		} else if (currentSection === 'portfolio') {
			if (currentCategory && portfolioData[currentCategory]) {
				sectionTitleHeader.textContent = portfolioData[currentCategory].name;
			} else {
				sectionTitleHeader.textContent = t('header.portfolio');
			}
		}
	}

	if (typeof elementNames !== 'undefined') {
		elementNames['cv-targeta-javier'].name = t('cv.personal_card');
		elementNames['cv-resumen-personal'].name = t('cv.personal_summary');
		elementNames['cv-experiencia'].name = t('cv.experience');
		elementNames['cv-aptitudes'].name = t('cv.skills');
		elementNames['cv-licenciado'].name = t('cv.degree');
		elementNames['cv-photoshop'].name = t('cv.photoshop');
		elementNames['cv-zbrush'].name = t('cv.zbrush');
		elementNames['cv-opentoonz'].name = t('cv.opentoonz');
		elementNames['cv-premiere'].name = t('cv.premiere');
		elementNames['cv-after-effects'].name = t('cv.after_effects');
		elementNames['cv-unreal'].name = t('cv.unreal');
		elementNames['cv-cascadeur'].name = t('cv.cascadeur');
		elementNames['cv-marmoset'].name = t('cv.marmoset');
		elementNames['cv-substance'].name = t('cv.substance');
		elementNames['cv-3dmax'].name = t('cv.3dmax');
		elementNames['cv-maya'].name = t('cv.maya');
		elementNames['cv-blender'].name = t('cv.blender');
		elementNames['cv-unity'].name = t('cv.unity');
		elementNames['cv-illustrator'].name = t('cv.illustrator');
		elementNames['cv-portfolio-titulo'].name = t('cv.portfolio_title');
		elementNames['cv-diseno-grafico'].name = t('cv.graphic_design');
		elementNames['cv-modelado3d'].name = t('cv.3d_modeling');
		elementNames['cv-ilustracion'].name = t('cv.illustration');
		elementNames['cv-edicion'].name = t('cv.editing');
		elementNames['cv-webs'].name = t('cv.webs');
		elementNames['cv-videojuegos'].name = t('cv.videogames');
	}
}

function updateCardTitlesOnly() {
	const cardWrappers = document.querySelectorAll('.card-wrapper');

	cardWrappers.forEach(wrapper => {
		const category = wrapper.getAttribute('data-category');
		if (category && portfolioData[category]) {
			const titleElement = wrapper.querySelector('.card-title');
			if (titleElement) {
				titleElement.textContent = portfolioData[category].name;
			}
		}
	});
}

function updateCurrentViewTextsOnly() {
	const backText = currentLanguage === 'es' ? 'Atrás' : 'Back';
	document.querySelectorAll('.back-button').forEach(btn => {
		btn.innerHTML = `← ${backText}`;
	});

	const backToPreviousBtn = document.getElementById('backToPreviousFloating');
	if (backToPreviousBtn) {
		const backToPrevText = currentLanguage === 'es' ? 'Volver al proyecto anterior' : 'Back to previous project';
		backToPreviousBtn.innerHTML = `<span class="button-icon">⮌</span>${backToPrevText}`;
	}

	if (currentSection !== 'portfolio') return;
	if (!currentCategory) return;

	const sectionData = portfolioData[currentCategory];
	if (!sectionData) return;

	const categoryColumnTitles = document.querySelectorAll('.category-column-title');
	categoryColumnTitles.forEach((titleEl, idx) => {
		if (sectionData.categories[idx]) {
			titleEl.textContent = sectionData.categories[idx].title;
		}
	});

	const categoryNavBtns = document.querySelectorAll('.category-nav-btn');
	categoryNavBtns.forEach((btn, idx) => {
		if (sectionData.categories[idx]) {
			btn.textContent = sectionData.categories[idx].title;
		}
	});

	if (currentProjectIndex !== null && currentProjectCategory !== null) {
		updateProjectViewerTextsOnly();
	} else if (currentCategoryIndex !== null) {
		updateCategoryDetailTextsOnly();
	}
}

function updateProjectViewerTextsOnly() {
	const sectionData = portfolioData[currentCategory];
	if (!sectionData || !sectionData.categories[currentProjectCategory]) return;

	const categoryData = sectionData.categories[currentProjectCategory];
	const projectData = categoryData.images[currentProjectIndex];

	if (!projectData) return;

	const titleEl = document.querySelector('.project-viewer-title');
	const subtitleEl = document.querySelector('.project-viewer-subtitle');

	if (titleEl) titleEl.textContent = projectData.title || 'Sin título';
	if (subtitleEl) subtitleEl.textContent = projectData.subtitle || '';

	const descText = document.querySelector('.project-description-text');
	if (descText) {
		const description = projectData.description || 'Sin descripción disponible';
		descText.innerHTML = description.replace(/\n/g, '<br>');
	}

	const descTitle = document.querySelector('.project-description-title');
	const descriptionText = currentLanguage === 'es' ? 'Descripción' : 'Description';
	if (descTitle) descTitle.textContent = descriptionText;

	const linksTitle = document.querySelector('.project-links-title');
	const linksText = currentLanguage === 'es' ? 'Enlaces' : 'Links';
	if (linksTitle) linksTitle.textContent = linksText;

	const linkElements = document.querySelectorAll('.project-link-text');
	if (projectData.links) {
		linkElements.forEach((linkEl, idx) => {
			if (projectData.links[idx]) {
				linkEl.textContent = projectData.links[idx].text;
			}
		});
	}

	const relatedTitle = document.querySelector('.project-related-title');
	const relatedText = currentLanguage === 'es' ? 'Proyectos Relacionados' : 'Related Projects';
	if (relatedTitle) relatedTitle.textContent = relatedText;

	const programsTitle = document.querySelector('.project-programs-title');
	const programsText = currentLanguage === 'es' ? 'Programas' : 'Programs';
	if (programsTitle) programsTitle.textContent = programsText;

	const thumbs = document.querySelectorAll('.project-thumbnail-nav-item img');
	thumbs.forEach((thumb, idx) => {
		if (categoryData.images[idx]) {
			thumb.alt = categoryData.images[idx].title || `Proyecto ${idx + 1}`;
			thumb.title = categoryData.images[idx].title || `Proyecto ${idx + 1}`;
		}
	});
}

function updateCategoryDetailTextsOnly() {
	const sectionData = portfolioData[currentCategory];
	if (!sectionData || !sectionData.categories[currentCategoryIndex]) return;

	const categoryData = sectionData.categories[currentCategoryIndex];

	const projectTitles = document.querySelectorAll('.category-detail-image-title');
	const projectSubtitles = document.querySelectorAll('.category-detail-image-subtitle');

	projectTitles.forEach((titleEl, idx) => {
		if (categoryData.images[idx]) {
			titleEl.textContent = categoryData.images[idx].title || 'Sin título';
		}
	});

	projectSubtitles.forEach((subtitleEl, idx) => {
		if (categoryData.images[idx]) {
			subtitleEl.textContent = categoryData.images[idx].subtitle || '';
		}
	});

	const projectImages = document.querySelectorAll('.category-detail-image-wrapper img');
	projectImages.forEach((img, idx) => {
		if (categoryData.images[idx]) {
			img.alt = categoryData.images[idx].title || categoryData.title;
		}
	});
}

function updateLanguageButtons() {
	const esBtn = document.getElementById('langES');
	const enBtn = document.getElementById('langEN');

	if (esBtn && enBtn) {
		if (currentLanguage === 'es') {
			esBtn.classList.add('active');
			enBtn.classList.remove('active');
		} else {
			esBtn.classList.remove('active');
			enBtn.classList.add('active');
		}
	}
}

function updateInterfaceTexts() {
	updateInterfaceTextsOnly();
}

function updateCardTitles() {
	updateCardTitlesOnly();
}

async function initializeLanguageSystem() {
	console.log('🌍 Inicializando sistema de idiomas...');

	let savedLang = 'es';
	try {
		savedLang = localStorage.getItem('preferredLanguage') || 'es';
	} catch (e) {}

	const success = await preloadAllLanguages();
	if (!success) {
		console.error('❌ Error al precargar idiomas');
		return false;
	}

	currentLanguage = savedLang;
	portfolioData = portfolioDataCache[currentLanguage];

	updateInterfaceTextsOnly();
	updateCardTitlesOnly();
	updateCurrentViewTextsOnly();
	updateLanguageButtons();

	// Emitir evento para que el selector se actualice
	window.dispatchEvent(new CustomEvent('languageChanged', {
		detail: { language: currentLanguage }
	}));

	console.log(`✅ Sistema listo: ${currentLanguage.toUpperCase()}`);

	return true;
}

window.addEventListener('load', async () => {
	await initializeLanguageSystem();
	console.log('Portfolio data ready');
});
