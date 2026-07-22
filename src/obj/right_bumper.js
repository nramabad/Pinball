export class RightBumper {
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
export default RightBumper;