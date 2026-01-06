// Enhanced Projects Data Structure with localStorage persistence
let projects = [];

// Initialize projects from localStorage or default data
function initializeProjects() {
    const savedProjects = localStorage.getItem('fountain-projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    } else {
        // Default projects with enhanced structure
        projects = [
            { id: '1', name: "Fountain Onboarding", progress: "in progress", link: "https://fountain-onboarding-n6vod5aah-daniel-8982s-projects.vercel.app/", description: "", category: "Web App", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '2', name: "itemized receipts", progress: "blocked", link: "https://itemized-receipt-builder.vercel.app/", description: "", category: "Tool", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '3', name: "document scrapper", progress: "in progress", link: "https://doc-extraction.vercel.app/", description: "", category: "Tool", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '4', name: "data visualization", progress: "in progress", link: "https://data-visualization-7szrf1s6a-daniel-8982s-projects.vercel.app/", description: "", category: "Web App", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '5', name: "docusign generator", progress: "complete", link: "https://docusign-mauve.vercel.app/", description: "", category: "Tool", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '6', name: "world clock", progress: "complete", link: "https://time-clock-extension-oytxql0ph-daniel-8982s-projects.vercel.app/", description: "", category: "Extension", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '7', name: "refund calculator", progress: "in progress", link: "https://refund-calculator-five.vercel.app/", description: "", category: "Tool", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '8', name: "grammarguard", progress: "in progress", link: "https://grammarguard.vercel.app/", description: "", category: "Extension", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '9', name: "Fountain Macro Assistant", progress: "in progress", link: "https://fountain-macro-assistant.vercel.app/", description: "", category: "Extension", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '10', name: "Fountain SEO", progress: "in progress", link: "https://seo-test-chi.vercel.app/", description: "", category: "Web App", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '11', name: "availability report", progress: "in progress", link: "https://website-puce-rho-32.vercel.app/", description: "", category: "Tool", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
        saveProjects();
    }
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('fountain-projects', JSON.stringify(projects));
    updateStatistics();
}

// Activity log
let activityLog = JSON.parse(localStorage.getItem('fountain-activity-log') || '[]');

function logActivity(action, projectName) {
    activityLog.unshift({
        action,
        projectName,
        timestamp: new Date().toISOString()
    });
    if (activityLog.length > 50) activityLog = activityLog.slice(0, 50);
    localStorage.setItem('fountain-activity-log', JSON.stringify(activityLog));
    renderActivityTimeline();
}

// Statistics
let stats = { total: 0, inProgress: 0, blocked: 0, complete: 0 };

function updateStatistics() {
    stats.total = projects.length;
    stats.inProgress = projects.filter(p => p.progress === 'in progress').length;
    stats.blocked = projects.filter(p => p.progress === 'blocked').length;
    stats.complete = projects.filter(p => p.progress === 'complete').length;
    renderStatistics();
}

// Render statistics dashboard
function renderStatistics() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    const progressPercent = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
    const activeStatus = currentFilter.status;
    
    statsContainer.innerHTML = `
        <div class="stat-card stat-filter ${activeStatus === 'all' ? 'active' : ''}" data-filter="all" onclick="filterByStatus('all')">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Total Projects</div>
        </div>
        <div class="stat-card stat-in-progress stat-filter ${activeStatus === 'in progress' ? 'active' : ''}" data-filter="in progress" onclick="filterByStatus('in progress')">
            <div class="stat-value">${stats.inProgress}</div>
            <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-card stat-blocked stat-filter ${activeStatus === 'blocked' ? 'active' : ''}" data-filter="blocked" onclick="filterByStatus('blocked')">
            <div class="stat-value">${stats.blocked}</div>
            <div class="stat-label">Blocked</div>
        </div>
        <div class="stat-card stat-complete stat-filter ${activeStatus === 'complete' ? 'active' : ''}" data-filter="complete" onclick="filterByStatus('complete')">
            <div class="stat-value">${stats.complete}</div>
            <div class="stat-label">Complete</div>
        </div>
        <div class="stat-card stat-progress">
            <div class="stat-value">${progressPercent}%</div>
            <div class="stat-label">Completion</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
        </div>
    `;
}

// Filter by status from stat card click
function filterByStatus(status) {
    currentFilter.status = status;
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.value = status;
    }
    renderStatistics();
    renderProjects();
}

// Filter and search
let currentFilter = { status: 'all', category: 'all', search: '' };

function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    
    currentFilter = { status: statusFilter, category: categoryFilter, search: searchTerm };
    renderStatistics(); // Update stat cards to show active filter
    renderProjects();
}

// Render projects with filtering
function renderProjects() {
    const tbody = document.getElementById('projects-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let filteredProjects = projects.filter(project => {
        const matchesSearch = !currentFilter.search || 
            project.name.toLowerCase().includes(currentFilter.search) ||
            (project.description && project.description.toLowerCase().includes(currentFilter.search));
        const matchesStatus = currentFilter.status === 'all' || project.progress === currentFilter.status;
        const matchesCategory = currentFilter.category === 'all' || project.category === currentFilter.category;
        return matchesSearch && matchesStatus && matchesCategory;
    });
    
    if (filteredProjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No projects found</td></tr>';
        return;
    }
    
    filteredProjects.forEach(project => {
        const row = document.createElement('tr');
        row.dataset.projectId = project.id;
        row.className = 'project-row';
        
        // Checkbox for bulk operations
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'project-checkbox';
        checkbox.dataset.projectId = project.id;
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);
        
        // Project name with category
        const nameCell = document.createElement('td');
        const nameDiv = document.createElement('div');
        nameDiv.className = 'project-name-cell';
        nameDiv.innerHTML = `
            <span class="project-name">${project.name}</span>
            ${project.category ? `<span class="category-badge">${project.category}</span>` : ''}
        `;
        nameCell.appendChild(nameDiv);
        nameCell.style.cursor = 'pointer';
        nameCell.onclick = () => showProjectModal(project);
        row.appendChild(nameCell);
        
        // Progress with quick actions
        const progressCell = document.createElement('td');
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-cell';
        const progressBadge = document.createElement('span');
        progressBadge.className = `progress-badge progress-${project.progress.replace(' ', '-')}`;
        progressBadge.textContent = project.progress;
        progressContainer.appendChild(progressBadge);
        
        // Quick action buttons
        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';
        if (project.progress !== 'complete') {
            const completeBtn = document.createElement('button');
            completeBtn.className = 'quick-btn complete-btn';
            completeBtn.innerHTML = '✓';
            completeBtn.title = 'Mark as complete';
            completeBtn.onclick = (e) => { e.stopPropagation(); updateProjectStatus(project.id, 'complete'); };
            quickActions.appendChild(completeBtn);
        }
        if (project.progress !== 'in progress') {
            const inProgressBtn = document.createElement('button');
            inProgressBtn.className = 'quick-btn in-progress-btn';
            inProgressBtn.innerHTML = '→';
            inProgressBtn.title = 'Mark as in progress';
            inProgressBtn.onclick = (e) => { e.stopPropagation(); updateProjectStatus(project.id, 'in progress'); };
            quickActions.appendChild(inProgressBtn);
        }
        if (project.progress !== 'blocked') {
            const blockedBtn = document.createElement('button');
            blockedBtn.className = 'quick-btn blocked-btn';
            blockedBtn.innerHTML = '⚠';
            blockedBtn.title = 'Mark as blocked';
            blockedBtn.onclick = (e) => { e.stopPropagation(); updateProjectStatus(project.id, 'blocked'); };
            quickActions.appendChild(blockedBtn);
        }
        progressContainer.appendChild(quickActions);
        progressCell.appendChild(progressContainer);
        row.appendChild(progressCell);
        
        // Link
        const linkCell = document.createElement('td');
        const link = document.createElement('a');
        link.href = project.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'project-link';
        link.textContent = project.link;
        link.onclick = (e) => e.stopPropagation();
        linkCell.appendChild(link);
        row.appendChild(linkCell);
        
        // Actions
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit';
        editBtn.onclick = (e) => { e.stopPropagation(); showProjectModal(project, true); };
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = (e) => { e.stopPropagation(); deleteProject(project.id); };
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
    });
}

// Update project status
function updateProjectStatus(projectId, newStatus) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const oldStatus = project.progress;
        project.progress = newStatus;
        project.updatedAt = new Date().toISOString();
        saveProjects();
        logActivity(`Changed status from "${oldStatus}" to "${newStatus}"`, project.name);
        renderProjects();
    }
}

// Delete project
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            projects = projects.filter(p => p.id !== projectId);
            saveProjects();
            logActivity('Deleted project', project.name);
            renderProjects();
        }
    }
}

// Project modal
function showProjectModal(project = null, isEdit = false) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    
    if (project) {
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-link').value = project.link;
        document.getElementById('project-progress').value = project.progress;
        document.getElementById('project-category').value = project.category || '';
        document.getElementById('project-description').value = project.description || '';
        document.getElementById('modal-title').textContent = 'Edit Project';
    } else {
        form.reset();
        document.getElementById('project-id').value = '';
        document.getElementById('modal-title').textContent = 'Add New Project';
    }
    
    modal.style.display = 'flex';
}

function closeProjectModal() {
    document.getElementById('project-modal').style.display = 'none';
}

// Handle project form submission
function handleProjectForm() {
    const form = document.getElementById('project-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('project-id').value;
        const name = document.getElementById('project-name').value;
        const link = document.getElementById('project-link').value;
        const progress = document.getElementById('project-progress').value;
        const category = document.getElementById('project-category').value;
        const description = document.getElementById('project-description').value;
        
        if (id) {
            // Update existing
            const project = projects.find(p => p.id === id);
            if (project) {
                project.name = name;
                project.link = link;
                project.progress = progress;
                project.category = category;
                project.description = description;
                project.updatedAt = new Date().toISOString();
                logActivity('Updated project', name);
            }
        } else {
            // Add new
            const newProject = {
                id: Date.now().toString(),
                name,
                link,
                progress,
                category,
                description,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            projects.push(newProject);
            logActivity('Added new project', name);
        }
        
        saveProjects();
        renderProjects();
        closeProjectModal();
    });
}

// Bulk operations
function handleBulkOperations() {
    const selectAllBtn = document.getElementById('select-all');
    const bulkActions = document.getElementById('bulk-actions');
    const bulkStatusSelect = document.getElementById('bulk-status');
    const bulkDeleteBtn = document.getElementById('bulk-delete');
    
    if (selectAllBtn) {
        selectAllBtn.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.project-checkbox');
            checkboxes.forEach(cb => cb.checked = this.checked);
            updateBulkActions();
        });
    }
    
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('project-checkbox')) {
            updateBulkActions();
        }
    });
    
    if (bulkStatusSelect) {
        bulkStatusSelect.addEventListener('change', function() {
            const selectedIds = getSelectedProjectIds();
            if (selectedIds.length > 0 && confirm(`Update ${selectedIds.length} project(s) to "${this.value}"?`)) {
                selectedIds.forEach(id => {
                    updateProjectStatus(id, this.value);
                });
                document.querySelectorAll('.project-checkbox').forEach(cb => cb.checked = false);
                updateBulkActions();
            }
        });
    }
    
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', function() {
            const selectedIds = getSelectedProjectIds();
            if (selectedIds.length > 0 && confirm(`Delete ${selectedIds.length} project(s)?`)) {
                selectedIds.forEach(id => deleteProject(id));
                updateBulkActions();
            }
        });
    }
}

function getSelectedProjectIds() {
    return Array.from(document.querySelectorAll('.project-checkbox:checked'))
        .map(cb => cb.dataset.projectId);
}

function updateBulkActions() {
    const selectedCount = getSelectedProjectIds().length;
    const bulkActions = document.getElementById('bulk-actions');
    if (bulkActions) {
        bulkActions.style.display = selectedCount > 0 ? 'flex' : 'none';
        document.getElementById('selected-count').textContent = selectedCount;
    }
}

// Export functionality
function exportToCSV() {
    const headers = ['Name', 'Progress', 'Category', 'Link', 'Description'];
    const rows = projects.map(p => [
        p.name,
        p.progress,
        p.category || '',
        p.link,
        (p.description || '').replace(/,/g, ';')
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fountain-projects-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportToJSON() {
    const json = JSON.stringify(projects, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fountain-projects-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Activity timeline
function renderActivityTimeline() {
    const timeline = document.getElementById('activity-timeline');
    if (!timeline) return;
    
    const recentActivities = activityLog.slice(0, 10);
    if (recentActivities.length === 0) {
        timeline.innerHTML = '<p style="text-align: center; color: #666;">No recent activity</p>';
        return;
    }
    
    timeline.innerHTML = recentActivities.map(activity => {
        const date = new Date(activity.timestamp);
        return `
            <div class="activity-item">
                <div class="activity-icon">${getActivityIcon(activity.action)}</div>
                <div class="activity-content">
                    <div class="activity-text">${activity.action} <strong>${activity.projectName}</strong></div>
                    <div class="activity-time">${formatTime(date)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function getActivityIcon(action) {
    if (action.includes('Added')) return '➕';
    if (action.includes('Updated')) return '✏️';
    if (action.includes('Deleted')) return '🗑️';
    if (action.includes('Changed')) return '🔄';
    return '📝';
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

// Dark mode
function initDarkMode() {
    const darkMode = localStorage.getItem('dark-mode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle')?.classList.add('active');
    }
}

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', isDark);
    document.getElementById('dark-mode-toggle')?.classList.toggle('active', isDark);
}

// Handle request form
function handleRequestForm() {
    const form = document.getElementById('request-form');
    const messageDiv = document.getElementById('form-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const requestData = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            const requests = JSON.parse(localStorage.getItem('fountain-requests') || '[]');
            requests.push(requestData);
            localStorage.setItem('fountain-requests', JSON.stringify(requests));
            
            console.log('Request submitted:', requestData);
            
            messageDiv.className = 'form-message success';
            messageDiv.textContent = 'Thank you! Your request has been submitted. We\'ll get back to you soon.';
            messageDiv.style.display = 'block';
            
            form.reset();
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
    initDarkMode();
    updateStatistics();
    renderProjects();
    renderActivityTimeline();
    handleProjectForm();
    handleBulkOperations();
    handleRequestForm();
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Filters
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilter.status = this.value;
            renderStatistics(); // Update stat cards to show active filter
            renderProjects();
        });
    }
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    
    // Export buttons
    const exportCSVBtn = document.getElementById('export-csv');
    const exportJSONBtn = document.getElementById('export-json');
    if (exportCSVBtn) exportCSVBtn.addEventListener('click', exportToCSV);
    if (exportJSONBtn) exportJSONBtn.addEventListener('click', exportToJSON);
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Close modal on outside click
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeProjectModal();
        });
    }
    
    console.log('Fountain Projects initialized');
});
