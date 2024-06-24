import { CanvasStyle } from '$lib/helpers/canvas-style';
import { BoxCollider, Collider, PointCollider } from '$lib/helpers/colliders';
import { RGB } from '$lib/helpers/color';
import { drawRectangle } from '$lib/helpers/draw';
import { calculateBoxTopLeftPositionFromCenterPosition } from '$lib/helpers/shape';
import type { Vector2D } from '$lib/helpers/vector2d';
import { DEFUALTS, EVENT_IDS, type EventIDTypes } from './defaults';
import type { IO } from './io';
import { SimulationEventDispatcher, SimulationEventListener } from './simulation-event';
import type { Wire } from './wire';

export interface WirePointProps {
	position: Vector2D;
}

export class WirePoint {
	position: Vector2D;
	collider: BoxCollider;
	wires: Wire[] = [];

	isHovering = true;

	dispatcher = new SimulationEventDispatcher();

	constructor({ position }: WirePointProps) {
		this.position = position;

		this.collider = new BoxCollider(
			this.getTopLeftPosition(),
			DEFUALTS.WIRE_POINT_SIZE,
			DEFUALTS.WIRE_POINT_SIZE
		);

		this.initEvents();
	}

	addWire(wire: Wire) {
		this.wires.push(wire);
	}

	initEvents() {
	}

	getTopLeftPosition() {
		return calculateBoxTopLeftPositionFromCenterPosition(
			this.position,
			DEFUALTS.WIRE_POINT_SIZE,
			DEFUALTS.WIRE_POINT_SIZE
		);
	}

	isCollidingMain(collider: Collider) {
		return this.collider.isColliding(collider);
	}

	updateCollider() {
		this.collider.position.copy(this.getTopLeftPosition());
	}

	move(delta: Vector2D) {
		this.position.addVector(delta);
		this.updateCollider();
	}

	checkHover(pointCollider: PointCollider) {
		this.resetHover();

		if (this.isCollidingMain(pointCollider)) {
			this.isHovering = true;
			return true;
		}

		return false;
	}

	resetHover() {
		this.isHovering = false;
	}

	select(pointCollider: PointCollider) {
		if (this.isCollidingMain(pointCollider)) {
			return true;
		}

		return false;
	}

	deselect() { }

	draw(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
		drawRectangle(
			ctx,
			this.collider.position.x,
			this.collider.position.y,
			DEFUALTS.WIRE_POINT_SIZE,
			DEFUALTS.WIRE_POINT_SIZE,
			new CanvasStyle({
				fillColor: new RGB(150, 150, 150)
			})
		);
	}
}
