import { Viewport } from 'pixi-viewport';
import Entity from '../object/entity';
import Character, { NONPLAYER_TYPES } from './character';

export default class NonPlayer extends Character {
  public constructor(type: NONPLAYER_TYPES, entities: Entity[][], viewport: Viewport) {
    super(type, entities, viewport);
    this.hide();
  }

  public hide() {
    super.hide();
  }

  public show() {
    super.show();
  }
}
