import Cull from 'pixi-cull';
import { Viewport, ViewportOptions } from 'pixi-viewport';
import * as PIXI from 'pixi.js';

import { PixiStatsPlugin } from '@armathai/pixi-stats';
import { OldFilmFilter } from '@pixi/filter-old-film';

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

PIXI.Application.registerPlugin(PixiStatsPlugin);
const { DEBUG, PIXEL_SCALE } = GAME_OPTIONS;
const MAX_DUNGEON_SIZE = 30;

console.log(~~window.devicePixelRatio);
let GAME_PIXEL_SCALE =
  PIXEL_SCALE * (~~window.devicePixelRatio === 0 ? 1 / 3 : ~~window.devicePixelRatio);

const defaultGameOptions: PIXIAppOption = {
  width: (window.innerWidth / GAME_PIXEL_SCALE) * window.devicePixelRatio,
  height: (window.innerHeight / GAME_PIXEL_SCALE) * window.devicePixelRatio,
  antialias: false,
  resolution: GAME_PIXEL_SCALE / window.devicePixelRatio,
  backgroundColor: 0x160c21,
};

const defaultViewportOptions: ViewportOptions = {
  screenWidth: (window.innerWidth / GAME_PIXEL_SCALE) * window.devicePixelRatio,
  screenHeight: (window.innerHeight / GAME_PIXEL_SCALE) * window.devicePixelRatio,
  worldHeight: MAX_DUNGEON_SIZE * 16 + window.innerWidth,
  worldWidth: MAX_DUNGEON_SIZE * 16 + window.innerHeight,
};

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Game extends PIXI.Application {
  private _currentDungeon: Dungeon;
  private _background: PIXI.Graphics;
  private _player: Player;
  private _noneplayers: NonePlayer[] = [];
  private _controller: Controller;
  private _scene: Viewport;

  // for stats.js
  private stats: any;

  public constructor(props?: PIXIAppOption) {
    super({ ...defaultGameOptions, ...props });

    this.initialize();

    Loader.load();
  }

  public play() {
    emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
      this.gameLoop();
    });
  }

  private initialize() {
    const root = document.getElementById('root');
    root.appendChild(this.view);

    // stats.js
    if (DEBUG) {
      root.appendChild(this.stats.dom);
      PIXI.Ticker.shared.add(() => {
        this.stats.update();
      });
    }

    this.registController();
    this.registResizer();
    this.registFilter();

    this.registBackground();
    this.registScene();
  }

  public get controller() {
    return this._controller;
  }

  public set controller(controller: Controller) {
    this._controller = controller;
  }

  private registController() {
    this._controller = new Controller();
  }

  private registScene() {
    this._scene = new Viewport(defaultViewportOptions);
    this.stage.addChild(this._scene);
  }

  private registBackground() {
    const background = new PIXI.Graphics();
    // background.beginFill(0x160c21);
    background.beginFill(0xf81111);
    background.drawRect(
      0,
      0,
      MAX_DUNGEON_SIZE * 16 + window.innerWidth * 2,
      MAX_DUNGEON_SIZE * 16 + window.innerHeight * 2
    );
    background.endFill();

    this._background = background;
    this.stage.addChild(this._background);
  }

  private registResizer() {
    window.onorientationchange = () => {
      this.renderer.resize(
        (window.innerWidth / GAME_PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / GAME_PIXEL_SCALE) * window.devicePixelRatio
      );
      this._scene.resize(
        (window.innerWidth / GAME_PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / GAME_PIXEL_SCALE) * window.devicePixelRatio
      );
    };
    window.onresize = () => {
      this.renderer.resize(
        (window.innerWidth / GAME_PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / GAME_PIXEL_SCALE) * window.devicePixelRatio
      );
      this._scene.resize(
        (window.innerWidth / GAME_PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / GAME_PIXEL_SCALE) * window.devicePixelRatio
      );
    };
  }

  private registFilter() {
    PIXI.Ticker.shared.add(() => {
      this.stage.filters = [
        new OldFilmFilter(
          {
            sepia: 0,
            noise: 0.0618,
            noiseSize: 1,
            scratch: -1,
            scratchDensity: 0.03,
            scratchWidth: 1,
            vignetting: 0.3,
            vignettingAlpha: 0.618,
            vignettingBlur: 0.3,
          },
          Math.random()
        ),
      ];
    });
  }

  private cullViewport() {
    const cull = new Cull.Simple({
      dirtyTest: false,
    });

    cull.addList(this._scene.children);
    cull.cull(this._scene.getVisibleBounds());

    PIXI.Ticker.shared.add(() => {
      if (this._scene.dirty) {
        cull.cull(this._scene.getVisibleBounds());
        this._scene.dirty = false;
      }
    });
  }

  private gameLoop() {
    this._currentDungeon = new Dungeon(MAX_DUNGEON_SIZE, MAX_DUNGEON_SIZE, this._scene);

    this._player = new Player({ x: 0, y: 0 }, PLAYER_TYPES.KNIGHT_M, this._scene);
    this._player.geometryPosition = this._currentDungeon.getRespawnPosition();
    this._player.entities = this._currentDungeon.entities;

    this._currentDungeon.draw();

    this._player.act();
    this._scene.follow(this._player);

    this.cullViewport();

    const mainTheme = Loader.sounds.musics.main;
    mainTheme.volume = 0.06;
    mainTheme.loop = true;
    mainTheme.play();
  }
}
