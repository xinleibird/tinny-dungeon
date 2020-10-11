export default class Effect {
  protected _name: string;
  protected _turnsRest: number;
  protected _stackable: boolean;

  protected constructor() {
    this._name = 'Abstract Effect';
    this._turnsRest = 0;
    this._stackable = false;
  }

  public get name() {
    return this._name;
  }

  protected get turnsRest() {
    return this._turnsRest;
  }

  public get stackable() {
    return this._stackable;
  }

  public update() {
    this.basicUpdate();
  }

  private basicUpdate() {
    this._turnsRest--;
    if (this.turnsRest <= 0) {
      this._stackable = false;
    }
  }
}
