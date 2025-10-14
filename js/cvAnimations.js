window.addEventListener('load', () => {
	loadPortfolioData().then(() => {
		console.log('Portfolio data ready');
	});

	const cvElements = document.querySelectorAll('.cv-background > div');

	cvElements.forEach(element => {
		element.style.pointerEvents = 'none';
	});

	const tablonGroupElements = [
		'cv-tablon',
		'cv-sobre'
	];

	const compactGroupElements = [
		'cv-webs',
		'cv-artilugio',
		'cv-coral',
		'cv-zapato',
		'cv-modelado3d',
		'cv-edicion',
		'cv-cinta-video1',
		'cv-cinta-video2',
		'cv-ilustracion',
		'cv-porky',
		'cv-sydan',
		'cv-diseno-grafico',
		'cv-entrada1',
		'cv-entrada2',
		'cv-videojuegos',
		'cv-consola',
		'cv-chincheta-verde',
		'cv-portfolio-titulo'
	];

	const smallIconElements = [
		'cv-photoshop',
		'cv-unity',
		'cv-premiere',
		'cv-3dmax',
		'cv-blender',
		'cv-maya',
		'cv-illustrator',
		'cv-substance',
		'cv-unreal',
		'cv-zbrush',
		'cv-cascadeur',
		'cv-marmoset',
		'cv-after-effects',
		'cv-opentoonz'
	];

	const directions = [
		{ x: '-200vw', y: '0', rotate: '-180deg' },
		{ x: '200vw', y: '0', rotate: '180deg' },
		{ x: '0', y: '-200vh', rotate: '-360deg' },
		{ x: '0', y: '200vh', rotate: '360deg' },
		{ x: '-150vw', y: '-150vh', rotate: '-270deg' },
		{ x: '150vw', y: '-150vh', rotate: '270deg' },
		{ x: '-150vw', y: '150vh', rotate: '-90deg' },
		{ x: '150vw', y: '150vh', rotate: '90deg' }
	];

	const tablonGroupDirection = directions[Math.floor(Math.random() * directions.length)];
	const groupDirection = directions[Math.floor(Math.random() * directions.length)];

	let maxDelay = 0;
	let animationsCount = 0;
	let completedAnimations = 0;

	cvElements.forEach((element, index) => {
		if (tablonGroupElements.includes(element.id)) {
			element.style.setProperty('--start-x', tablonGroupDirection.x);
			element.style.setProperty('--start-y', tablonGroupDirection.y);
			element.style.setProperty('--start-rotate', tablonGroupDirection.rotate);

			animationsCount++;
			const delay = 0;
			maxDelay = Math.max(maxDelay, delay + 850);

			setTimeout(() => {
				element.classList.add('animate-in');

				setTimeout(() => {
					element.classList.remove('animate-in');
					element.classList.add('animation-complete');
					element.style.animation = '';
					element.style.transform = '';
					element.style.removeProperty('--start-x');
					element.style.removeProperty('--start-y');
					element.style.removeProperty('--start-rotate');
					completedAnimations++;
					checkAllAnimationsComplete();
				}, 850);
			}, delay);
		}
		else if (compactGroupElements.includes(element.id)) {
			element.style.setProperty('--start-x', groupDirection.x);
			element.style.setProperty('--start-y', groupDirection.y);
			element.style.setProperty('--start-rotate', groupDirection.rotate);

			animationsCount++;
			const delay = 600;
			maxDelay = Math.max(maxDelay, delay + 850);

			setTimeout(() => {
				element.classList.add('animate-in');

				setTimeout(() => {
					element.classList.remove('animate-in');
					element.classList.add('animation-complete');
					element.style.animation = '';
					element.style.transform = '';
					element.style.removeProperty('--start-x');
					element.style.removeProperty('--start-y');
					element.style.removeProperty('--start-rotate');
					completedAnimations++;
					checkAllAnimationsComplete();
				}, 850);
			}, delay);
		}
		else if (smallIconElements.includes(element.id)) {
			const randomDirection = directions[Math.floor(Math.random() * directions.length)];

			element.style.setProperty('--start-x', randomDirection.x);
			element.style.setProperty('--start-y', randomDirection.y);
			element.style.setProperty('--start-rotate', randomDirection.rotate);

			animationsCount++;
			const delay = index * 50;
			maxDelay = Math.max(maxDelay, delay + 850);

			setTimeout(() => {
				element.classList.add('animate-in-subtle');

				setTimeout(() => {
					element.classList.remove('animate-in-subtle');
					element.classList.add('animation-complete');
					element.style.animation = '';
					element.style.transform = '';
					element.style.removeProperty('--start-x');
					element.style.removeProperty('--start-y');
					element.style.removeProperty('--start-rotate');
					completedAnimations++;
					checkAllAnimationsComplete();
				}, 850);
			}, delay);
		} else {
			const randomDirection = directions[Math.floor(Math.random() * directions.length)];

			element.style.setProperty('--start-x', randomDirection.x);
			element.style.setProperty('--start-y', randomDirection.y);
			element.style.setProperty('--start-rotate', randomDirection.rotate);

			animationsCount++;
			const delay = index * 50;
			maxDelay = Math.max(maxDelay, delay + 850);

			setTimeout(() => {
				element.classList.add('animate-in');

				setTimeout(() => {
					element.classList.remove('animate-in');
					element.classList.add('animation-complete');
					element.style.animation = '';
					element.style.transform = '';
					element.style.removeProperty('--start-x');
					element.style.removeProperty('--start-y');
					element.style.removeProperty('--start-rotate');
					completedAnimations++;
					checkAllAnimationsComplete();
				}, 850);
			}, delay);
		}
	});

	function checkAllAnimationsComplete() {
		if (completedAnimations === animationsCount && !animationComplete) {
			animationComplete = true;
			cvElements.forEach(element => {
				if (element.id !== 'cv-sobre') {
					element.style.pointerEvents = 'auto';
				}
			});

			const cvContainer = document.querySelector('.cv-container');
			cvContainer.style.overflow = 'hidden';
		}
	}
});
