export class BumperTwo {
    constructor() {
        this.radius = BumperTwo.RADIUS;
        this.ballPosX = 315;
        this.ballPosY = 220;
    }

    draw(ctx) {
        let balzano = ctx.createPattern(document.getElementById('balzano'), 'repeat');
        ctx.beginPath();
        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = balzano;
        ctx.fill();
        ctx.closePath();
    }
}
BumperTwo.RADIUS = 35;
BumperTwo.COLOR = 'lightgreen';
export default BumperTwo;