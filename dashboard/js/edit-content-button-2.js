// Function to set up Edit Content button with dynamic detection
function setupEditContentButton() {
    function attachEventListener() {
        const editContentBtn = document.getElementById("editContentBtn");
        if (editContentBtn) {
            editContentBtn.addEventListener("click", () => {
                if (currentSheetId) {
                    console.log("editContentBtn clicked, navigating to /dashboard/edit.html");
                    window.location.href = "/dashboard/edit.html";
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