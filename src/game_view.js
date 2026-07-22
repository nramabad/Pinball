export class GameView {
    constructor(game, ctx) {
        this.game = game;
        this.ctx = ctx;
    }

    start() {
        this.lastTime = 0;
        requestAnimationFrame(this.animate.bind(this));
    }

    animate(time) {
        const timeDiff = time - this.lastTime;
        this.game.step(timeDiff);
        this.game.draw(this.ctx);
        this.lastTime = time;
        requestAnimationFrame(this.animate.bind(this));
    }
}

export default GameView;