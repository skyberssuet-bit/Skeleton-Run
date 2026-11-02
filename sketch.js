let skeleton;
let obstacles = [];
let pumpkins = [];
let bits = [];
let stars = [];
let bats = [];
let groundY = 300;
let speed = 5;
let distance = 0;
let bonus = 0;
let score = 0;
let best = 0;
let state = 'start';
let spawnIn = 60;
let scrollX = 0;
let overTime = 0;
let hurtFlash = 0;

function setup() {
  createCanvas(480, 360);
  textFont('Courier New');
  for (let i = 0; i < 30; i++) {
    stars.push({ x: random(width), y: random(170), s: random(1, 3) });
  }
  for (let i = 0; i < 4; i++) {
    bats.push({ x: random(width), y: random(30, 140), s: random(0.6, 1.6) });
  }
  resetGame();
}

function resetGame() {
  skeleton = { x: 90, y: groundY, vy: 0, onGround: true };
  obstacles = [];
  pumpkins = [];
  bits = [];
  speed = 5;
  distance = 0;
  bonus = 0;
  score = 0;
  spawnIn = 60;
  hurtFlash = 0;
}

function draw() {
  drawScene();

  if (state === 'start') {
    drawSkeleton(skeleton.x, skeleton.y, true);
    textAlign(CENTER, CENTER);
    fill(255, 120, 20);
    textSize(40);
    text('SKELETON RUN', width / 2, 70);
    fill(255);
    textSize(14);
    text('Its halloween and this skeleton is late', width / 2, 118);
    text('for the graveyard party!!', width / 2, 138);
    fill(255, 215, 0);
    text('Jump over the tombstones', width / 2, 175);
    text('Grab pumpkins for +5', width / 2, 195);
    fill(255);
    text('Jump: space, up arrow, W, or click / tap', width / 2, 228);
    fill(200, 255, 210);
    textSize(20);
    text('Press jump to start', width / 2, 270);
    return;
  }

  if (state === 'over') {
    for (let i = 0; i < obstacles.length; i++) {
      drawObstacle(obstacles[i]);
    }
    drawBits();
    textAlign(CENTER, CENTER);
    fill(220, 30, 30);
    textSize(40);
    text('GAME OVER', width / 2, 85);
    fill(255);
    textSize(20);
    text('Score: ' + score, width / 2, 145);
    text('Best: ' + best, width / 2, 175);
    fill(200, 255, 210);
    textSize(16);
    text('Jump to run again', width / 2, 225);
    return;
  }

  distance += 0.3;
  speed = min(11, 5 + distance / 150);
  scrollX += speed;

  skeleton.vy += 0.8;
  skeleton.y += skeleton.vy;
  if (skeleton.y >= groundY) {
    skeleton.y = groundY;
    skeleton.vy = 0;
    skeleton.onGround = true;
  }

  spawnIn--;
  if (spawnIn <= 0) {
    addObstacle();
    spawnIn = random(50, 95);
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.x -= speed;
    drawObstacle(o);
    if (hitsSkeleton(o)) {
      die();
    }
    if (o.x < -60) {
      obstacles.splice(i, 1);
    }
  }

  for (let i = pumpkins.length - 1; i >= 0; i--) {
    let p = pumpkins[i];
    p.x -= speed;
    drawPumpkin(p);
    if (dist(p.x, p.y, skeleton.x, skeleton.y - 40) < 32) {
      bonus += 5;
      boom(p.x, p.y, 255, 120, 20, 14);
      pumpkins.splice(i, 1);
    } else if (p.x < -30) {
      pumpkins.splice(i, 1);
    }
  }

  drawSkeleton(skeleton.x, skeleton.y, skeleton.onGround);
  drawBits();

  score = floor(distance) + bonus;

  textAlign(LEFT, TOP);
  fill(255);
  textSize(16);
  text('Score: ' + score, 12, 10);
  textAlign(RIGHT, TOP);
  text('Best: ' + best, width - 12, 10);

  if (hurtFlash > 0) {
    noStroke();
    fill(255, 0, 0, hurtFlash * 12);
    rect(0, 0, width, height);
    hurtFlash--;
  }
}

function addObstacle() {
  let r = random();
  let o = { x: width + 40, type: 'small', w: 28, h: 38 };
  if (r > 0.75) {
    o = { x: width + 40, type: 'double', w: 62, h: 38 };
  } else if (r > 0.4) {
    o = { x: width + 40, type: 'tall', w: 30, h: 58 };
  }
  obstacles.push(o);

  if (random() < 0.45) {
    pumpkins.push({ x: width + 40 + random(100, 170), y: groundY - random(80, 115) });
  }
}

function hitsSkeleton(o) {
  let sx1 = skeleton.x - 10;
  let sx2 = skeleton.x + 10;
  let ox1 = o.x - o.w / 2 + 3;
  let ox2 = o.x + o.w / 2 - 3;
  let oy1 = groundY - o.h + 4;
  return sx2 > ox1 && sx1 < ox2 && skeleton.y > oy1;
}

function die() {
  state = 'over';
  overTime = millis();
  hurtFlash = 12;
  if (score > best) {
    best = score;
  }
  boom(skeleton.x, skeleton.y - 35, 235, 230, 210, 25);
}

function startGame() {
  resetGame();
  state = 'play';
}

function pressJump() {
  if (state === 'start') {
    startGame();
  } else if (state === 'over') {
    if (millis() - overTime > 500) {
      startGame();
    }
  } else if (skeleton.onGround) {
    skeleton.vy = -14;
    skeleton.onGround = false;
  }
}

function mousePressed() {
  pressJump();
}

function keyPressed() {
  if (key === ' ' || keyCode === UP_ARROW || key === 'w' || key === 'W') {
    pressJump();
    return false;
  }
}

function boom(x, y, r, g, b, n) {
  for (let i = 0; i < n; i++) {
    bits.push({
      x: x,
      y: y,
      vx: random(-4, 4),
      vy: random(-6, 1),
      life: 255,
      r: r,
      g: g,
      b: b
    });
  }
}

function drawBits() {
  for (let i = bits.length - 1; i >= 0; i--) {
    let b = bits[i];
    b.x += b.vx;
    b.y += b.vy;
    b.vy += 0.3;
    b.life -= 7;
    noStroke();
    fill(b.r, b.g, b.b, b.life);
    rect(b.x, b.y, 5, 5);
    if (b.life <= 0) {
      bits.splice(i, 1);
    }
  }
}

function drawSkeleton(x, y, running) {
  let swing = 0;
  if (running) {
    swing = sin(frameCount * 0.35 * speed / 5) * 10;
  } else {
    swing = 8;
  }

  stroke(235, 230, 210);
  strokeWeight(3);
  line(x, y - 26, x - swing, y);
  line(x, y - 26, x + swing, y);
  line(x, y - 26, x, y - 48);
  line(x, y - 44, x + swing * 0.8, y - 30);
  line(x, y - 44, x - swing * 0.8, y - 30);
  strokeWeight(2);
  line(x - 8, y - 31, x + 8, y - 31);
  line(x - 8, y - 37, x + 8, y - 37);
  line(x - 7, y - 43, x + 7, y - 43);

  noStroke();
  fill(235, 230, 210);
  ellipse(x, y - 58, 26, 24);
  rect(x - 8, y - 52, 16, 8);
  fill(20);
  ellipse(x - 5, y - 59, 7, 8);
  ellipse(x + 5, y - 59, 7, 8);
  triangle(x - 2, y - 54, x + 2, y - 54, x, y - 50);
  stroke(20);
  strokeWeight(1);
  line(x - 4, y - 47, x - 4, y - 44);
  line(x, y - 47, x, y - 44);
  line(x + 4, y - 47, x + 4, y - 44);
  noStroke();
}

function drawObstacle(o) {
  if (o.type === 'double') {
    drawTomb(o.x - 17, 28, 38);
    drawTomb(o.x + 17, 28, 38);
  } else {
    drawTomb(o.x, o.w, o.h);
  }
  if (o.type === 'tall') {
    fill(50, 50, 65);
    textAlign(CENTER, CENTER);
    textSize(9);
    text('RIP', o.x, groundY - o.h + 22);
  }
}

function drawTomb(cx, w, h) {
  noStroke();
  fill(105, 105, 125);
  rect(cx - w / 2, groundY - h + w / 2, w, h - w / 2);
  arc(cx, groundY - h + w / 2, w, w, PI, TWO_PI);
  stroke(60, 60, 78);
  strokeWeight(1);
  line(cx - 3, groundY - h + 12, cx + 2, groundY - h + 20);
  noStroke();
}

function drawPumpkin(p) {
  let y = p.y + sin(frameCount * 0.1 + p.x) * 4;
  noStroke();
  fill(255, 120, 20);
  ellipse(p.x, y, 32, 28);
  fill(235, 100, 10);
  ellipse(p.x - 9, y, 13, 27);
  ellipse(p.x + 9, y, 13, 27);
  fill(255, 120, 20);
  ellipse(p.x, y, 15, 28);
  fill(40, 120, 40);
  rect(p.x - 2, y - 18, 4, 7);
  fill(30, 10, 0);
  triangle(p.x - 8, y - 5, p.x - 3, y - 5, p.x - 5, y - 1);
  triangle(p.x + 3, y - 5, p.x + 8, y - 5, p.x + 5, y - 1);
  triangle(p.x - 6, y + 3, p.x + 6, y + 3, p.x, y + 8);
}

function drawBat(x, y, s) {
  let flap = sin(frameCount * 0.3 + x) * 6;
  noStroke();
  fill(35, 25, 50);
  ellipse(x, y, 9 * s, 9 * s);
  triangle(x - 3 * s, y, x - 16 * s, y - flap - 4 * s, x - 11 * s, y + 5 * s);
  triangle(x + 3 * s, y, x + 16 * s, y - flap - 4 * s, x + 11 * s, y + 5 * s);
}

function drawScene() {
  background(15, 10, 25);
  noStroke();

  fill(255);
  for (let i = 0; i < stars.length; i++) {
    ellipse(stars[i].x, stars[i].y, stars[i].s, stars[i].s);
  }

  fill(255, 240, 200);
  ellipse(400, 65, 60, 60);
  fill(235, 215, 170);
  ellipse(390, 57, 12, 12);
  ellipse(410, 75, 9, 9);

  for (let i = 0; i < bats.length; i++) {
    let b = bats[i];
    b.x -= b.s * 1.5;
    if (b.x < -20) {
      b.x = width + 20;
      b.y = random(30, 140);
    }
    drawBat(b.x, b.y + sin(frameCount * 0.05 + i) * 10, b.s);
  }

  fill(28, 20, 40);
  for (let i = 0; i < 6; i++) {
    let bx = ((i * 110 - scrollX * 0.3) % 660 + 660) % 660 - 60;
    rect(bx, groundY - 50, 24, 50);
    arc(bx + 12, groundY - 50, 24, 24, PI, TWO_PI);
  }

  fill(40, 30, 50);
  rect(0, groundY, width, height - groundY);

  stroke(65, 50, 80);
  strokeWeight(2);
  for (let i = 0; i < 10; i++) {
    let dx = ((i * 60 - scrollX) % 600 + 600) % 600 - 60;
    line(dx, groundY + 18, dx + 20, groundY + 18);
    line(dx + 30, groundY + 38, dx + 42, groundY + 38);
  }
  noStroke();

  fill(200, 200, 230, 20);
  ellipse(150 + sin(frameCount * 0.01) * 40, groundY + 8, 220, 24);
  ellipse(360 + cos(frameCount * 0.01) * 40, groundY + 20, 240, 24);
}
