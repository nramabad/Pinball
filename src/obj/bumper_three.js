export class BumperThree {
    constructor() {
        this.radius = BumperThree.RADIUS;
        this.ballPosX = 230;
        this.ballPosY = 120;
    }

    draw(ctx) {
        let veil = ctx.createPattern(document.getElementById('veil-art'), 'repeat');
        ctx.beginPath();
        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = veil;
        ctx.fill();
        ctx.closePath();
    }
}
BumperThree.RADIUS = 35;
BumperThree.COLOR = 'lightgreen';
export default BumperThree;