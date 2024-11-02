const searchInput = document.getElementById("search_bar");
let timeout;                  // To handle the delay timer
let lastKeyTime = 0;          // To record the time of the last key press
let typingIntervals = [];     // To store intervals between keystrokes
const INITIAL_DELAY = 4000;   // Minimum threshold delay of 4 seconds
const MINIMUM_DELAY = 900;    // Minimum delay before performing search to prevent instant action

searchInput.addEventListener("input", () => {
    const currentTime = Date.now();
    
    // Check if this is the first key press
    if (lastKeyTime !== 0) {
        // Calculate interval since the last key press
        const interval = currentTime - lastKeyTime;
        typingIntervals.push(interval);
        
        // Keep only the last 5 intervals for a smooth average
        if (typingIntervals.length > 5) typingIntervals.shift();
    }
    
    // Update last key press time
    lastKeyTime = currentTime;

    // Calculate average typing speed
    const averageTypingSpeed = typingIntervals.reduce((a, b) => a + b, 0) / typingIntervals.length || INITIAL_DELAY;

    // Adjust search delay: use averageTypingSpeed but clamp between MINIMUM_DELAY and INITIAL_DELAY
    const dynamicDelay = Math.min(INITIAL_DELAY, Math.max(MINIMUM_DELAY, averageTypingSpeed));

    // Clear previous timeout if the user is still typing
    clearTimeout(timeout);

    // Set a new timeout based on the dynamic delay
    timeout = setTimeout(() => {
        performSearch();
        lastKeyTime = 0;         // Reset after search is performed
        typingIntervals = [];    // Clear intervals
    }, dynamicDelay);
});

function performSearch() {
    document.getElementById('search_button_action').click();
}
