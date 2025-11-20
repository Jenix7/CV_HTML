// ============================================
// MODAL DE CONTACTO
// ============================================

function openContactModal() {
	const modal = document.getElementById('contactModal');
	modal.classList.add('active');
	document.body.style.overflow = 'hidden';

	console.log('✅ Modal de contacto abierto');
}

function closeContactModal() {
	const modal = document.getElementById('contactModal');
	modal.classList.remove('active');
	document.body.style.overflow = '';

	console.log('❌ Modal de contacto cerrado');
}

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		const modal = document.getElementById('contactModal');
		if (modal && modal.classList.contains('active')) {
			closeContactModal();
		}
	}
});

// Actualizar traducciones del modal de contacto
function updateContactModalTexts() {
	const title = document.getElementById('contactModalTitle');
	const subtitle = document.getElementById('contactModalSubtitle');
	const sectionDirect = document.getElementById('contactSectionDirect');
	const sectionSocial = document.getElementById('contactSectionSocial');
	const labelPhone = document.getElementById('contactLabelPhone');
	const labelEmail = document.getElementById('contactLabelEmail');

	if (typeof currentLanguage !== 'undefined') {
		if (currentLanguage === 'es') {
			if (title) title.textContent = 'CONTACTO';
			if (subtitle) subtitle.textContent = 'Conecta conmigo a través de estos canales';
			if (sectionDirect) sectionDirect.textContent = 'Contacto Directo';
			if (sectionSocial) sectionSocial.textContent = 'Redes Sociales';
			if (labelPhone) labelPhone.textContent = 'Teléfono';
			if (labelEmail) labelEmail.textContent = 'Correo';
		} else {
			if (title) title.textContent = 'CONTACT';
			if (subtitle) subtitle.textContent = 'Connect with me through these channels';
			if (sectionDirect) sectionDirect.textContent = 'Direct Contact';
			if (sectionSocial) sectionSocial.textContent = 'Social Media';
			if (labelPhone) labelPhone.textContent = 'Phone';
			if (labelEmail) labelEmail.textContent = 'Email';
		}
	}
}

// Inicializar traducciones
document.addEventListener('DOMContentLoaded', updateContactModalTexts);
window.addEventListener('languageChanged', updateContactModalTexts);
