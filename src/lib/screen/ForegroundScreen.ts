import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { CHARACTER_ANIMATIONS } from '../character';
import { GAME_OPTIONS } from '../config';
import { GameMusic, GameSound } from '../sound';
import { MUSIC_ALBUM } from '../sound/GameMusic';
import { Emitter, GAME_EVENTS, JOY_EVENTS, KEY_EVENTS, Loader } from '../system';
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

  public effect(event: GAME_EVENTS, cb?: () => void, value?: any) {
    switch (event) {
      case GAME_EVENTS.GAME_TITLE: {
        this.gameTitle(cb);
        break;
      }

      case GAME_EVENTS.SCENE_START: {
        this.sceneStart(value);
        break;
      }

      case GAME_EVENTS.SCENE_CLEAR: {
        this.sceneClear(value, cb);
        break;
      }

      case GAME_EVENTS.USER_DIE: {
        this.tapToRestart(cb);
        break;
      }

      default:
        break;
    }
  }

  private sceneClear(value: number, cb: () => void) {
    const text = new PIXI.BitmapText(`LEVEL ${value} CLEAR`, {
      fontName: 'Covenant5x5',
      fontSize: 9,
      align: 'center',
    });

    text.anchor = 0.5;
    text.position.y -= 20;
    this._rendering.addChild(text);
    this._rendering.alpha = 0;
    text.alpha = 0;
    gsap.to(text, {
      duration: 2,
      pixi: { alpha: 1 },
      onComplete: () => {
        setTimeout(() => {
          cb();
          this._rendering.removeChild(text);
        }, 1000);
      },
    });

    this.fadeIn(4);
  }

  private sceneStart(value: number) {
    GameMusic.play(MUSIC_ALBUM.MAIN, 0.01);
    GameSound.play('cave_airflow', 0.01, true);
    const text = new PIXI.BitmapText(`DUNGEON LEVEL ${value}`, {
      fontName: 'Covenant5x5',
      fontSize: 9,
      align: 'center',
    });

    text.anchor = 0.5;
    text.position.y -= 20;
    this._rendering.addChild(text);
    this._rendering.alpha = 1;
    gsap.to(text, {
      duration: 2,
      pixi: { alpha: 0 },
      onComplete: () => {
        this._rendering.removeChild(text);
      },
    });

    this.fadeOut(4);
  }

  private gameTitle(cb: () => void) {
    const haveToTap = () => {
      const keyboard = new PIXI.Container();
      keyboard.pivot.set(16);

      const w = new PIXI.Sprite(Loader.textures.UI.w);
      const a = new PIXI.Sprite(Loader.textures.UI.a);
      const s = new PIXI.Sprite(Loader.textures.UI.s);
      const d = new PIXI.Sprite(Loader.textures.UI.a);
      const space = new PIXI.Sprite(Loader.textures.UI.space);
      const enter = new PIXI.Sprite(Loader.textures.UI.enter);

      w.position.y -= 16;
      a.position.x -= 16;
      s.position.x += 0;
      d.position.x += 16;
      space.position.x += 32;
      enter.position.x += 48;

      keyboard.position.y -= 16;
      keyboard.position.x -= 8;

      keyboard.addChild(w, a, s, d, space, enter);
      this._rendering.addChild(keyboard);

      const text = new PIXI.BitmapText(`USE  KEYBOARD\n\n\nOR TAP SCREEN`, {
        fontName: 'Covenant5x5',
        fontSize: 9,
        align: 'center',
      });

      text.anchor = 0.5;
      text.position.y += 10;
      this._rendering.addChild(text);

      const tapIcon = new PIXI.Sprite(Loader.textures.UI.tap);
      tapIcon.anchor.set(0.5);
      tapIcon.position.y += 36;
      this._rendering.addChild(tapIcon);

      gsap.to(tapIcon, {
        duration: 0.5,
        pixi: { alpha: 0.3 },
        repeat: -1,
        yoyo: true,
      });

      const tap = () => {
        Emitter.removeListener(KEY_EVENTS.KEY_DOWN, tap);
        Emitter.removeListener(JOY_EVENTS.JOY_DOWN, tap);
        this._rendering.removeChild(keyboard, text, tapIcon);
        showAuthor();
      };

      Emitter.on(KEY_EVENTS.KEY_DOWN, tap);
      Emitter.on(JOY_EVENTS.JOY_DOWN, tap);
    };

    const showAuthor = () => {
      const product = new PIXI.BitmapText(`辛 磊       作 品`, {
        fontName: 'Pixel',
        fontSize: 9,
      });
      product.anchor = 0.5;

      const email = new PIXI.BitmapText(`xinleibird@gmail.com`, {
        fontName: 'Covenant5x5',
        fontSize: 9,
      });

      email.anchor = 0.5;
      email.position.y += 20;

      const container = new PIXI.Container();
      container.alpha = 0;

      container.addChild(product, email);

      this._rendering.addChild(container);

      gsap.to(container, {
        duration: 1.5,
        pixi: { alpha: 0.8 },
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          this._rendering.removeChild(container);
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

      const titleBackground = new PIXI.Sprite(Loader.textures.TITLE_BACKGROUND);
      titleBackground.anchor.set(0.5);
      titleBackground.position.y -= 38;
      this._rendering.addChild(titleBackground);

      const titleBatch = Loader.textures.TITLES;
      const titleSprite = new PIXI.AnimatedSprite(titleBatch);
      titleSprite.anchor.set(0.5);
      titleSprite.position.y -= 20;
      titleSprite.alpha = 0;
      titleSprite.animationSpeed = 0.1;
      titleSprite.play();

      this._rendering.addChild(titleSprite);

      const holdBatch = Loader.textures['KNIGHT_M'][CHARACTER_ANIMATIONS.HOLD];
      const anim = new PIXI.AnimatedSprite(holdBatch);
      anim.anchor.set(0.5);
      anim.animationSpeed = 0.133;
      anim.position.y += 42;
      this.rendering.addChild(anim);
      anim.play();

      const tapToStart = new PIXI.BitmapText('GAME START', {
        fontName: 'Covenant5x5',
        fontSize: 9,
      });
      tapToStart.anchor = 0.5;
      tapToStart.position.y += 32;

      this._rendering.addChild(tapToStart);

      gsap.to(tapToStart, { duration: 0.233, pixi: { alpha: 0.5 }, repeat: -1, yoyo: true });

      gsap.to(titleSprite, {
        duration: 1.5,
        alpha: 1,
      });

      const tap = () => {
        cb();
        Emitter.removeListener(KEY_EVENTS.KEY_DOWN, tap);
        Emitter.removeListener(JOY_EVENTS.JOY_DOWN, tap);
        this._rendering.removeChild(titleSprite, titleBackground, anim, tapToStart);
      };

      Emitter.on(KEY_EVENTS.KEY_DOWN, tap);
      Emitter.on(JOY_EVENTS.JOY_DOWN, tap);
    };

    this._rendering.alpha = 1;
    haveToTap();
  }

  private tapToRestart(cb: () => void) {
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
      const tapText = new PIXI.BitmapText(`GAME OVER`, {
        fontName: 'Covenant5x5',
        fontSize: 9,
      });

      tapText.anchor = 0.5;
      tapText.position.y += 5;

      this._rendering.addChild(tapText);

      const tap = () => {
        GameMusic.stopAll();
        GameSound.stopAll();
        cb();
        Emitter.removeListener(KEY_EVENTS.KEY_DOWN, tap);
        Emitter.removeListener(JOY_EVENTS.JOY_DOWN, tap);
        this._rendering.removeChild(bitmapText, tapText);
      };

      Emitter.on(KEY_EVENTS.KEY_DOWN, tap);
      Emitter.on(JOY_EVENTS.JOY_DOWN, tap);
    });
  }
}
