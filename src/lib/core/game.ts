import { PixiStatsPlugin } from '@armathai/pixi-stats';
import { OldFilmFilter } from '@pixi/filter-old-film';
import Cull from 'pixi-cull';
import { Viewport, ViewportOptions } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { NonePlayer, Player, PLAYER_TYPES } from '../character';
import { GAME_OPTIONS } from '../config';
import Controller from '../input/controller';
import Dungeon from '../scene/dungeon';
import { emitter, Loader, RESOURCE_EVENTS } from '../system';
import { updateEntitiesLightings } from '../utils';

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

const MAX_DUNGEON_SIZE = 75;

const { DEBUG, PIXEL_SCALE } = GAME_OPTIONS;

const defaultGameOptions: PIXIAppOption = {
  width: (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
  height: (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio,
  antialias: false,
  resolution: PIXEL_SCALE / window.devicePixelRatio,
  backgroundColor: 0x160c21,
};

const defaultViewportOptions: ViewportOptions = {
  screenWidth: (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
  screenHeight: (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio,
  worldHeight: MAX_DUNGEON_SIZE * 16 + window.innerWidth,
  worldWidth: MAX_DUNGEON_SIZE * 16 + window.innerHeight,
};

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Game extends PIXI.Application {
  private _background: PIXI.Graphics;
  private _player: Player;
  private _noneplayers: NonePlayer[] = [];
  private _controller: Controller;
  private _viewport: Viewport;

  // for stats.js
  private stats: any;

  public constructor(props?: PIXIAppOption) {
    super({ ...defaultGameOptions, ...props });

    Loader.load();

    this.initialize();
  }

  public play() {
    emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
      this.gameLoop();
    });
  }

  private initialize() {
    const root = document.getElementById('root');
    root.appendChild(this.view);

    // prevent contextmenu
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

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
    this.registViewport();
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

  private registViewport() {
    this._viewport = new Viewport(defaultViewportOptions);
    this.stage.addChild(this._viewport);
  }

  private registBackground() {
    const background = new PIXI.Graphics();
    background.beginFill(0x160c21);
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
        (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio
      );
      this._viewport.resize(
        (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio
      );
    };
    window.onresize = () => {
      this.renderer.resize(
        (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio
      );
      this._viewport.resize(
        (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio
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
            scratchDensity: 0.0382,
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

    cull.addList(this._viewport.children);
    cull.cull(this._viewport.getVisibleBounds());

    PIXI.Ticker.shared.add(() => {
      if (this._viewport.dirty) {
        cull.cull(this._viewport.getVisibleBounds());
        this._viewport.dirty = false;
      }
    });
  }

  private gameLoop() {
    const dungeon = new Dungeon(MAX_DUNGEON_SIZE, MAX_DUNGEON_SIZE, this._viewport);
    const player = new Player(PLAYER_TYPES.KNIGHT_M, dungeon.entities, this._viewport);
    this._player = player;

    // player.geometryPosition = dungeon.getRespawnPosition();
    player.entities = dungeon.entities;

    dungeon.addCharacter(player);
    updateEntitiesLightings(player.geometryPosition, player.entities);

    dungeon.draw();
    player.act();

    this._viewport.follow(this._player);

    this.cullViewport();
  }
}
