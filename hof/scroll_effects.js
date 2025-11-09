/*
 * scroll_effects.js
 * Controls all scroll-driven animations and reveals for the cinematic effect.
 */

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('main-header');
    const heroTitle = document.getElementById('hero-title');
    const heroMotto = document.getElementById('hero-motto');
    const fusionShape = document.getElementById('fusion-geometric-shape');
    
    // Elements for Scene 2
    const sceneCore = document.getElementById('scene-core');
    const vizElement = document.getElementById('matlab-spring-visualization');
    const detailElement = document.querySelector('.project-details-1');
    
    // Total height of the first scene, used to normalize scroll (0 to 1)
    const scene1Height = document.getElementById('scene-fusion').offsetHeight;
    const scene2Height = sceneCore.offsetHeight;

    // --- Utility function for scroll normalization ---
    function normalizeScroll(start, end, scrollPos) {
        if (scrollPos < start) return 0;
        if (scrollPos > end) return 1;
        return (scrollPos - start) / (end - start);
    }
    
    // --- Scroll Handler ---
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // 1. HEADER CONTROL (Fade out navigation on scroll)
        if (scrollPos > 50) {
            mainHeader.style.opacity = 0.8;
        } else {
            mainHeader.style.opacity = 1;
        }
        
        // --- SCENE 1: FUSION (0 to 100% of scene 1 height) ---
        const scrollProgress1 = normalizeScroll(0, scene1Height, scrollPos);

        // a. Title word reveal (0% to 30%)
        const wordRevealProgress = normalizeScroll(0, scene1Height * 0.3, scrollPos);
        document.querySelectorAll('.word-reveal').forEach((word, index) => {
            if (wordRevealProgress > (index + 1) * 0.2) {
                word.style.opacity = 1;
            } else {
                word.style.opacity = 0.2;
            }
        });

        // b. Motto Fade In (30% to 50%)
        const mottoOpacity = normalizeScroll(scene1Height * 0.3, scene1Height * 0.5, scrollPos);
        heroMotto.style.opacity = mottoOpacity;
        
        // c. Shape/Hero Fade Out (50% to 100%)
        const shapeOpacity = 1 - normalizeScroll(scene1Height * 0.5, scene1Height, scrollPos);
        fusionShape.style.opacity = shapeOpacity * 0.5; // Max opacity 0.5
        heroTitle.style.transform = `scale(${1 + scrollProgress1 * 0.2}) translateZ(0)`; // Slight zoom

        
        // --- SCENE 2: ANALYTICAL CORE (When scene 2 comes into view) ---
        const coreTop = sceneCore.offsetTop;
        const scrollProgress2 = normalizeScroll(coreTop, coreTop + scene2Height, scrollPos);

        // a. Visualization Pin and Reveal (0% to 20% of Scene 2)
        const vizOpacity = normalizeScroll(coreTop, coreTop + scene2Height * 0.2, scrollPos);
        vizElement.style.opacity = vizOpacity;
        
        // b. Details Fade In (20% to 40%)
        const detailOpacity = normalizeScroll(coreTop + scene2Height * 0.2, coreTop + scene2Height * 0.4, scrollPos);
        detailElement.style.opacity = detailOpacity;

        // c. Viz Scale Down/Blur (40% to 100%)
        const vizScale = 1 - normalizeScroll(coreTop + scene2Height * 0.4, coreTop + scene2Height, scrollPos) * 0.4;
        vizElement.style.transform = `scale(${vizScale}) translateZ(0)`; 
        vizElement.style.filter = `blur(${scrollProgress2 * 5}px)`; 
    });
    
    // Initial setup to run the function once (to set starting opacity)
    window.dispatchEvent(new Event('scroll'));
});