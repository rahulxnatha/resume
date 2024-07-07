const element = document.getElementById("tab_bar90");
const scrollScaleFactor = 2; // Adjust this value to control the scale

element.addEventListener('wheel', (event) => {
    event.preventDefault();
    element.scrollLeft += event.deltaY * scrollScaleFactor;
});
