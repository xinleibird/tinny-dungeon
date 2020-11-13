import * as PIXI from 'pixi.js';
import { Renderable } from '../abstraction';
import { Player } from '../character';
import { StaticSystem } from '../core';
import HealthBar from './HealthBar';

export default class UserInterface extends Renderable {
  protected _rendering: PIXI.Container;

  private _player: Player;
  private _healthBar: HealthBar;

  public constructor(player: Player) {
    super();
    this._rendering = new PIXI.Container();

    this.initialize(player);
    this.registUpdater();
  }

  public regist(player?: Player) {
    this.initialize(player);
  }

  public get rendering() {
    return this._rendering;
  }

  private registUpdater() {
    PIXI.Ticker.shared.add(() => {
      this._healthBar.update();

      this._rendering.position.x = StaticSystem.camera.viewport.left;
      this._rendering.position.y = StaticSystem.camera.viewport.top;
    });
  }

  private initialize(player: Player) {
    this._rendering.removeChildren();

    this._player = player;
    this._healthBar = new HealthBar(player);

    this._rendering.addChild(this._healthBar);
    StaticSystem.renderer.add(this);
  }
}
