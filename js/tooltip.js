function showTooltip(element, x, y) {
	const data = elementNames[element.id];
	if (!data) return;

	clearTimeout(tooltipTimeout);

	tooltipTimeout = setTimeout(() => {
		tooltipText.textContent = data.name;

		tooltip.classList.remove('clickable');

		tooltip.style.left = x + 'px';
		tooltip.style.top = y + 'px';
		tooltip.classList.add('show');
	}, 500);
}

function hideTooltip() {
	clearTimeout(tooltipTimeout);
	tooltip.classList.remove('show');
}

function updateTooltipPosition(x, y) {
	tooltip.style.left = x + 'px';
	tooltip.style.top = y + 'px';
}
