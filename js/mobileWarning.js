// ============================================
// MOBILE WARNING - TRADUCCIONES
// ============================================

function closeMobileWarning() {
	const warning = document.getElementById('mobileWarning');
	if (warning) {
		warning.style.display = 'none';
	}
}

function updateMobileWarningTexts() {
	const title = document.getElementById('mobileWarningTitle');
	const text = document.getElementById('mobileWarningText');
	const subtext = document.getElementById('mobileWarningSubtext');
	const btnText = document.getElementById('mobileWarningBtnText');

	if (typeof currentLanguage !== 'undefined' && currentLanguage === 'en') {
		if (title) title.textContent = 'Desktop Version';
		if (text) text.textContent = 'This portfolio is optimized for desktop experience. Mobile version is currently under development.';
		if (subtext) subtext.textContent = 'For the complete experience, please access from a computer.';
		if (btnText) btnText.textContent = 'Continue anyway';
	} else {
		if (title) title.textContent = 'Versión de Escritorio';
		if (text) text.textContent = 'Este portfolio está optimizado para experiencia de escritorio. La versión móvil se encuentra en desarrollo.';
		if (subtext) subtext.textContent = 'Para una experiencia completa, por favor accede desde un ordenador.';
		if (btnText) btnText.textContent = 'Continuar de todas formas';
	}
}

// Inicializar textos
document.addEventListener('DOMContentLoaded', updateMobileWarningTexts);

// Actualizar al cambiar idioma
window.addEventListener('languageChanged', updateMobileWarningTexts);
