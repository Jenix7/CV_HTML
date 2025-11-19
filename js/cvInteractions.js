Object.values(hoverGroups).forEach(group => {
	group.forEach(elementId => {
		const element = document.getElementById(elementId);
		if (element) {
			element.addEventListener('mouseenter', (e) => {
				showTooltip(element, e.clientX, e.clientY);
				group.forEach(id => {
					const el = document.getElementById(id);
					if (el) {
						el.style.transform = 'scale(1.05) translateY(-2px)';
						el.style.zIndex = '999';
						el.style.filter = 'drop-shadow(0 0 3px rgba(74, 222, 128, 0.9)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) brightness(1.12) contrast(1.05) saturate(1.15)';
						el.style.animation = 'pulse-glow 1.5s ease-in-out infinite';
					}
				});
			});

			element.addEventListener('mousemove', (e) => {
				updateTooltipPosition(e.clientX, e.clientY);
			});

			element.addEventListener('mouseleave', () => {
				hideTooltip();
				group.forEach(id => {
					const el = document.getElementById(id);
					if (el) {
						el.style.transform = '';
						el.style.zIndex = '';
						el.style.filter = '';
						el.style.animation = '';
					}
				});
			});

			// Añadir click para abrir modal de información
			element.addEventListener('click', () => {
				hideTooltip();
				const groupName = elementNames[elementId]?.name;
				if (groupName && typeof openCVInfoModal === 'function') {
					openCVInfoModal(groupName);
				}
			});
		}
	});
});

const clickableElements = [
	'cv-targeta-javier',
	'cv-resumen-personal',
	'cv-experiencia',
	'cv-aptitudes',
	'cv-licenciado'
];

// Función para reconectar eventos del modal después de reconstruirlo
function reconnectModalEvents(modalImage, modal) {
	console.log('🔄 Reconectando eventos del modal...');

	// Eventos de mousemove para el efecto 3D
	const mousemoveHandler = (e) => {
		const wrapper = document.getElementById('resumenPersonalWrapper');
		if (wrapper) return; // Si hay wrapper, sus eventos se encargan

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
	};

	const mouseenterHandler = () => {
		const wrapper = document.getElementById('resumenPersonalWrapper');
		if (wrapper) return;

		if (modalImage.hasAttribute('data-no-card-effect')) {
			return;
		}
		modalImage.style.transition = 'transform 0.6s ease-out';
	};

	const mouseleaveHandler = () => {
		const wrapper = document.getElementById('resumenPersonalWrapper');
		if (wrapper) return;

		if (modalImage.hasAttribute('data-no-card-effect')) {
			return;
		}
		modalImage.style.transition = 'transform 0.6s ease-out';
		modalImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
	};

	modalImage.addEventListener('mousemove', mousemoveHandler);
	modalImage.addEventListener('mouseenter', mouseenterHandler);
	modalImage.addEventListener('mouseleave', mouseleaveHandler);

	console.log('✅ Eventos del modal reconectados');
}

clickableElements.forEach(elementId => {
	const element = document.getElementById(elementId);
	if (element) {
		element.addEventListener('mouseenter', (e) => {
			showTooltip(element, e.clientX, e.clientY);
		});

		element.addEventListener('mousemove', (e) => {
			updateTooltipPosition(e.clientX, e.clientY);
		});

		element.addEventListener('mouseleave', () => {
			hideTooltip();
		});

		element.addEventListener('click', () => {
			console.log('🔍 CLICK en elemento clickable:', elementId);

			hideTooltip();

			// IMPORTANTE: Obtener referencias frescas cada vez y asegurar que existen
			let modal = document.getElementById('imageModal');
			let modalImage = document.getElementById('modalImage');
			let modalContent = document.querySelector('.modal-content');

			console.log('🔍 Modal encontrado:', modal);
			console.log('🔍 ModalImage encontrado:', modalImage);
			console.log('🔍 ModalContent encontrado:', modalContent);

			// Si no existe modalImage, intentar reconstruir la estructura del modal
			if (!modalImage && modalContent) {
				console.log('⚠️ Reconstruyendo estructura del modal...');

				// Limpiar contenido actual
				modalContent.innerHTML = '';

				// Reconstruir estructura
				const closeBtn = document.createElement('button');
				closeBtn.className = 'modal-close';
				closeBtn.id = 'modalClose';
				closeBtn.innerHTML = '&times;';
				closeBtn.addEventListener('click', () => {
					modal.classList.remove('active');
					document.body.style.overflow = '';

					// Limpiar elementos de Resumen Personal si existen
					if (typeof removeResumenPersonalElements === 'function') {
						removeResumenPersonalElements();
					}

					setTimeout(() => {
						const img = document.getElementById('modalImage');
						if (img) img.src = '';
					}, 300);
				});

				const img = document.createElement('img');
				img.id = 'modalImage';
				img.src = '';
				img.alt = '';

				modalContent.appendChild(closeBtn);
				modalContent.appendChild(img);

				// Actualizar referencia
				modalImage = img;

				// IMPORTANTE: Reconectar eventos del modal
				reconnectModalEvents(modalImage, modal);

				console.log('✅ Modal reconstruido con eventos');
			}

			if (!modalImage) {
				console.error('❌ ERROR: No se pudo crear modalImage!');
				return;
			}

			const highResImage = highResMap[elementId];
			if (highResImage) {
				// Usar la función de imageLanguageManager para obtener la ruta correcta
				const imagePathForLang = typeof getImagePathForLanguage === 'function'
					? getImagePathForLanguage(highResImage, currentLanguage)
					: highResImage;

				modalImage.src = imagePathForLang;

				if (elementId === 'cv-licenciado') {
					modalImage.setAttribute('data-no-card-effect', 'true');
				} else {
					modalImage.removeAttribute('data-no-card-effect');
				}
			} else {
				const img = element.querySelector('img');
				if (img) {
					modalImage.src = img.src;
					modalImage.removeAttribute('data-no-card-effect');
				}
			}

			modal.classList.add('active');
			document.body.style.overflow = 'hidden';

			// Si es Resumen Personal, crear los elementos interactivos
			if (elementId === 'cv-resumen-personal') {
				// Esperar a que el modal esté visible
				setTimeout(() => {
					if (typeof createResumenPersonalElements === 'function') {
						createResumenPersonalElements();
					}
				}, 100);
			}
		});
	}
});

const individualHoverElements = [
	'cv-photoshop', 'cv-zbrush', 'cv-opentoonz', 'cv-premiere',
	'cv-after-effects', 'cv-unreal', 'cv-cascadeur', 'cv-marmoset',
	'cv-substance', 'cv-3dmax', 'cv-maya', 'cv-blender', 'cv-unity',
	'cv-illustrator', 'cv-portfolio-titulo'
];

individualHoverElements.forEach(elementId => {
	const element = document.getElementById(elementId);
	if (element) {
		element.addEventListener('mouseenter', (e) => {
			showTooltip(element, e.clientX, e.clientY);
		});

		element.addEventListener('mousemove', (e) => {
			updateTooltipPosition(e.clientX, e.clientY);
		});

		element.addEventListener('mouseleave', () => {
			hideTooltip();
		});
	}
});
