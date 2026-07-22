const Thruster = require('./obj/thruster');

let ballPosX = 445;
let ballPosY = 384;
let gravity = 0.18;
let elasticity = 0.7;
let friction = 0.1;

class Ball {
    constructor(ctx) {
        this.radius = Ball.RADIUS;
        this.color = Ball.COLOR;
        this.ballPosX = ballPosX;
        this.ballPosY = ballPosY;
        this.ballVelX = 0;
        this.ballVelY = 0;
        this.elasticity = elasticity;
        this.bounced = false;
        this._collisionData = null;
    }

    draw(ctx) {
        let img = new Image();
        img.src = '../assets/cool-color-circle.gif';
        let pat = ctx.createPattern(img, 'repeat');
        ctx.beginPath();
        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = pat;
        ctx.fill();
        ctx.closePath();
    }

    // Apply physics (gravity, velocity) — called BEFORE collision checking
    update() {
        this.ballVelY += gravity;

        this.speed =
            Math.sqrt(this.ballVelX * this.ballVelX + this.ballVelY * this.ballVelY);

        if (this.speed > 0) {
            this.dnorm = { x: this.ballVelX / this.speed, y: this.ballVelY / this.speed };
        } else {
            this.dnorm = { x: 0, y: 0 };
        }

        this.ballPosY += this.ballVelY;
        this.ballPosX += this.ballVelX;
    }

    thrust(delta) {
        this.ballVelY = -12;
    }

    firstReflect(delta) {
        this.ballVelX = Math.random() * (-2.53 + 2.6) - 2.6;
        this.ballVelY = Math.random() * (3.4 - 3.1) + 3.1;
    }

    // Proper line-segment vs circle collision detection
    // Uses the closest point on a line segment to the ball center
    isCollidedWithLine(obj) {
        if (!obj.pos1 || !obj.pos2) {
            return this._isCollidedWithLineLegacy(obj);
        }

        let ax = obj.pos1.x, ay = obj.pos1.y;
        let bx = obj.pos2.x, by = obj.pos2.y;
        let cx = this.ballPosX, cy = this.ballPosY;

        // Vector AB
        let abx = bx - ax, aby = by - ay;
        // Vector AC
        let acx = cx - ax, acy = cy - ay;

        // Project AC onto AB, compute closest point on segment
        let ab2 = abx * abx + aby * aby;
        if (ab2 === 0) {
            // Degenerate line (point) — check circle-point distance
            let dx = cx - ax, dy = cy - ay;
            let dist2 = dx * dx + dy * dy;
            if (dist2 < this.radius * this.radius) {
                let dist = Math.sqrt(dist2);
                if (dist === 0) return false;
                this._collisionData = {
                    px: ax, py: ay,
                    nx: dx / dist, ny: dy / dist,
                    dist: dist
                };
                return true;
            }
            return false;
        }

        let t = (acx * abx + acy * aby) / ab2;
        t = Math.max(0, Math.min(1, t)); // clamp to segment

        // Closest point on segment
        let px = ax + t * abx;
        let py = ay + t * aby;

        // Distance from ball center to closest point
        let dx = cx - px, dy = cy - py;
        let dist2 = dx * dx + dy * dy;

        if (dist2 < this.radius * this.radius && dist2 > 0) {
            let dist = Math.sqrt(dist2);
            let nx = dx / dist; // normal from line toward ball center
            let ny = dy / dist;

            this._collisionData = {
                px: px, py: py,
                nx: nx, ny: ny,
                dist: dist
            };
            return true;
        }
        return false;
    }

    isCollidedWithLineOld(obj) {
        // X and Y distance between the ball and the bump
        let distX = Math.abs(this.ballPosX - (obj.mid.x));
        let distY = Math.abs(this.ballPosY - (obj.mid.y));

        // Distance too far
        if (distX > (obj.halfwidth + this.radius)) { return false; }
        if (distY > (obj.halfheight + this.radius)) { return false; }

        // Distance definitely colliding
        if ((distX <= obj.halfwidth) && (this.bouncedTwo === false)) {
            this.changeBounce();
            return true;
        }

        if ((distX <= obj.halfheight) && (this.bouncedTwo === false)) {
            this.changeBounce();
            return true;
        }

        // Checks corners using Pythagorean Theorem
        let dx = distX - obj.halfwidth;
        let dy = distY - obj.halfheight;
        if ((dx * dx) + (dy * dy) <= (this.radius * this.radius) && (this.bouncedTwo === false)) {
            this.changeBounce();
            return true;
        } else {
            return false;
        }
    }

    // Legacy AABB-based check (used only as fallback)
    _isCollidedWithLineLegacy(obj) {
        let distX = Math.abs(this.ballPosX - obj.mid.x);
        let distY = Math.abs(this.ballPosY - obj.mid.y);

        if (distX > (obj.halfwidth + this.radius)) return false;
        if (distY > (obj.halfheight + this.radius)) return false;

        if (distX <= obj.halfwidth) return true;
        if (distY <= obj.halfheight) return true;

        let dx = distX - obj.halfwidth;
        let dy = distY - obj.halfheight;
        return (dx * dx) + (dy * dy) <= (this.radius * this.radius);
    }

    hitbackFlipper(obj) {
        if (!this._collisionData) return;

        let nx = this._collisionData.nx;
        let ny = this._collisionData.ny;
        let px = this._collisionData.px;
        let py = this._collisionData.py;

        // Push ball outside the collider so it doesn't stick
        this.ballPosX = px + nx * (this.radius + 2);
        this.ballPosY = py + ny * (this.radius + 2);

        // Reflect velocity around the collision normal
        let dot = this.ballVelX * nx + this.ballVelY * ny;
        if (dot < 0) {
            // Reflect only when moving toward the surface
            this.ballVelX -= 2 * dot * nx;
            this.ballVelY -= 2 * dot * ny;
        }

        // Add a small kick from the flipper (simulates the flip action)
        this.ballVelX *= 1.1;
        this.ballVelY *= 1.15;

        // Clean up
        this._collisionData = null;
    }

    playThud() {
        let x = document.getElementById('thud');
        x.currentTime = 0;
        x.play();
    }

    collidewithTopWall() {
        this.ballPosY = this.radius;
        this.ballVelY = -this.ballVelY;
        this.ballVelY *= this.elasticity;
    }

    collidewithRightWall() {
        this.ballPosX = 470 - this.radius;
        this.ballVelX = -this.ballVelX;
        this.ballVelX *= this.elasticity;
    }

    collidewithLeftWall() {
        this.ballPosX = this.radius;
        this.ballVelX = -this.ballVelX;
        this.ballVelX *= this.elasticity;
    }

    // Proper circle-circle collision detection for bumpers
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

            // Compute collision data for hitbackBumper
            let nx = dx / distance;
            let ny = dy / distance;

            this._bumperCollision = {
                nx: nx, ny: ny,
                dist: distance,
                minDist: minDist,
                overlap: minDist - distance
            };

            return true;
        }
        return false;
    }

    hitbackBumper(obj) {
        if (!this._bumperCollision) return;

        let nc = this._bumperCollision;
        let nx = nc.nx, ny = nc.ny;

        // Push ball outside the bumper by exactly the overlap amount
        this.ballPosX += nx * (nc.overlap + 1);
        this.ballPosY += ny * (nc.overlap + 1);

        // Reflect velocity around the collision normal
        let dot = this.ballVelX * nx + this.ballVelY * ny;
        if (dot < 0) {
            this.ballVelX -= 2 * dot * nx;
            this.ballVelY -= 2 * dot * ny;
        }
        this.ballVelX *= 1.01;
        this.ballVelY *= 1.02;

        this._bumperCollision = null;
    }

    playBumperSound() {
        let x = document.getElementById('bell');
        x.currentTime = 0;
        x.volume = 0.3;
        x.play();
    }

    hitbackBottomBumper(obj) {
        if (!this._collisionData) return;

        let nx = this._collisionData.nx;
        let ny = this._collisionData.ny;
        let px = this._collisionData.px;
        let py = this._collisionData.py;

        // Push ball outside the collider
        this.ballPosX = px + nx * (this.radius + 1);
        this.ballPosY = py + ny * (this.radius + 1);

        // Reflect velocity around the collision normal
        let dot = this.ballVelX * nx + this.ballVelY * ny;
        if (dot < 0) {
            this.ballVelX -= 2 * dot * nx;
            this.ballVelY -= 2 * dot * ny;
        }

        this._collisionData = null;
    }

    // Side walls of the bottom bumpers — also use line-segment collision
    isCollidedwithSideBumper(obj) {
        // Use line-segment collision for the vertical wall if available
        if (obj.sidePos1 && obj.sidePos2) {
            let ax = obj.sidePos1.x, ay = obj.sidePos1.y;
            let bx = obj.sidePos2.x, by = obj.sidePos2.y;
            let cx = this.ballPosX, cy = this.ballPosY;

            let abx = bx - ax, aby = by - ay;
            let acx = cx - ax, acy = cy - ay;

            let ab2 = abx * abx + aby * aby;
            if (ab2 === 0) return false;

            let t = Math.max(0, Math.min(1, (acx * abx + acy * aby) / ab2));
            let px = ax + t * abx;
            let py = ay + t * aby;

            let dx = cx - px, dy = cy - py;
            let dist2 = dx * dx + dy * dy;

            if (dist2 < this.radius * this.radius && dist2 > 0) {
                let dist = Math.sqrt(dist2);
                this._collisionData = {
                    px: px, py: py,
                    nx: dx / dist, ny: dy / dist,
                    dist: dist
                };
                return true;
            }
            return false;
        }

        // Fallback to legacy AABB
        return this._isCollidedWithSideLegacy(obj);
    }

    // Legacy side bumper collision (AABB-based)
    _isCollidedWithSideLegacy(obj) {
        let distX = Math.abs(this.ballPosX - obj.mid2.x);
        let distY = Math.abs(this.ballPosY - obj.mid2.y);

        if (distX > (obj.halfwidthTwo + this.radius)) return false;
        if (distY > (obj.halfheightTwo + this.radius)) return false;

        if (distX <= obj.halfwidthTwo) return true;
        if (distY <= obj.halfheightTwo) return true;

        let dx = distX - obj.halfwidthTwo;
        let dy = distY - obj.halfheightTwo;
        return (dx * dx) + (dy * dy) <= (this.radius * this.radius);
    }

    collidewithSideBumper() {
        this.ballVelX = -this.ballVelX;
        this.ballVelX *= this.elasticity;
    }

    isOnScreen() {
        return this.ballPosY < 600;
    }
}

Ball.RADIUS = 15;
Ball.COLOR = 'blue';
const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

module.exports = Ball;