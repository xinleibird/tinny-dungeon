import * as PIXI from 'pixi.js';
import { Player } from '../character';
import { StaticSystem } from '../core';
import { Loader } from '../system';

export default class HealthBar extends PIXI.Container {
  private _player: Player;
  private _heartTexture: PIXI.Texture;

  public constructor(player: Player) {
    super();
    this._player = player;
    this._heartTexture = Loader.textures.UI['heart'];
    this.update();

    this.position.y = 8;
  }

  public update() {
    const hp = this?._player?.currentHP;

    let row = 0;
    let column = 0;

    this.removeChildren();
    for (let i = 0; i < hp; i++) {
      column = i % 10;
      row = ~~(i / 10);

      const heart = new PIXI.Sprite(this._heartTexture);
      heart.position.x += column * 8;
      heart.position.y += row * 7;
      this.addChild(heart);
    }

    this.position.x =
      (StaticSystem.camera.viewport.right - StaticSystem.camera.viewport.left - 80) / 2 + 1;
  }
}
