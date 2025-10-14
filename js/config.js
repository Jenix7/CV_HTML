let currentSection = 'curriculum';
let currentCategory = 'todo';
let currentTheme = '';
let animationComplete = false;
let portfolioAnimated = false;
let selectedCard = null;
let categoryDetailView = false;
let currentCategoryIndex = null;
let currentProjectIndex = null;
let currentProjectCategory = null;

const tooltip = document.getElementById('customTooltip');
const tooltipText = tooltip.querySelector('.tooltip-text');
let tooltipTimeout = null;

const categoryColors = {
	'todo': 'green',
	'arte': 'red',
	'programacion': 'blue',
	'diseño': 'yellow',
	'produccion': 'purple',
	'comunicacion': 'pink'
};

let portfolioData = {
	'arte': { name: 'ARTE', categories: [] },
	'programacion': { name: 'PROGRAMACIÓN', categories: [] },
	'diseño': { name: 'DISEÑO', categories: [] },
	'produccion': { name: 'PRODUCCIÓN', categories: [] },
	'comunicacion': { name: 'COMUNICACIÓN', categories: [] },
	'todo': { name: 'TODO', categories: [] }
};

const elementNames = {
	'cv-targeta-javier': { name: 'Tarjeta Personal', icon: '👤', clickable: true },
	'cv-resumen-personal': { name: 'Resumen Personal', icon: '📄', clickable: true },
	'cv-experiencia': { name: 'Experiencia', icon: '💼', clickable: true },
	'cv-aptitudes': { name: 'Aptitudes', icon: '⭐', clickable: true },
	'cv-licenciado': { name: 'Título Universitario', icon: '🎓', clickable: true },
	'cv-photoshop': { name: 'Photoshop', icon: '🎨', clickable: false },
	'cv-zbrush': { name: 'ZBrush', icon: '🗿', clickable: false },
	'cv-opentoonz': { name: 'OpenToonz', icon: '🎬', clickable: false },
	'cv-premiere': { name: 'Premiere', icon: '🎞️', clickable: false },
	'cv-after-effects': { name: 'After Effects', icon: '✨', clickable: false },
	'cv-unreal': { name: 'Unreal Engine', icon: '🎮', clickable: false },
	'cv-cascadeur': { name: 'Cascadeur', icon: '🤸', clickable: false },
	'cv-marmoset': { name: 'Marmoset', icon: '🦊', clickable: false },
	'cv-substance': { name: 'Substance', icon: '🧪', clickable: false },
	'cv-3dmax': { name: '3D Max', icon: '📦', clickable: false },
	'cv-maya': { name: 'Maya', icon: '🛕', clickable: false },
	'cv-blender': { name: 'Blender', icon: '🌀', clickable: false },
	'cv-unity': { name: 'Unity', icon: '🎯', clickable: false },
	'cv-illustrator': { name: 'Illustrator', icon: '✏️', clickable: false },
	'cv-portfolio-titulo': { name: 'Portfolio', icon: '📂', clickable: false },
	'cv-entrada1': { name: 'Diseño Gráfico', icon: '🎨', clickable: false },
	'cv-entrada2': { name: 'Diseño Gráfico', icon: '🎨', clickable: false },
	'cv-diseno-grafico': { name: 'Diseño Gráfico', icon: '🎨', clickable: false },
	'cv-coral': { name: 'Modelado 3D', icon: '🪸', clickable: false },
	'cv-zapato': { name: 'Modelado 3D', icon: '👟', clickable: false },
	'cv-modelado3d': { name: 'Modelado 3D', icon: '📦', clickable: false },
	'cv-porky': { name: 'Ilustración', icon: '🐷', clickable: false },
	'cv-sydan': { name: 'Ilustración', icon: '🦌', clickable: false },
	'cv-ilustracion': { name: 'Ilustración', icon: '🖼️', clickable: false },
	'cv-cinta-video1': { name: 'Edición de Video', icon: '📹', clickable: false },
	'cv-cinta-video2': { name: 'Edición de Video', icon: '📹', clickable: false },
	'cv-edicion': { name: 'Edición', icon: '✂️', clickable: false },
	'cv-artilugio': { name: 'Webs', icon: '🌐', clickable: false },
	'cv-webs': { name: 'Desarrollo Web', icon: '💻', clickable: false },
	'cv-consola': { name: 'Videojuegos', icon: '🎮', clickable: false },
	'cv-videojuegos': { name: 'Videojuegos', icon: '🕹️', clickable: false }
};

const cardOrder = ['todo', 'arte', 'programacion', 'diseño', 'produccion', 'comunicacion'];

const highResMap = {
	'cv-targeta-javier': 'images/TargetaJavier_High.png',
	'cv-resumen-personal': 'images/ResumenPersonal_High.png',
	'cv-experiencia': 'images/Experiencia_High.png',
	'cv-aptitudes': 'images/Aptitudes_High.png',
	'cv-licenciado': 'images/Licenciado_High.png'
};

const hoverGroups = {
	group1: ['cv-entrada2', 'cv-entrada1', 'cv-diseno-grafico'],
	group2: ['cv-coral', 'cv-zapato', 'cv-modelado3d'],
	group3: ['cv-porky', 'cv-sydan', 'cv-ilustracion'],
	group4: ['cv-cinta-video2', 'cv-cinta-video1', 'cv-edicion'],
	group5: ['cv-artilugio', 'cv-webs'],
	group6: ['cv-consola', 'cv-videojuegos']
};
