import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { GAME_OPTIONS } from '../config';
import { GameSound } from '../sound';
import { Emitter, GAME_EVENTS, JOY_EVENTS, KEY_EVENTS } from '../system/Emitter';
import GameScreen from './GameScreen';

const { PIXEL_SCALE } = GAME_OPTIONS;

export default class ForegroundScreen extends GameScreen {
  public constructor(width: number, height: number) {
    super(width, height);
    const background = new PIXI.Graphics();
    background.beginFill(0x160c21);
    background.drawRect(0, 0, width * PIXEL_SCALE * 2, height * PIXEL_SCALE * 2);
    background.endFill();
    background.pivot.set(width * PIXEL_SCALE, height * PIXEL_SCALE);

    this._rendering.addChild(background);
  }

  public fadeIn(duration = 2, start = 0, end = 1, onComplete?: () => void) {
    this._rendering.alpha = start;
    gsap.to(this._rendering, {
      duration,
      pixi: { alpha: end },
      onComplete,
    });
  }

  public fadeOut(duration = 2, start = 1, end = 0, onComplete?: () => void) {
    this._rendering.alpha = start;
    gsap.to(this._rendering, { duration, pixi: { alpha: end }, onComplete });
  }

  public effect(event: GAME_EVENTS) {
    switch (event) {
      case GAME_EVENTS.SCENE_START: {
        this.fadeOut(3);
        break;
      }
      case GAME_EVENTS.USER_DIE: {
        this.youDied();
        this.fadeIn(2, 0, 0.618, () => {
          this.tapToRestart();
        });
        break;
      }

      default:
        break;
    }
  }

  private tapToRestart() {
    const bitmapText = new PIXI.BitmapText(`PRESS TO RESTART`, {
      fontName: 'Click',
      fontSize: 13,
    });

    bitmapText.anchor = 0.5;
    bitmapText.position.y += 5;

    this._rendering.addChild(bitmapText);

    Emitter.on(KEY_EVENTS.KEY_DOWN, () => {
      Emitter.emit(GAME_EVENTS.GAME_OVER);
    });
    Emitter.on(JOY_EVENTS.JOY_DOWN, () => {
      Emitter.emit(GAME_EVENTS.GAME_OVER);
    });
  }

  private youDied() {
    const bitmapText = new PIXI.BitmapText(`YOU DIED`, {
      fontName: 'Click',
      fontSize: 30,
      tint: 0xda4e38,
    });

    bitmapText.anchor = 0.5;
    bitmapText.position.y -= 20;
    this._rendering.addChild(bitmapText);
    GameSound.play('you_died', 1);
  }
}
