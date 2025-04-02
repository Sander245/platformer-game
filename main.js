const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const gravity = 0.5;

const player = {
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
