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

	addWire(wire: Wire<T>): void
	removeWire(wire: Wire<T>): void
}

export interface WireProps<T> {
	startPosition: Vector2D;
	endPosition: Vector2D;

	start: WireEntity<T>;
	end: WireEntity<T>;
}

export class Wire<T> {
	startPosition: Vector2D;
	endPosition: Vector2D;

	start: WireEntity<T>;
	end: WireEntity<T>;

	dispatcher = new SimulationEventDispatcher();
	collider: LineCollider;

	constructor({
		startPosition,
		endPosition,
		start,
		end
	}: WireProps<T>) {
		this.startPosition = startPosition;
		this.endPosition = endPosition;

		this.start = start;
		this.end = end;

		this.start.addWire(this);
		this.end.addWire(this);

		this.collider = new LineCollider(this.startPosition, this.endPosition, DEFUALTS.WIRE_WIDTH);
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
				strokeColor: new RGB(100, 100, 100, 0.2),
				lineWidth: DEFUALTS.WIRE_WIDTH
			})
		);

		drawLine(
			ctx,
			this.startPosition.x,
			this.startPosition.y,
			this.endPosition.x,
			this.endPosition.y,
			new CanvasStyle({
				strokeColor: this.start.activated ? new RGB(100, 100, 100, 1) : new RGB(75, 50, 255, 1),
				lineWidth: DEFUALTS.WIRE_WIDTH,
			})
		);
	}
}
