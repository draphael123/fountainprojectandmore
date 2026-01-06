// Projects data
const projects = [
    {
        name: "Fountain Onboarding",
        progress: "in progress",
        link: "https://fountain-onboarding-n6vod5aah-daniel-8982s-projects.vercel.app/"
    },
    {
        name: "itemized receipts",
        progress: "blocked",
        link: "https://itemized-receipt-builder.vercel.app/"
    },
    {
        name: "document scrapper",
        progress: "in progress",
        link: "https://doc-extraction.vercel.app/"
    },
    {
        name: "data visualization",
        progress: "in progress",
        link: "https://data-visualization-7szrf1s6a-daniel-8982s-projects.vercel.app/"
    },
    {
        name: "docusign generator",
        progress: "complete",
        link: "https://docusign-mauve.vercel.app/"
    },
    {
        name: "world clock",
        progress: "complete",
        link: "https://time-clock-extension-oytxql0ph-daniel-8982s-projects.vercel.app/"
    },
    {
        name: "refund calculator",
        progress: "in progress",
        link: "https://refund-calculator-five.vercel.app/"
    },
    {
        name: "grammarguard",
        progress: "in progress",
        link: "https://grammarguard.vercel.app/"
    },
    {
        name: "Fountain Macro Assistant",
        progress: "in progress",
        link: "https://fountain-macro-assistant.vercel.app/"
    },
    {
        name: "Fountain SEO",
        progress: "in progress",
        link: "https://seo-test-chi.vercel.app/"
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
document.addEventListener('DOMContentLoaded', function() {
    console.log('Projects data:', projects);
    renderProjects();
    console.log('Projects rendered');
});

