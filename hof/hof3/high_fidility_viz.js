/*
 * high_fidelity_viz.js
 * Generates the FEA-inspired SVG mesh and manages 3D structure rotation.
 */

// --- 1. SVG Mesh Generation (The "FEA Topology" Effect) ---
function generateTopologyMesh(containerId, gridSize = 20, lineDensity = 1) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 1000; // Fixed canvas size for SVG scale
    const height = 1000;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Create a procedural grid of lines and circles
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const x1 = (i / gridSize) * width;
            const y1 = (j / gridSize) * height;

            // Draw horizontal lines
            if (i < gridSize - 1) {
                const lineH = document.createElementNS("http://www.w3.org/2000/svg", "line");
                lineH.setAttribute('x1', x1);
                lineH.setAttribute('y1', y1);
                lineH.setAttribute('x2', ((i + 1) / gridSize) * width);
                lineH.setAttribute('y2', y1);
                lineH.setAttribute('stroke', 'rgba(0, 255, 255, 0.1)');
                svg.appendChild(lineH);
            }

            // Draw vertical lines
            if (j < gridSize - 1) {
                const lineV = document.createElementNS("http://www.w3.org/2000/svg", "line");
                lineV.setAttribute('x1', x1);
                lineV.setAttribute('y1', y1);
                lineV.setAttribute('x2', x1);
                lineV.setAttribute('y2', ((j + 1) / gridSize) * height);
                lineV.setAttribute('stroke', 'rgba(0, 255, 255, 0.1)');
                svg.appendChild(lineV);
            }

            // Draw nodes (FEA points)
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute('cx', x1);
            circle.setAttribute('cy', y1);
            circle.setAttribute('r', 1.5);
            circle.setAttribute('fill', 'rgba(255, 255, 255, 0.3)');
            svg.appendChild(circle);
        }
    }
    
    container.appendChild(svg);
    // Initial large rotation for perspective
    container.style.transform = `rotateX(60deg) rotateY(0deg) translateZ(-500px)`; 
}

// --- 2. Mouse Interaction for Stability ---
function initMouseParallax() {
    const cube = document.getElementById('css-structure-cube');
    const mesh = document.getElementById('mesh-container');
    
    // Initial 3D settings
    const initialCubeTransform = { x: -30, y: 45, z: -500 }; 
    const initialMeshTransform = { x: 60, y: 0, z: -500 }; 

    document.addEventListener('mousemove', (e) => {
        // Normalize mouse movement to -1 to 1 for smooth control
        const x = (e.clientX / window.innerWidth - 0.5) * 2; 
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        // Subtle Parallax Tilt on the Cube
        const tiltX = initialCubeTransform.x + y * 5; 
        const tiltY = initialCubeTransform.y - x * 5; 
        cube.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${initialCubeTransform.z}px)`;

        // Subtle Parallax Rotation on the Mesh
        const meshTiltX = initialMeshTransform.x - y * 2; 
        const meshTiltY = initialMeshTransform.y + x * 2; 
        mesh.style.transform = `rotateX(${meshTiltX}deg) rotateY(${meshTiltY}deg) translateZ(${initialMeshTransform.z}px)`;
    });
}

// --- 3. Dynamic Text Glows ---
function initGlowEffects() {
    // Wrap key elements in spans for the interactive glow
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        // Rebuild title with interactive glow spans
        const titleText = heroTitle.textContent;
        const glowingWords = titleText.split(' | ').map(word => 
            `<span class="glow-on-hover">${word.trim()}</span>`
        ).join(' | ');
        heroTitle.innerHTML = glowingWords;
    }
    
    // Add other elements here (e.g., section titles, key phrases in the bio)
}


document.addEventListener('DOMContentLoaded', () => {
    generateTopologyMesh('mesh-container');
    initMouseParallax();
    initGlowEffects();
});