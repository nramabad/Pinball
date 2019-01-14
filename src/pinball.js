const Game = require('./game');
const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', function () {
    const canvasEl = document.getElementById('game-canvas');
    canvasEl.width = Game.DIM_X;
    canvasEl.height = Game.DIM_Y;
    const ctx = canvasEl.getContext('2d');

    // background = new Image();
    // background.src = "";
    // background.onload = () => {
    //     ctx.drawImage(background, 0, 0);
    // }

    const game = new Game();
    new GameView(game, ctx).start();
});