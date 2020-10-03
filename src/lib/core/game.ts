import * as PIXI from 'pixi.js';

import { NonePlayer, Player, PLAYER_TYPES } from '../character';
import { ENTITY_TYPES } from '../objects/entity';
import { emitter, Loader, RESOURCE_EVENTS } from '../system';
import Dungeon from '../tilemap/dungeon';

export interface PIXIAppOption {
  autoStart?: boolean;
  width?: number;
  height?: number;
  view?: HTMLCanvasElement;
  transparent?: boolean;
  autoDensity?: boolean;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  resolution?: number;
  forceCanvas?: boolean;
  backgroundColor?: number;
  clearBeforeRender?: boolean;
  powerPreference?: string;
  sharedTicker?: boolean;
  sharedLoader?: boolean;
  resizeTo?: Window | HTMLElement;
}

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Game extends PIXI.Application {
  private _currentDungeon: Dungeon;
  private _player: Player;
  private _noneplayers: NonePlayer[] = [];

  public constructor(props: PIXIAppOption) {
    super(props);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'd') {
        // this._player.positionX += 1;
        const { x, y } = this._player.geometryPosition;
        const entities = this._currentDungeon.entities;

        if (entities[y][x + 1] === ENTITY_TYPES.CORRIDOR) {
          this._player.setGeometryPosition(x + 1, y);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'a') {
        // this._player.positionX -= 1;
        const { x, y } = this._player.geometryPosition;
        const entities = this._currentDungeon.entities;

        if (entities[y][x - 1] === ENTITY_TYPES.CORRIDOR) {
          this._player.setGeometryPosition(x - 1, y);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'w') {
        // this._player.positionY -= 1;
        const { x, y } = this._player.geometryPosition;
        const entities = this._currentDungeon.entities;

        if (entities[y - 1][x] === ENTITY_TYPES.CORRIDOR) {
          this._player.setGeometryPosition(x, y - 1);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 's') {
        // this._player.positionY += 1;
        const { x, y } = this._player.geometryPosition;
        const entities = this._currentDungeon.entities;

        if (entities[y + 1][x] === ENTITY_TYPES.CORRIDOR) {
          this._player.setGeometryPosition(x, y + 1);
        }
      }
    });

    Loader.load();
  }

  public play() {
    const root = document.getElementById('root');
    root.appendChild(this.view);

    emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
      const dungeon = new Dungeon(25, 21);
      this._currentDungeon = dungeon;
      this.stage.addChild(dungeon);

      const t = new Player(2, 2, PLAYER_TYPES.KNIGHT_M);
      this.stage.addChild(t);

      const v = t.children[2] as PIXI.AnimatedSprite;
      v.play();

      this._gameLoop();
      this._player = t;
    });
  }

  public get currentDungeon() {
    return this._currentDungeon;
  }

  public set currentDungeon(dungeon: Dungeon) {
    this._currentDungeon = dungeon;
  }

  public get player() {
    return this._player;
  }

  public set player(player: Player) {
    this._player = player;
  }

  public addNonePlayers(...nones: NonePlayer[]) {
    this._noneplayers = [...this._noneplayers, ...nones];
  }

  public addNonePlayer(none: NonePlayer) {
    this._noneplayers = [...this._noneplayers, none];
  }

  public get nonePlayers() {
    return this._noneplayers;
  }

  private _gameLoop() {}
}
