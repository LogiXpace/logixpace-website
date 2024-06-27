import { CanvasStyle } from '$lib/helpers/canvas-style';
import { BoxCollider, CircleCollider, Collider, PointCollider } from '$lib/helpers/colliders';
import { RGB } from '$lib/helpers/color';
import { drawCircle, drawRectangle } from '$lib/helpers/draw';
import { calculateBoxTopLeftPositionFromCenterPosition } from '$lib/helpers/shape';
import type { Vector2D } from '$lib/helpers/vector2d';
import { DEFUALTS, EVENT_IDS, type EventIDTypes } from './defaults';
import type { IO } from './io';
import { SimulationEventDispatcher, SimulationEventListener } from './simulation-event';
import type { Wire } from './wire';

export interface WirePointProps<T> {
	position: Vector2D;
	pinId: T;
}

export class WirePoint<T> {
	position: Vector2D;
	collider: CircleCollider;
	wires: Wire<T>[] = [];

	pinId: T;

	isHovering = false;
	isActivated = false;

	dispatcher = new SimulationEventDispatcher();

	constructor({ position, pinId }: WirePointProps<T>) {
		this.position = position;
		this.pinId = pinId;

		this.collider = new CircleCollider(this.position, DEFUALTS.WIRE_POINT_SIZE);

		this.initEvents();
	}

	get activated() {
		return this.isActivated;
	}

	addWire(wire: Wire<T>) {
		this.wires.push(wire);
	}

	removeWire(wire: Wire<T>) {
		const index = this.wires.indexOf(wire);
		if (index !== -1) {
			this.wires.splice(index, 1);
		}
	}

	initEvents() { }

	isCollidingMain(collider: Collider) {
		return this.collider.isColliding(collider);
	}

	updateCollider() {
		this.collider.position.copy(this.position);
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
		drawCircle(
			ctx,
			this.collider.position.x,
			this.collider.position.y,
			DEFUALTS.WIRE_POINT_SIZE,
			new CanvasStyle({
				fillColor: this.isActivated ? DEFUALTS.ACTIVATED_COLOR : DEFUALTS.UNACTIVATED_COLOR
			})
		);
	}
}
