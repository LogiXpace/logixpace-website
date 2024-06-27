import type { PointCollider } from '$lib/helpers/colliders';
import { RGB } from '$lib/helpers/color';
import type { Vector2D } from '$lib/helpers/vector2d';
import type { SimulationEventEmitter } from './simulation-event';

export const DEFUALTS = {
	PIN_OUTLET_LINE_LENGTH: 15,
	PIN_OUTLET_LINE_WIDTH: 3,

	PIN_OUTLET_SIZE: 7,
	PIN_OUTLET_2_SIZE: 14,

	IO_SIZE: 10,
	IO_2_SIZE: 20,

	WIRE_POINT_SIZE: 3.5,
	WIRE_WIDTH: 3,

	CHIP_FONT_SIZE: 20,
	CHIP_FONT_COLOR: '#fff',
	CHIP_FONT_FAMILY: 'monospace',
	CHIP_FONT_STROKE_WIDTH: 1,

	ACTIVATED_COLOR: new RGB(255, 0, 0),
	UNACTIVATED_COLOR: new RGB(150, 150, 150),
};

export const EVENT_IDS = {
	destroy: 'destroy',
	onMove: 'onMove',
	onBeforeMove: 'onBeforeMove',
	onAfterMove: 'onAfterMove',
	onOutletMove: 'onOutletMove'
};

export type EventIDTypes = {
	// move
	DELTA_MOVE: SimulationEventEmitter<Vector2D>;
	DELTA_OLD_NEW_MOVE: SimulationEventEmitter<{
		delta: Vector2D;
		old: Vector2D;
		new: Vector2D;
	}>;

	DESTROY: SimulationEventEmitter<undefined>;

	CHECK_HOVER: SimulationEventEmitter<PointCollider>;
	UNHOVER: SimulationEventEmitter<undefined>;

	CHECK_SELECT: SimulationEventEmitter<PointCollider>;
	DESELECT: SimulationEventEmitter<undefined>;
};

export const KEYBOARD_INPUTS = {
	PANNING: ' '
};
