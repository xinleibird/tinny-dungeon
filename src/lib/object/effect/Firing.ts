import Effect from './Effect';

export default class Firing extends Effect {
  public constructor() {
    super();
    this._name = 'Fire Effect';
    this._turnsRest = 3;
    this._stackable = true;
  }

  public update() {
    super.update();
  }
}
