import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { CHARACTER_ANIMATIONS } from '../character';
import { GAME_OPTIONS } from '../config';
import { GameMusic, GameSound } from '../sound';
import { MUSIC_ALBUM } from '../sound/GameMusic';
import { Loader } from '../system';
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
      case GAME_EVENTS.GAME_PLAY: {
        this.gameTitle();
        break;
      }

      case GAME_EVENTS.SCENE_START: {
        this.fadeOut(3);
        break;
      }

      case GAME_EVENTS.USER_DIE: {
        this.tapToRestart();
        break;
      }

      default:
        break;
    }
  }

  private gameTitle() {
    const haveToTap = () => {
      const text = new PIXI.BitmapText(
        `
This game use
w / a / s / d
or 
visual Joystick
for controller
      `,
        {
          fontName: 'Click',
          fontSize: 13,
        }
      );

      text.anchor = 0.5;
      text.position.y -= 30;
      this._rendering.addChild(text);

      const tapIcon = new PIXI.Sprite(Loader.textures.UI.tap);
      tapIcon.anchor.set(0.5);
      tapIcon.position.y += 25;
      this._rendering.addChild(tapIcon);

      gsap.to(tapIcon, {
        duration: 0.8,
        pixi: { alpha: 0.3 },
        repeat: -1,
        yoyo: true,
      });

      const tap = () => {
        Emitter.removeListener(KEY_EVENTS.KEY_DOWN, tap);
        Emitter.removeListener(JOY_EVENTS.JOY_DOWN, tap);
        this._rendering.removeChild(text, tapIcon);
        showAuthor();
      };

      Emitter.on(KEY_EVENTS.KEY_DOWN, tap);
      Emitter.on(JOY_EVENTS.JOY_DOWN, tap);
    };

    const showAuthor = () => {
      const product = new PIXI.BitmapText('辛磊作品', {
        fontName: 'Zpix',
        fontSize: 13,
      });
      product.anchor = 0.5;
      product.alpha = 0;

      this._rendering.addChild(product);

      gsap.to(product, {
        duration: 1.5,
        pixi: { alpha: 0.8 },
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          this._rendering.removeChild(product);
          showAvatar();
        },
      });
    };

    const showAvatar = () => {
      const avatar = new PIXI.Sprite(Loader.textures.AVATAR);
      avatar.anchor.set(0.5);
      avatar.alpha = 0;
      this._rendering.addChild(avatar);

      gsap.to(avatar, {
        duration: 1.5,
        alpha: 1,
        onComplete: () => {
          gsap.to(avatar, {
            duration: 0.03,
            pixi: { alpha: 0 },
            yoyo: true,
            repeat: 5,
            onComplete: () => {
              GameSound.play('coin');
              this._rendering.removeChild(avatar);
              setTimeout(() => {
                showTitle();
              }, 1000);
            },
          });
        },
      });
    };

    const showTitle = () => {
      GameMusic.play(MUSIC_ALBUM.TITLE);

      const title = new PIXI.Sprite(Loader.textures.TITLE);
      title.anchor.set(0.5);
      title.position.y -= 40;
      title.alpha = 0;
      this._rendering.addChild(title);

      const holdBatch = Loader.textures['KNIGHT_M'][CHARACTER_ANIMATIONS.HOLD];
      const anim = new PIXI.AnimatedSprite(holdBatch);
      anim.anchor.set(0.5);
      anim.animationSpeed = 0.133;
      anim.position.y += 40;
      this.rendering.addChild(anim);
      anim.play();

      const tapToStart = new PIXI.BitmapText('TAP TO START', {
        fontName: 'Click',
        fontSize: 13,
      });
      tapToStart.anchor = 0.5;
      tapToStart.position.y += 10;

      this._rendering.addChild(tapToStart);

      gsap.to(tapToStart, { duration: 0.233, pixi: { alpha: 0.5 }, repeat: -1, yoyo: true });

      gsap.to(title, {
        duration: 1.5,
        alpha: 1,
        onComplete: () => {
          gsap.to(title, {
            duration: 2,
            pixi: { alpha: 0.382 },
            yoyo: true,
            repeat: -1,
          });
        },
      });

      const tap = () => {
        Emitter.emit(GAME_EVENTS.GAME_START);
        Emitter.removeListener(KEY_EVENTS.KEY_DOWN, tap);
        Emitter.removeListener(JOY_EVENTS.JOY_DOWN, tap);
        this._rendering.removeChild(title, anim, tapToStart);
      };

      Emitter.on(KEY_EVENTS.KEY_DOWN, tap);
      Emitter.on(JOY_EVENTS.JOY_DOWN, tap);
    };

    haveToTap();
  }

  private tapToRestart() {
    const bitmapText = new PIXI.BitmapText(`YOU DIED`, {
      fontName: 'Click',
      fontSize: 30,
      tint: 0xda4e38,
    });

    bitmapText.anchor = 0.5;
    bitmapText.position.y -= 20;
    this._rendering.addChild(bitmapText);
    GameSound.play('you_died', 1);

    this.fadeIn(2, 0, 0.618, () => {
      const tapText = new PIXI.BitmapText(`TAP TO RESTART`, {
        fontName: 'Click',
        fontSize: 13,
      });

      tapText.anchor = 0.5;
      tapText.position.y += 5;

      this._rendering.addChild(tapText);

      const tap = () => {
        Emitter.emit(GAME_EVENTS.GAME_OVER);
        Emitter.removeListener(KEY_EVENTS.KEY_DOWN, tap);
        Emitter.removeListener(JOY_EVENTS.JOY_DOWN, tap);
        this._rendering.removeChild(bitmapText, tapText);
      };

      Emitter.on(KEY_EVENTS.KEY_DOWN, tap);
      Emitter.on(JOY_EVENTS.JOY_DOWN, tap);
    });
  }
}
