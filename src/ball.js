let gravity = 0.18;
let elasticity = 0.7;
let friction = 0.1;

export class Ball {
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
        let img = new Image();
        img.src = 'assets/cool-color-circle.gif';
        let pat = ctx.createPattern(img, 'repeat');
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

    thrust() { this.ballVelY = -12; }

    firstReflect() {
        this.ballVelX = Math.random() * 0.07 - 2.6;
        this.ballVelY = Math.random() * 0.3 + 3.1;
    }

    isCollidedWithLine(obj) {
        if (!obj.pos1 || !obj.pos2) return this._isCollidedWithLineLegacy(obj);

        let ax = obj.pos1.x, ay = obj.pos1.y;
        let bx = obj.pos2.x, by = obj.pos2.y;
        let cx = this.ballPosX, cy = this.ballPosY;

        let abx = bx - ax, aby = by - ay;
        let acx = cx - ax, acy = cy - ay;

        let ab2 = abx * abx + aby * aby;
        if (ab2 === 0) {
            let dx = cx - ax, dy = cy - ay;
            let dist2 = dx * dx + dy * dy;
            if (dist2 < this.radius * this.radius) {
                let dist = Math.sqrt(dist2);
                if (dist === 0) return false;
                this._collisionData = { px: ax, py: ay, nx: dx / dist, ny: dy / dist, dist };
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
        if (distX > (obj.halfwidth + this.radius)) return false;
        if (distY > (obj.halfheight + this.radius)) return false;
        if (distX <= obj.halfwidth) return true;
        if (distY <= obj.halfheight) return true;
        let dx = distX - obj.halfwidth, dy = distY - obj.halfheight;
        return (dx * dx) + (dy * dy) <= (this.radius * this.radius);
    }

    hitbackFlipper(obj) {
        if (!this._collisionData) return;
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

        if (distance < minDist && distance > 0) {
            this._bumperCollision = {
                nx: dx / distance, ny: dy / distance,
                overlap: minDist - distance
            };
            return true;
        }
        return false;
    }

    hitbackBumper(obj) {
        if (!this._bumperCollision) return;
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
        if (!this._collisionData) return;
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
            if (ab2 === 0) return false;
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
Ball.COLOR = 'blue';
export default Ball;