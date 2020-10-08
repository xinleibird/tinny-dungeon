import { Viewport, ViewportOptions } from 'pixi-viewport';
import * as PIXI from 'pixi.js';

import { NonePlayer, Player, PLAYER_TYPES } from '../character';
import { GAME_OPTIONS } from '../config';
import Controller from '../input/controller';
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

const { BACKGROUND_COLOR, GAME_PIXEL_SCALE } = GAME_OPTIONS;

const defaultGameOptions: PIXIAppOption = {
  width: window.innerWidth / GAME_PIXEL_SCALE / window.devicePixelRatio,
  height: window.innerHeight / GAME_PIXEL_SCALE / window.devicePixelRatio,
  antialias: false,
  resolution: GAME_PIXEL_SCALE * window.devicePixelRatio,

  backgroundColor: BACKGROUND_COLOR,
};

const defaultViewportOptions: ViewportOptions = {
  screenWidth: window.innerWidth / GAME_PIXEL_SCALE / window.devicePixelRatio,
  screenHeight: window.innerHeight / GAME_PIXEL_SCALE / window.devicePixelRatio,
  worldHeight: 31 * 16,
  worldWidth: 27 * 16,
};

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Game extends PIXI.Application {
  private _currentDungeon: Dungeon;
  private _player: Player;
  private _noneplayers: NonePlayer[] = [];
  private _controller: Controller;
  private _viewport: Viewport;

  public constructor(props?: PIXIAppOption) {
    super({ ...defaultGameOptions, ...props });

    Loader.load();

    this._viewport = new Viewport(defaultViewportOptions);
    this.stage.addChild(this._viewport);

    this._controller = new Controller();
  }

  public play() {
    const root = document.getElementById('root');
    root.appendChild(this.view);

    emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
      const knight = new Player({ x: 0, y: 0 }, PLAYER_TYPES.KNIGHT_M);
      this._player = knight;

      this.gameLoop();
      this.renderLayers();
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

  private renderLayers() {
    if (this._currentDungeon) {
      this._viewport.addChild(this._currentDungeon);
    }

    if (this._player) {
      this._viewport.addChild(this._player);
    }
  }

  private gameLoop() {
    const dungeon = new Dungeon(100, 100);
    this._currentDungeon = dungeon;

    this._player.geometryPosition = this._currentDungeon.getRespawnPosition();
    this._player.entities = this._currentDungeon.entities;

    this._viewport.follow(this._player);

    const mainTheme = Loader.sounds.musics.main;
    mainTheme.volume = 0.1;
    mainTheme.loop = true;
    mainTheme.play();
  }
}
