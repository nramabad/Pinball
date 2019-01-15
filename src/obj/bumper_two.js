class BumperTwo {
    constructor() {
        this.radius = BumperTwo.RADIUS;
        this.color = BumperTwo.COLOR;
        this.ballPosX = 315;
        this.ballPosY = 220;
    }

    draw(ctx) {
        let img = document.getElementById('balzano');
        let balzano = ctx.createPattern(img, 'repeat');
        ctx.beginPath();
        ctx.arc(this.ballPosX, this.ballPosY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = balzano;
        // ctx.fillStyle = "purple";
        ctx.fill();
        ctx.closePath();
    }
}

BumperTwo.RADIUS = 35;
BumperTwo.COLOR = 'lightgreen';

module.exports = BumperTwo;