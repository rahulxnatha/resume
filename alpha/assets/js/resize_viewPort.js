// let isDragging = false;
// let initialX;
// let initialY;
// let offsetX = 0;
// let offsetY = 0;

// const viewport = document.getElementById('viewPort');

// viewport.addEventListener('mousedown', (e) => {
//     // Check if the click was on the resize handle (bottom right corner)
//     const resizeHandleWidth = 10; // Adjust this value as needed
//     const isResizeClick = 
//         e.clientX >= viewport.offsetWidth - resizeHandleWidth && 
//         e.clientY >= viewport.offsetHeight - resizeHandleWidth;

//     if (!isResizeClick) {
//         isDragging = true;
//         initialX = e.clientX - offsetX;
//         initialY = e.clientY - offsetY;
//         viewport.style.cursor = 'grabbing';
//     }
// });

// document.addEventListener('mousemove', (e) => {
//     if (!isDragging) return;
    
//     const currentX = e.clientX - initialX;
//     const currentY = e.clientY - initialY;
    
//     offsetX = currentX;
//     offsetY = currentY;

//     viewport.style.transform = `translate(${currentX}px, ${currentY}px)`;
// });

// document.addEventListener('mouseup', () => {
//     isDragging = false;
//     viewport.style.cursor = 'grab';
// });
