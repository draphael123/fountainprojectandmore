// ============================================================================
// FOUNTAIN PROJECTS - COMPREHENSIVE ENHANCED VERSION WITH ALL 30 FEATURES
// ============================================================================

// Enhanced Projects Data Structure with all new fields
let projects = [];
let archivedProjects = [];
let projectHistory = {}; // For versioning
let currentSort = { field: 'order', direction: 'asc' };
let currentFilter = { status: 'all', category: 'all', priority: 'all', search: '', favorite: false, archived: false };
let savedFilterPresets = JSON.parse(localStorage.getItem('fountain-filter-presets') || '[]');
let searchHistory = JSON.parse(localStorage.getItem('fountain-search-history') || '[]');
let keyboardShortcutsEnabled = true;

// Initialize projects with enhanced structure
function initializeProjects() {
    const savedProjects = localStorage.getItem('fountain-projects');
    const savedArchived = localStorage.getItem('fountain-archived-projects');
    
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
        // Migrate old projects to new structure
        projects = projects.map(p => migrateProject(p));
    } else {
        projects = getDefaultProjects().map(p => createProject(p));
        saveProjects();
    }
    
    if (savedArchived) {
        archivedProjects = JSON.parse(savedArchived);
    }
    
    // Initialize order if not present and calculate health
    projects.forEach((p, i) => {
        if (!p.order) p.order = i;
        if (!p.health) p.health = calculateProjectHealth(p);
    });
    saveProjects();
}

// Migrate old project structure to new enhanced structure
function migrateProject(p) {
    return {
        ...p,
        priority: p.priority || 'medium',
        dueDate: p.dueDate || null,
        tags: p.tags || [],
        icon: p.icon || '',
        color: p.color || '',
        favorite: p.favorite || false,
        archived: p.archived || false,
        notes: p.notes || [],
        dependencies: p.dependencies || [],
        linkStatus: p.linkStatus || 'unknown',
        health: p.health || 'good',
        order: p.order !== undefined ? p.order : projects.length,
        history: p.history || []
    };
}

// Create new project with all fields
function createProject(data) {
    const now = new Date().toISOString();
    return {
        id: data.id || Date.now().toString(),
        name: data.name || '',
        link: data.link || '',
        progress: data.progress || 'in progress',
        category: data.category || '',
        description: data.description || '',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || null,
        tags: data.tags || [],
        icon: data.icon || '',
        color: data.color || '',
        favorite: data.favorite || false,
        archived: data.archived || false,
        notes: data.notes || [],
        dependencies: data.dependencies || [],
        linkStatus: data.linkStatus || 'unknown',
        health: data.health || 'good',
        order: data.order !== undefined ? data.order : projects.length,
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
        history: data.history || []
    };
}

// Get default projects
function getDefaultProjects() {
    return [
        { id: '1', name: "Fountain Onboarding", progress: "in progress", link: "https://fountain-onboarding-n6vod5aah-daniel-8982s-projects.vercel.app/", description: "", category: "Web App" },
        { id: '2', name: "itemized receipts", progress: "blocked", link: "https://itemized-receipt-builder.vercel.app/", description: "", category: "Tool" },
        { id: '3', name: "document scrapper", progress: "in progress", link: "https://doc-extraction.vercel.app/", description: "", category: "Tool" },
        { id: '4', name: "data visualization", progress: "in progress", link: "https://data-visualization-7szrf1s6a-daniel-8982s-projects.vercel.app/", description: "", category: "Web App" },
        { id: '5', name: "docusign generator", progress: "complete", link: "https://docusign-mauve.vercel.app/", description: "", category: "Tool" },
        { id: '6', name: "world clock", progress: "complete", link: "https://time-clock-extension-oytxql0ph-daniel-8982s-projects.vercel.app/", description: "", category: "Extension" },
        { id: '7', name: "refund calculator", progress: "in progress", link: "https://refund-calculator-five.vercel.app/", description: "", category: "Tool" },
        { id: '8', name: "grammarguard", progress: "in progress", link: "https://grammarguard.vercel.app/", description: "", category: "Extension" },
        { id: '9', name: "Fountain Macro Assistant", progress: "in progress", link: "https://fountain-macro-assistant.vercel.app/", description: "", category: "Extension" },
        { id: '10', name: "Fountain SEO", progress: "in progress", link: "https://seo-test-chi.vercel.app/", description: "", category: "Web App" },
        { id: '11', name: "availability report", progress: "in progress", link: "https://website-puce-rho-32.vercel.app/", description: "", category: "Tool" }
    ];
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('fountain-projects', JSON.stringify(projects));
    localStorage.setItem('fountain-archived-projects', JSON.stringify(archivedProjects));
    updateStatistics();
}

// Activity log
let activityLog = JSON.parse(localStorage.getItem('fountain-activity-log') || '[]');

function logActivity(action, projectName, details = {}) {
    activityLog.unshift({
        action,
        projectName,
        details,
        timestamp: new Date().toISOString()
    });
    if (activityLog.length > 100) activityLog = activityLog.slice(0, 100);
    localStorage.setItem('fountain-activity-log', JSON.stringify(activityLog));
    renderActivityTimeline();
}

// Save project history for versioning
function saveProjectHistory(projectId, action, oldData, newData) {
    if (!projectHistory[projectId]) {
        projectHistory[projectId] = [];
    }
    projectHistory[projectId].unshift({
        action,
        oldData: JSON.parse(JSON.stringify(oldData)),
        newData: JSON.parse(JSON.stringify(newData)),
        timestamp: new Date().toISOString()
    });
    if (projectHistory[projectId].length > 20) {
        projectHistory[projectId] = projectHistory[projectId].slice(0, 20);
    }
    localStorage.setItem('fountain-project-history', JSON.stringify(projectHistory));
}

// Statistics
let stats = { total: 0, inProgress: 0, blocked: 0, complete: 0, archived: 0, overdue: 0, favorites: 0 };

function updateStatistics() {
    const activeProjects = projects.filter(p => !p.archived);
    stats.total = activeProjects.length;
    stats.inProgress = activeProjects.filter(p => p.progress === 'in progress').length;
    stats.blocked = activeProjects.filter(p => p.progress === 'blocked').length;
    stats.complete = activeProjects.filter(p => p.progress === 'complete').length;
    stats.archived = archivedProjects.length;
    stats.overdue = activeProjects.filter(p => p.dueDate && new Date(p.dueDate) < new Date() && p.progress !== 'complete').length;
    stats.favorites = activeProjects.filter(p => p.favorite).length;
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
        ${stats.overdue > 0 ? `
        <div class="stat-card stat-overdue">
            <div class="stat-value">${stats.overdue}</div>
            <div class="stat-label">Overdue</div>
        </div>
        ` : ''}
        ${stats.favorites > 0 ? `
        <div class="stat-card stat-favorites">
            <div class="stat-value">⭐ ${stats.favorites}</div>
            <div class="stat-label">Favorites</div>
        </div>
        ` : ''}
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

// ============================================================================
// FEATURE 1: PROJECT SORTING
// ============================================================================
function sortProjects(projectsToSort) {
    const sorted = [...projectsToSort];
    const { field, direction } = currentSort;
    
    sorted.sort((a, b) => {
        let aVal, bVal;
        
        switch(field) {
            case 'name':
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
                break;
            case 'progress':
                const progressOrder = { 'complete': 3, 'in progress': 2, 'blocked': 1 };
                aVal = progressOrder[a.progress] || 0;
                bVal = progressOrder[b.progress] || 0;
                break;
            case 'priority':
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                aVal = priorityOrder[a.priority] || 0;
                bVal = priorityOrder[b.priority] || 0;
                break;
            case 'dueDate':
                aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                break;
            case 'createdAt':
                aVal = new Date(a.createdAt).getTime();
                bVal = new Date(b.createdAt).getTime();
                break;
            case 'updatedAt':
                aVal = new Date(a.updatedAt).getTime();
                bVal = new Date(b.updatedAt).getTime();
                break;
            case 'order':
            default:
                aVal = a.order || 0;
                bVal = b.order || 0;
                break;
        }
        
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    return sorted;
}

function setSort(field, direction = 'asc') {
    if (currentSort.field === field && currentSort.direction === direction) {
        // Toggle direction if same field
        currentSort.direction = direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = direction;
    }
    renderProjects();
    updateSortUI();
}

function updateSortUI() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = `${currentSort.field}-${currentSort.direction}`;
    }
}

// ============================================================================
// FEATURE 2: DRAG AND DROP REORDERING
// ============================================================================
let draggedElement = null;

function initDragAndDrop() {
    const tbody = document.getElementById('projects-list');
    if (!tbody) return;
    
    tbody.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'TR' || e.target.closest('tr')) {
            draggedElement = e.target.closest('tr');
            draggedElement.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        }
    });
    
    tbody.addEventListener('dragend', (e) => {
        if (draggedElement) {
            draggedElement.style.opacity = '1';
            draggedElement = null;
        }
    });
    
    tbody.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const afterElement = getDragAfterElement(tbody, e.clientY);
        const dragging = draggedElement;
        
        if (afterElement == null) {
            tbody.appendChild(dragging);
        } else {
            tbody.insertBefore(dragging, afterElement);
        }
    });
    
    tbody.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedElement) {
            updateProjectOrder();
            draggedElement = null;
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('tr:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateProjectOrder() {
    const rows = document.querySelectorAll('#projects-list tr');
    rows.forEach((row, index) => {
        const projectId = row.dataset.projectId;
        const project = projects.find(p => p.id === projectId);
        if (project) {
            project.order = index;
            project.updatedAt = new Date().toISOString();
        }
    });
    saveProjects();
    logActivity('Reordered projects', 'Multiple', { action: 'reorder' });
}

// ============================================================================
// FEATURE 3: IMPORT FUNCTIONALITY
// ============================================================================
function importProjects(file, format = 'json') {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let importedProjects = [];
            
            if (format === 'json') {
                const data = JSON.parse(e.target.result);
                importedProjects = Array.isArray(data) ? data : [data];
            } else if (format === 'csv') {
                importedProjects = parseCSV(e.target.result);
            }
            
            // Validate and migrate imported projects
            importedProjects = importedProjects.map(p => {
                const migrated = migrateProject(p);
                migrated.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                migrated.createdAt = new Date().toISOString();
                migrated.updatedAt = new Date().toISOString();
                return migrated;
            });
            
            // Add imported projects
            projects.push(...importedProjects);
            saveProjects();
            renderProjects();
            logActivity(`Imported ${importedProjects.length} projects`, 'Import', { count: importedProjects.length });
            
            alert(`Successfully imported ${importedProjects.length} project(s)!`);
        } catch (error) {
            alert('Error importing projects: ' + error.message);
            console.error('Import error:', error);
        }
    };
    
    if (format === 'json') {
        reader.readAsText(file);
    } else {
        reader.readAsText(file);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const projects = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const project = {};
        headers.forEach((header, index) => {
            project[header.toLowerCase().replace(/\s+/g, '')] = values[index] || '';
        });
        projects.push(project);
    }
    
    return projects;
}

// ============================================================================
// FEATURE 4: PROJECT ARCHIVING
// ============================================================================
function archiveProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.archived = true;
        archivedProjects.push(project);
        projects = projects.filter(p => p.id !== projectId);
        saveProjects();
        logActivity('Archived project', project.name);
        renderProjects();
    }
}

function unarchiveProject(projectId) {
    const project = archivedProjects.find(p => p.id === projectId);
    if (project) {
        project.archived = false;
        projects.push(project);
        archivedProjects = archivedProjects.filter(p => p.id !== projectId);
        saveProjects();
        logActivity('Unarchived project', project.name);
        renderProjects();
    }
}

function toggleArchiveView() {
    currentFilter.archived = !currentFilter.archived;
    if (currentFilter.archived) {
        // Show archived projects
        projects = [...projects, ...archivedProjects];
    } else {
        // Show active projects
        projects = projects.filter(p => !p.archived);
    }
    renderProjects();
}

// ============================================================================
// FEATURE 5: PROJECT PRIORITIES
// ============================================================================
function setProjectPriority(projectId, priority) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const oldPriority = project.priority;
        project.priority = priority;
        project.updatedAt = new Date().toISOString();
        saveProjects();
        logActivity(`Changed priority from "${oldPriority}" to "${priority}"`, project.name);
        renderProjects();
    }
}

function getPriorityColor(priority) {
    const colors = {
        'high': '#ff6b6b',
        'medium': '#f9ca24',
        'low': '#4ecdc4'
    };
    return colors[priority] || '#999';
}

// ============================================================================
// FEATURE 6: DUE DATES
// ============================================================================
function isOverdue(project) {
    if (!project.dueDate || project.progress === 'complete') return false;
    return new Date(project.dueDate) < new Date();
}

function getDaysUntilDue(project) {
    if (!project.dueDate) return null;
    const diff = new Date(project.dueDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ============================================================================
// FEATURE 7: KEYBOARD SHORTCUTS
// ============================================================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!keyboardShortcutsEnabled) return;
        
        // Don't trigger if typing in input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            if (e.key === 'Escape') {
                closeProjectModal();
                closeBulkEditModal();
            }
            return;
        }
        
        // Ctrl/Cmd + N - New project
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            showProjectModal();
        }
        
        // Ctrl/Cmd + F - Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
        }
        
        // ? - Show shortcuts help
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            showKeyboardShortcutsHelp();
        }
        
        // Esc - Close modals
        if (e.key === 'Escape') {
            closeProjectModal();
            closeBulkEditModal();
            closeShortcutsModal();
        }
    });
}

function showKeyboardShortcutsHelp() {
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeShortcutsModal() {
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================================================
// FEATURE 8: SAVED FILTER PRESETS
// ============================================================================
function saveFilterPreset(name) {
    const preset = {
        name,
        filter: { ...currentFilter },
        sort: { ...currentSort },
        timestamp: new Date().toISOString()
    };
    savedFilterPresets.push(preset);
    localStorage.setItem('fountain-filter-presets', JSON.stringify(savedFilterPresets));
    renderFilterPresets();
}

function loadFilterPreset(presetName) {
    const preset = savedFilterPresets.find(p => p.name === presetName);
    if (preset) {
        currentFilter = { ...preset.filter };
        currentSort = { ...preset.sort };
        applyFilters();
        updateSortUI();
        renderStatistics();
    }
}

function deleteFilterPreset(presetName) {
    savedFilterPresets = savedFilterPresets.filter(p => p.name !== presetName);
    localStorage.setItem('fountain-filter-presets', JSON.stringify(savedFilterPresets));
    renderFilterPresets();
}

function renderFilterPresets() {
    const container = document.getElementById('filter-presets');
    if (!container) return;
    
    if (savedFilterPresets.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 0.9rem;">No saved presets</p>';
        return;
    }
    
    container.innerHTML = savedFilterPresets.map(preset => `
        <div class="preset-item">
            <span onclick="loadFilterPreset('${preset.name}')">${preset.name}</span>
            <button onclick="deleteFilterPreset('${preset.name}')" class="delete-preset-btn">×</button>
        </div>
    `).join('');
}

// ============================================================================
// FEATURE 9: PROJECT FAVORITES/STARRING
// ============================================================================
function toggleFavorite(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.favorite = !project.favorite;
        project.updatedAt = new Date().toISOString();
        saveProjects();
        logActivity(project.favorite ? 'Favorited project' : 'Unfavorited project', project.name);
        renderProjects();
    }
}

// ============================================================================
// FEATURE 10: PROJECT CLONING
// ============================================================================
function cloneProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const cloned = {
            ...project,
            id: Date.now().toString(),
            name: `${project.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            order: projects.length,
            favorite: false
        };
        delete cloned.history;
        projects.push(cloned);
        saveProjects();
        logActivity('Cloned project', project.name);
        renderProjects();
    }
}

// ============================================================================
// FEATURE 11: LINK VALIDATION
// ============================================================================
async function validateLink(url) {
    try {
        const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
        return 'valid';
    } catch (error) {
        // Try with CORS proxy or just check if URL is well-formed
        try {
            new URL(url);
            return 'unknown'; // Can't verify due to CORS
        } catch {
            return 'invalid';
        }
    }
}

async function validateAllLinks() {
    for (const project of projects) {
        if (project.link) {
            project.linkStatus = await validateLink(project.link);
            project.updatedAt = new Date().toISOString();
        }
    }
    saveProjects();
    renderProjects();
}

// ============================================================================
// FEATURE 12: PROJECT HEALTH INDICATORS
// ============================================================================
function calculateProjectHealth(project) {
    let score = 100;
    
    // Deduct points for various issues
    if (project.progress === 'blocked') score -= 30;
    if (isOverdue(project)) score -= 25;
    if (project.linkStatus === 'invalid') score -= 20;
    if (!project.description) score -= 10;
    if (!project.category) score -= 5;
    if (project.notes && project.notes.length === 0) score -= 5;
    
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
}

function updateProjectHealth(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.health = calculateProjectHealth(project);
        saveProjects();
    }
}

// ============================================================================
// FEATURE 13: MULTIPLE TAGS
// ============================================================================
function addTagToProject(projectId, tag) {
    const project = projects.find(p => p.id === projectId);
    if (project && !project.tags.includes(tag)) {
        project.tags.push(tag);
        project.updatedAt = new Date().toISOString();
        saveProjects();
        renderProjects();
    }
}

function removeTagFromProject(projectId, tag) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.tags = project.tags.filter(t => t !== tag);
        project.updatedAt = new Date().toISOString();
        saveProjects();
        renderProjects();
    }
}

// ============================================================================
// FEATURE 14: PROJECT NOTES/COMMENTS
// ============================================================================
function addNoteToProject(projectId, noteText) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        if (!project.notes) project.notes = [];
        project.notes.push({
            text: noteText,
            timestamp: new Date().toISOString()
        });
        project.updatedAt = new Date().toISOString();
        saveProjects();
        logActivity('Added note', project.name);
    }
}

function deleteNoteFromProject(projectId, noteIndex) {
    const project = projects.find(p => p.id === projectId);
    if (project && project.notes) {
        project.notes.splice(noteIndex, 1);
        project.updatedAt = new Date().toISOString();
        saveProjects();
    }
}

// ============================================================================
// FEATURE 15: PROJECT TEMPLATES
// ============================================================================
const projectTemplates = [
    {
        name: 'Web App',
        data: { category: 'Web App', priority: 'high', tags: ['web', 'app'] }
    },
    {
        name: 'Chrome Extension',
        data: { category: 'Extension', priority: 'medium', tags: ['extension', 'chrome'] }
    },
    {
        name: 'Tool',
        data: { category: 'Tool', priority: 'medium', tags: ['tool', 'utility'] }
    }
];

function createProjectFromTemplate(templateName) {
    const template = projectTemplates.find(t => t.name === templateName);
    if (template) {
        const newProject = createProject(template.data);
        showProjectModal(newProject);
    }
}

// ============================================================================
// FEATURE 16: PROJECT SHARING (READ-ONLY LINKS)
// ============================================================================
function generateShareLink(projectIds = null) {
    const projectsToShare = projectIds ? 
        projects.filter(p => projectIds.includes(p.id)) : 
        projects.filter(p => !p.archived);
    
    const shareData = {
        projects: projectsToShare.map(p => ({
            name: p.name,
            progress: p.progress,
            category: p.category,
            description: p.description,
            link: p.link
        })),
        timestamp: new Date().toISOString()
    };
    
    const encoded = btoa(JSON.stringify(shareData));
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!');
    });
    
    return shareUrl;
}

function loadSharedProjects() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');
    if (shareData) {
        try {
            const data = JSON.parse(atob(shareData));
            // Display shared projects in a read-only view
            displaySharedView(data.projects);
        } catch (error) {
            console.error('Error loading shared projects:', error);
        }
    }
}

function displaySharedView(sharedProjects) {
    // Create a read-only view of shared projects
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>Shared Projects View</h1>
            <p>Read-only view of shared projects</p>
        </header>
        <main>
            <div id="shared-projects-list"></div>
        </main>
    `;
    // Render shared projects...
}

// ============================================================================
// FEATURE 17: PROJECT ANALYTICS/CHARTS
// ============================================================================
function renderAnalytics() {
    const analyticsContainer = document.getElementById('analytics-container');
    if (!analyticsContainer) return;
    
    // Calculate analytics
    const statusDistribution = {
        'in progress': projects.filter(p => p.progress === 'in progress' && !p.archived).length,
        'blocked': projects.filter(p => p.progress === 'blocked' && !p.archived).length,
        'complete': projects.filter(p => p.progress === 'complete' && !p.archived).length
    };
    
    const priorityDistribution = {
        'high': projects.filter(p => p.priority === 'high' && !p.archived).length,
        'medium': projects.filter(p => p.priority === 'medium' && !p.archived).length,
        'low': projects.filter(p => p.priority === 'low' && !p.archived).length
    };
    
    const categoryDistribution = {};
    projects.filter(p => !p.archived).forEach(p => {
        categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1;
    });
    
    analyticsContainer.innerHTML = `
        <div class="analytics-section">
            <h3>Status Distribution</h3>
            <div class="chart-container">
                ${Object.entries(statusDistribution).map(([status, count]) => `
                    <div class="chart-bar">
                        <div class="bar-label">${status}</div>
                        <div class="bar" style="width: ${(count / stats.total) * 100}%">${count}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="analytics-section">
            <h3>Priority Distribution</h3>
            <div class="chart-container">
                ${Object.entries(priorityDistribution).map(([priority, count]) => `
                    <div class="chart-bar">
                        <div class="bar-label">${priority}</div>
                        <div class="bar" style="width: ${(count / stats.total) * 100}%">${count}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ============================================================================
// FEATURE 18: PROJECT DEPENDENCIES
// ============================================================================
function addDependency(projectId, dependencyId) {
    const project = projects.find(p => p.id === projectId);
    if (project && !project.dependencies.includes(dependencyId)) {
        project.dependencies.push(dependencyId);
        project.updatedAt = new Date().toISOString();
        saveProjects();
    }
}

function removeDependency(projectId, dependencyId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.dependencies = project.dependencies.filter(d => d !== dependencyId);
        project.updatedAt = new Date().toISOString();
        saveProjects();
    }
}

// ============================================================================
// FEATURE 19: BACKUP/RESTORE
// ============================================================================
function createBackup() {
    const backup = {
        projects,
        archivedProjects,
        activityLog,
        projectHistory,
        timestamp: new Date().toISOString(),
        version: '2.0'
    };
    
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fountain-projects-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function restoreFromBackup(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            if (confirm('This will replace all current data. Continue?')) {
                projects = backup.projects || [];
                archivedProjects = backup.archivedProjects || [];
                activityLog = backup.activityLog || [];
                projectHistory = backup.projectHistory || {};
                saveProjects();
                renderProjects();
                alert('Backup restored successfully!');
            }
        } catch (error) {
            alert('Error restoring backup: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ============================================================================
// FEATURE 20: PROJECT HISTORY/VERSIONING
// ============================================================================
function revertProjectToVersion(projectId, versionIndex) {
    const project = projects.find(p => p.id === projectId);
    const history = projectHistory[projectId];
    if (project && history && history[versionIndex]) {
        const version = history[versionIndex];
        Object.assign(project, version.oldData);
        project.updatedAt = new Date().toISOString();
        saveProjects();
        logActivity('Reverted project to previous version', project.name);
        renderProjects();
    }
}

// ============================================================================
// FEATURE 21: PROJECT ICONS/EMOJIS
// ============================================================================
function setProjectIcon(projectId, icon) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.icon = icon;
        project.updatedAt = new Date().toISOString();
        saveProjects();
        renderProjects();
    }
}

// ============================================================================
// FEATURE 22: COLOR CODING
// ============================================================================
function setProjectColor(projectId, color) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.color = color;
        project.updatedAt = new Date().toISOString();
        saveProjects();
        renderProjects();
    }
}

// ============================================================================
// FEATURE 23: CUSTOM THEMES
// ============================================================================
const customThemes = {
    'default': {
        primary: '#667eea',
        secondary: '#764ba2'
    },
    'ocean': {
        primary: '#4facfe',
        secondary: '#00f2fe'
    },
    'sunset': {
        primary: '#ff6b6b',
        secondary: '#f0932b'
    },
    'forest': {
        primary: '#4ecdc4',
        secondary: '#44a08d'
    }
};

function setTheme(themeName) {
    const theme = customThemes[themeName];
    if (theme) {
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        localStorage.setItem('fountain-theme', themeName);
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('fountain-theme') || 'default';
    setTheme(savedTheme);
}

// ============================================================================
// FEATURE 24: MOBILE CARD VIEW
// ============================================================================
let viewMode = localStorage.getItem('fountain-view-mode') || 'table';

function toggleViewMode() {
    viewMode = viewMode === 'table' ? 'cards' : 'table';
    localStorage.setItem('fountain-view-mode', viewMode);
    renderProjects();
}

// ============================================================================
// FEATURE 25: PWA SUPPORT
// ============================================================================
function initPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker not available, that's okay
        });
    }
}

// ============================================================================
// FEATURE 26: SEARCH AUTOCOMPLETE
// ============================================================================
function initSearchAutocomplete() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.id = 'autocomplete-container';
    autocompleteContainer.className = 'autocomplete-container';
    searchInput.parentNode.appendChild(autocompleteContainer);
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            autocompleteContainer.style.display = 'none';
            return;
        }
        
        const suggestions = getSearchSuggestions(query);
        if (suggestions.length > 0) {
            autocompleteContainer.innerHTML = suggestions.map(s => `
                <div class="autocomplete-item" onclick="selectSuggestion('${s}')">${s}</div>
            `).join('');
            autocompleteContainer.style.display = 'block';
        } else {
            autocompleteContainer.style.display = 'none';
        }
    });
    
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            autocompleteContainer.style.display = 'none';
        }, 200);
    });
}

function getSearchSuggestions(query) {
    const allNames = projects.map(p => p.name);
    const matches = allNames.filter(name => 
        name.toLowerCase().includes(query) && name.toLowerCase() !== query
    ).slice(0, 5);
    
    // Add recent searches
    const recentMatches = searchHistory.filter(s => 
        s.toLowerCase().includes(query)
    ).slice(0, 3);
    
    return [...new Set([...matches, ...recentMatches])].slice(0, 5);
}

function selectSuggestion(suggestion) {
    document.getElementById('search-input').value = suggestion;
    currentFilter.search = suggestion.toLowerCase();
    applyFilters();
    document.getElementById('autocomplete-container').style.display = 'none';
    
    // Add to search history
    if (!searchHistory.includes(suggestion)) {
        searchHistory.unshift(suggestion);
        if (searchHistory.length > 10) searchHistory = searchHistory.slice(0, 10);
        localStorage.setItem('fountain-search-history', JSON.stringify(searchHistory));
    }
}

// ============================================================================
// FEATURE 27: BULK EDIT MODAL
// ============================================================================
function showBulkEditModal() {
    const selectedIds = getSelectedProjectIds();
    if (selectedIds.length === 0) {
        alert('Please select projects to edit');
        return;
    }
    
    const modal = document.getElementById('bulk-edit-modal');
    if (modal) {
        document.getElementById('bulk-edit-count').textContent = selectedIds.length;
        modal.style.display = 'flex';
    }
}

function closeBulkEditModal() {
    const modal = document.getElementById('bulk-edit-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function applyBulkEdit() {
    const selectedIds = getSelectedProjectIds();
    const category = document.getElementById('bulk-edit-category')?.value;
    const priority = document.getElementById('bulk-edit-priority')?.value;
    const tags = document.getElementById('bulk-edit-tags')?.value.split(',').map(t => t.trim()).filter(t => t);
    
    selectedIds.forEach(id => {
        const project = projects.find(p => p.id === id);
        if (project) {
            if (category) project.category = category;
            if (priority) project.priority = priority;
            if (tags.length > 0) {
                tags.forEach(tag => {
                    if (!project.tags.includes(tag)) {
                        project.tags.push(tag);
                    }
                });
            }
            project.updatedAt = new Date().toISOString();
        }
    });
    
    saveProjects();
    renderProjects();
    closeBulkEditModal();
    document.querySelectorAll('.project-checkbox').forEach(cb => cb.checked = false);
    updateBulkActions();
    logActivity(`Bulk edited ${selectedIds.length} projects`, 'Multiple', { count: selectedIds.length });
}

// ============================================================================
// FEATURE 28: SEARCH HISTORY
// ============================================================================
function renderSearchHistory() {
    const container = document.getElementById('search-history');
    if (!container) return;
    
    if (searchHistory.length === 0) {
        container.innerHTML = '<p style="color: #666;">No search history</p>';
        return;
    }
    
    container.innerHTML = searchHistory.slice(0, 10).map(term => `
        <div class="search-history-item" onclick="useSearchHistory('${term}')">
            ${term}
            <button onclick="removeSearchHistory('${term}')" class="remove-search-btn">×</button>
        </div>
    `).join('');
}

function useSearchHistory(term) {
    document.getElementById('search-input').value = term;
    currentFilter.search = term.toLowerCase();
    applyFilters();
}

function removeSearchHistory(term) {
    searchHistory = searchHistory.filter(t => t !== term);
    localStorage.setItem('fountain-search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
}

// ============================================================================
// FEATURE 29: EMPTY STATES
// ============================================================================
function renderEmptyState() {
    const tbody = document.getElementById('projects-list');
    if (!tbody || projects.length > 0) return;
    
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">
                <div class="empty-state-content">
                    <div class="empty-state-icon">📋</div>
                    <h3>No projects yet</h3>
                    <p>Get started by adding your first project!</p>
                    <button onclick="showProjectModal()" class="add-first-project-btn">+ Add Your First Project</button>
                    <div class="empty-state-tips">
                        <h4>Quick Tips:</h4>
                        <ul>
                            <li>Click "+ Add Project" to create a new project</li>
                            <li>Use templates to quickly start common project types</li>
                            <li>Import projects from CSV or JSON files</li>
                            <li>Press <kbd>Ctrl+N</kbd> (or <kbd>Cmd+N</kbd> on Mac) to quickly add a project</li>
                        </ul>
                    </div>
                </div>
            </td>
        </tr>
    `;
}

// ============================================================================
// FEATURE 30: DATA SYNC/EXPORT FOR DEVICES
// ============================================================================
function exportForSync() {
    const syncData = {
        projects,
        archivedProjects,
        settings: {
            theme: localStorage.getItem('fountain-theme'),
            darkMode: localStorage.getItem('dark-mode'),
            viewMode: localStorage.getItem('fountain-view-mode')
        },
        timestamp: new Date().toISOString()
    };
    
    const json = JSON.stringify(syncData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fountain-sync-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importSyncData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const syncData = JSON.parse(e.target.result);
            if (confirm('This will replace all current data and settings. Continue?')) {
                projects = syncData.projects || [];
                archivedProjects = syncData.archivedProjects || [];
                
                if (syncData.settings) {
                    if (syncData.settings.theme) localStorage.setItem('fountain-theme', syncData.settings.theme);
                    if (syncData.settings.darkMode) localStorage.setItem('dark-mode', syncData.settings.darkMode);
                    if (syncData.settings.viewMode) localStorage.setItem('fountain-view-mode', syncData.settings.viewMode);
                }
                
                saveProjects();
                initTheme();
                initDarkMode();
                renderProjects();
                alert('Sync data imported successfully!');
            }
        } catch (error) {
            alert('Error importing sync data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ============================================================================
// FILTER AND SEARCH
// ============================================================================
function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    const priorityFilter = document.getElementById('priority-filter')?.value || 'all';
    const favoriteFilter = document.getElementById('favorite-filter')?.checked || false;
    
    currentFilter = { 
        status: statusFilter, 
        category: categoryFilter, 
        priority: priorityFilter,
        search: searchTerm,
        favorite: favoriteFilter,
        archived: currentFilter.archived
    };
    
    renderStatistics();
    renderProjects();
}

// ============================================================================
// RENDER PROJECTS (Enhanced with all new features)
// ============================================================================
function renderProjects() {
    const tbody = document.getElementById('projects-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Filter projects
    let filteredProjects = projects.filter(project => {
        if (currentFilter.archived && !project.archived) return false;
        if (!currentFilter.archived && project.archived) return false;
        
        const matchesSearch = !currentFilter.search || 
            project.name.toLowerCase().includes(currentFilter.search) ||
            (project.description && project.description.toLowerCase().includes(currentFilter.search)) ||
            (project.tags && project.tags.some(tag => tag.toLowerCase().includes(currentFilter.search)));
        const matchesStatus = currentFilter.status === 'all' || project.progress === currentFilter.status;
        const matchesCategory = currentFilter.category === 'all' || project.category === currentFilter.category;
        const matchesPriority = currentFilter.priority === 'all' || project.priority === currentFilter.priority;
        const matchesFavorite = !currentFilter.favorite || project.favorite;
        
        return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesFavorite;
    });
    
    // Sort projects
    filteredProjects = sortProjects(filteredProjects);
    
    // Show empty state if no projects
    if (filteredProjects.length === 0 && projects.length === 0) {
        renderEmptyState();
        return;
    }
    
    if (filteredProjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No projects match your filters</td></tr>';
        return;
    }
    
    // Render based on view mode
    if (viewMode === 'cards') {
        // For card view, we need to change the container
        const section = document.querySelector('.projects-section');
        if (section) {
            const table = section.querySelector('table');
            if (table) table.style.display = 'none';
            let cardContainer = section.querySelector('#projects-cards-container');
            if (!cardContainer) {
                cardContainer = document.createElement('div');
                cardContainer.id = 'projects-cards-container';
                cardContainer.className = 'projects-cards-container';
                section.appendChild(cardContainer);
            }
            cardContainer.style.display = 'grid';
            renderProjectCards(filteredProjects, cardContainer);
        }
    } else {
        const section = document.querySelector('.projects-section');
        if (section) {
            const table = section.querySelector('table');
            if (table) table.style.display = 'table';
            const cardContainer = section.querySelector('#projects-cards-container');
            if (cardContainer) cardContainer.style.display = 'none';
        }
        renderProjectTable(filteredProjects);
    }
}

function renderProjectTable(filteredProjects) {
    const tbody = document.getElementById('projects-list');
    
    filteredProjects.forEach(project => {
        const row = document.createElement('tr');
        row.dataset.projectId = project.id;
        row.className = 'project-row';
        row.draggable = true;
        
        if (project.color) {
            row.style.borderLeft = `4px solid ${project.color}`;
        }
        
        // Checkbox
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'project-checkbox';
        checkbox.dataset.projectId = project.id;
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);
        
        // Project name with icon, favorite, category, tags
        const nameCell = document.createElement('td');
        const nameDiv = document.createElement('div');
        nameDiv.className = 'project-name-cell';
        nameDiv.innerHTML = `
            ${project.icon ? `<span class="project-icon">${project.icon}</span>` : ''}
            ${project.favorite ? '<span class="favorite-star">⭐</span>' : ''}
            <span class="project-name">${project.name}</span>
            ${project.category ? `<span class="category-badge">${project.category}</span>` : ''}
            ${project.tags && project.tags.length > 0 ? `<div class="tags-container">${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
            ${isOverdue(project) ? '<span class="overdue-badge">⚠️ Overdue</span>' : ''}
        `;
        nameCell.appendChild(nameDiv);
        nameCell.style.cursor = 'pointer';
        nameCell.onclick = () => showProjectModal(project);
        row.appendChild(nameCell);
        
        // Priority
        const priorityCell = document.createElement('td');
        if (project.priority) {
            const priorityBadge = document.createElement('span');
            priorityBadge.className = `priority-badge priority-${project.priority}`;
            priorityBadge.textContent = project.priority;
            priorityBadge.style.backgroundColor = getPriorityColor(project.priority);
            priorityCell.appendChild(priorityBadge);
        }
        row.appendChild(priorityCell);
        
        // Progress with quick actions
        const progressCell = document.createElement('td');
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-cell';
        const progressBadge = document.createElement('span');
        progressBadge.className = `progress-badge progress-${project.progress.replace(' ', '-')}`;
        progressBadge.textContent = project.progress;
        progressContainer.appendChild(progressBadge);
        
        // Quick actions
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
        
        // Due date
        const dueDateCell = document.createElement('td');
        if (project.dueDate) {
            const dueDate = new Date(project.dueDate);
            const daysUntil = getDaysUntilDue(project);
            const overdue = isOverdue(project);
            dueDateCell.innerHTML = `
                <span class="due-date ${overdue ? 'overdue' : ''}">
                    ${dueDate.toLocaleDateString()}
                    ${daysUntil !== null ? `<span class="days-until">${overdue ? 'Overdue' : `${daysUntil}d left`}</span>` : ''}
                </span>
            `;
        }
        row.appendChild(dueDateCell);
        
        // Link with status
        const linkCell = document.createElement('td');
        const linkContainer = document.createElement('div');
        linkContainer.className = 'link-container';
        const link = document.createElement('a');
        link.href = project.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'project-link';
        link.textContent = project.link;
        link.onclick = (e) => e.stopPropagation();
        
        // Link status indicator
        if (project.linkStatus) {
            const statusIndicator = document.createElement('span');
            statusIndicator.className = `link-status link-status-${project.linkStatus}`;
            statusIndicator.title = `Link status: ${project.linkStatus}`;
            linkContainer.appendChild(statusIndicator);
        }
        
        linkContainer.appendChild(link);
        linkCell.appendChild(linkContainer);
        row.appendChild(linkCell);
        
        // Health indicator
        const healthCell = document.createElement('td');
        if (project.health) {
            const healthBadge = document.createElement('span');
            healthBadge.className = `health-badge health-${project.health}`;
            healthBadge.textContent = project.health;
            healthCell.appendChild(healthBadge);
        }
        row.appendChild(healthCell);
        
        // Actions
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `action-btn favorite-btn ${project.favorite ? 'active' : ''}`;
        favoriteBtn.innerHTML = '⭐';
        favoriteBtn.title = project.favorite ? 'Remove from favorites' : 'Add to favorites';
        favoriteBtn.onclick = (e) => { e.stopPropagation(); toggleFavorite(project.id); };
        
        const cloneBtn = document.createElement('button');
        cloneBtn.className = 'action-btn clone-btn';
        cloneBtn.innerHTML = '📋';
        cloneBtn.title = 'Clone project';
        cloneBtn.onclick = (e) => { e.stopPropagation(); cloneProject(project.id); };
        
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit';
        editBtn.onclick = (e) => { e.stopPropagation(); showProjectModal(project, true); };
        
        const archiveBtn = document.createElement('button');
        archiveBtn.className = 'action-btn archive-btn';
        archiveBtn.innerHTML = '📦';
        archiveBtn.title = project.archived ? 'Unarchive' : 'Archive';
        archiveBtn.onclick = (e) => { 
            e.stopPropagation(); 
            if (project.archived) {
                unarchiveProject(project.id);
            } else {
                archiveProject(project.id);
            }
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = (e) => { e.stopPropagation(); deleteProject(project.id); };
        
        actionsCell.appendChild(favoriteBtn);
        actionsCell.appendChild(cloneBtn);
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(archiveBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
    });
}

function renderProjectCards(filteredProjects, container = null) {
    const cardContainer = container || document.getElementById('projects-cards-container') || document.getElementById('projects-list');
    if (!cardContainer) return;
    
    cardContainer.innerHTML = '';
    
    filteredProjects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = project.id;
        
        if (project.color) {
            card.style.borderLeft = `4px solid ${project.color}`;
        }
        
        card.innerHTML = `
            <div class="card-header">
                ${project.favorite ? '<span class="favorite-star">⭐</span>' : ''}
                ${project.icon ? `<span class="project-icon">${project.icon}</span>` : ''}
                <h3>${project.name}</h3>
            </div>
            <div class="card-body">
                <div class="card-progress">
                    <span class="progress-badge progress-${project.progress.replace(' ', '-')}">${project.progress}</span>
                    ${project.priority ? `<span class="priority-badge priority-${project.priority}" style="background-color: ${getPriorityColor(project.priority)}">${project.priority}</span>` : ''}
                </div>
                ${project.description ? `<p class="card-description">${project.description}</p>` : ''}
                ${project.category ? `<span class="category-badge">${project.category}</span>` : ''}
                ${project.tags && project.tags.length > 0 ? `<div class="tags-container">${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                ${isOverdue(project) ? '<span class="overdue-badge">⚠️ Overdue</span>' : ''}
            </div>
            <div class="card-actions">
                <button onclick="showProjectModalById('${project.id}')">Edit</button>
                <a href="${project.link}" target="_blank">Visit</a>
            </div>
        `;
        
        cardContainer.appendChild(card);
    });
}

function showProjectModalById(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        showProjectModal(project);
    }
}

// ============================================================================
// UPDATE PROJECT STATUS
// ============================================================================
function updateProjectStatus(projectId, newStatus) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const oldStatus = project.progress;
        const oldData = JSON.parse(JSON.stringify(project));
        project.progress = newStatus;
        project.updatedAt = new Date().toISOString();
        project.health = calculateProjectHealth(project);
        saveProjectHistory(projectId, 'status_change', oldData, project);
        saveProjects();
        logActivity(`Changed status from "${oldStatus}" to "${newStatus}"`, project.name);
        renderProjects();
    }
}

// ============================================================================
// DELETE PROJECT
// ============================================================================
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

// ============================================================================
// PROJECT MODAL (Enhanced)
// ============================================================================
function showProjectModal(project = null, isEdit = false) {
    const modal = document.getElementById('project-modal');
    
    if (project) {
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-link').value = project.link;
        document.getElementById('project-progress').value = project.progress;
        document.getElementById('project-category').value = project.category || '';
        document.getElementById('project-description').value = project.description || '';
        document.getElementById('project-priority').value = project.priority || 'medium';
        document.getElementById('project-due-date').value = project.dueDate ? project.dueDate.split('T')[0] : '';
        document.getElementById('project-icon').value = project.icon || '';
        document.getElementById('project-color').value = project.color || '';
        document.getElementById('project-tags').value = project.tags ? project.tags.join(', ') : '';
        document.getElementById('project-favorite').checked = project.favorite || false;
        document.getElementById('modal-title').textContent = 'Edit Project';
    } else {
        document.getElementById('project-form').reset();
        document.getElementById('project-id').value = '';
        document.getElementById('modal-title').textContent = 'Add New Project';
    }
    
    modal.style.display = 'flex';
}

function closeProjectModal() {
    document.getElementById('project-modal').style.display = 'none';
}

// ============================================================================
// HANDLE PROJECT FORM SUBMISSION (Enhanced)
// ============================================================================
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
        const priority = document.getElementById('project-priority').value;
        const dueDate = document.getElementById('project-due-date').value;
        const icon = document.getElementById('project-icon').value;
        const color = document.getElementById('project-color').value;
        const tags = document.getElementById('project-tags').value.split(',').map(t => t.trim()).filter(t => t);
        const favorite = document.getElementById('project-favorite').checked;
        
        if (id) {
            // Update existing
            const project = projects.find(p => p.id === id);
            if (project) {
                const oldData = JSON.parse(JSON.stringify(project));
                project.name = name;
                project.link = link;
                project.progress = progress;
                project.category = category;
                project.description = description;
                project.priority = priority;
                project.dueDate = dueDate || null;
                project.icon = icon;
                project.color = color;
                project.tags = tags;
                project.favorite = favorite;
                project.updatedAt = new Date().toISOString();
                project.health = calculateProjectHealth(project);
                saveProjectHistory(id, 'update', oldData, project);
                logActivity('Updated project', name);
            }
        } else {
            // Add new
            const newProject = createProject({
                name,
                link,
                progress,
                category,
                description,
                priority,
                dueDate: dueDate || null,
                icon,
                color,
                tags,
                favorite
            });
            projects.push(newProject);
            logActivity('Added new project', name);
        }
        
        saveProjects();
        renderProjects();
        closeProjectModal();
    });
}

// ============================================================================
// BULK OPERATIONS (Enhanced)
// ============================================================================
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

// ============================================================================
// EXPORT FUNCTIONALITY (Enhanced)
// ============================================================================
function exportToCSV() {
    const headers = ['Name', 'Progress', 'Category', 'Priority', 'Due Date', 'Link', 'Description', 'Tags'];
    const rows = projects.filter(p => !p.archived).map(p => [
        p.name,
        p.progress,
        p.category || '',
        p.priority || '',
        p.dueDate || '',
        p.link,
        (p.description || '').replace(/,/g, ';'),
        (p.tags || []).join(';')
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
    const json = JSON.stringify(projects.filter(p => !p.archived), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fountain-projects-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// ACTIVITY TIMELINE
// ============================================================================
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
    if (action.includes('Archived')) return '📦';
    if (action.includes('Cloned')) return '📋';
    if (action.includes('Favorited')) return '⭐';
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

// ============================================================================
// DARK MODE
// ============================================================================
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

// ============================================================================
// HANDLE REQUEST FORM
// ============================================================================
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
            
            const requests = JSON.parse(localStorage.getItem('fountain-requests') || '[]');
            requests.push(requestData);
            localStorage.setItem('fountain-requests', JSON.stringify(requests));
            
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

// ============================================================================
// INITIALIZE EVERYTHING
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
    initTheme();
    initDarkMode();
    initPWA();
    updateStatistics();
    renderProjects();
    renderActivityTimeline();
    renderAnalytics();
    renderFilterPresets();
    renderSearchHistory();
    handleProjectForm();
    handleBulkOperations();
    handleRequestForm();
    initDragAndDrop();
    initKeyboardShortcuts();
    initSearchAutocomplete();
    loadSharedProjects();
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Filters
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const priorityFilter = document.getElementById('priority-filter');
    const favoriteFilter = document.getElementById('favorite-filter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilter.status = this.value;
            renderStatistics();
            renderProjects();
        });
    }
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (priorityFilter) priorityFilter.addEventListener('change', applyFilters);
    if (favoriteFilter) favoriteFilter.addEventListener('change', applyFilters);
    
    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const [field, direction] = this.value.split('-');
            setSort(field, direction);
        });
    }
    
    // Export buttons
    const exportCSVBtn = document.getElementById('export-csv');
    const exportJSONBtn = document.getElementById('export-json');
    if (exportCSVBtn) exportCSVBtn.addEventListener('click', exportToCSV);
    if (exportJSONBtn) exportJSONBtn.addEventListener('click', exportToJSON);
    
    // Import buttons
    const importCSVBtn = document.getElementById('import-csv');
    const importJSONBtn = document.getElementById('import-json');
    if (importCSVBtn) {
        importCSVBtn.addEventListener('change', function(e) {
            if (e.target.files[0]) importProjects(e.target.files[0], 'csv');
        });
    }
    if (importJSONBtn) {
        importJSONBtn.addEventListener('change', function(e) {
            if (e.target.files[0]) importProjects(e.target.files[0], 'json');
        });
    }
    
    // Backup/Restore
    const backupBtn = document.getElementById('backup-btn');
    const restoreBtn = document.getElementById('restore-btn');
    if (backupBtn) backupBtn.addEventListener('click', createBackup);
    if (restoreBtn) {
        restoreBtn.addEventListener('change', function(e) {
            if (e.target.files[0]) restoreFromBackup(e.target.files[0]);
        });
    }
    
    // Sync
    const syncExportBtn = document.getElementById('sync-export-btn');
    const syncImportBtn = document.getElementById('sync-import-btn');
    if (syncExportBtn) syncExportBtn.addEventListener('click', exportForSync);
    if (syncImportBtn) {
        syncImportBtn.addEventListener('change', function(e) {
            if (e.target.files[0]) importSyncData(e.target.files[0]);
        });
    }
    
    // View mode toggle
    const viewModeToggle = document.getElementById('view-mode-toggle');
    if (viewModeToggle) {
        viewModeToggle.addEventListener('click', toggleViewMode);
    }
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Close modals
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeProjectModal();
        });
    }
    
    console.log('Fountain Projects initialized with all features');
});

