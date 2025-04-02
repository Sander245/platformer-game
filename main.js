const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const gravity = 0.5;

const player = {// Matter.js setup
const { Engine, Render, World, Bodies, Body } = Matter;

const canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 400;

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

// Run the engine and renderer
Engine.run(engine);
Render.run(render);

    x: 50,
    y: 300,
    width: 30,
    height: 30,
    color: 'red',
    velocityY: 0,
    isJumping: false
};

const ground = {
    x: 0,
    y: canvas.height - 50,
    width: canvas.width,
    height: 50,
    color: 'green'
};

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function updatePlayer() {
    player.y += player.velocityY;
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    } else {
        player.velocityY += gravity;
    }
}

function handleKeyDown(event) {
    if (event.code === 'Space' && !player.isJumping) {
        player.velocityY = -10;
        player.isJumping = true;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(ground.x, ground.y, ground.width, ground.height, ground.color);
    drawRect(player.x, player.y, player.width, player.height, player.color);

    updatePlayer();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleKeyDown);
gameLoop();
