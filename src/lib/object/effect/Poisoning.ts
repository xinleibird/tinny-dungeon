import Effect from './Effect';

export default class Poisoning extends Effect {
  public constructor() {
    super();
    this._name = 'Poison Effect';
    this._turnsRest = 3;
    this._stackable = true;
  }

  public update() {
    super.update();
  }
}
