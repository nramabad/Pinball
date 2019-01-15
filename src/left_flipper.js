let lPressed = false;
let posY = 520;

document.addEventListener("keydown", leftFlipperHandler, false);
document.addEventListener("keyup", leftFlipperHandlerUp, false);

function leftFlipperHandler(e) {
    if (e.keyCode === 37) {
        lPressed = true;
    }
}
function leftFlipperHandlerUp(e) {
    if (e.keyCode === 37) {
        lPressed = false;
    }
}


class LeftFlipper {
    constructor() {
        this.pos1 = { x: 125, y: 480 };
        this.halfwidth = 45;
        this.halfheight = 10;
        this.posY = posY;
        this.mid = { x: 170, y: (this.posY + 480) / 2 };
        // this.stopAColor = [
        //     { 'r': '9', 'g': '117', 'b': '190' }, //blue
        //     { 'r': '59', 'g': '160', 'b': '89' }, //green
        //     { 'r': '230', 'g': '192', 'b': '39' }, //yellow
        //     { 'r': '238', 'g': '30', 'b': '77' } //red
        // ];
        // this.stopBColor = [
        //     { 'r': '205', 'g': '24', 'b': '75' }, //pink
        //     { 'r': '33', 'g': '98', 'b': '155' }, //blue
        //     { 'r': '64', 'g': '149', 'b': '69' }, //green
        //     { 'r': '228', 'g': '171', 'b': '33' } //yellow
        // ];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(120, 480);
        ctx.lineTo(210, this.posY);
        ctx.lineWidth = 10;
        let grd = ctx.createLinearGradient(125, 480, 215, this.posY);
        grd.addColorStop(0, "purple");
        grd.addColorStop(1, "pink");
        ctx.strokeStyle = grd;
        ctx.stroke();
        ctx.closePath();
        this.posY = this.posY;
        this.pos2 = { x: 215, y: this.posY };
        this.vec = { x: this.pos2.x - this.pos1.x, y: this.pos2.y - this.pos1.y };
        this.length = Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y);
        this.vnorm = { x: this.vec.x / this.length, y: this.vec.y / this.length };
        if (lPressed && this.posY > 440) {
            this.flipLeftUp(ctx);
        }
        if (lPressed === false && this.posY < 520) {
            this.flipLeftDown(ctx);
        }
        this.mid = { x: 170, y: (this.posY + 480) / 2 };
    }

    flipLeftUp(ctx) {
        this.posY -= 15;
        this.mid = { x: 170, y: (this.posY + 480) / 2 };
        // this.playFlip();
    }

    playFlip() {
        let x = document.getElementById('flip');
        x.currentTime = 0;
        x.play();
    }

    flipLeftDown(ctx) {
        this.posY += 15;
        this.mid = { x: 170, y: (this.posY + 480) / 2 };
    }
}

module.exports = LeftFlipper;