import * as ROT from 'rot-js';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { TurnEvent } from '../../turn';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Strategy from './Strategy';

export default class Trace extends Strategy {
  public constructor(self: Character, target: Character) {
    super(self, target);
  }

  public execute() {
    if (this._target.isStay) {
      const dir = this.siege();
      return [new TurnEvent(this._self, dir)];
    } else {
      const dir = this.follow();
      return [new TurnEvent(this._self, dir)];
    }
  }

  private follow() {
    const { x: sx, y: sy } = this._self.geometryPosition;
    const { x: tx, y: ty } = this._target.geometryPosition;
    const entityGroup = StaticSystem.entityGroup;

    const dijkstra = new ROT.Path.Dijkstra(
      sx,
      sy,
      (x, y) => {
        const entity = entityGroup.getEntity(x, y);
        if (entity?.hasAbility(ABILITY_NAMES.PASSABLE)) {
          const passable = entity.getAbility(ABILITY_NAMES.PASSABLE);

          if (passable.status === ABILITY_STATUS.PASS) {
            return true;
          }
        }

        return false;
      },
      { topology: 4 }
    );

    const pathStack = [];
    dijkstra.compute(tx, ty, (x, y) => {
      const dir = Vector2.minus(new Vector2(x, y), this._self.geometryPosition);

      if (!Vector2.equals(Vector2.center, dir)) {
        pathStack.push(dir);
      }
    });

    return pathStack[0];
  }

  private siege(threshold = 300) {
    const { x: sx, y: sy } = this._self.geometryPosition;
    const { x: tx, y: ty } = this._target.geometryPosition;
    const entityGroup = StaticSystem.entityGroup;
    const characterGroup = StaticSystem.characterGroup;

    this._self.inTick = true;

    let count = 0;

    const dijkstra = new ROT.Path.Dijkstra(
      sx,
      sy,
      (x, y) => {
        if (count > threshold) {
          return false;
        }

        const entity = entityGroup.getEntity(x, y);
        if (entity?.hasAbility(ABILITY_NAMES.PASSABLE)) {
          const passable = entity.getAbility(ABILITY_NAMES.PASSABLE);
          const char = characterGroup.getCharacter(x, y);
          const inTick = char?.inTick;

          if (passable.status === ABILITY_STATUS.PASS && !inTick) {
            return true;
          }
        }

        return false;
      },
      { topology: 4 }
    );

    const pathStack = [];
    dijkstra.compute(tx, ty, (x, y) => {
      const dir = Vector2.minus(new Vector2(x, y), this._self.geometryPosition);
      if (!Vector2.equals(Vector2.center, dir)) {
        pathStack.push(dir);
      }
    });

    return pathStack[0];
  }
}
