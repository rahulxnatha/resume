/*
 * scroll_effects.js
 * Controls all scroll-driven 3D animations and reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Define Elements ---
    const mainHeader = document.getElementById('main-header');
    const heroMotto = document.getElementById('hero-motto');
    const meshLayer = document.getElementById('geometric-layer-1');
    const cubeLayer = document.getElementById('geometric-layer-2');
    const feaShape = document.getElementById('fea-inspired-shape');
    const detailElement = document.querySelector('.project-details-1');

    const scene1 = document.getElementById('scene-fusion');
    const scene2 = document.getElementById('scene-core');
    
    // Calculate heights once
    const scene1Height = scene1.offsetHeight;
    const coreTop = scene2.offsetTop;

    // --- Utility function for scroll normalization ---
    function normalizeScroll(start, end, scrollPos) {
        if (scrollPos < start) return 0;
        if (scrollPos > end) return 1;
        return (scrollPos - start) / (end - start);
    }
    
    // --- Scroll Handler ---
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // 1. SCENE 1 CONTROL (0% to 100% of scene 1 height)
        const progress1 = normalizeScroll(0, scene1Height, scrollPos);

        // a. Title word reveal (0% to 30%) - For initial visual impact
        const wordRevealProgress = normalizeScroll(0, scene1Height * 0.3, scrollPos);
        document.querySelectorAll('.word-reveal').forEach((word, index) => {
            // Reveal sequentially
            if (wordRevealProgress > (index + 1) * 0.2) {
                word.style.opacity = 1;
            } else {
                word.style.opacity = 0.2;
            }
        });

        // b. Motto Fade In (30% to 50%)
        const mottoOpacity = normalizeScroll(scene1Height * 0.3, scene1Height * 0.5, scrollPos);
        heroMotto.style.opacity = mottoOpacity;
        
        // c. Geometric Mesh (Layer 1 - Rotation and Zoom Out)
        const meshRotationX = 45 + progress1 * 360; // Full 360 rotation
        const meshScale = 2 - progress1 * 1.5;      // Parallax zoom out
        // Use translateZ(0) to force GPU rendering
        meshLayer.style.transform = `rotateX(${meshRotationX}deg) scale(${meshScale}) translateZ(0)`;
        meshLayer.style.opacity = 0.3 + (1 - progress1) * 0.2; // Fade slightly as you scroll down
        
        // d. Geometric Cube (Layer 2 - 3D Rotation and Color Shift)
        const cubeRotationY = 30 + progress1 * 720; // Two full rotations
        const cubeRotationX = 15 + progress1 * 360; // One full rotation
        const hueShift = Math.floor(progress1 * 120); // Cyan (0) towards Blue (120)
        cubeLayer.style.transform = `rotateY(${cubeRotationY}deg) rotateX(${cubeRotationX}deg) translateZ(-500px)`;
        cubeLayer.style.borderColor = `hsl(${hueShift}, 100%, 50%)`;
        

        // 2. SCENE 2 CONTROL (Transition into the Analytical Core)
        // Starts transition when top of scene 2 is 50vh from the top of the viewport
        const progress2 = normalizeScroll(coreTop - window.innerHeight / 2, coreTop + window.innerHeight / 2, scrollPos);

        // a. FEA Shape Reveal (Fade in and dramatic skew)
        feaShape.style.opacity = progress2 * 0.8; 
        const feaRotation = progress2 * 30; // Aggressive rotation/skew
        feaShape.style.transform = `skewX(${feaRotation}deg) scale(${1 + progress2 * 0.2}) translateZ(0)`;
        
        // b. Details Fade In (Positioned on the left side)
        const detailOpacity = normalizeScroll(coreTop - window.innerHeight * 0.3, coreTop + window.innerHeight * 0.2, scrollPos);
        detailElement.style.opacity = detailOpacity;
        detailElement.style.transform = `translateX(${(1 - detailOpacity) * 50}px) translateY(-50%)`; // Slide from the left
    });
    
    // Set initial state and run once
    window.dispatchEvent(new Event('scroll'));
});