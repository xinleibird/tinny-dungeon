import * as ROT from 'rot-js';
import { StaticSystem } from '../core';
import { Pickupable } from '../object/ability';
import { PICKUPABLE_TYPES } from '../object/ability/Pickupable';
import { Attacking, Movement, Opening } from '../object/behavior';
import { GameSound } from '../sound';
import Character, { NONPLAYER_TYPES } from './Character';
import CharacterClass from './CharacterClass';

export default class NonPlayer extends Character {
  public constructor(type: NONPLAYER_TYPES) {
    super(type);

    this._class = new CharacterClass({ ST: 10, DX: 10, IQ: 10, HT: 10 }, 'Thr', 'cr');

    if (type === NONPLAYER_TYPES.SKELETON) {
      this._class = new CharacterClass({ ST: 10, DX: 11, IQ: 9, HT: 10 }, 'Thr', 'cr');
    }

    if (type === NONPLAYER_TYPES.BAT) {
      this._class = new CharacterClass({ ST: 8, DX: 12, IQ: 9, HT: 9 }, 'Thr', 'cr');
    }

    this.hide();
  }

  public gotDamage(damage: number) {
    super.gotDamage(damage);

    if (this.currentHP <= 0) {
      const itemPool = [null, PICKUPABLE_TYPES.HEALTH_POTION];
      const roll = ROT.RNG.getItem(itemPool);

      if (roll) {
        const { x, y } = this._geometryPosition;
        const entity = StaticSystem.entityGroup.getEntity(x, y);
        entity.addAbility(new Pickupable(this, roll));
      }
    }
  }

  public hide() {
    this._rendering.visible = false;
  }

  public show() {
    this._rendering.visible = true;
  }

  protected registBehaviors() {
    const movement = new Movement(this);
    const opening = new Opening(this);
    const attacting = new Attacking(this);
    this._behaviors.push(opening, attacting, movement);
  }

  protected registSounds() {
    super.registSounds();
    this._stepSound = GameSound.get('nonplayer_step', 0.003);
    this._attackSound = GameSound.get('nonplayer_attack', 0.01);
  }
}
