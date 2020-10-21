import { PixiStatsPlugin } from '@armathai/pixi-stats';
import { OldFilmFilter } from '@pixi/filter-old-film';
import * as PIXI from 'pixi.js';
import { Player, PLAYER_TYPES } from '../character';
import { GAME_OPTIONS } from '../config';
import Controller from '../input/controller';
import { Scene } from '../scene';
import Dungeon from '../scene/dungeon';
import { Music, SoundEffect } from '../sound';
import { emitter, Loader, RESOURCE_EVENTS } from '../system';
import Camera from './camera';
import Renderer from './renderer';

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

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Game extends PIXI.Application {
  private _background: PIXI.Graphics;
  private _controller: Controller;
  private _camera: Camera;
  private _renderer: Renderer;
  private _scene: Scene;
  private _player: Player;

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
      this._renderer.render();
    });
  }

  private initialize() {
    const root = document.getElementById('root');
    root.appendChild(this.view);

    // prevent contextmenu
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // stats.js;
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
    this.registCamera();
    this.registRenderer();
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

  private registCamera() {
    this._camera = new Camera();
    this.stage.addChild(this._camera.viewport);
  }

  private registRenderer() {
    this._renderer = new Renderer();
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
      this._camera.viewport.resize(
        (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio
      );
    };
    window.onresize = () => {
      this.renderer.resize(
        (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
        (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio
      );
      this._camera.viewport.resize(
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

  private gameLoop() {
    Music.play('main');
    SoundEffect.play('cave_airflow', 0.02, true);

    this._scene = new Dungeon(MAX_DUNGEON_SIZE, MAX_DUNGEON_SIZE);
    this._player = new Player(PLAYER_TYPES.KNIGHT_M);
    this._camera.follow(this._player.rendering);

    this._player.geometryPosition = this._scene.playerRespawnPosition;

    // const skeleton = new NonPlayer(NONPLAYER_TYPES.SKELETON, dungeon);
    // const { x, y } = dungeon.respawnPosition;
    // skeleton.geometryPosition = new Vector2(x + 1, y);
  }
}
