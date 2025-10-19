const HistoryManager = {
	init() {
		window.addEventListener('popstate', (e) => this.handlePopState(e));
		this.restoreFromURL();
	},

	pushState(path, state) {
		window.history.pushState(state, '', path);
	},

	handlePopState(event) {
		if (event.state) {
			this.restoreState(event.state);
		} else {
			this.restoreFromURL();
		}
	},

	restoreFromURL() {
		const path = window.location.pathname;
		const parts = path.split('/').filter(p => p);

		if (parts.length === 0 || parts[0] === 'index.html') {
			this.restoreState({ view: 'curriculum' });
		} else if (parts[0] === 'portfolio') {
			if (parts.length === 1) {
				this.restoreState({ view: 'portfolio' });
			} else if (parts.length === 2) {
				this.restoreState({
					view: 'portfolio-category',
					category: parts[1]
				});
			} else if (parts.length >= 3) {
				this.restoreState({
					view: 'portfolio-project',
					category: parts[1],
					categoryIndex: parseInt(parts[2]) || 0,
					projectIndex: parseInt(parts[3]) || 0
				});
			}
		}
	},

	restoreState(state) {
		switch(state.view) {
			case 'curriculum':
				if (currentSection !== 'curriculum') {
					switchSection('curriculum');
				}
				break;

			case 'portfolio':
				if (currentSection !== 'portfolio') {
					switchSection('portfolio');
				}
				if (categoryDetailView) {
					closeCategoryDetail();
				}
				break;

			case 'portfolio-category':
				if (currentSection !== 'portfolio') {
					switchSection('portfolio');
				}
				if (state.category && portfolioData[state.category]) {
					const categoryIndex = state.categoryIndex || 0;

					const card = document.querySelector(`.portfolio-card[data-category="${state.category}"]`);
					if (card && !card.closest('.card-wrapper').classList.contains('featured')) {
						card.click();
					}

					if (!categoryDetailView) {
						setTimeout(() => {
							openCategoryDetail(categoryIndex);
						}, 100);
					} else {
						openCategoryDetail(categoryIndex);
					}
				}
				break;

			case 'portfolio-project':
				if (currentSection !== 'portfolio') {
					switchSection('portfolio');
				}
				if (state.category && portfolioData[state.category]) {
					const card = document.querySelector(`.portfolio-card[data-category="${state.category}"]`);
					if (card && !card.closest('.card-wrapper').classList.contains('featured')) {
						card.click();
					}

					setTimeout(() => {
						openProjectViewer(state.categoryIndex, state.projectIndex);
					}, 200);
				}
				break;
		}
	},

	trackSectionSwitch(section) {
		if (section === 'curriculum') {
			this.pushState('/', { view: 'curriculum' });
		} else if (section === 'portfolio') {
			this.pushState('/portfolio', { view: 'portfolio' });
		}
	},

	trackCategoryOpen(category, categoryIndex) {
		const sectionData = portfolioData[category];
		if (sectionData) {
			this.pushState(`/portfolio/${category}/${categoryIndex}`, {
				view: 'portfolio-category',
				category: category,
				categoryIndex: categoryIndex
			});
		}
	},

	trackProjectOpen(category, categoryIndex, projectIndex) {
		const sectionData = portfolioData[category];
		if (sectionData && sectionData.categories[categoryIndex]) {
			this.pushState(`/portfolio/${category}/${categoryIndex}/${projectIndex}`, {
				view: 'portfolio-project',
				category: category,
				categoryIndex: categoryIndex,
				projectIndex: projectIndex
			});
		}
	},

	trackCategoryClose(category) {
		this.pushState('/portfolio', { view: 'portfolio' });
	},

	trackProjectClose(category, categoryIndex) {
		this.pushState(`/portfolio/${category}/${categoryIndex}`, {
			view: 'portfolio-category',
			category: category,
			categoryIndex: categoryIndex
		});
	}
};

window.addEventListener('load', () => {
	HistoryManager.init();
});
