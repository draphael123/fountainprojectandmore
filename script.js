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
    },
    {
        name: "availability report",
        progress: "in progress",
        link: "https://website-puce-rho-32.vercel.app/"
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

// Handle request form submission
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
            
            // Log the request (in production, this would be sent to a backend)
            console.log('Request submitted:', requestData);
            
            // Show success message
            messageDiv.className = 'form-message success';
            messageDiv.textContent = 'Thank you! Your request has been submitted. We\'ll get back to you soon.';
            messageDiv.style.display = 'block';
            
            // Reset form
            form.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Projects data:', projects);
    renderProjects();
    handleRequestForm();
    console.log('Projects rendered');
});

