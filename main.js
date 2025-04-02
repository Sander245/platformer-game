// Matter.js setup
const { Engine, Render, World, Bodies, Body } = Matter;

const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;  // Fit canvas width to screen width
canvas.height = window.innerHeight; // Fit canvas height to screen height

// Create engine and renderer
const engine = Engine.create();
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
        background: '#87CEEB',
    }
});

// Create ground
const ground = Bodies.rectangle(canvas.width / 2, canvas.height - 25, canvas.width, 50, { 
    isStatic: true,
    render: { fillStyle: 'green' } 
});

// Create player
const player = Bodies.rectangle(100, canvas.height - 75, 40, 40, { 
    render: { fillStyle: 'red' } 
});

// Add objects to the world
World.add(engine.world, [ground, player]);

// Handle player movement
document.addEventListener('keydown', (event) => {
    const speed = 5;
    if (event.code === 'ArrowLeft') {
        Body.setVelocity(player, { x: -speed, y: player.velocity.y });
    } else if (event.code === 'ArrowRight') {
        Body.setVelocity(player, { x: speed, y: player.velocity.y });
    } else if (event.code === 'ArrowUp' && player.position.y >= canvas.height - 75) {
        Body.setVelocity(player, { x: player.velocity.x, y: -10 });
    }
});

// Update canvas size dynamically when the window resizes
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    render.options.width = canvas.width;
    render.options.height = canvas.height;

    Body.setPosition(ground, { x: canvas.width / 2, y: canvas.height - 25 });
});

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
