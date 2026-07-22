import Thruster from './obj/thruster.js';
import Ball from './ball.js';
import RightFlipper from './right_flipper.js';
import LeftFlipper from './left_flipper.js';
import BumperOne from './obj/bumper_one.js';
import BumperTwo from './obj/bumper_two.js';
import BumperThree from './obj/bumper_three.js';
import LeftBumper from './obj/left_bumper.js';
import RightBumper from './obj/right_bumper.js';

window.sPressed = false;

document.addEventListener("keydown", (e) => { if (e.keyCode === 32) window.sPressed = true; });
document.addEventListener("keyup", (e) => { if (e.keyCode === 32) window.sPressed = false; });
document.addEventListener("keydown", (e) => { if (e.keyCode === 37) window.lPressed = true; });
document.addEventListener("keyup", (e) => { if (e.keyCode === 37) window.lPressed = false; });
document.addEventListener("keydown", (e) => { if (e.keyCode === 39) window.rPressed = true; });
document.addEventListener("keyup", (e) => { if (e.keyCode === 39) window.rPressed = false; });

export class Game {
    constructor() {
        this.thruster = new Thruster();
        this.ball = new Ball();
        this.rightFlipper = new RightFlipper();
        this.leftFlipper = new LeftFlipper();
        this.bumperOne = new BumperOne();
        this.bumperTwo = new BumperTwo();
        this.bumperThree = new BumperThree();
        this.leftBumper = new LeftBumper();
        this.rightBumper = new RightBumper();
        this.score = 0;
        this.highscore = 0;
        this.launched = false;
    }

    draw(ctx) {
        ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

        // Hold ball in thruster lane only when thruster is at rest
        if (!this.launched && this.ball.ballPosX === 445 && this.thruster.tposY === 400) {
            this.ball.ballVelX = 0;
            this.ball.ballVelY = 0;
            this.ball.ballPosX = 445;
            this.ball.ballPosY = 384;
        }

        this.thruster.draw(ctx);
        this.ball.draw(ctx);
        this.rightFlipper.draw(ctx);
        this.leftFlipper.draw(ctx);
        this.bumperOne.draw(ctx);
        this.bumperTwo.draw(ctx);
        this.bumperThree.draw(ctx);
        this.leftBumper.draw(ctx);
        this.rightBumper.draw(ctx);

        if (this.score > this.highscore) this.highscore = this.score;

        document.getElementById("test").innerHTML = this.score;
        document.getElementById("high").innerHTML = this.highscore;

        if (window.sPressed) this.resetBall();
    }

    step(delta) {
        this.ball.update();
        if (this.ball.ballPosX === 445 && this.ball.ballPosY + 15 > this.thruster.tposY) {
            this.launched = true;
            this.ball.thrust();
        } else if (this.ball.ballPosX === 445 && this.ball.ballPosY < 80) {
            this.ball.firstReflect();
        }
        this.checkCollisions();
    }

    checkCollisions() {
        const flippers = [this.rightFlipper, this.leftFlipper];
        for (const f of flippers) {
            if (this.ball.isCollidedWithLine(f)) this.ball.hitbackFlipper(f);
        }

        if (this.ball.ballPosY <= this.ball.radius) this.ball.collidewithTopWall();
        else if (this.ball.ballPosX >= Game.DIM_X - this.ball.radius) this.ball.collidewithRightWall();
        else if (this.ball.ballPosX <= this.ball.radius) this.ball.collidewithLeftWall();

        const bumpers = [this.bumperOne, this.bumperTwo, this.bumperThree];
        for (let j = 0; j < bumpers.length; j++) {
            if (this.ball.isCollidedWithBumpers(bumpers[j])) {
                this.ball.hitbackBumper(bumpers[j]);
                this.score += (j === 2) ? 7 : 5;
            }
        }

        const bottomBumpers = [this.leftBumper, this.rightBumper];
        for (const bb of bottomBumpers) {
            if (this.ball.isCollidedWithLine(bb)) {
                this.ball.hitbackBottomBumper(bb);
                this.score += 3;
            } else if (this.ball.isCollidedwithSideBumper(bb)) {
                this.ball.collidewithSideBumper();
                this.score += 3;
            }
        }

        if (this.ball.ballPosY > Game.DIM_Y + 30) this.resetBall();
    }

    resetBall() {
        this.ball.ballPosX = 445;
        this.ball.ballPosY = 384;
        this.ball.ballVelX = 0;
        this.ball.ballVelY = 0;
        this.launched = false;
        if (this.score > this.highscore) this.highscore = this.score;
        this.score = 0;
    }
}

Game.DIM_X = 470;
Game.DIM_Y = 570;
Game.BG_COLOR = 'white';

export default Game;