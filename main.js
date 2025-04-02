const { Engine, Render, World, Bodies, Body, Events } = Matter;

// Set up canvas
const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

// Create platforms
const platforms = [
    Bodies.rectangle(300, canvas.height - 150, 200, 20, { isStatic: true, render: { fillStyle: 'brown' } }),
    Bodies.rectangle(600, canvas.height - 250, 200, 20, { isStatic: true, render: { fillStyle: 'brown' } }),
    Bodies.rectangle(900, canvas.height - 350, 200, 20, { isStatic: true, render: { fillStyle: 'brown' } })
];

// Create player
const player = Bodies.rectangle(100, canvas.height - 75, 40, 40, { 
    render: { fillStyle: 'red' }
});

// Add objects to the world
World.add(engine.world, [ground, player, ...platforms]);

// Track key states
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false
};

// Handle keydown and keyup events
document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.code)) {
        keys[event.code] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.code)) {
        keys[event.code] = false;
    }
});

// Check if player is grounded
function isGrounded() {
    const tolerance = 5; // Small tolerance for detecting ground contact
    return player.position.y + player.bounds.max.y >= ground.position.y - tolerance;
}

// Apply movement logic in each engine update
Events.on(engine, 'beforeUpdate', () => {
    const speed = 5;

    if (isGrounded()) {
        if (keys.ArrowLeft) {
            Body.setVelocity(player, { x: -speed, y: player.velocity.y });
        }
        if (keys.ArrowRight) {
            Body.setVelocity(player, { x: speed, y: player.velocity.y });
        }
    }

    if (keys.ArrowUp && isGrounded()) { // Jump only when grounded
        Body.setVelocity(player, { x: player.velocity.x, y: -10 });
    }
});

// Adjust canvas and objects when window resizes
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
