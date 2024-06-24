import { CanvasStyle } from '$lib/helpers/canvas-style';
import { LineCollider } from '$lib/helpers/colliders';
import { RGB } from '$lib/helpers/color';
import { drawLine } from '$lib/helpers/draw';
import type { Vector2D } from '$lib/helpers/vector2d';
import { DEFUALTS, EVENT_IDS } from './defaults';
import { SimulationEventDispatcher, SimulationEventListener } from './simulation-event';

export interface WireProps {
	startPosition: Vector2D;
	endPosition: Vector2D;
}

export class Wire {
	startPosition: Vector2D;
	endPosition: Vector2D;

	dispatcher = new SimulationEventDispatcher();
	collider: LineCollider;

	constructor({ startPosition, endPosition }: WireProps) {
		this.startPosition = startPosition;
		this.endPosition = endPosition;

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
				strokeColor: new RGB(25, 25, 25, 0.8),
				lineWidth: DEFUALTS.WIRE_WIDTH,
				lineDashOffset: -currTime * 0.03,
				lineDash: [10, 5]
			})
		);
	}
}
