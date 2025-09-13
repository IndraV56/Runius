// Runius Application JavaScript
class RuniusApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.theme = 'light'; // Don't use localStorage initially to avoid sandbox issues
        
        // Initialize data from provided JSON
        this.users = [
            {
                id: 1,
                username: "demo_user",
                email: "demo@runius.com",
                password: "password123",
                name: "Alex Johnson",
                avatar: "/api/placeholder/40/40"
            }
        ];

        this.projects = [
            {
                id: 1,
                name: "Website Redesign",
                description: "Complete overhaul of company website with modern design",
                category: "Design",
                progress: 75,
                deadline: "2025-10-15",
                teamMembers: ["Alex Johnson", "Sarah Smith"],
                tasks: [
                    {id: 1, title: "Create wireframes", completed: true},
                    {id: 2, title: "Design homepage", completed: true},
                    {id: 3, title: "Implement responsive layout", completed: false}
                ],
                createdAt: "2025-09-01"
            },
            {
                id: 2,
                name: "Mobile App Development",
                description: "Native iOS and Android app for project management",
                category: "Development",
                progress: 45,
                deadline: "2025-12-01",
                teamMembers: ["Alex Johnson", "Mike Chen"],
                tasks: [
                    {id: 4, title: "UI/UX Design", completed: true},
                    {id: 5, title: "Backend API", completed: false},
                    {id: 6, title: "Testing", completed: false}
                ],
                createdAt: "2025-08-15"
            }
        ];

        this.worlds = [
            {
                id: 1,
                name: "Aethermoor",
                description: "A mystical realm where magic and technology coexist",
                type: "Fantasy",
                size: "Continental",
                climate: "Temperate",
                population: "10 million",
                locations: [
                    {id: 1, name: "Crystal City", description: "The capital built around a massive crystal formation"},
                    {id: 2, name: "Ironwood Forest", description: "Ancient forest with metal-like trees"}
                ],
                characters: [
                    {id: 1, name: "Lyra Stormwind", role: "Royal Mage", description: "Powerful sorceress and advisor to the king"},
                    {id: 2, name: "Gareth Ironbeard", role: "Master Craftsman", description: "Legendary blacksmith who forges magical weapons"}
                ],
                timeline: [
                    {date: "Year 0", event: "Foundation of Crystal City"},
                    {date: "Year 247", event: "The Great Magic War begins"}
                ],
                createdAt: "2025-08-20"
            },
            {
                id: 2,
                name: "Neo Tokyo 2185",
                description: "Cyberpunk metropolis with towering arcologies and neon-lit streets",
                type: "Sci-Fi",
                size: "Megacity",
                climate: "Urban",
                population: "50 million",
                locations: [
                    {id: 3, name: "Nexus Tower", description: "Central hub for digital consciousness transfers"},
                    {id: 4, name: "Underground Markets", description: "Black market for illegal tech modifications"}
                ],
                characters: [
                    {id: 3, name: "Kai Nakamura", role: "Cyber Detective", description: "Investigates crimes in both physical and virtual realms"},
                    {id: 4, name: "Zero-Nine", role: "AI Hacker", description: "Sentient AI that fights for digital rights"}
                ],
                timeline: [
                    {date: "2150", event: "First successful consciousness upload"},
                    {date: "2172", event: "AI Rights Movement begins"}
                ],
                createdAt: "2025-09-05"
            }
        ];

        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Runius App...');
        this.setupEventListeners();
        this.applyTheme();
        this.showAuthScreen(); // Always start with auth screen for demo
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Authentication - with null checks
        const loginForm = document.getElementById('login-form-element');
        const registerForm = document.getElementById('register-form-element');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        if (showRegister) {
            showRegister.addEventListener('click', (e) => this.showRegisterForm(e));
        }
        
        if (showLogin) {
            showLogin.addEventListener('click', (e) => this.showLoginForm(e));
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const settingsThemeToggle = document.getElementById('settings-theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        if (settingsThemeToggle) {
            settingsThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // User menu
        const userMenuBtn = document.getElementById('user-menu-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', () => this.toggleUserMenu());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }
        
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Dashboard buttons
        const createProjectBtn = document.getElementById('create-project-btn');
        const createWorldBtn = document.getElementById('create-world-btn');
        const newProjectBtn = document.getElementById('new-project-btn');
        const newWorldBtn = document.getElementById('new-world-btn');
        
        if (createProjectBtn) createProjectBtn.addEventListener('click', () => this.openProjectModal());
        if (createWorldBtn) createWorldBtn.addEventListener('click', () => this.openWorldModal());
        if (newProjectBtn) newProjectBtn.addEventListener('click', () => this.openProjectModal());
        if (newWorldBtn) newWorldBtn.addEventListener('click', () => this.openWorldModal());

        // Settings
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Setup modal listeners
        this.setupModalListeners();
    }

    setupModalListeners() {
        const modals = [
            { id: 'project-modal', closeId: 'project-modal-close', cancelId: 'project-cancel', formId: 'project-form' },
            { id: 'world-modal', closeId: 'world-modal-close', cancelId: 'world-cancel', formId: 'world-form' },
            { id: 'project-detail-modal', closeId: 'project-detail-close' },
            { id: 'world-detail-modal', closeId: 'world-detail-close' }
        ];

        modals.forEach(modal => {
            const closeBtn = document.getElementById(modal.closeId);
            const cancelBtn = modal.cancelId ? document.getElementById(modal.cancelId) : null;
            const form = modal.formId ? document.getElementById(modal.formId) : null;
            const modalElement = document.getElementById(modal.id);

            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modal.id));
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.closeModal(modal.id));
            }
            
            if (form && modal.id === 'project-modal') {
                form.addEventListener('submit', (e) => this.handleProjectSubmit(e));
            } else if (form && modal.id === 'world-modal') {
                form.addEventListener('submit', (e) => this.handleWorldSubmit(e));
            }

            if (modalElement) {
                modalElement.addEventListener('click', (e) => {
                    if (e.target === modalElement) {
                        this.closeModal(modal.id);
                    }
                });
            }
        });

        // World detail tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });
    }

    // Authentication Methods
    handleLogin(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const rememberInput = document.getElementById('remember-me');
        
        if (!emailInput || !passwordInput) {
            console.error('Login form elements not found');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const rememberMe = rememberInput ? rememberInput.checked : false;

        console.log('Login attempt:', { email, password: password ? '***' : 'empty' });

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            console.log('Login successful');
            this.currentUser = user;
            this.showMainApp();
            this.showMessage('Login successful!', 'success');
        } else {
            console.log('Login failed');
            this.showMessage('Invalid email or password', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        console.log('Register form submitted');
        
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm').value.trim();

        // Validation
        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showMessage('Email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.users.length + 1,
            username,
            email,
            password,
            name: username,
            avatar: "/api/placeholder/40/40"
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        
        this.showMainApp();
        this.showMessage('Account created successfully!', 'success');
    }

    handleLogout(e) {
        e.preventDefault();
        console.log('Logout clicked');
        this.currentUser = null;
        this.showAuthScreen();
    }

    showAuthScreen() {
        console.log('Showing auth screen');
        const authScreen = document.getElementById('auth-screen');
        const mainApp = document.getElementById('main-app');
        
        if (authScreen) authScreen.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    }

    showMainApp() {
        console.log('Showing main app');
        const authScreen = document.getElementById('auth-screen');
        const mainApp = document.getElementById('main-app');
        
        if (authScreen) authScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        
        this.updateUserInfo();
        this.navigateToPage('dashboard');
    }

    showRegisterForm(e) {
        e.preventDefault();
        console.log('Showing register form');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
    }

    showLoginForm(e) {
        e.preventDefault();
        console.log('Showing login form');
        const registerForm = document.getElementById('register-form');
        const loginForm = document.getElementById('login-form');
        
        if (registerForm) registerForm.classList.add('hidden');
        if (loginForm) loginForm.classList.remove('hidden');
    }

    // Theme Methods
    toggleTheme() {
        console.log('Toggling theme');
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    // Navigation Methods
    handleNavigation(e) {
        e.preventDefault();
        const page = e.target.closest('[data-page]').dataset.page;
        if (page) {
            this.navigateToPage(page);
        }
    }

    navigateToPage(page) {
        console.log('Navigating to page:', page);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Show corresponding page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        const activePage = document.getElementById(`${page}-page`);
        if (activePage) {
            activePage.classList.add('active');
        }

        this.currentPage = page;
        
        // Load page-specific content
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'worlds':
                this.loadWorlds();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // User Interface Methods
    updateUserInfo() {
        if (this.currentUser) {
            const userName = document.getElementById('user-name');
            const welcomeUser = document.getElementById('welcome-user');
            const userAvatarImg = document.getElementById('user-avatar-img');
            
            if (userName) userName.textContent = this.currentUser.name;
            if (welcomeUser) welcomeUser.textContent = this.currentUser.name.split(' ')[0];
            if (userAvatarImg) userAvatarImg.src = this.currentUser.avatar;
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    }

    handleOutsideClick(e) {
        const userMenu = document.querySelector('.user-menu');
        const dropdown = document.getElementById('user-dropdown');
        
        if (userMenu && dropdown && !userMenu.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    }

    // Dashboard Methods
    loadDashboard() {
        this.updateDashboardStats();
        this.loadRecentProjects();
        this.loadRecentWorlds();
    }

    updateDashboardStats() {
        const totalProjectsEl = document.getElementById('total-projects');
        const activeWorldsEl = document.getElementById('active-worlds');
        const teamMembersEl = document.getElementById('team-members');
        
        if (totalProjectsEl) totalProjectsEl.textContent = this.projects.length;
        if (activeWorldsEl) activeWorldsEl.textContent = this.worlds.length;
        
        // Calculate unique team members
        const allMembers = new Set();
        this.projects.forEach(project => {
            project.teamMembers.forEach(member => allMembers.add(member));
        });
        if (teamMembersEl) teamMembersEl.textContent = allMembers.size;
    }

    loadRecentProjects() {
        const container = document.getElementById('recent-projects');
        if (!container) return;
        
        container.innerHTML = '';
        this.projects.slice(0, 3).forEach(project => {
            const projectCard = this.createProjectCard(project);
            container.appendChild(projectCard);
        });
    }

    loadRecentWorlds() {
        const container = document.getElementById('recent-worlds');
        if (!container) return;
        
        container.innerHTML = '';
        this.worlds.slice(0, 3).forEach(world => {
            const worldCard = this.createWorldCard(world);
            container.appendChild(worldCard);
        });
    }

    // Projects Methods
    loadProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;
        
        container.innerHTML = '';
        this.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            container.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h4>${project.name}</h4>
            <p>${project.description}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress}%"></div>
            </div>
            <div class="project-meta">
                <span>${project.category}</span>
                <span>${project.progress}% complete</span>
            </div>
        `;
        
        card.addEventListener('click', () => this.openProjectDetail(project));
        return card;
    }

    openProjectModal(project = null) {
        const modal = document.getElementById('project-modal');
        const title = document.getElementById('project-modal-title');
        const form = document.getElementById('project-form');
        
        if (!modal || !title || !form) return;
        
        if (project) {
            title.textContent = 'Edit Project';
            form.dataset.projectId = project.id;
            
            const nameInput = document.getElementById('project-name');
            const descInput = document.getElementById('project-description');
            const catInput = document.getElementById('project-category');
            const deadlineInput = document.getElementById('project-deadline');
            
            if (nameInput) nameInput.value = project.name;
            if (descInput) descInput.value = project.description;
            if (catInput) catInput.value = project.category;
            if (deadlineInput) deadlineInput.value = project.deadline;
        } else {
            title.textContent = 'Create New Project';
            form.removeAttribute('data-project-id');
            form.reset();
        }
        
        this.showModal('project-modal');
    }

    handleProjectSubmit(e) {
        e.preventDefault();
        console.log('Project form submitted');
        
        const form = e.target;
        const projectId = form.dataset.projectId;
        
        const nameInput = document.getElementById('project-name');
        const descInput = document.getElementById('project-description');
        const catInput = document.getElementById('project-category');
        const deadlineInput = document.getElementById('project-deadline');
        
        if (!nameInput || !descInput || !catInput || !deadlineInput) return;
        
        const projectData = {
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            category: catInput.value,
            deadline: deadlineInput.value,
            progress: 0,
            teamMembers: [this.currentUser.name],
            tasks: [],
            createdAt: new Date().toISOString().split('T')[0]
        };

        if (projectId) {
            // Update existing project
            const project = this.projects.find(p => p.id == projectId);
            if (project) {
                Object.assign(project, projectData);
            }
        } else {
            // Create new project
            projectData.id = this.projects.length + 1;
            this.projects.push(projectData);
        }

        this.closeModal('project-modal');
        this.showMessage('Project saved successfully!', 'success');
        
        if (this.currentPage === 'projects') {
            this.loadProjects();
        } else {
            this.loadDashboard();
        }
    }

    openProjectDetail(project) {
        const titleEl = document.getElementById('project-detail-title');
        const descEl = document.getElementById('project-detail-description');
        const catEl = document.getElementById('project-detail-category');
        const deadlineEl = document.getElementById('project-detail-deadline');
        const progressEl = document.getElementById('project-detail-progress');
        
        if (titleEl) titleEl.textContent = project.name;
        if (descEl) descEl.textContent = project.description;
        if (catEl) catEl.textContent = project.category;
        if (deadlineEl) deadlineEl.textContent = new Date(project.deadline).toLocaleDateString();
        if (progressEl) progressEl.textContent = project.progress;
        
        this.loadProjectTasks(project);
        this.showModal('project-detail-modal');
    }

    loadProjectTasks(project) {
        const container = document.getElementById('project-tasks-list');
        if (!container) return;
        
        container.innerHTML = '';
        project.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       data-project-id="${project.id}" data-task-id="${task.id}">
                <h5 class="task-title">${task.title}</h5>
            `;
            
            const checkbox = taskItem.querySelector('.task-checkbox');
            checkbox.addEventListener('change', (e) => {
                this.toggleTask(parseInt(e.target.dataset.projectId), parseInt(e.target.dataset.taskId));
            });
            
            container.appendChild(taskItem);
        });
    }

    toggleTask(projectId, taskId) {
        console.log('Toggling task:', projectId, taskId);
        
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        task.completed = !task.completed;
        
        // Update progress
        const completedTasks = project.tasks.filter(t => t.completed).length;
        project.progress = Math.round((completedTasks / project.tasks.length) * 100);
        
        this.loadProjectTasks(project);
        
        // Update progress in detail view
        const progressEl = document.getElementById('project-detail-progress');
        if (progressEl) progressEl.textContent = project.progress;
        
        // Refresh current page view
        if (this.currentPage === 'projects') {
            setTimeout(() => this.loadProjects(), 300);
        } else if (this.currentPage === 'dashboard') {
            setTimeout(() => this.loadDashboard(), 300);
        }
    }

    // Worlds Methods
    loadWorlds() {
        const container = document.getElementById('worlds-grid');
        if (!container) return;
        
        container.innerHTML = '';
        this.worlds.forEach(world => {
            const worldCard = this.createWorldCard(world);
            container.appendChild(worldCard);
        });
    }

    createWorldCard(world) {
        const card = document.createElement('div');
        card.className = 'world-card';
        card.innerHTML = `
            <h4>${world.name}</h4>
            <p>${world.description}</p>
            <div class="world-meta">
                <span>${world.type}</span>
                <span>${world.size}</span>
            </div>
        `;
        
        card.addEventListener('click', () => this.openWorldDetail(world));
        return card;
    }

    openWorldModal(world = null) {
        const modal = document.getElementById('world-modal');
        const title = document.getElementById('world-modal-title');
        const form = document.getElementById('world-form');
        
        if (!modal || !title || !form) return;
        
        if (world) {
            title.textContent = 'Edit World';
            form.dataset.worldId = world.id;
            
            const nameInput = document.getElementById('world-name');
            const descInput = document.getElementById('world-description');
            const typeInput = document.getElementById('world-type');
            const sizeInput = document.getElementById('world-size');
            
            if (nameInput) nameInput.value = world.name;
            if (descInput) descInput.value = world.description;
            if (typeInput) typeInput.value = world.type;
            if (sizeInput) sizeInput.value = world.size;
        } else {
            title.textContent = 'Create New World';
            form.removeAttribute('data-world-id');
            form.reset();
        }
        
        this.showModal('world-modal');
    }

    handleWorldSubmit(e) {
        e.preventDefault();
        console.log('World form submitted');
        
        const form = e.target;
        const worldId = form.dataset.worldId;
        
        const nameInput = document.getElementById('world-name');
        const descInput = document.getElementById('world-description');
        const typeInput = document.getElementById('world-type');
        const sizeInput = document.getElementById('world-size');
        
        if (!nameInput || !descInput || !typeInput || !sizeInput) return;
        
        const worldData = {
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            type: typeInput.value,
            size: sizeInput.value,
            climate: 'Temperate',
            population: '1 million',
            locations: [],
            characters: [],
            timeline: [],
            createdAt: new Date().toISOString().split('T')[0]
        };

        if (worldId) {
            // Update existing world
            const world = this.worlds.find(w => w.id == worldId);
            if (world) {
                Object.assign(world, worldData);
            }
        } else {
            // Create new world
            worldData.id = this.worlds.length + 1;
            this.worlds.push(worldData);
        }

        this.closeModal('world-modal');
        this.showMessage('World saved successfully!', 'success');
        
        if (this.currentPage === 'worlds') {
            this.loadWorlds();
        } else {
            this.loadDashboard();
        }
    }

    openWorldDetail(world) {
        const titleEl = document.getElementById('world-detail-title');
        if (titleEl) titleEl.textContent = world.name;
        
        this.currentWorld = world;
        this.loadWorldOverview(world);
        this.loadWorldLocations(world);
        this.loadWorldCharacters(world);
        this.loadWorldTimeline(world);
        this.showModal('world-detail-modal');
    }

    switchTab(e) {
        const tabName = e.target.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    loadWorldOverview(world) {
        const container = document.getElementById('world-overview');
        if (!container) return;
        
        container.innerHTML = `
            <h4>${world.name}</h4>
            <p><strong>Type:</strong> ${world.type}</p>
            <p><strong>Size:</strong> ${world.size}</p>
            <p><strong>Climate:</strong> ${world.climate}</p>
            <p><strong>Population:</strong> ${world.population}</p>
            <p><strong>Description:</strong> ${world.description}</p>
        `;
    }

    loadWorldLocations(world) {
        const container = document.getElementById('world-locations-list');
        if (!container) return;
        
        container.innerHTML = '';
        world.locations.forEach(location => {
            const locationItem = document.createElement('div');
            locationItem.className = 'location-item';
            locationItem.innerHTML = `
                <h5>${location.name}</h5>
                <p>${location.description}</p>
            `;
            container.appendChild(locationItem);
        });
    }

    loadWorldCharacters(world) {
        const container = document.getElementById('world-characters-list');
        if (!container) return;
        
        container.innerHTML = '';
        world.characters.forEach(character => {
            const characterItem = document.createElement('div');
            characterItem.className = 'character-item';
            characterItem.innerHTML = `
                <h5>${character.name}</h5>
                <div class="character-role">${character.role}</div>
                <p>${character.description}</p>
            `;
            container.appendChild(characterItem);
        });
    }

    loadWorldTimeline(world) {
        const container = document.getElementById('world-timeline-list');
        if (!container) return;
        
        container.innerHTML = '';
        world.timeline.forEach(event => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-date">${event.date}</div>
                <p>${event.event}</p>
            `;
            container.appendChild(timelineItem);
        });
    }

    // Settings Methods
    loadSettings() {
        if (this.currentUser) {
            const nameInput = document.getElementById('profile-name');
            const emailInput = document.getElementById('profile-email');
            
            if (nameInput) nameInput.value = this.currentUser.name;
            if (emailInput) emailInput.value = this.currentUser.email;
        }
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('profile-name');
        const emailInput = document.getElementById('profile-email');
        
        if (!nameInput || !emailInput || !this.currentUser) return;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        this.currentUser.name = name;
        this.currentUser.email = email;
        this.updateUserInfo();
        this.showMessage('Profile updated successfully!', 'success');
    }

    // Modal Methods
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('hidden');
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 250);
    }

    // Utility Methods
    showMessage(text, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `message message--${type}`;
        message.textContent = text;
        
        // Insert at the beginning of the current page
        const currentPageElement = document.querySelector('.page.active');
        if (currentPageElement) {
            currentPageElement.insertBefore(message, currentPageElement.firstChild);
        } else {
            // Fallback to auth screen
            const authForm = document.querySelector('.auth-form:not(.hidden)');
            if (authForm) {
                authForm.insertBefore(message, authForm.firstChild);
            }
        }
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize the application
const app = new RuniusApp();