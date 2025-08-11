const container = document.getElementById('pillContainer2');
let scrollSpeed = 1; // px per frame
let scrolling;

function startScrolling() {
  scrolling = requestAnimationFrame(scrollStep);
}

function stopScrolling() {
  cancelAnimationFrame(scrolling);
}

function scrollStep() {
  container.scrollLeft += scrollSpeed;
  // Loop back to start for infinite effect
  if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
    container.scrollLeft = 0;
  }
  scrolling = requestAnimationFrame(scrollStep);
}

// Start auto-scroll
startScrolling();

// Pause on hover
container.addEventListener('mouseenter', stopScrolling);
container.addEventListener('mouseleave', startScrolling);

// Button scroll
document.querySelector('.scroll-left').addEventListener('click', () => {
  container.scrollLeft -= 100;
});
document.querySelector('.scroll-right').addEventListener('click', () => {
  container.scrollLeft += 100;
});