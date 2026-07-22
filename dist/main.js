// src/obj/thruster.js
window.downPressed = false;
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 40)
    window.downPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 40)
    window.downPressed = false;
});

class Thruster {
  constructor() {
    this.height = Thruster.HEIGHT;
    this.width = Thruster.WIDTH;
    this.tposY = 400;
    this.tposX = 440;
    this.tposYMax = 0;
  }
  draw(ctx) {
    if (window.downPressed && this.tposY < 480) {
      this.tposY += 1;
    } else if (!window.downPressed && this.tposY > 400) {
      if (this.tposY > this.tposYMax)
        this.tposYMax = this.tposY;
      this.tposY -= this.tposYMax % 16 === 0 ? 17 : 16;
    }
    if (this.tposY === 400)
      this.tposYMax = 0;
  }
}
Thruster.HEIGHT = 60;
Thruster.WIDTH = 30;
Thruster.COLOR = "blue";
var thruster_default = Thruster;

// src/ball.js
var gravity = 0.18;
var elasticity = 0.7;
class Ball {
  constructor() {
    this.radius = Ball.RADIUS;
    this.color = Ball.COLOR;
    this.ballPosX = 445;
    this.ballPosY = 384;
    this.ballVelX = 0;
    this.ballVelY = 0;
    this.elasticity = elasticity;
    this.bounced = false;
    this._collisionData = null;
  }
  draw(ctx) {
    let img = new Image;
    img.src = "../assets/cool-color-circle.gif";
    let pat = ctx.createPattern(img, "repeat");
    ctx.beginPath();
    ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = pat;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.ballVelY += gravity;
    this.speed = Math.sqrt(this.ballVelX * this.ballVelX + this.ballVelY * this.ballVelY);
    if (this.speed > 0) {
      this.dnorm = { x: this.ballVelX / this.speed, y: this.ballVelY / this.speed };
    } else {
      this.dnorm = { x: 0, y: 0 };
    }
    this.ballPosY += this.ballVelY;
    this.ballPosX += this.ballVelX;
  }
  thrust() {
    this.ballVelY = -12;
  }
  firstReflect() {
    this.ballVelX = Math.random() * 0.07 - 2.6;
    this.ballVelY = Math.random() * 0.3 + 3.1;
  }
  isCollidedWithLine(obj) {
    if (!obj.pos1 || !obj.pos2)
      return this._isCollidedWithLineLegacy(obj);
    let ax = obj.pos1.x, ay = obj.pos1.y;
    let bx = obj.pos2.x, by = obj.pos2.y;
    let cx = this.ballPosX, cy = this.ballPosY;
    let abx = bx - ax, aby = by - ay;
    let acx = cx - ax, acy = cy - ay;
    let ab2 = abx * abx + aby * aby;
    if (ab2 === 0) {
      let dx2 = cx - ax, dy2 = cy - ay;
      let dist22 = dx2 * dx2 + dy2 * dy2;
      if (dist22 < this.radius * this.radius) {
        let dist = Math.sqrt(dist22);
        if (dist === 0)
          return false;
        this._collisionData = { px: ax, py: ay, nx: dx2 / dist, ny: dy2 / dist, dist };
        return true;
      }
      return false;
    }
    let t = Math.max(0, Math.min(1, (acx * abx + acy * aby) / ab2));
    let px = ax + t * abx;
    let py = ay + t * aby;
    let dx = cx - px, dy = cy - py;
    let dist2 = dx * dx + dy * dy;
    if (dist2 < this.radius * this.radius && dist2 > 0) {
      let dist = Math.sqrt(dist2);
      this._collisionData = { px, py, nx: dx / dist, ny: dy / dist, dist };
      return true;
    }
    return false;
  }
  _isCollidedWithLineLegacy(obj) {
    let distX = Math.abs(this.ballPosX - obj.mid.x);
    let distY = Math.abs(this.ballPosY - obj.mid.y);
    if (distX > obj.halfwidth + this.radius)
      return false;
    if (distY > obj.halfheight + this.radius)
      return false;
    if (distX <= obj.halfwidth)
      return true;
    if (distY <= obj.halfheight)
      return true;
    let dx = distX - obj.halfwidth, dy = distY - obj.halfheight;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }
  hitbackFlipper(obj) {
    if (!this._collisionData)
      return;
    let { nx, ny, px, py } = this._collisionData;
    this.ballPosX = px + nx * (this.radius + 2);
    this.ballPosY = py + ny * (this.radius + 2);
    let dot = this.ballVelX * nx + this.ballVelY * ny;
    if (dot < 0) {
      this.ballVelX -= 2 * dot * nx;
      this.ballVelY -= 2 * dot * ny;
    }
    this.ballVelX *= 1.1;
    this.ballVelY *= 1.15;
    this._collisionData = null;
  }
  collidewithTopWall() {
    this.ballPosY = this.radius;
    this.ballVelY = -this.ballVelY * this.elasticity;
  }
  collidewithRightWall() {
    this.ballPosX = 470 - this.radius;
    this.ballVelX = -this.ballVelX * this.elasticity;
  }
  collidewithLeftWall() {
    this.ballPosX = this.radius;
    this.ballVelX = -this.ballVelX * this.elasticity;
  }
  isCollidedWithBumpers(obj) {
    let dx = this.ballPosX - obj.ballPosX;
    let dy = this.ballPosY - obj.ballPosY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let minDist = this.radius + obj.radius;
    if (distance < minDist && distance > 0 && !obj._bounced) {
      obj._bounced = true;
      obj.radius += 1;
      setTimeout(() => {
        obj._bounced = false;
        obj.radius -= 1;
      }, 200);
      this._bumperCollision = {
        nx: dx / distance,
        ny: dy / distance,
        overlap: minDist - distance
      };
      return true;
    }
    return false;
  }
  hitbackBumper(obj) {
    if (!this._bumperCollision)
      return;
    let { nx, ny, overlap } = this._bumperCollision;
    this.ballPosX += nx * (overlap + 1);
    this.ballPosY += ny * (overlap + 1);
    let dot = this.ballVelX * nx + this.ballVelY * ny;
    if (dot < 0) {
      this.ballVelX -= 2 * dot * nx;
      this.ballVelY -= 2 * dot * ny;
    }
    this.ballVelX *= 1.01;
    this.ballVelY *= 1.02;
    this._bumperCollision = null;
  }
  hitbackBottomBumper(obj) {
    if (!this._collisionData)
      return;
    let { nx, ny, px, py } = this._collisionData;
    this.ballPosX = px + nx * (this.radius + 1);
    this.ballPosY = py + ny * (this.radius + 1);
    let dot = this.ballVelX * nx + this.ballVelY * ny;
    if (dot < 0) {
      this.ballVelX -= 2 * dot * nx;
      this.ballVelY -= 2 * dot * ny;
    }
    this._collisionData = null;
  }
  isCollidedwithSideBumper(obj) {
    if (obj.sidePos1 && obj.sidePos2) {
      let ax = obj.sidePos1.x, ay = obj.sidePos1.y;
      let bx = obj.sidePos2.x, by = obj.sidePos2.y;
      let cx = this.ballPosX, cy = this.ballPosY;
      let abx = bx - ax, aby = by - ay;
      let acx = cx - ax, acy = cy - ay;
      let ab2 = abx * abx + aby * aby;
      if (ab2 === 0)
        return false;
      let t = Math.max(0, Math.min(1, (acx * abx + acy * aby) / ab2));
      let px = ax + t * abx, py = ay + t * aby;
      let dx = cx - px, dy = cy - py;
      let dist2 = dx * dx + dy * dy;
      if (dist2 < this.radius * this.radius && dist2 > 0) {
        let dist = Math.sqrt(dist2);
        this._collisionData = { px, py, nx: dx / dist, ny: dy / dist, dist };
        return true;
      }
      return false;
    }
    return false;
  }
  collidewithSideBumper() {
    this.ballVelX = -this.ballVelX * this.elasticity;
  }
}
Ball.RADIUS = 15;
Ball.COLOR = "blue";
var ball_default = Ball;

// src/right_flipper.js
class RightFlipper {
  constructor() {
    this.halfwidth = 45;
    this.halfheight = 10;
    this.pos1 = { x: 350, y: 480 };
    this.posY = 520;
    this.mid = { x: 305, y: 500 };
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.moveTo(345, 480);
    ctx.lineTo(255, this.posY);
    ctx.lineWidth = 10;
    let grd = ctx.createLinearGradient(350, 480, 260, this.posY);
    grd.addColorStop(0, "#D6A4A4");
    grd.addColorStop(1, "#DAE2F8");
    ctx.strokeStyle = grd;
    ctx.stroke();
    ctx.closePath();
    this.pos2 = { x: 260, y: this.posY };
    this.vec = { x: this.pos2.x - this.pos1.x, y: this.pos2.y - this.pos1.y };
    this.length = Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y);
    this.vnorm = { x: this.vec.x / this.length, y: this.vec.y / this.length };
    if (window.rPressed && this.posY > 440)
      this.flipRightUp();
    if (!window.rPressed && this.posY < 520)
      this.flipRightDown();
    this.mid = { x: 305, y: (this.posY + 480) / 2 };
  }
  flipRightUp() {
    this.posY -= 15;
  }
  flipRightDown() {
    this.posY += 15;
  }
}
var right_flipper_default = RightFlipper;

// src/left_flipper.js
class LeftFlipper {
  constructor() {
    this.pos1 = { x: 125, y: 480 };
    this.halfwidth = 45;
    this.halfheight = 10;
    this.posY = 520;
    this.mid = { x: 170, y: 500 };
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(120, 480);
    ctx.lineTo(210, this.posY);
    ctx.lineWidth = 10;
    let grd = ctx.createLinearGradient(125, 480, 215, this.posY);
    grd.addColorStop(0, "#D6A4A4");
    grd.addColorStop(1, "#DAE2F8");
    ctx.strokeStyle = grd;
    ctx.stroke();
    ctx.closePath();
    this.pos2 = { x: 215, y: this.posY };
    this.vec = { x: this.pos2.x - this.pos1.x, y: this.pos2.y - this.pos1.y };
    this.length = Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y);
    this.vnorm = { x: this.vec.x / this.length, y: this.vec.y / this.length };
    if (window.lPressed && this.posY > 440)
      this.flipLeftUp();
    if (!window.lPressed && this.posY < 520)
      this.flipLeftDown();
    this.mid = { x: 170, y: (this.posY + 480) / 2 };
  }
  flipLeftUp() {
    this.posY -= 15;
  }
  flipLeftDown() {
    this.posY += 15;
  }
}
var left_flipper_default = LeftFlipper;

// src/obj/bumper_one.js
class BumperOne {
  constructor() {
    this.radius = BumperOne.RADIUS;
    this.ballPosX = 145;
    this.ballPosY = 220;
  }
  draw(ctx) {
    let meditative = ctx.createPattern(document.getElementById("meditative"), "repeat");
    ctx.beginPath();
    ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = meditative;
    ctx.fill();
    ctx.closePath();
  }
}
BumperOne.RADIUS = 35;
BumperOne.COLOR = "lightgreen";
var bumper_one_default = BumperOne;

// src/obj/bumper_two.js
class BumperTwo {
  constructor() {
    this.radius = BumperTwo.RADIUS;
    this.ballPosX = 315;
    this.ballPosY = 220;
  }
  draw(ctx) {
    let balzano = ctx.createPattern(document.getElementById("balzano"), "repeat");
    ctx.beginPath();
    ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = balzano;
    ctx.fill();
    ctx.closePath();
  }
}
BumperTwo.RADIUS = 35;
BumperTwo.COLOR = "lightgreen";
var bumper_two_default = BumperTwo;

// src/obj/bumper_three.js
class BumperThree {
  constructor() {
    this.radius = BumperThree.RADIUS;
    this.ballPosX = 230;
    this.ballPosY = 120;
  }
  draw(ctx) {
    let veil = ctx.createPattern(document.getElementById("veil-art"), "repeat");
    ctx.beginPath();
    ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = veil;
    ctx.fill();
    ctx.closePath();
  }
}
BumperThree.RADIUS = 35;
BumperThree.COLOR = "lightgreen";
var bumper_three_default = BumperThree;

// src/obj/left_bumper.js
class LeftBump {
  constructor() {
    this.pos1 = { x: 110, y: 450 };
    this.pos2 = { x: 60, y: 400 };
    this.sidePos1 = { x: 40, y: 300 };
    this.sidePos2 = { x: 40, y: 400 };
    this.mid = { x: 85, y: 425 };
    this.mid2 = { x: 40, y: 350 };
    this.halfwidth = 25;
    this.halfheight = 25;
    this.halfwidthTwo = 0.5;
    this.halfheightTwo = 50;
  }
  draw(ctx) {
    let geom = ctx.createPattern(document.getElementById("geom"), "repeat");
    ctx.beginPath();
    ctx.fillStyle = geom;
    ctx.moveTo(90, 450);
    ctx.lineTo(110, 450);
    ctx.lineTo(60, 400);
    ctx.lineTo(60, 300);
    ctx.lineTo(40, 300);
    ctx.lineTo(40, 400);
    ctx.fill();
  }
}
var left_bumper_default = LeftBump;

// src/obj/right_bumper.js
class RightBumper {
  constructor() {
    this.pos1 = { x: 370, y: 450 };
    this.pos2 = { x: 420, y: 400 };
    this.sidePos1 = { x: 420, y: 300 };
    this.sidePos2 = { x: 420, y: 400 };
    this.mid = { x: 395, y: 425 };
    this.mid2 = { x: 420, y: 350 };
    this.halfwidth = 25;
    this.halfheight = 25;
    this.halfwidthTwo = 0.5;
    this.halfheightTwo = 50;
  }
  draw(ctx) {
    let geom = ctx.createPattern(document.getElementById("geom"), "repeat");
    ctx.beginPath();
    ctx.fillStyle = geom;
    ctx.moveTo(350, 450);
    ctx.lineTo(370, 450);
    ctx.lineTo(420, 400);
    ctx.lineTo(420, 300);
    ctx.lineTo(400, 300);
    ctx.lineTo(400, 400);
    ctx.fill();
  }
}
var right_bumper_default = RightBumper;

// src/game.js
window.sPressed = false;
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 32)
    window.sPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 32)
    window.sPressed = false;
});
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 37)
    window.lPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 37)
    window.lPressed = false;
});
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 39)
    window.rPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 39)
    window.rPressed = false;
});

class Game {
  constructor() {
    this.thruster = new thruster_default;
    this.ball = new ball_default;
    this.rightFlipper = new right_flipper_default;
    this.leftFlipper = new left_flipper_default;
    this.bumperOne = new bumper_one_default;
    this.bumperTwo = new bumper_two_default;
    this.bumperThree = new bumper_three_default;
    this.leftBumper = new left_bumper_default;
    this.rightBumper = new right_bumper_default;
    this.score = 0;
    this.highscore = 0;
  }
  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.thruster.draw(ctx);
    this.ball.draw(ctx);
    this.rightFlipper.draw(ctx);
    this.leftFlipper.draw(ctx);
    this.bumperOne.draw(ctx);
    this.bumperTwo.draw(ctx);
    this.bumperThree.draw(ctx);
    this.leftBumper.draw(ctx);
    this.rightBumper.draw(ctx);
    if (this.score > this.highscore)
      this.highscore = this.score;
    document.getElementById("test").innerHTML = this.score;
    document.getElementById("high").innerHTML = this.highscore;
    if (window.sPressed)
      this.resetBall();
  }
  step(delta) {
    this.ball.update();
    if (this.ball.ballPosX === 445 && this.ball.ballPosY + 15 > this.thruster.tposY) {
      this.ball.thrust();
    } else if (this.ball.ballPosX === 445 && this.ball.ballPosY < 80) {
      this.ball.firstReflect();
    }
    this.checkCollisions();
  }
  checkCollisions() {
    const flippers = [this.rightFlipper, this.leftFlipper];
    for (const f of flippers) {
      if (this.ball.isCollidedWithLine(f))
        this.ball.hitbackFlipper(f);
    }
    if (this.ball.ballPosY <= this.ball.radius)
      this.ball.collidewithTopWall();
    else if (this.ball.ballPosX >= Game.DIM_X - this.ball.radius)
      this.ball.collidewithRightWall();
    else if (this.ball.ballPosX <= this.ball.radius)
      this.ball.collidewithLeftWall();
    const bumpers = [this.bumperOne, this.bumperTwo, this.bumperThree];
    for (let j = 0;j < bumpers.length; j++) {
      if (this.ball.isCollidedWithBumpers(bumpers[j])) {
        this.ball.hitbackBumper(bumpers[j]);
        this.score += j === 2 ? 7 : 5;
      }
    }
    const bottomBumpers = [this.leftBumper, this.rightBumper];
    for (const bb of bottomBumpers) {
      if (this.ball.isCollidedWithLine(bb)) {
        this.ball.hitbackBottomBumper(bb);
        this.score += 3;
      } else if (this.ball.isCollidedwithSideBumper(bb)) {
        this.ball.collidewithSideBumper();
        this.score += 3;
      }
    }
    if (this.ball.ballPosY > Game.DIM_Y + 30)
      this.resetBall();
  }
  resetBall() {
    this.ball.ballPosX = 445;
    this.ball.ballPosY = 384;
    this.ball.ballVelX = 0;
    this.ball.ballVelY = 0;
    if (this.score > this.highscore)
      this.highscore = this.score;
    this.score = 0;
  }
}
Game.DIM_X = 470;
Game.DIM_Y = 570;
Game.BG_COLOR = "white";
var game_default = Game;

// src/game_view.js
class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }
  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }
  animate(time) {
    const timeDiff = time - this.lastTime;
    this.game.step(timeDiff);
    this.game.draw(this.ctx);
    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }
}
var game_view_default = GameView;

// src/pinball.js
document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("game-canvas");
  canvasEl.width = game_default.DIM_X;
  canvasEl.height = game_default.DIM_Y;
  const ctx = canvasEl.getContext("2d");
  const game = new game_default;
  new game_view_default(game, ctx).start();
});
