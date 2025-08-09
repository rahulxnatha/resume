// Function to set up Edit Content button with dynamic detection
function setupEditContentButton() {
    function attachEventListener() {
        const editContentBtn = document.getElementById("editContentBtn");
        if (editContentBtn) {
            editContentBtn.addEventListener("click", () => {
                if (currentSheetId) {
                    const sheetUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/edit`;
                    console.log(`Attempting to open sheet URL: ${sheetUrl}`);
                    const newWindow = window.open(sheetUrl, "_blank");
                    if (!newWindow) {
                        console.warn("Failed to open new tab. Pop-up blocker may be enabled.");
                        alert("Unable to open the sheet. Please ensure pop-ups are allowed and try again.");
                    }
                } else {
                    console.warn("No sheet ID available for editing. Current sheetId:", currentSheetId);
                    alert("No sheet ID available. Please enter a valid dashboard key.");
                }
            });
            return true;
        }
        console.warn("Element with id='editContentBtn' not found in the DOM.");
        return false;
    }

    // Try attaching immediately
    if (!attachEventListener()) {
        // Set up MutationObserver to detect when editContentBtn is added to DOM
        const observer = new MutationObserver((mutations, obs) => {
            if (attachEventListener()) {
                obs.disconnect(); // Stop observing once the button is found
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}