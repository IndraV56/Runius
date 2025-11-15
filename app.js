// Application State
let appState = {
  currentUser: null,
  currentView: 'dashboard',
  theme: 'light',
  projects: [],
  tasks: [],
  currentProject: null,
  editingProject: null,
  editingTask: null
};

// Sample Data
const sampleProjects = [
  {
    id: 1,
    name: "E-Commerce Platform",
    description: "Build a modern e-commerce website with payment integration",
    status: "In Progress",
    progress: 65,
    start_date: "2025-10-01",
    end_date: "2025-12-15",
    tech_stack: {
      frontend: ["React", "Tailwind CSS", "Redux"],
      backend: ["Node.js", "Express"],
      database: ["PostgreSQL"],
      devops: ["Docker", "AWS"]
    },
    team_members: ["John Doe", "Jane Smith"]
  },
  {
    id: 2,
    name: "Mobile Banking App",
    description: "iOS and Android banking application with biometric authentication",
    status: "Planning",
    progress: 15,
    start_date: "2025-11-01",
    end_date: "2026-03-30",
    tech_stack: {
      frontend: ["React Native", "TypeScript"],
      backend: ["Java", "Spring Boot"],
      database: ["MongoDB"],
      devops: ["Jenkins", "Azure"]
    },
    team_members: ["Mike Johnson", "Sarah Williams"]
  },
  {
    id: 3,
    name: "AI Chatbot Integration",
    description: "Implement AI-powered customer service chatbot",
    status: "In Progress",
    progress: 40,
    start_date: "2025-09-15",
    end_date: "2025-11-30",
    tech_stack: {
      frontend: ["Vue.js"],
      backend: ["Python", "FastAPI"],
      database: ["Redis"],
      tools: ["OpenAI API", "Langchain"]
    },
    team_members: ["Alex Brown"]
  },
  {
    id: 4,
    name: "Data Analytics Dashboard",
    description: "Real-time business intelligence dashboard",
    status: "Completed",
    progress: 100,
    start_date: "2025-07-01",
    end_date: "2025-09-30",
    tech_stack: {
      frontend: ["Angular", "D3.js"],
      backend: ["Python", "Django"],
      database: ["MySQL"],
      devops: ["Kubernetes"]
    },
    team_members: ["Emily Davis", "Chris Martinez"]
  }
];

const sampleTasks = [
  {
    id: 1,
    project_id: 1,
    title: "Design homepage mockup",
    description: "Create initial design mockups for homepage",
    priority: "High",
    status: "Done",
    assigned_to: "Jane Smith",
    due_date: "2025-10-15"
  },
  {
    id: 2,
    project_id: 1,
    title: "Implement payment gateway",
    description: "Integrate Stripe payment processing",
    priority: "High",
    status: "In Progress",
    assigned_to: "John Doe",
    due_date: "2025-11-20"
  },
  {
    id: 3,
    project_id: 1,
    title: "Set up product database",
    description: "Create PostgreSQL schema for products",
    priority: "Medium",
    status: "Done",
    assigned_to: "John Doe",
    due_date: "2025-10-25"
  },
  {
    id: 4,
    project_id: 2,
    title: "Research biometric SDKs",
    description: "Evaluate available biometric authentication libraries",
    priority: "High",
    status: "In Progress",
    assigned_to: "Mike Johnson",
    due_date: "2025-11-15"
  },
  {
    id: 5,
    project_id: 3,
    title: "Train AI model",
    description: "Fine-tune language model on company data",
    priority: "High",
    status: "In Progress",
    assigned_to: "Alex Brown",
    due_date: "2025-11-10"
  },
  {
    id: 6,
    project_id: 1,
    title: "Write API documentation",
    description: "Document all REST API endpoints",
    priority: "Low",
    status: "To Do",
    assigned_to: "John Doe",
    due_date: "2025-12-01"
  }
];

const workflowStages = [
  { id: 1, title: "Planning", icon: "📋", subtitle: "Requirements" },
  { id: 2, title: "Design", icon: "🎨", subtitle: "Prototyping" },
  { id: 3, title: "Development", icon: "💻", subtitle: "Building" },
  { id: 4, title: "Testing", icon: "🧪", subtitle: "QA" },
  { id: 5, title: "Deployment", icon: "🚀", subtitle: "Release" },
  { id: 6, title: "Maintenance", icon: "🔧", subtitle: "Support" }
];

// Initialize Application
function initializeApp() {
  appState.projects = [...sampleProjects];
  appState.tasks = [...sampleTasks];
  
  // Check for saved theme preference
  const savedTheme = appState.theme || 'light';
  setTheme(savedTheme);
  
  setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Logout Button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Navigation
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.target.dataset.view;
      switchView(view);
    });
  });
  
  // Project Form
  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', handleProjectSubmit);
  }
  
  // Task Form
  const taskForm = document.getElementById('taskForm');
  if (taskForm) {
    taskForm.addEventListener('submit', handleTaskSubmit);
  }
  
  // Filters
  const projectFilter = document.getElementById('projectFilter');
  if (projectFilter) {
    projectFilter.addEventListener('change', renderProjects);
  }
  
  const projectSearch = document.getElementById('projectSearch');
  if (projectSearch) {
    projectSearch.addEventListener('input', renderProjects);
  }
  
  const taskFilter = document.getElementById('taskFilter');
  if (taskFilter) {
    taskFilter.addEventListener('change', renderTasks);
  }
  
  const priorityFilter = document.getElementById('priorityFilter');
  if (priorityFilter) {
    priorityFilter.addEventListener('change', renderTasks);
  }
  
  const workflowTemplate = document.getElementById('workflowTemplate');
  if (workflowTemplate) {
    workflowTemplate.addEventListener('change', renderWorkflow);
  }
  
  // Project Detail Tabs
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      const tabs = document.querySelectorAll('.tab-btn');
      tabs.forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      const tabName = e.target.dataset.tab;
      renderProjectDetailTab(tabName);
    }
  });
}

// Login Handler
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  // Simple authentication
  if (username === 'admin' && password === 'admin123') {
    appState.currentUser = username;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('userDisplayName').textContent = username;
    document.getElementById('welcomeUserName').textContent = username;
    
    showToast('Welcome to Runius!');
    renderDashboard();
    renderProjects();
    renderTasks();
    renderSchedule();
    renderWorkflow();
    renderAnalytics();
  } else {
    showToast('Invalid credentials. Try admin/admin123');
  }
}

// Logout Handler
function handleLogout() {
  appState.currentUser = null;
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginForm').reset();
  showToast('Logged out successfully');
}

// Theme Toggle
function toggleTheme() {
  const newTheme = appState.theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function setTheme(theme) {
  appState.theme = theme;
  document.documentElement.setAttribute('data-color-scheme', theme);
  
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  if (theme === 'dark') {
    sunIcon?.classList.add('hidden');
    moonIcon?.classList.remove('hidden');
  } else {
    sunIcon?.classList.remove('hidden');
    moonIcon?.classList.add('hidden');
  }
}

// View Switching
function switchView(viewName) {
  appState.currentView = viewName;
  
  // Update nav buttons
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    if (btn.dataset.view === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update view containers
  const views = document.querySelectorAll('.view-container');
  views.forEach(view => view.classList.remove('active'));
  
  const activeView = document.getElementById(`${viewName}View`);
  if (activeView) {
    activeView.classList.add('active');
  }
}

// Dashboard Rendering
function renderDashboard() {
  const totalProjects = appState.projects.length;
  const activeTasks = appState.tasks.filter(t => t.status !== 'Done').length;
  const completedTasks = appState.tasks.filter(t => t.status === 'Done').length;
  const upcomingDeadlines = appState.tasks.filter(t => {
    const dueDate = new Date(t.due_date);
    const today = new Date();
    const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).length;
  
  document.getElementById('totalProjects').textContent = totalProjects;
  document.getElementById('activeTasks').textContent = activeTasks;
  document.getElementById('completedTasks').textContent = completedTasks;
  document.getElementById('upcomingDeadlines').textContent = upcomingDeadlines;
  
  // Project Overview
  const overviewList = document.getElementById('projectOverviewList');
  const activeProjects = appState.projects.filter(p => p.status === 'In Progress').slice(0, 5);
  
  overviewList.innerHTML = activeProjects.map(project => `
    <div class="project-overview-item" onclick="viewProjectDetail(${project.id})">
      <h4>${project.name}</h4>
      <p>Progress: ${project.progress}% • Due: ${formatDate(project.end_date)}</p>
    </div>
  `).join('');
}

// Projects Rendering
function renderProjects() {
  const projectsList = document.getElementById('projectsList');
  const filterValue = document.getElementById('projectFilter')?.value || 'all';
  const searchValue = document.getElementById('projectSearch')?.value.toLowerCase() || '';
  
  let filteredProjects = appState.projects;
  
  if (filterValue !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.status === filterValue);
  }
  
  if (searchValue) {
    filteredProjects = filteredProjects.filter(p => 
      p.name.toLowerCase().includes(searchValue) || 
      p.description.toLowerCase().includes(searchValue)
    );
  }
  
  projectsList.innerHTML = filteredProjects.map(project => `
    <div class="project-card" onclick="viewProjectDetail(${project.id})">
      <div class="project-card-header">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
      </div>
      <div class="project-meta">
        <span class="project-status ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
        <span class="project-dates">📅 ${formatDate(project.start_date)} - ${formatDate(project.end_date)}</span>
      </div>
      <div class="progress-container">
        <div class="progress-header">
          <span>Progress</span>
          <span>${project.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${project.progress}%"></div>
        </div>
      </div>
    </div>
  `).join('');
}

// Tasks Rendering
function renderTasks() {
  const tasksList = document.getElementById('tasksList');
  const statusFilter = document.getElementById('taskFilter')?.value || 'all';
  const priorityFilter = document.getElementById('priorityFilter')?.value || 'all';
  
  let filteredTasks = appState.tasks;
  
  if (statusFilter !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
  }
  
  if (priorityFilter !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
  }
  
  tasksList.innerHTML = filteredTasks.map(task => {
    const project = appState.projects.find(p => p.id === task.project_id);
    return `
      <div class="task-card">
        <div class="task-header">
          <h4>${task.title}</h4>
          <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
        </div>
        <p class="task-description">${task.description}</p>
        <div class="task-meta">
          <span class="task-meta-item">📂 ${project?.name || 'Unknown'}</span>
          <span class="task-meta-item">👤 ${task.assigned_to}</span>
          <span class="task-meta-item">📅 ${formatDate(task.due_date)}</span>
          <span class="task-meta-item">Status: ${task.status}</span>
        </div>
        <div class="task-actions">
          ${task.status !== 'Done' ? `<button class="task-btn" onclick="toggleTaskStatus(${task.id})">✓ Mark Done</button>` : ''}
          <button class="task-btn" onclick="editTask(${task.id})">Edit</button>
          <button class="task-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

// Schedule Rendering
function renderSchedule() {
  renderCalendar();
  renderGanttChart();
}

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Task dates
  const taskDates = new Set(appState.tasks.map(t => t.due_date));
  
  let calendarHTML = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
    `<div class="calendar-header">${day}</div>`
  ).join('');
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarHTML += '<div class="calendar-day"></div>';
  }
  
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasEvent = taskDates.has(dateStr);
    const isToday = day === today.getDate() && currentMonth === today.getMonth();
    
    let classes = 'calendar-day';
    if (hasEvent) classes += ' has-event';
    if (isToday) classes += ' today';
    
    calendarHTML += `<div class="${classes}">${day}</div>`;
  }
  
  calendar.innerHTML = calendarHTML;
}

function renderGanttChart() {
  const ganttChart = document.getElementById('ganttChart');
  const today = new Date();
  
  const ganttHTML = appState.projects.map(project => {
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    const progressPercent = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));
    
    return `
      <div class="gantt-row">
        <div class="gantt-label">${project.name}</div>
        <div class="gantt-bar-container">
          <div class="gantt-bar" style="left: 0; width: ${project.progress}%">
            ${project.progress}%
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  ganttChart.innerHTML = ganttHTML;
}

// Workflow Rendering
function renderWorkflow() {
  const workflowDiagram = document.getElementById('workflowDiagram');
  const template = document.getElementById('workflowTemplate')?.value || 'waterfall';
  
  let stages = workflowStages;
  
  if (template === 'agile') {
    stages = [
      { id: 1, title: "Sprint Planning", icon: "📋", subtitle: "Backlog" },
      { id: 2, title: "Development", icon: "💻", subtitle: "Sprint" },
      { id: 3, title: "Daily Standup", icon: "🗣️", subtitle: "Sync" },
      { id: 4, title: "Review", icon: "👀", subtitle: "Demo" },
      { id: 5, title: "Retrospective", icon: "🔄", subtitle: "Improve" }
    ];
  } else if (template === 'kanban') {
    stages = [
      { id: 1, title: "Backlog", icon: "📥", subtitle: "Ideas" },
      { id: 2, title: "To Do", icon: "📋", subtitle: "Ready" },
      { id: 3, title: "In Progress", icon: "⚙️", subtitle: "Working" },
      { id: 4, title: "Review", icon: "👁️", subtitle: "Testing" },
      { id: 5, title: "Done", icon: "✅", subtitle: "Complete" }
    ];
  }
  
  const stagesHTML = stages.map((stage, index) => {
    const arrow = index < stages.length - 1 ? '<div class="workflow-arrow">→</div>' : '';
    return `
      <div class="workflow-stage">
        <div class="workflow-stage-icon">${stage.icon}</div>
        <div class="workflow-stage-title">${stage.title}</div>
        <div class="workflow-stage-subtitle">${stage.subtitle}</div>
      </div>
      ${arrow}
    `;
  }).join('');
  
  workflowDiagram.innerHTML = `<div class="workflow-container">${stagesHTML}</div>`;
}

// Analytics Rendering
function renderAnalytics() {
  renderProjectStatusChart();
  renderTaskPriorityChart();
  renderProjectProgressChart();
  renderTaskTimelineChart();
}

function renderProjectStatusChart() {
  const ctx = document.getElementById('projectStatusChart');
  if (!ctx) return;
  
  const statusCounts = {};
  appState.projects.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function renderTaskPriorityChart() {
  const ctx = document.getElementById('taskPriorityChart');
  if (!ctx) return;
  
  const priorityCounts = { High: 0, Medium: 0, Low: 0 };
  appState.tasks.forEach(t => {
    priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
  });
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(priorityCounts),
      datasets: [{
        label: 'Tasks',
        data: Object.values(priorityCounts),
        backgroundColor: ['#B4413C', '#FFC185', '#1FB8CD']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function renderProjectProgressChart() {
  const ctx = document.getElementById('projectProgressChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: appState.projects.map(p => p.name),
      datasets: [{
        label: 'Progress (%)',
        data: appState.projects.map(p => p.progress),
        backgroundColor: '#52b788'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function renderTaskTimelineChart() {
  const ctx = document.getElementById('taskTimelineChart');
  if (!ctx) return;
  
  const statusCounts = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
  appState.tasks.forEach(t => {
    statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
  });
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#FFC185', '#1FB8CD', '#5D878F']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Project Detail View
function viewProjectDetail(projectId) {
  const project = appState.projects.find(p => p.id === projectId);
  if (!project) return;
  
  appState.currentProject = project;
  
  const modal = document.getElementById('projectDetailModal');
  document.getElementById('projectDetailName').textContent = project.name;
  
  // Reset tabs
  const tabs = modal.querySelectorAll('.tab-btn');
  tabs.forEach(tab => tab.classList.remove('active'));
  tabs[0].classList.add('active');
  
  renderProjectDetailTab('overview');
  modal.classList.add('active');
}

function renderProjectDetailTab(tabName) {
  const content = document.getElementById('projectDetailContent');
  const project = appState.currentProject;
  
  if (tabName === 'overview') {
    content.innerHTML = `
      <div style="display: grid; gap: 16px;">
        <div>
          <h4 style="margin-bottom: 8px; color: var(--color-text-secondary);">Description</h4>
          <p>${project.description}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <h4 style="margin-bottom: 8px; color: var(--color-text-secondary);">Status</h4>
            <span class="project-status ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
          </div>
          <div>
            <h4 style="margin-bottom: 8px; color: var(--color-text-secondary);">Progress</h4>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress}%"></div>
              </div>
              <span style="font-size: 12px; margin-top: 4px; display: block;">${project.progress}%</span>
            </div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <h4 style="margin-bottom: 8px; color: var(--color-text-secondary);">Start Date</h4>
            <p>${formatDate(project.start_date)}</p>
          </div>
          <div>
            <h4 style="margin-bottom: 8px; color: var(--color-text-secondary);">End Date</h4>
            <p>${formatDate(project.end_date)}</p>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'techstack') {
    const techStackHTML = Object.entries(project.tech_stack).map(([category, technologies]) => `
      <div class="tech-category">
        <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
        <div class="tech-chips">
          ${technologies.map(tech => `<span class="tech-chip">${tech}</span>`).join('')}
        </div>
      </div>
    `).join('');
    
    content.innerHTML = `<div class="tech-stack-grid">${techStackHTML}</div>`;
  } else if (tabName === 'projectTasks') {
    const projectTasks = appState.tasks.filter(t => t.project_id === project.id);
    content.innerHTML = projectTasks.map(task => `
      <div class="task-card" style="margin-bottom: 12px;">
        <div class="task-header">
          <h4>${task.title}</h4>
          <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
        </div>
        <p class="task-description">${task.description}</p>
        <div class="task-meta">
          <span class="task-meta-item">👤 ${task.assigned_to}</span>
          <span class="task-meta-item">📅 ${formatDate(task.due_date)}</span>
          <span class="task-meta-item">Status: ${task.status}</span>
        </div>
      </div>
    `).join('') || '<p>No tasks for this project yet.</p>';
  } else if (tabName === 'team') {
    content.innerHTML = `
      <div class="team-list">
        ${project.team_members.map(member => `
          <div class="team-member">
            <div class="team-member-avatar">${member.charAt(0).toUpperCase()}</div>
            <span>${member}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

function closeProjectDetail() {
  document.getElementById('projectDetailModal').classList.remove('active');
}

// Project Modal
function showCreateProjectModal() {
  appState.editingProject = null;
  document.getElementById('projectModalTitle').textContent = 'Create New Project';
  document.getElementById('projectForm').reset();
  document.getElementById('projectModal').classList.add('active');
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('active');
}

function handleProjectSubmit(e) {
  e.preventDefault();
  
  const projectData = {
    name: document.getElementById('projectName').value,
    description: document.getElementById('projectDescription').value,
    status: document.getElementById('projectStatus').value,
    progress: parseInt(document.getElementById('projectProgress').value),
    start_date: document.getElementById('projectStartDate').value,
    end_date: document.getElementById('projectEndDate').value,
    tech_stack: { frontend: [], backend: [], database: [], devops: [] },
    team_members: []
  };
  
  if (appState.editingProject) {
    const index = appState.projects.findIndex(p => p.id === appState.editingProject.id);
    appState.projects[index] = { ...appState.editingProject, ...projectData };
    showToast('Project updated successfully!');
  } else {
    const newProject = {
      id: Date.now(),
      ...projectData
    };
    appState.projects.push(newProject);
    showToast('Project created successfully!');
  }
  
  closeProjectModal();
  renderProjects();
  renderDashboard();
}

// Task Modal
function showCreateTaskModal() {
  appState.editingTask = null;
  document.getElementById('taskModalTitle').textContent = 'Create New Task';
  document.getElementById('taskForm').reset();
  
  // Populate project dropdown
  const projectSelect = document.getElementById('taskProject');
  projectSelect.innerHTML = appState.projects.map(p => 
    `<option value="${p.id}">${p.name}</option>`
  ).join('');
  
  document.getElementById('taskModal').classList.add('active');
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.remove('active');
}

function handleTaskSubmit(e) {
  e.preventDefault();
  
  const taskData = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    project_id: parseInt(document.getElementById('taskProject').value),
    priority: document.getElementById('taskPriority').value,
    status: document.getElementById('taskStatus').value,
    assigned_to: document.getElementById('taskAssignedTo').value,
    due_date: document.getElementById('taskDueDate').value
  };
  
  if (appState.editingTask) {
    const index = appState.tasks.findIndex(t => t.id === appState.editingTask.id);
    appState.tasks[index] = { ...appState.editingTask, ...taskData };
    showToast('Task updated successfully!');
  } else {
    const newTask = {
      id: Date.now(),
      ...taskData
    };
    appState.tasks.push(newTask);
    showToast('Task created successfully!');
  }
  
  closeTaskModal();
  renderTasks();
  renderDashboard();
  renderSchedule();
}

function editTask(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;
  
  appState.editingTask = task;
  document.getElementById('taskModalTitle').textContent = 'Edit Task';
  
  // Populate form
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description;
  document.getElementById('taskPriority').value = task.priority;
  document.getElementById('taskStatus').value = task.status;
  document.getElementById('taskAssignedTo').value = task.assigned_to;
  document.getElementById('taskDueDate').value = task.due_date;
  
  // Populate project dropdown
  const projectSelect = document.getElementById('taskProject');
  projectSelect.innerHTML = appState.projects.map(p => 
    `<option value="${p.id}" ${p.id === task.project_id ? 'selected' : ''}>${p.name}</option>`
  ).join('');
  
  document.getElementById('taskModal').classList.add('active');
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    appState.tasks = appState.tasks.filter(t => t.id !== taskId);
    showToast('Task deleted successfully!');
    renderTasks();
    renderDashboard();
  }
}

function toggleTaskStatus(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = 'Done';
    showToast('Task marked as complete!');
    renderTasks();
    renderDashboard();
  }
}

// Utility Functions
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showForgotPassword(e) {
  e.preventDefault();
  showToast('Password reset link would be sent to your email');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeApp);