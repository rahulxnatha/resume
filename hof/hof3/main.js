/*
 * main.js
 * Initializes content, handles language switching, and binds content data.
 */

// Function to update all text content on the page
function updateContent(lang) {
    // 1. Update the language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active-lang');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active-lang');
        }
    });

    // 2. Iterate through all static elements that need translation
    document.querySelectorAll('[data-content-key]').forEach(el => {
        const key = el.getAttribute('data-content-key');
        if (window.Content && window.Content.get) {
            el.textContent = window.Content.get(key, lang);
        }
    });
    
    // 3. Dynamically generate the Projects/Experience section
    generateProjectGrid(lang);
}

// Function to generate project grid dynamically
function generateProjectGrid(lang) {
    const projectGrid = document.getElementById('project-grid');
    if (!projectGrid) return;
    
    projectGrid.innerHTML = ''; // Clear existing content
    const experienceData = window.Content.getExperience();

    // Loop through data and create project cards
    experienceData.forEach(item => {
        // Simple card structure for demonstration, adjust styling in CSS
        const card = document.createElement('article');
        card.classList.add('project-card');
        
        // Placeholder for Title translation - currently static in data array
        const title = item.title;
        const organization = item.organization;
        
        let visualPlaceholder = `[Visual for ${title}]`;

        // Customize visual placeholders based on type/title
        if (item.type === 'Work' && title.includes('Research Fellow')) {
            visualPlaceholder = 'FEA | MATLAB Scripts | GD&T';
        } else if (item.type === 'School' && title.includes('Bachelor')) {
            visualPlaceholder = 'Gold Medal | 8.91 CGPA | Thesis';
        }
        
        card.innerHTML = `
            <div class="card-visual">${visualPlaceholder}</div>
            <h3 class="card-title">${title}</h3>
            <p class="card-org">${organization}</p>
            <p class="card-date">${item.joinDate} — ${item.exitDate}</p>
        `;
        
        projectGrid.appendChild(card);
    });
}

// --- Initialization Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Determine initial language based on the URL (or default to 'en')
    let currentLang = 'en';
    if (window.location.host.startsWith('de.')) {
        currentLang = 'de';
    } else if (window.location.host.startsWith('en.')) {
        currentLang = 'en';
    } 
    
    // Initialize content
    updateContent(currentLang);

    // Attach click handlers to language buttons for domain switching
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = btn.getAttribute('data-lang');
            
            // Construct the target host for domain switching (e.g., rahulnatha.com -> de.rahulnatha.com)
            let targetHost = window.location.host.replace('en.', '').replace('de.', '');
            targetHost = newLang + '.' + targetHost;
            
            window.location.href = `${window.location.protocol}//${targetHost}${window.location.pathname}`;
        });
    });
});