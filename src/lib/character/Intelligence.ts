import { Character } from '.';
import { Disable } from '../object/strategy';
import Strategy from '../object/strategy/Strategy';
import { TurnEvent } from '../turn';

export default class Intelligence {
  protected _self: Character;
  protected _target: Character;
  private _strategy: Strategy;
  private _eventQueue: TurnEvent[];

  public constructor(self: Character, target?: Character) {
    this._self = self;
    this._target = target;
    this._strategy = new Disable(self);
  }

  public decide() {
    this._eventQueue = this._strategy.execute();
    this.carry();
  }

  public set strategy(strategy: Strategy) {
    this._strategy = strategy;
  }

  public get strategy() {
    return this._strategy;
  }

  public setStrategy(strategy: Strategy) {
    this._strategy = strategy;
  }

  private carry() {
    this._self.turnBase.add(this._eventQueue);
  }
}
