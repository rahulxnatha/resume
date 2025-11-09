/*
 * kinetic_effect.js
 * Generates a subtle, low-opacity animated particle/dot effect on the canvas.
 * This effect symbolizes data flow and technical precision.
 */

const canvas = document.getElementById('kinetic-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

// Resize canvas on window resize
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        // Subtle movement
        this.velocity = {
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1
        };
        // Electric Blue color, very low opacity
        this.color = 'rgba(0, 255, 255, 0.5)'; 
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        // Bounce off edges (optional: makes it feel more "contained")
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}

// Initialization function
function initParticles() {
    particles = [];
    const particleCount = 100; // Keep it low for a subtle effect and performance
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 1.5 + 0.5; // Small dots
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y, radius));
    }
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    // Draw a semi-transparent black rectangle over the previous frame
    // This creates a "trail" effect and slowly fades old particles (key to the kinetic look)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
    });
}

// Start everything up
window.addEventListener('load', () => {
    resizeCanvas();
    initParticles();
    animate();
});

window.addEventListener('resize', resizeCanvas);