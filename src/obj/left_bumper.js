export class LeftBump {
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
        this.rect = { left: 40, top: 300, right: 60, bottom: 400 };
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
export default LeftBump;