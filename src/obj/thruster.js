window.downPressed = false;

document.addEventListener("keydown", (e) => { if (e.keyCode === 40) window.downPressed = true; });
document.addEventListener("keyup", (e) => { if (e.keyCode === 40) window.downPressed = false; });

export class Thruster {
    constructor() {
        this.height = Thruster.HEIGHT;
        this.width = Thruster.WIDTH;
        this.tposY = 400;
        this.tposX = 440;
        this.tposYMax = 0;
    }

    draw(ctx) {
        if (window.downPressed && this.tposY < 480) {
            this.tposY += 1;
        } else if (!window.downPressed && this.tposY > 400) {
            if (this.tposY > this.tposYMax) this.tposYMax = this.tposY;
            this.tposY -= (this.tposYMax % 16 === 0) ? 17 : 16;
        }
        if (this.tposY === 400) this.tposYMax = 0;
    }
}
Thruster.HEIGHT = 60;
Thruster.WIDTH = 30;
Thruster.COLOR = 'blue';
export default Thruster;