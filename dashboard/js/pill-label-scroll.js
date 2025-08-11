const container = document.getElementById('pillContainer2');
let scrollSpeed = 1; // px per frame
let scrolling;

function startScrolling() {
  scrolling = requestAnimationFrame(scrollStep);
}

function stopScrolling() {
  cancelAnimationFrame(scrolling);
}

function startCycleWithDelay() {
  stopScrolling(); // just in case
  setTimeout(() => {
    startScrolling();
  }, 6000); // 6s delay before cycle starts
}

function scrollStep() {
  container.scrollLeft += scrollSpeed;

  // If reached the end
  if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
    stopScrolling();
    setTimeout(() => {
      container.scrollLeft = 0; // reset
      startCycleWithDelay(); // pause before next cycle
    }, 6000); // pause after finishing current cycle
    return;
  }

  scrolling = requestAnimationFrame(scrollStep);
}

// First cycle
startCycleWithDelay();

// Pause on hover
container.addEventListener('mouseenter', stopScrolling);
container.addEventListener('mouseleave', startScrolling);
