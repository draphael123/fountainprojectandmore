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

// Suggestions data
const suggestions = [
    {
        title: "Update Project Status Regularly",
        description: "Keep your project statuses up to date so team members always know what's happening. Mark projects as complete when finished!",
        icon: "🔄"
    },
    {
        title: "Add More Projects",
        description: "Track all your Fountain projects in one place. Simply add new entries to the projects array in script.js.",
        icon: "➕"
    },
    {
        title: "Use Descriptive Project Names",
        description: "Clear project names make it easier to identify and find projects quickly. Be specific and concise.",
        icon: "📝"
    },
    {
        title: "Keep Links Updated",
        description: "Ensure all project links are working and point to the latest deployed versions. Broken links can waste time.",
        icon: "🔗"
    },
    {
        title: "Review Blocked Projects",
        description: "Regularly check blocked projects and identify blockers. Move them to 'in progress' once unblocked.",
        icon: "🚧"
    },
    {
        title: "Celebrate Completed Projects",
        description: "Mark completed projects to track your progress and celebrate your achievements!",
        icon: "🎉"
    }
];

// Function to render suggestions
function renderSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions-list');
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        
        card.innerHTML = `
            <div class="suggestion-icon">${suggestion.icon}</div>
            <h3>${suggestion.title}</h3>
            <p>${suggestion.description}</p>
        `;
        
        suggestionsContainer.appendChild(card);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Projects data:', projects);
    renderProjects();
    renderSuggestions();
    console.log('Projects rendered');
});

