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
	setTimeout(() => {
		modalImage.src = '';
	}, 300);
}

modalImage.addEventListener('mousemove', (e) => {
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
	if (modalImage.hasAttribute('data-no-card-effect')) {
		return;
	}
	modalImage.style.transition = 'transform 0.6s ease-out';
});

modalImage.addEventListener('mouseleave', () => {
	if (modalImage.hasAttribute('data-no-card-effect')) {
		return;
	}
	modalImage.style.transition = 'transform 0.6s ease-out';
	modalImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
});
