
class BumperThree {
    constructor() {
        this.radius = BumperThree.RADIUS;
        this.color = BumperThree.COLOR;
        this.ballPosX = 230;
        this.ballPosY = 120;
    }

    draw(ctx) {
        let img = document.getElementById('veil-art');
        let veil = ctx.createPattern(img, 'repeat');
        ctx.beginPath();
        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = veil;
        // ctx.fillStyle = "purple";
        ctx.fill();
        ctx.closePath();
    }
}

BumperThree.RADIUS = 35;
BumperThree.COLOR = 'lightgreen';

module.exports = BumperThree;