import { CONTROL_ACTIONS, JOY_NAMES, KEY_NAMES } from '../input';

export const KEYBOARD_CONTROLLED_KEYS = {
  [CONTROL_ACTIONS.WALK_LEFT]: KEY_NAMES.a,
  [CONTROL_ACTIONS.WALK_RIGHT]: KEY_NAMES.d,
  [CONTROL_ACTIONS.WALK_UP]: KEY_NAMES.w,
  [CONTROL_ACTIONS.WALK_DOWN]: KEY_NAMES.s,
  [CONTROL_ACTIONS.SHOW_EXTERNAL]: KEY_NAMES.Space,
};

export const JOYSTICK_CONTROLLED_JOYS = {
  [CONTROL_ACTIONS.WALK_LEFT]: JOY_NAMES.left,
  [CONTROL_ACTIONS.WALK_RIGHT]: JOY_NAMES.right,
  [CONTROL_ACTIONS.WALK_UP]: JOY_NAMES.up,
  [CONTROL_ACTIONS.WALK_DOWN]: JOY_NAMES.down,
};

export const GAME_OPTIONS = {
  PIXEL_SCALE_NORMAL: 3,
  PIXEL_SCALE_RETINA: 1,
  DEBUG: true,
};

export const ENTITY_OPTIONS = {
  TILE_SIZE: 16,
  TILE_OFFSET_X: 24,
  TILE_OFFSET_Y: 32,
};
