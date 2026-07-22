export class LeftFlipper {
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
        if (window.lPressed && this.posY > 440) this.flipLeftUp();
        if (!window.lPressed && this.posY < 520) this.flipLeftDown();
        this.mid = { x: 170, y: (this.posY + 480) / 2 };
    }

    flipLeftUp() { this.posY -= 15; }
    flipLeftDown() { this.posY += 15; }
}

export default LeftFlipper;