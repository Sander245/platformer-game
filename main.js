// Alias Matter modules for convenience.
const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events;

// Create Matter.js engine and world.
const engine = Engine.create();
const world = engine.world;

// Create a PIXI application.
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

// ----------
// Create Physics Bodies
// ----------

// Dimensions for the player rectangle.
const playerWidth = 40;
const playerHeight = 60;

// Create the player body: a dynamic rectangle.
const player = Bodies.rectangle(100, 300, playerWidth, playerHeight, {
  restitution: 0,
  friction: 0.01,
  mass: 1,
});
World.add(world, player);

// Create the ground (static) body.
// Here, we create a wide rectangle that spans the bottom of the viewport.
const ground = Bodies.rectangle(
  app.screen.width / 2,
  app.screen.height - 20,
  app.screen.width,
  40,
  { isStatic: true }
);
World.add(world, ground);

// Create two platforms as static bodies.
const platform1 = Bodies.rectangle(300, app.screen.height - 100, 200, 20, {
  isStatic: true,
});
const platform2 = Bodies.rectangle(600, app.screen.height - 200, 200, 20, {
  isStatic: true,
});
World.add(world, [platform1, platform2]);

// ----------
// Create PIXI Graphics for Each Body
// ----------

// For a smoother sync between Matter.js bodies and PIXI visuals it is easiest
// to draw each rectangle with its center at (0,0) so we only need to update
// position and rotation of the container.

//
// Player sprite: drawn as a red rectangle.
const playerGraphics = new PIXI.Graphics();
playerGraphics.beginFill(0xff0000);
playerGraphics.drawRect(-playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight);
playerGraphics.endFill();
app.stage.addChild(playerGraphics);

//
// Ground sprite: drawn as a green rectangle.
const groundWidth = app.screen.width,
  groundHeight = 40;
const groundGraphics = new PIXI.Graphics();
groundGraphics.beginFill(0x00ff00);
groundGraphics.drawRect(-groundWidth / 2, -groundHeight / 2, groundWidth, groundHeight);
groundGraphics.endFill();
app.stage.addChild(groundGraphics);

//
// Platform sprites: drawn as blue rectangles.
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

// ----------
// Keyboard Controls
// ----------

// A simple object to keep track of which keys are pressed.
const keys = {};

// Basic controls:
//   Left/Right: ArrowLeft or ArrowRight (or A/D)
//   Jump: ArrowUp, W, or Space
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// To allow a jump only when the player is on a platform,
// we set a flag when collisions occur.
let canJump = false;

// Use Matter's collision events to detect when the player touches other bodies.
Events.on(engine, "collisionStart", function (event) {
  event.pairs.forEach((pair) => {
    // If the player is involved in the collision, allow jumping.
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

// ----------
// Game Loop
// ----------

// Use PIXI's ticker to update our physics engine and render our sprites.
app.ticker.add((delta) => {
  // Update physics engine using a fixed timestep (16.67ms for ~60fps).
  Engine.update(engine, 1000 / 60);

  // --- Player Movement --- //
  const forceMagnitudeX = 0.005;
  const forceMagnitudeY = 0.015;
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    Body.applyForce(player, player.position, { x: -forceMagnitudeX, y: 0 });
  }
  if (keys["ArrowRight"] || keys["KeyD"]) {
    Body.applyForce(player, player.position, { x: forceMagnitudeX, y: 0 });
  }
  if ((keys["ArrowUp"] || keys["KeyW"] || keys["Space"]) && canJump) {
    // Apply an upward force to simulate a jump.
    Body.applyForce(player, player.position, { x: 0, y: -forceMagnitudeY });
    // Prevent continuous jumping.
    canJump = false;
  }

  // --- Sync PIXI Graphics with Matter Bodies --- //
  // Update the player sprite.
  playerGraphics.x = player.position.x;
  playerGraphics.y = player.position.y;
  playerGraphics.rotation = player.angle;

  // Update the ground sprite.
  groundGraphics.x = ground.position.x;
  groundGraphics.y = ground.position.y;
  groundGraphics.rotation = ground.angle;

  // Update platform sprites.
  platformGraphics1.x = platform1.position.x;
  platformGraphics1.y = platform1.position.y;
  platformGraphics1.rotation = platform1.angle;

  platformGraphics2.x = platform2.position.x;
  platformGraphics2.y = platform2.position.y;
  platformGraphics2.rotation = platform2.angle;
});
