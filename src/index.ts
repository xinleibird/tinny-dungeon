import './index.css';

import Game from './lib/core/game';

const GAME_PIXEL_SCALE = 2;
const game = new Game({
  width: window.innerWidth / GAME_PIXEL_SCALE / window.devicePixelRatio,
  height: window.innerHeight / GAME_PIXEL_SCALE / window.devicePixelRatio,
  antialias: false,
  resolution: GAME_PIXEL_SCALE * window.devicePixelRatio,

  backgroundColor: 0x160c21,
});

game.play();
