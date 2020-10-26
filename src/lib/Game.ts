import { PixiStatsPlugin } from '@armathai/pixi-stats';
import { OldFilmFilter } from '@pixi/filter-old-film';
import * as PIXI from 'pixi.js';
import { NonPlayer, NONPLAYER_TYPES, Player, PLAYER_TYPES } from './character';
import { GAME_OPTIONS } from './config';
import { Camera, Renderer } from './core';
import { Vector2 } from './geometry';
import Controller from './input/Controller';
import { Scene } from './scene';
import Dungeon from './scene/Dungeon';
import { GameMusic, GameSound } from './sound';
import { Emitter, Loader, RESOURCE_EVENTS } from './system';
import { updateEntitiesLightings } from './utils';

export interface GameOptions {
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

const DUNGEON_SIZE_WIDTH = 71;
const DUNGEON_SIZE_HEITHT = 71;

const { DEBUG, PIXEL_SCALE } = GAME_OPTIONS;

const defaultGameOptions: GameOptions = {
  width: (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
  height: (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio,
  antialias: false,
  resolution: PIXEL_SCALE / window.devicePixelRatio,
  backgroundColor: 0x160c21,
};

if (DEBUG) {
  PIXI.Application.registerPlugin(PixiStatsPlugin);
}

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

  public constructor(props?: GameOptions) {
    super({ ...defaultGameOptions, ...props });

    Loader.load();

    this.initialize();
  }

  public play() {
    Emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
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
      DUNGEON_SIZE_WIDTH * 16 + window.innerWidth * 2,
      DUNGEON_SIZE_HEITHT * 16 + window.innerHeight * 2
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
    GameMusic.play('main');
    GameSound.play('cave_airflow', 0.02, true);

    this._scene = new Dungeon(DUNGEON_SIZE_WIDTH, DUNGEON_SIZE_HEITHT);
    this._player = new Player(PLAYER_TYPES.KNIGHT_M);
    this._camera.follow(this._player.rendering);

    this._player.geometryPosition = this._scene.playerRespawnPosition;
    updateEntitiesLightings(this._player.geometryPosition);

    const { x, y } = this._scene.playerRespawnPosition;

    const skeleton1 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    const skeleton2 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    const skeleton3 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    const skeleton4 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    const skeleton5 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    skeleton1.geometryPosition = new Vector2(x + 1, y);
    skeleton2.geometryPosition = new Vector2(x + 2, y);
    skeleton3.geometryPosition = new Vector2(x + 3, y);
    skeleton4.geometryPosition = new Vector2(x + 1, y + 1);
    skeleton5.geometryPosition = new Vector2(x, y + 1);
  }
}
