// Contenido específico para cada grupo
const cvInfoContent = {
	'Diseño Gráfico': {
		title: 'Diseño Gráfico',
		content: `
			<h3>Experiencia en Diseño Gráfico</h3>
			<p>Especializado en la creación de identidades visuales cohesivas y materiales gráficos que comunican efectivamente el mensaje de marca.</p>

			<h3>Habilidades</h3>
			<ul>
				<li>Diseño de identidad corporativa y branding</li>
				<li>Diseño editorial y maquetación</li>
				<li>Ilustración digital y vectorial</li>
				<li>Diseño de materiales publicitarios</li>
				<li>Tipografía y composición</li>
			</ul>

			<div class="cv-info-highlight">
				<strong>Herramientas:</strong> Adobe Illustrator, Photoshop, InDesign
			</div>

			<h3>Proyectos Destacados</h3>
			<p>He trabajado en diversos proyectos de branding, desde eventos hasta productos comerciales, creando soluciones visuales únicas y memorables.</p>
		`
	},
	'Modelado 3D': {
		title: 'Modelado 3D',
		content: `
			<h3>Especialización en Modelado 3D</h3>
			<p>Experiencia en la creación de assets 3D de alta calidad para videojuegos, animación y visualización arquitectónica.</p>

			<h3>Técnicas y Procesos</h3>
			<ul>
				<li>Modelado hard surface y orgánico</li>
				<li>Esculpido digital de alta resolución</li>
				<li>Retopología y optimización de mallas</li>
				<li>UV mapping y texturización PBR</li>
				<li>Rigging y preparación para animación</li>
			</ul>

			<div class="cv-info-highlight">
				<strong>Software:</strong> Blender, 3DS Max, Maya, ZBrush, Substance Painter
			</div>

			<h3>Aplicaciones</h3>
			<p>Desde personajes estilizados para videojuegos hasta props realistas para producciones audiovisuales.</p>
		`
	},
	'Ilustración': {
		title: 'Ilustración',
		content: `
			<h3>Arte e Ilustración Digital</h3>
			<p>Creación de ilustraciones originales con diversos estilos, desde concept art hasta ilustraciones finalizadas para productos comerciales.</p>

			<h3>Estilos y Técnicas</h3>
			<ul>
				<li>Ilustración digital y tradicional</li>
				<li>Concept art para videojuegos</li>
				<li>Character design y development</li>
				<li>Ilustración editorial</li>
				<li>Arte para redes sociales</li>
			</ul>

			<div class="cv-info-highlight">
				<strong>Herramientas:</strong> Photoshop, Illustrator, Procreate
			</div>

			<h3>Proyectos</h3>
			<p>He desarrollado personajes únicos y mundos visuales completos para diversos proyectos creativos.</p>
		`
	},
	'Edición de Video': {
		title: 'Edición de Video',
		content: `
			<h3>Edición y Postproducción</h3>
			<p>Experiencia en la edición de video profesional, desde cortometrajes hasta contenido para redes sociales y trailers de videojuegos.</p>

			<h3>Servicios</h3>
			<ul>
				<li>Edición de video narrativo y comercial</li>
				<li>Motion graphics y animación 2D</li>
				<li>Corrección de color y grading</li>
				<li>Diseño de sonido y mezcla de audio</li>
				<li>Efectos visuales y composición</li>
			</ul>

			<div class="cv-info-highlight">
				<strong>Software:</strong> Adobe Premiere Pro, After Effects, DaVinci Resolve
			</div>

			<h3>Tipos de Proyectos</h3>
			<p>Trailers de videojuegos, booktrailers, contenido promocional y videos corporativos.</p>
		`
	},
	'Desarrollo Web': {
		title: 'Desarrollo Web',
		content: `
			<h3>Desarrollo Web Full Stack</h3>
			<p>Creación de aplicaciones web modernas, responsivas y optimizadas, con enfoque en experiencia de usuario y rendimiento.</p>

			<h3>Tecnologías</h3>
			<ul>
				<li>HTML5, CSS3, JavaScript (ES6+)</li>
				<li>React, Vue.js</li>
				<li>Node.js, Express</li>
				<li>Bases de datos SQL y NoSQL</li>
				<li>APIs RESTful y GraphQL</li>
				<li>Control de versiones con Git</li>
			</ul>

			<div class="cv-info-highlight">
				<strong>Especialidades:</strong> UI/UX, Responsive Design, Performance Optimization
			</div>

			<h3>Proyectos</h3>
			<p>Desde portfolios personales hasta aplicaciones empresariales complejas y sistemas de gestión.</p>
		`
	},
	'Videojuegos': {
		title: 'Videojuegos',
		content: `
			<h3>Desarrollo de Videojuegos</h3>
			<p>Experiencia completa en el ciclo de desarrollo de videojuegos, desde el concepto inicial hasta el lanzamiento.</p>

			<h3>Áreas de Expertise</h3>
			<ul>
				<li>Programación de gameplay en Unity y Unreal</li>
				<li>Diseño de niveles y mecánicas</li>
				<li>Implementación de IA y sistemas</li>
				<li>Optimización y debugging</li>
				<li>Integración de assets 2D/3D</li>
				<li>Game design y documentación</li>
			</ul>

			<div class="cv-info-highlight">
				<strong>Motores:</strong> Unity, Unreal Engine 4/5
			</div>

			<h3>Géneros</h3>
			<p>Plataformas 3D, puzzles, prototipos de gameplay, juegos narrativos y mecánicas experimentales.</p>
		`
	},
	'Edición': {
		title: 'Edición de Video',
		content: `
			<h3>Edición y Postproducción</h3>
			<p>Experiencia en la edición de video profesional, desde cortometrajes hasta contenido para redes sociales y trailers de videojuegos.</p>

			<h3>Servicios</h3>
			<ul>
				<li>Edición de video narrativo y comercial</li>
				<li>Motion graphics y animación 2D</li>
				<li>Corrección de color y grading</li>
				<li>Diseño de sonido y mezcla de audio</li>
				<li>Efectos visuales y composición</li>
			</ul>

			<div class="cv-info-highlight">
				<strong>Software:</strong> Adobe Premiere Pro, After Effects, DaVinci Resolve
			</div>

			<h3>Tipos de Proyectos</h3>
			<p>Trailers de videojuegos, booktrailers, contenido promocional y videos corporativos.</p>
		`
	},
	'Webs': {
		title: 'Desarrollo Web',
		content: `
			<h3>Desarrollo Web Full Stack</h3>
			<p>Creación de aplicaciones web modernas, responsivas y optimizadas, con enfoque en experiencia de usuario y rendimiento.</p>

			<h3>Tecnologías</h3>
			<ul>
				<li>HTML5, CSS3, JavaScript (ES6+)</li>
				<li>React, Vue.js</li>
				<li>Node.js, Express</li>
				<li>Bases de datos SQL y NoSQL</li>
				<li>APIs RESTful y GraphQL</li>
				<li>Control de versiones con Git</li>
			</ul>

			<div class="cv-info-highlight">
				<strong>Especialidades:</strong> UI/UX, Responsive Design, Performance Optimization
			</div>

			<h3>Proyectos</h3>
			<p>Desde portfolios personales hasta aplicaciones empresariales complejas y sistemas de gestión.</p>
		`
	}
};

// Variable para trackear el estado del panel
let currentPanelOpen = false;

// Función para abrir el panel con contenido específico
function openCVInfoPanel(groupName) {
	console.log('Opening panel for:', groupName);
	const panel = document.getElementById('cvInfoPanel');
	const cvContainer = document.querySelector('.cv-container');
	const panelTitle = document.getElementById('cvInfoPanelTitle');
	const panelContent = document.getElementById('cvInfoPanelContent');

	if (!panel) {
		console.error('Panel not found!');
		return;
	}

	// Obtener el contenido correspondiente
	const content = cvInfoContent[groupName];
	if (!content) {
		console.error('No content for:', groupName);
		return;
	}

	// Actualizar contenido
	panelTitle.textContent = content.title;
	panelContent.innerHTML = content.content;

	// Abrir panel
	panel.classList.add('active');
	cvContainer.classList.add('panel-open');
	currentPanelOpen = true;
}

// Función para cerrar el panel
function closeCVInfoPanel() {
	const panel = document.getElementById('cvInfoPanel');
	const cvContainer = document.querySelector('.cv-container');

	if (!panel) return;

	panel.classList.remove('active');
	cvContainer.classList.remove('panel-open');
	currentPanelOpen = false;
}

// Crear el panel inmediatamente
(function() {
	const panel = document.createElement('div');
	panel.id = 'cvInfoPanel';
	panel.className = 'cv-info-panel';
	panel.innerHTML = `
		<div class="cv-info-panel-header">
			<div class="cv-info-panel-title" id="cvInfoPanelTitle">Información</div>
			<button class="cv-info-panel-close" onclick="closeCVInfoPanel()">×</button>
		</div>
		<div class="cv-info-panel-content" id="cvInfoPanelContent"></div>
	`;
	document.body.appendChild(panel);
	console.log('CV Info Panel created successfully');
})();
