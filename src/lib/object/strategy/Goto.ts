import * as ROT from 'rot-js';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { TurnEvent } from '../../turn';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Strategy from './Strategy';

export default class Goto extends Strategy {
  private _targetGeometryPosition: Vector2;
  public constructor(self: Character, geoPosition: Vector2) {
    super(self, null);
    this._targetGeometryPosition = geoPosition;
  }

  public execute() {
    const dirs = this.goto();
    const eventQueue = [];

    for (let time = 0; time < dirs.length; time++) {
      const event = new TurnEvent(this._self, dirs[time], time);
      eventQueue.push(event);
    }

    return eventQueue;
  }

  private goto() {
    const { x: sx, y: sy } = this._self.geometryPosition;
    const { x: tx, y: ty } = this._targetGeometryPosition;
    const entityGroup = StaticSystem.entityGroup;

    const dijkstra = new ROT.Path.Dijkstra(
      tx,
      ty,
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

    const geoStack = [];
    const { x, y } = this._self.geometryPosition;

    let lastX = x;
    let LastY = y;

    dijkstra.compute(sx, sy, (x, y) => {
      let dx = x - lastX;
      let dy = y - LastY;

      geoStack.push(new Vector2(dx, dy));

      lastX += dx;
      LastY += dy;
    });

    return geoStack;
  }
}
