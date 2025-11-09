/*
 * main.js
 * Handles language switching logic and dynamic content population.
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

    // 2. Iterate through all elements that need translation
    document.querySelectorAll('[data-content-key]').forEach(el => {
        const key = el.getAttribute('data-content-key');
        // This relies on the window.Content.get function from content_data.js
        if (window.Content && window.Content.get) {
            const translatedText = window.Content.get(key, lang);
            el.textContent = translatedText;
        }
    });

    // 3. Update structured data (e.g., project descriptions, timeline, etc.)
    // NOTE: This complex logic will be implemented here later.
    // For now, we only handle the static strings.
}

// Event listener for the language buttons
document.addEventListener('DOMContentLoaded', () => {
    // Determine initial language (you will use your URL logic here later)
    // For this mockup, we'll default to 'en'.
    let currentLang = 'en'; 

    // Initialize content
    updateContent(currentLang);

    // Attach click handlers to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = btn.getAttribute('data-lang');
            // In a live environment, this would navigate to the new URL:
            // window.location.href = `https://${newLang}.rahulnatha.com`;
            
            // For the mockup, we just update the content:
            updateContent(newLang);
        });
    });
});