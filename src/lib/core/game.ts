import * as PIXI from 'pixi.js';

import { NonePlayer, Player, PLAYER_TYPES } from '../character';
import { Vector2 } from '../geometry';
import Controller from '../input/controller';
import { ABILITY_NAMES } from '../objects/ability';
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
  private _controller: Controller;

  public constructor(props: PIXIAppOption) {
    super(props);

    Loader.load();
    this._controller = new Controller();
  }

  public play() {
    const root = document.getElementById('root');
    root.appendChild(this.view);

    emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
      const knight = new Player({ x: 0, y: 0 }, PLAYER_TYPES.KNIGHT_M);
      this._player = knight;

      this.gameLoop();
      this.renderCompositions();
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

  public clearNonePlayers(none: NonePlayer) {
    this._noneplayers = [];
  }

  public get nonePlayers() {
    return this._noneplayers;
  }

  private renderCompositions() {
    if (this._currentDungeon) {
      this.stage.addChild(this._currentDungeon);
    }

    if (this._player) {
      this.stage.addChild(this._player);
    }
  }

  private gameLoop() {
    const dungeon = new Dungeon(31, 27);
    this._currentDungeon = dungeon;

    this._player.geometryPosition = this._currentDungeon.getRespawnPosition();
    this._player.entities = this._currentDungeon.entities;

    const mainTheme = Loader.sounds.musics.main;
    mainTheme.volume = 0.1;
    mainTheme.loop = true;
    mainTheme.play();
  }
}
