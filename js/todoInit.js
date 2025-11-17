// ============================================
// TODO SECTION INITIALIZATION
// ============================================
// Este script se ejecuta automáticamente al cargar la página
// para configurar la visibilidad de la sección TODO

(function initializeTodoSection() {
	'use strict';
	
	console.log(`🔧 Initializing TODO section: ${ENABLE_TODO_SECTION ? 'ENABLED' : 'DISABLED'}`);
	
	if (!ENABLE_TODO_SECTION) {
		// Aplicar estilos inline para desactivar completamente TODO
		const style = document.createElement('style');
		style.id = 'todo-disable-styles';
		style.textContent = `
			/* Desactivar completamente la tarjeta TODO */
			.card-wrapper[data-category="todo"],
			#todoCardWrapper {
				display: none !important;
				pointer-events: none !important;
				opacity: 0 !important;
				visibility: hidden !important;
			}
			
			/* Desactivar placeholder de TODO */
			.card-placeholder[data-category="todo"] {
				display: none !important;
				pointer-events: none !important;
				opacity: 0 !important;
				visibility: hidden !important;
			}
			
			/* Desactivar estilos TODO en hover */
			.portfolio-card[data-category="todo"]:hover .card-inner,
			.portfolio-card[data-category="todo"] .card-inner:hover {
				transform: none !important;
			}
			
			/* Desactivar grid de TODO */
			.categories-container.todo-grid-mode,
			.todo-projects-grid,
			.todo-project-card,
			.todo-project-image-wrapper,
			.todo-project-title,
			.todo-project-subtitle {
				display: none !important;
				pointer-events: none !important;
				opacity: 0 !important;
				visibility: hidden !important;
			}
			
			/* Desactivar tema verde (TODO) */
			body.green-theme {
				background-image: url('images/FondoWeb.png') !important;
			}
		`;
		document.head.appendChild(style);
		
		// Eliminar datos de TODO del portfolioData si existen
		if (portfolioData && portfolioData.todo) {
			portfolioData.todo = { name: 'TODO', categories: [], projects: [] };
		}
		
		console.log('✅ TODO section fully disabled');
	} else {
		console.log('✅ TODO section is active');
	}
	
	// Asegurar que la tarjeta TODO tenga el comportamiento correcto
	window.addEventListener('DOMContentLoaded', () => {
		const todoCardWrapper = document.getElementById('todoCardWrapper');
		if (todoCardWrapper) {
			if (!ENABLE_TODO_SECTION) {
				// Remover completamente del DOM
				todoCardWrapper.remove();
				console.log('🗑️ TODO card wrapper removed from DOM');
			} else {
				// Asegurar que esté visible
				todoCardWrapper.style.display = '';
				console.log('👁️ TODO card wrapper is visible');
			}
		}
		
		// Limpiar placeholders de TODO si está desactivado
		if (!ENABLE_TODO_SECTION) {
			setTimeout(() => {
				const todoPlaceholders = document.querySelectorAll('.card-placeholder[data-category="todo"]');
				todoPlaceholders.forEach(placeholder => {
					placeholder.remove();
					console.log('🗑️ TODO placeholder removed');
				});
			}, 1000);
		}
	});
	
	// Sobrescribir función de cambio de categoría para prevenir TODO
	if (!ENABLE_TODO_SECTION) {
		const originalCurrentCategory = currentCategory;
		
		// Si currentCategory es 'todo' por defecto, cambiarlo a 'arte'
		if (currentCategory === 'todo') {
			currentCategory = 'arte';
			console.log('🔄 Changed default category from todo to arte');
		}
	}
})();
