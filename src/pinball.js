import Game from './game.js';
import GameView from './game_view.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvasEl = document.getElementById('game-canvas');
    canvasEl.width = Game.DIM_X;
    canvasEl.height = Game.DIM_Y;
    const ctx = canvasEl.getContext('2d');
    const game = new Game();
    new GameView(game, ctx).start();
});