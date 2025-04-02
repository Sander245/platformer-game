// --------------------------
// Global Error Handling
// --------------------------

// This function updates the top text with error details.
function showErrorMessage(message) {
  const topTextElement = document.getElementById("top-text");
  if (topTextElement) {
    topTextElement.textContent = message;
    topTextElement.style.color = 'red';
  }
}

// Catch any global errors.
window.addEventListener('error', (event) => {
  const errorMsg = `Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
  showErrorMessage(errorMsg);
});

// Also handle unhandled promise rejections.
window.addEventListener('unhandledrejection', (event) => {
  const errorMsg = `Unhandled Promise Rejection: ${event.reason}`;
  showErrorMessage(errorMsg);
});

// --------------------------
// Set Up Matter.js and PIXI.js
// --------------------------

// Alias Matter.js modules for convenience.
const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events;

// Create a Matter.js engine and world.
const engine = Engine.create();
const world = engine.world;

// Create a PIXI application.
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

// --------------------------
// Create Physics Bodies
// --------------------------

// Player dimensions.
const playerWidth = 40;
const playerHeight = 60;

// Create a dynamic player body.
const player = Bodies.rectangle(100, 300, playerWidth, playerHeight, {
  restitution: 0,
  friction: 0.01,
  mass: 1,
});
World.add(world, player);

// Create a static ground body.
const ground = Bodies.rectangle(
  app.screen.width / 2,
  app.screen.height - 20,
  app.screen.width,
  40,
  { isStatic: true }
);
World.add(world, ground);

// Create two static platform bodies.
const platform1 = Bodies.rectangle(300, app.screen.height - 100, 200, 20, {
  isStatic: true,
});
const platform2 = Bodies.rectangle(600, app.screen.height - 200, 200, 20, {
  isStatic: true,
});
World.add(world, [platform1, platform2]);

// --------------------------
// Create PIXI Graphics for Each Body
// --------------------------

// Player sprite: a red rectangle.
const playerGraphics = new PIXI.Graphics();
playerGraphics.beginFill(0xff0000);
playerGraphics.drawRect(-playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight);
playerGraphics.endFill();
app.stage.addChild(playerGraphics);

// Ground sprite: a green rectangle.
const groundWidth = app.screen.width,
  groundHeight = 40;
const groundGraphics = new PIXI.Graphics();
groundGraphics.beginFill(0x00ff00);
groundGraphics.drawRect(-groundWidth / 2, -groundHeight / 2, groundWidth, groundHeight);
groundGraphics.endFill();
app.stage.addChild(groundGraphics);

// Platform sprites: blue rectangles.
const platformWidth = 200,
  platformHeight = 20;

const platformGraphics1 = new PIXI.Graphics();
platformGraphics1.beginFill(0x0000ff);
platformGraphics1.drawRect(-platformWidth / 2, -platformHeight / 2, platformWidth, platformHeight);
platformGraphics1.endFill();
app.stage.addChild(platformGraphics1);

const platformGraphics2 = new PIXI.Graphics();
platformGraphics2.beginFill(0x0000ff);
platformGraphics2.drawRect(-platformWidth / 2, -platformHeight / 2, platformWidth, platformHeight);
platformGraphics2.endFill();
app.stage.addChild(platformGraphics2);

// --------------------------
// Keyboard Controls
// --------------------------

const keys = {};

// Listen for keydown events.
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Allows jump only when the player is grounded.
let canJump = false;

// Matter.js collision events to detect ground contact.
Events.on(engine, "collisionStart", function (event) {
  event.pairs.forEach((pair) => {
    if (pair.bodyA === player || pair.bodyB === player) {
      canJump = true;
    }
  });
});

Events.on(engine, "collisionEnd", function (event) {
  event.pairs.forEach((pair) => {
    if (pair.bodyA === player || pair.bodyB === player) {
      canJump = false;
    }
  });
});

// --------------------------
// Game Loop
// --------------------------

app.ticker.add((delta) => {
  // Update the Matter.js engine.
  Engine.update(engine, 1000 / 60);

  // Apply forces based on key presses.
  const forceMagnitudeX = 0.005;
  const forceMagnitudeY = 0.015;
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    Body.applyForce(player, player.position, { x: -forceMagnitudeX, y: 0 });
  }
  if (keys["ArrowRight"] || keys["KeyD"]) {
    Body.applyForce(player, player.position, { x: forceMagnitudeX, y: 0 });
  }
  if ((keys["ArrowUp"] || keys["KeyW"] || keys["Space"]) && canJump) {
    Body.applyForce(player, player.position, { x: 0, y: -forceMagnitudeY });
    canJump = false;
  }

  // Sync the PIXI graphics with the Matter.js bodies.
  playerGraphics.x = player.position.x;
  playerGraphics.y = player.position.y;
  playerGraphics.rotation = player.angle;

  groundGraphics.x = ground.position.x;
  groundGraphics.y = ground.position.y;
  groundGraphics.rotation = ground.angle;

  platformGraphics1.x = platform1.position.x;
  platformGraphics1.y = platform1.position.y;
  platformGraphics1.rotation = platform1.angle;

  platformGraphics2.x = platform2.position.x;
  platformGraphics2.y = platform2.position.y;
  platformGraphics2.rotation = platform2.angle;
});
