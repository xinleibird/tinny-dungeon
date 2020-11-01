import * as PIXI from 'pixi.js';
import { GAME_OPTIONS } from '../config';
import GameScreen from './GameScreen';

const { PIXEL_SCALE } = GAME_OPTIONS;

export default class BackgroundScreen extends GameScreen {
  public constructor(width: number, height: number) {
    super(width, height);
    const background = new PIXI.Graphics();
    background.beginFill(0x160c21);
    background.drawRect(0, 0, width * PIXEL_SCALE * 2, height * PIXEL_SCALE * 2);
    background.endFill();
    background.pivot.set(width * PIXEL_SCALE, height * PIXEL_SCALE);

    this._rendering.addChild(background);
  }
}
