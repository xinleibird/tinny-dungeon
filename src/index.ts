import './index.css';
import * as PIXI from 'pixi.js';
import { initTileTextures } from './tiles';
import { getSpriteAnimation } from './player';

const root = document.getElementById('root');

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
  width: window.innerWidth / 2,
  height: window.innerHeight / 2,
  antialias: false,
  resolution: 2,
});

root.appendChild(app.view);

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const drawMap = async () => {
  const tileTextures = await initTileTextures();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const element = map[y][x];

      if (element === 1) {
        const wall = tileTextures.WALL;
        const sprite = new PIXI.Sprite(wall);

        sprite.x = x * 16;
        sprite.y = y * 16;

        app.stage.addChild(sprite);
      } else {
        const floor = tileTextures.FLOOR;
        const sprite = new PIXI.Sprite(floor);

        sprite.position.x = x * 16;
        sprite.position.y = y * 16;

        app.stage.addChild(sprite);
      }
    }
  }
};

drawMap();

const drawPlayer = async () => {
  const knight = await getSpriteAnimation();

  knight.position.x = 16;
  knight.position.y = 16;

  knight.play();
  app.stage.addChild(knight);
};

drawPlayer();
