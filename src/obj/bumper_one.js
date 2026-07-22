export class BumperOne {
    constructor() {
        this.radius = BumperOne.RADIUS;
        this.ballPosX = 145;
        this.ballPosY = 220;
    }

    draw(ctx) {
        let meditative = ctx.createPattern(document.getElementById('meditative'), 'repeat');
        ctx.beginPath();
        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = meditative;
        ctx.fill();
        ctx.closePath();
    }
}
BumperOne.RADIUS = 35;
BumperOne.COLOR = 'lightgreen';
export default BumperOne;