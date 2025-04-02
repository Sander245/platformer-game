// Destructure Matter modules
const { Engine, Render, World, Bodies, Body, Events } = Matter;

// Set up canvas to fill full window
const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create the Matter engine and renderer
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

// --- Create Surfaces ---

// Ground: centered horizontally; height = 50, so top is at canvas.height - 50
const ground = Bodies.rectangle(
  canvas.width / 2,
  canvas.height - 25,  // center y (50/2 = 25 from bottom)
  canvas.width,
  50,
  {
    isStatic: true,
    render: { fillStyle: 'green' }
  }
);

// Platforms (all are 200x20):
const platforms = [
  Bodies.rectangle(300, canvas.height - 150, 200, 20, {
    isStatic: true,
    render: { fillStyle: 'brown' }
  }),
  Bodies.rectangle(600, canvas.height - 250, 200, 20, {
    isStatic: true,
    render: { fillStyle: 'brown' }
  }),
  Bodies.rectangle(900, canvas.height - 350, 200, 20, {
    isStatic: true,
    render: { fillStyle: 'brown' }
  })
];

// --- Create the Player ---

// The player is a 40x40 rectangle (by default it can rotate/roll)
const player = Bodies.rectangle(100, canvas.height - 75, 40, 40, {
  render: { fillStyle: 'red' }
});

// Add all bodies to the world
World.add(engine.world, [ground, player, ...platforms]);

// --- Input Handling ---

// Track key states for continuous movement
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
};

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

// --- Jump Delay ---
// When the player jumps, we record the time so that for a short period
// (while the player is overlapping a surface) additional jumps are not allowed.
const jumpDelay = 200; // milliseconds
let lastJumpTime = 0;

// --- Grounded Check ---
// This simple routine considers the player "grounded" if the bottom of its
// axis‑aligned bounding box is within a small tolerance of the top surface of
// either the ground or a platform.
// For the ground, the top is at canvas.height - 50 (since ground height is 50).
// For each platform (200x20), the top is platform.position.y - 10.
function isGrounded() {
  const tolerance = 7;
  const playerBottom = player.bounds.max.y;

  // Check ground; ground top = ground.position.y - (50 / 2) = ground.position.y - 25
  const groundTop = ground.position.y - 25;
  if (
    Math.abs(playerBottom - groundTop) < tolerance &&
    // Ensure horizontal overlap using the ground's bounds
    player.position.x > ground.bounds.min.x &&
    player.position.x < ground.bounds.max.x
  ) {
    return true;
  }

  // Check each platform. We assume each platform is 20px tall.
  for (let platform of platforms) {
    const platformTop = platform.position.y - 10; // 20/2
    if (
      Math.abs(playerBottom - platformTop) < tolerance &&
      player.position.x > platform.position.x - 100 && // half the platform's width (200/2)
      player.position.x < platform.position.x + 100
    ) {
      return true;
    }
  }
  return false;
}

// --- Movement Logic on Each Engine Update ---
Events.on(engine, 'beforeUpdate', function () {
  const now = Date.now();
  const speed = 5;
  const grounded = isGrounded();

  // Allow horizontal movement only when on a surface
  // and only if the jump delay has passed (to avoid false "grounded" read on jump)
  if (grounded && (now - lastJumpTime > jumpDelay)) {
    if (keys.ArrowLeft) {
      Body.setVelocity(player, { x: -speed, y: player.velocity.y });
    }
    if (keys.ArrowRight) {
      Body.setVelocity(player, { x: speed, y: player.velocity.y });
    }
  }

  // Handle jump. Check that:
  // 1. ArrowUp is pressed,
  // 2. The player is grounded (either on the ground OR on top of a platform),
  // 3. Enough time has passed since the last jump.
  if (keys.ArrowUp && grounded && (now - lastJumpTime > jumpDelay)) {
    Body.setVelocity(player, { x: player.velocity.x, y: -10 });
    lastJumpTime = now; // reset the jump timer
  }
});

// --- Resize Handling ---
// When the window is resized, update canvas size and adjust ground accordingly.
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render.options.width = canvas.width;
  render.options.height = canvas.height;

  // Reposition the ground (and update its vertices for rendering/collision)
  Body.setPosition(ground, { x: canvas.width / 2, y: canvas.height - 25 });
  // (Here we simply reposition; for a more robust solution you might recreate the ground.)
});

// --- Run Engine and Renderer ---
Engine.run(engine);
Render.run(render);
