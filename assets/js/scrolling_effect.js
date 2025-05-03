const element = document.getElementById("tab_bar90");
const scrollScaleFactor = 2; // Adjust this value to control the scale

element.addEventListener('wheel', (event) => {
    event.preventDefault();
    element.scrollLeft += event.deltaY * scrollScaleFactor;
});





let lastScrollTop = window.pageYOffset;
let isSnapping = false;

function onScroll() {
  const currentScrollTop = window.pageYOffset;
  const scrollingDown = currentScrollTop > lastScrollTop;
  lastScrollTop = currentScrollTop;

  if (!scrollingDown || isSnapping) return;

  const headings = document.querySelectorAll('.main_heading');

  for (let heading of headings) {
    const rect = heading.getBoundingClientRect();

    // If any heading is partly visible and below the top, snap it
    if (rect.top > 0 && rect.top < window.innerHeight) {
      isSnapping = true;
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Prevent repeated snaps while scrolling
      setTimeout(() => isSnapping = false, 500);
      break;
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });