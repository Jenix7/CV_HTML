const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');

modalOverlay.addEventListener('click', closeModal);

modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && modal.classList.contains('active')) {
		closeModal();
	}
});

function closeModal() {
	modal.classList.remove('active');
	document.body.style.overflow = '';

	// Limpiar elementos interactivos de Resumen Personal si existen
	removeResumenPersonalElements();

	setTimeout(() => {
		const img = document.getElementById('modalImage');
		if (img) img.src = '';
	}, 300);
}

// Función para eliminar elementos de Resumen Personal
function removeResumenPersonalElements() {
	const wrapper = document.getElementById('resumenPersonalWrapper');
	if (wrapper) {
		console.log('🗑️ Eliminando wrapper de Resumen Personal');
		wrapper.remove();
	}
}

// Función para crear elementos interactivos en Resumen Personal
function createResumenPersonalElements() {
	console.log('🟥 Iniciando creación de elementos rojos...');

	// Limpiar elementos previos si existen
	removeResumenPersonalElements();

	const modalContent = document.querySelector('.modal-content');
	let modalImage = document.getElementById('modalImage');

	console.log('📦 ModalContent encontrado:', modalContent);
	console.log('🖼️ ModalImage encontrado:', modalImage);

	if (!modalImage) {
		console.error('❌ No se puede crear elementos: modalImage no existe');
		return;
	}

	// Crear un wrapper que contendrá tanto la imagen como los elementos interactivos
	const wrapper = document.createElement('div');
	wrapper.id = 'resumenPersonalWrapper';
	wrapper.style.position = 'relative';
	wrapper.style.display = 'inline-block';
	wrapper.style.transformStyle = 'preserve-3d';

	console.log('📦 Wrapper creado');

	// Mover la imagen dentro del wrapper
	const parent = modalImage.parentNode;
	parent.insertBefore(wrapper, modalImage);
	wrapper.appendChild(modalImage);

	console.log('🖼️ Imagen movida al wrapper');

	// Definir las posiciones de los 4 cuadrados en columna
	const baseTop = 334; // Top del primer elemento
	const gap = 8; // Espacio entre elementos (ajustable)
	const elementHeight = 23;

	const positions = [
		{ top: `${baseTop}px`, left: '493px' },
		{ top: `${baseTop + elementHeight + gap}px`, left: '493px' },
		{ top: `${baseTop + (elementHeight + gap) * 2}px`, left: '493px' },
		{ top: `${baseTop + (elementHeight + gap) * 3}px`, left: '493px' }
	];

	const linkUrl = 'https://javiersagales.com/';

	positions.forEach((pos, index) => {
		const element = document.createElement('a');
		element.className = 'resumen-personal-link';
		element.href = linkUrl;
		element.target = '_blank';
		element.rel = 'noopener noreferrer';

		// Estilos del cuadrado - dimensiones y posición exactas
		element.style.position = 'absolute';
		element.style.width = '343px';
		element.style.height = '23px';
		element.style.backgroundColor = 'red';
		element.style.cursor = 'pointer';
		element.style.zIndex = '10';
		element.style.transition = 'opacity 0.3s ease';
		element.style.pointerEvents = 'auto';
		element.style.transformStyle = 'preserve-3d';

		// Aplicar posición
		element.style.top = pos.top;
		element.style.left = pos.left;

		// Efecto hover
		element.addEventListener('mouseenter', () => {
			element.style.opacity = '0.7';
		});

		element.addEventListener('mouseleave', () => {
			element.style.opacity = '1';
		});

		wrapper.appendChild(element);
		console.log(`🟥 Elemento rojo ${index + 1} creado en posición:`, pos);
	});

	console.log('✅ Todos los elementos rojos creados');

	// IMPORTANTE: Agregar eventos de mouse al WRAPPER para que detecte tanto imagen como cuadrados
	setupWrapperMouseEvents(wrapper);
}

// Función para configurar eventos de mouse en el wrapper
function setupWrapperMouseEvents(wrapper) {
	console.log('🔄 Configurando eventos del wrapper...');

	const modalImage = document.getElementById('modalImage');

	wrapper.addEventListener('mousemove', (e) => {
		if (modalImage.hasAttribute('data-no-card-effect')) {
			return;
		}

		// Calcular posición relativa a la imagen (no al wrapper)
		const rect = modalImage.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * -10;
		const rotateY = ((x - centerX) / centerX) * 10;

		wrapper.style.transition = 'transform 0.15s ease-out';
		wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
	});

	wrapper.addEventListener('mouseenter', () => {
		if (modalImage.hasAttribute('data-no-card-effect')) {
			return;
		}
		wrapper.style.transition = 'transform 0.6s ease-out';
	});

	wrapper.addEventListener('mouseleave', () => {
		if (modalImage.hasAttribute('data-no-card-effect')) {
			return;
		}
		wrapper.style.transition = 'transform 0.6s ease-out';
		wrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
	});

	console.log('✅ Eventos del wrapper configurados');
}

// Eventos de mouse para la imagen (cuando NO hay wrapper - otros modales)
modalImage.addEventListener('mousemove', (e) => {
	// Solo aplicar si NO existe el wrapper (para otros modales)
	const wrapper = document.getElementById('resumenPersonalWrapper');
	if (wrapper) return;

	if (modalImage.hasAttribute('data-no-card-effect')) {
		return;
	}

	const rect = modalImage.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	const centerX = rect.width / 2;
	const centerY = rect.height / 2;

	const rotateX = ((y - centerY) / centerY) * -10;
	const rotateY = ((x - centerX) / centerX) * 10;

	modalImage.style.transition = 'transform 0.15s ease-out';
	modalImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
});

modalImage.addEventListener('mouseenter', () => {
	const wrapper = document.getElementById('resumenPersonalWrapper');
	if (wrapper) return;

	if (modalImage.hasAttribute('data-no-card-effect')) {
		return;
	}
	modalImage.style.transition = 'transform 0.6s ease-out';
});

modalImage.addEventListener('mouseleave', () => {
	const wrapper = document.getElementById('resumenPersonalWrapper');
	if (wrapper) return;

	if (modalImage.hasAttribute('data-no-card-effect')) {
		return;
	}
	modalImage.style.transition = 'transform 0.6s ease-out';
	modalImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
});
