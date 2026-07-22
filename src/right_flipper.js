export class RightFlipper {
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
        if (window.rPressed && this.posY > 440) this.flipRightUp();
        if (!window.rPressed && this.posY < 520) this.flipRightDown();
        this.mid = { x: 305, y: (this.posY + 480) / 2 };
    }

    flipRightUp() { this.posY -= 15; }
    flipRightDown() { this.posY += 15; }
}

export default RightFlipper;