
class LeftBump {
    constructor() {
        this.height = 150;
        // Angled wall (matches drawn edge: 110,450 → 60,400)
        this.pos1 = { x: 110, y: 450 };
        this.pos2 = { x: 60, y: 400 };
        // Vertical side wall
        this.sidePos1 = { x: 40, y: 300 };
        this.sidePos2 = { x: 40, y: 400 };
        // Legacy AABB properties (kept for fallback compatibility)
        this.mid = { x: 85, y: 425 };
        this.mid2 = { x: 40, y: 350 };
        this.halfwidth = 25;
        this.halfheight = 25;
        this.halfwidthTwo = 0.5;
        this.halfheightTwo = 50;
        this.vec = { x: this.pos2.x - this.pos1.x, y: this.pos2.y - this.pos1.y };
        this.length = Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y);
        this.vnorm = { x: this.vec.x / this.length, y: this.vec.y / this.length };
    }

    draw(ctx) {
        let img = document.getElementById("geom");
        let geom = ctx.createPattern(img, "repeat");
        ctx.beginPath();
        ctx.fillStyle = geom;
        ctx.moveTo(90, 450);
        ctx.lineTo(110, 450);
        ctx.lineTo(60, 400);
        ctx.lineTo(60, 300);
        ctx.lineTo(40, 300); //was 380
        ctx.lineTo(40, 400)
        ctx.fill();
    }
}



module.exports = LeftBump;