
var A_isDragging = false;
var A_initialX;
var A_initialY;
var A_offsetX = 0;
var A_offsetY = 0;

const viewport = document.getElementById('viewPort');

viewport.addEventListener('mousedown', (e) => {
    const A_resizeHandleWidth = 10; // Adjust this value as needed
    const A_isResizeClick =
        e.clientX >= viewport.offsetWidth - A_resizeHandleWidth &&
        e.clientY >= viewport.offsetHeight - A_resizeHandleWidth;

    if (!A_isResizeClick) {
        A_isDragging = true;
        A_initialX = e.clientX - A_offsetX;
        A_initialY = e.clientY - A_offsetY;
        viewport.style.cursor = 'grabbing';
    }
});

document.addEventListener('mousemove', (e) => {
    if (!A_isDragging) return;

    const A_currentX = e.clientX - A_initialX;
    const A_currentY = e.clientY - A_initialY;
    A_offsetX = A_currentX;
    A_offsetY = A_currentY;

    viewport.style.transform = `translate(${A_currentX}px, ${A_currentY}px)`;
});

document.addEventListener('mouseup', () => {
    A_isDragging = false;
    viewport.style.cursor = 'grab';
});
viewport.style.cursor = 'grab';