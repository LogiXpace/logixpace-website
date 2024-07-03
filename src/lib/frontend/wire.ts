import { CanvasStyle } from '$lib/helpers/canvas-style';
import { LineCollider } from '$lib/helpers/colliders';
import { RGB } from '$lib/helpers/color';
import { drawLine } from '$lib/helpers/draw';
import type { Vector2D } from '$lib/helpers/vector2d';
import { DEFUALTS, EVENT_IDS } from './defaults';
import { SimulationEventDispatcher, SimulationEventListener } from './simulation-event';

export interface WireEntity<T> {
	pinId: T;

	get activated(): boolean;

	addWire(wire: Wire<T>): void;
	removeWire(wire: Wire<T>): void;
}

export type WireDirection = 'start' | 'end' | 'both';

export interface WireProps<T> {
	startPosition: Vector2D;
	endPosition: Vector2D;
	direction: WireDirection;
	start: WireEntity<T>;
	end: WireEntity<T>;
}

export class Wire<T> {
	startPosition: Vector2D;
	endPosition: Vector2D;
	direction: WireDirection;

	start: WireEntity<T>;
	end: WireEntity<T>;

	dispatcher = new SimulationEventDispatcher();
	collider: LineCollider;

	constructor({ startPosition, endPosition, start, end, direction }: WireProps<T>) {
		this.startPosition = startPosition;
		this.endPosition = endPosition;
		this.direction = direction;

		this.start = start;
		this.end = end;

		this.collider = new LineCollider(this.startPosition, this.endPosition, DEFUALTS.WIRE_WIDTH);
	}

	get activated() {
		return this.start.activated && this.end.activated;
	}

	updateCollider() {
		this.collider.startPosition.copy(this.startPosition);
		this.collider.endPosition.copy(this.endPosition);
	}

	draw(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
		drawLine(
			ctx,
			this.startPosition.x,
			this.startPosition.y,
			this.endPosition.x,
			this.endPosition.y,
			new CanvasStyle({
				strokeColor: this.activated ? DEFUALTS.ACTIVATED_COLOR : DEFUALTS.UNACTIVATED_COLOR,
				lineWidth: DEFUALTS.WIRE_WIDTH,
				lineDash: [5],
				lineDashOffset: this.direction === 'start' ? -currTime * 0.05 : currTime * 0.05
			})
		);
	}
}
