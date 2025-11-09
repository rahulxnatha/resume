/*
 * mouse_parallax.js
 * Applies subtle 3D parallax transformation to background layers based on mouse movement.
 */

document.addEventListener('DOMContentLoaded', () => {
    const layers = document.querySelectorAll('.parallax-layer');
    const container = document.getElementById('parallax-container');

    // --- Main Mouse Handler ---
    document.addEventListener('mousemove', (e) => {
        // Center mouse coordinates relative to the viewport (normalized -1 to 1)
        const x = (e.clientX / window.innerWidth) - 0.5; 
        const y = (e.clientY / window.innerHeight) - 0.5;

        layers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth'));
            
            // Calculate movement based on depth: deeper layers move less
            const translateX = x * 100 * depth;
            const translateY = y * 100 * depth;

            // Calculate subtle rotation based on mouse position
            const rotateY = x * 10 * -1; // Rotate opposite to mouse X movement
            const rotateX = y * 10;     // Rotate along mouse Y movement

            // Apply translation for parallax effect
            layer.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
            
            // Apply rotation to the specific 3D geometry layers
            if (layer.id === 'geometric-cube') {
                 // Adjust initial fixed rotation with dynamic mouse rotation
                layer.style.transform += ` rotateY(${45 + rotateY}deg) rotateX(${15 + rotateX}deg) translateZ(-500px)`;
            }
            if (layer.id === 'geometric-plane') {
                layer.style.transform += ` rotateX(${80 + rotateX}deg) rotateZ(${10 + rotateY}deg) translateZ(-800px)`;
            }
        });
    });
});