import { Scene } from '../scene';
import Character, { NONPLAYER_TYPES } from './character';

export default class NonPlayer extends Character {
  public constructor(type: NONPLAYER_TYPES, scene?: Scene) {
    super(type);
    this.hide();
  }

  public updateLighting() {}

  public hide() {
    super.hide();
  }

  public show() {
    super.show();
  }
}
