import { gsap, Power3 } from 'gsap';
import * as PIXI from 'pixi.js';
import { CHARACTER_TYPES } from '../../character';
import { Vector2 } from '../../geometry';
import External, { EXTERNAL_NAMES } from './External';

export default class DamageIndicator extends External {
  protected _rendering: PIXI.Container = new PIXI.Container();

  public constructor() {
    super();
    this._name = EXTERNAL_NAMES.DAMAGE_INDICATOR;
  }

  public addDamageText(damage: number, characterType: CHARACTER_TYPES) {
    this.cleanupText();

    let color = 0xac3232;

    if (characterType === CHARACTER_TYPES.PLAYER) {
      color = 0x306082;
    }

    let bitmapText = null;
    if (damage) {
      bitmapText = new PIXI.BitmapText(`-${damage}`, {
        fontName: 'Click',
        fontSize: 13,
        tint: color,
      });
    } else {
      bitmapText = new PIXI.BitmapText('Miss', {
        fontName: 'Click',
        fontSize: 13,
        tint: color,
      });
    }

    const dir = this._direction.equals(Vector2.left) ? 1 : -1;

    bitmapText.anchor = 0.5;
    bitmapText.scale = 0.8;
    this._rendering.addChild(bitmapText);

    gsap.to(bitmapText, {
      duration: 0.2,
      pixi: {
        x: 12 * dir,
        y: -2,
        scale: 1,
      },
      ease: Power3.easeOut,
      onComplete: () => {
        gsap.to(bitmapText, {
          duration: 0.15,
          pixi: {
            x: 12 * dir,
            y: 4,
            scale: 0.5,
          },
          ease: Power3.easeIn,
          onComplete: () => {
            gsap.to(bitmapText, {
              duration: 0.2,
              pixi: {
                x: 8 * dir,
                y: 4,
                alpha: 0,
              },
              ease: Power3.easeOut,
            });
          },
        });
      },
    });
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: Vector2) {
    this._direction = direction;
    this.handleDirection(direction);
  }

  public get visiable() {
    return this._rendering.visible;
  }

  public set visiable(visiable: boolean) {
    this._rendering.visible = visiable;
  }

  private handleDirection(direction: Vector2) {
    if (direction.equals(Vector2.left)) {
      this._rendering.scale.x = -1;
    }

    if (direction.equals(Vector2.right)) {
      this._rendering.scale.x = 1;
    }
  }

  private cleanupText() {
    for (const child of this._rendering.children) {
      if (child.visible) {
        this._rendering.removeChild(child);
      }
    }
  }
}
