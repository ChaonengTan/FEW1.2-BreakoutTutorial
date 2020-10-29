/* eslint-disable no-alert */

// constants
const color = 'red';
// bricks
const bricks = [];
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
// canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// paddle
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;

// variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;

for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// functions
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}
// draw functions
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = color;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = color;
  ctx.fillText(`Score: ${score}`, 8, 20);
}
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
// custom background
function createGradiant() {
  // skyGrad
  const grd = ctx.createLinearGradient(0, 0, 0, 320);
  grd.addColorStop(0, 'cornflowerblue');
  grd.addColorStop(1, 'white');

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 480, 320);
}
function drawCloud(xposition, yposition) {
  // cloud
  ctx.beginPath();
  ctx.arc(xposition, yposition, 30, 0, Math.PI * 2);
  ctx.arc(xposition + 30, yposition, 25, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
}
function drawBG() {
  createGradiant();
  drawCloud(100, 60);
  drawCloud(300, 100);
}
// key/mouse handlers
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}
function paddleMove() {
  // moves the paddle when keyPressed
  if (rightPressed) {
    paddleX += 7;
  } else if (leftPressed) {
    paddleX -= 7;
  }
}
function wallsCollison() {
  // walls, misses, subtracts lives
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives -= 1;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
}
function moveBall() {
  // moves the ball by dx/dy
  x += dx;
  y += dy;
}
function drawElements() {
  // draws certain elements
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}
// event handlers
document.addEventListener('mousemove', mouseMoveHandler, false);
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// main exe
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBG();
  drawElements();
  collisionDetection();
  drawLives();
  wallsCollison();
  paddleMove();

  moveBall();
  requestAnimationFrame(draw);
}
draw();
