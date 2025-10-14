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
			hideTooltip();
			const highResImage = highResMap[elementId];
			if (highResImage) {
				modalImage.src = highResImage;

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
