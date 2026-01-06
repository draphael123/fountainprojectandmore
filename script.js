// Projects data
const projects = [
    {
        name: "Fountain Onboarding",
        progress: "in progress",
        link: "https://fountain-onboarding-n6vod5aah-daniel-8982s-projects.vercel.app/"
    }
];

// Function to render projects
function renderProjects() {
    const tbody = document.getElementById('projects-list');
    tbody.innerHTML = '';
    
    projects.forEach(project => {
        const row = document.createElement('tr');
        
        // Project name
        const nameCell = document.createElement('td');
        nameCell.textContent = project.name;
        row.appendChild(nameCell);
        
        // Progress
        const progressCell = document.createElement('td');
        const progressBadge = document.createElement('span');
        progressBadge.className = `progress-badge progress-${project.progress.replace(' ', '-')}`;
        progressBadge.textContent = project.progress;
        progressCell.appendChild(progressBadge);
        row.appendChild(progressCell);
        
        // Link
        const linkCell = document.createElement('td');
        const link = document.createElement('a');
        link.href = project.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'project-link';
        link.textContent = project.link;
        linkCell.appendChild(link);
        row.appendChild(linkCell);
        
        tbody.appendChild(row);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderProjects);

