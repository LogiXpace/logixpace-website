import { CanvasStyle } from '$lib/helpers/canvas-style';
import {
	BoxCollider,
	CircleCollider,
	Collider,
	LineCollider,
	PointCollider
} from '$lib/helpers/colliders';
import { Color, HSL, RGB } from '$lib/helpers/color';
import { drawCircle, drawLine, drawRectangle } from '$lib/helpers/draw';
import { calculateBoxFromTwoPoint } from '$lib/helpers/shape';
import { Vector2D } from '$lib/helpers/vector2d';
import { DEFUALTS, EVENT_IDS } from './defaults';
import { DIRECTION, getDirectionVector, type Direction } from '../helpers/direction';
import type { NamedPin } from './named-pin';
import { Pin, type PinProps } from './pin';
import { SimulationEventDispatcher, SimulationEventListener } from './simulation-event';
import type { Wire } from './wire';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from './state';

export interface IOProps<T> extends PinProps<T> {
	color?: Color;
}

export class IO<T> {
	bound: BoxCollider;

	collider: CircleCollider;
	outletLineCollider: LineCollider;
	outletCollider: CircleCollider;

	namedPin: NamedPin<T>;

	position: Vector2D;
	outletPosition: Vector2D = new Vector2D();
	direction: Direction;

	dispatcher = new SimulationEventDispatcher();

	wires: Wire<T>[] = [];

	isSelected = false;
	isHovering = false;
	isOutletLineHovering = false;
	isOutletHovering = false;

	color: Color;

	constructor({ namedPin, position, direction, color = new RGB(0, 0, 0) }: IOProps<T>) {
		this.namedPin = namedPin;
		this.position = position.clone();

		this.color = color;

		this.direction = direction;

		this.calculateOutletPosition();

		this.outletLineCollider = new LineCollider(
			this.position,
			this.outletPosition,
			DEFUALTS.PIN_OUTLET_LINE_WIDTH
		);

		this.outletCollider = new CircleCollider(this.outletPosition, DEFUALTS.PIN_OUTLET_SIZE);

		this.collider = new CircleCollider(this.position, DEFUALTS.IO_SIZE);

		const result = this.calculateBound();
		this.bound = new BoxCollider(result.position, result.width, result.height);

		this.initEvents();
	}

	get pinId() {
		return this.namedPin.id;
	}

	get activated() {
		return this.namedPin.powerState === POWER_STATE_HIGH;
	}

	initEvents() {
		this.dispatcher.addEmiiter(EVENT_IDS.onMove);
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

	updateColliders() {
		this.calculateOutletPosition();
		this.outletCollider.position.copy(this.outletPosition);

		this.outletLineCollider.startPosition.copy(this.getOutletLinePosition());
		this.outletLineCollider.endPosition.copy(this.outletPosition);

		const result = this.calculateBound();
		this.bound.position.copy(result.position);

		this.collider.position.copy(this.position);
	}

	getOutletLinePosition() {
		return this.position.clone().subScalar(DEFUALTS.PIN_OUTLET_LINE_WIDTH / 2);
	}

	calculateOutletPosition() {
		this.outletPosition
			.copy(this.position)
			.addVector(
				getDirectionVector(this.direction).multScalar(
					DEFUALTS.PIN_OUTLET_LINE_LENGTH + DEFUALTS.IO_SIZE / 2 + DEFUALTS.PIN_OUTLET_SIZE / 2
				)
			);
	}

	calculateBound() {
		const dir = this.direction;

		const dirVector = getDirectionVector(dir);
		const end = this.position
			.clone()
			.addVector(
				dirVector.clone().multScalar(DEFUALTS.PIN_OUTLET_LINE_LENGTH + DEFUALTS.PIN_OUTLET_2_SIZE)
			);
		const start = this.position.clone().addVector(dirVector.multScalar(-DEFUALTS.IO_SIZE));

		switch (dir) {
			case DIRECTION.RIGHT:
			case DIRECTION.LEFT: {
				end.y += DEFUALTS.IO_SIZE;
				start.y -= DEFUALTS.IO_SIZE;
				return calculateBoxFromTwoPoint(start, end);
			}

			case DIRECTION.TOP:
			case DIRECTION.BOTTOM: {
				end.x += DEFUALTS.IO_SIZE;
				start.x -= DEFUALTS.IO_SIZE;
				return calculateBoxFromTwoPoint(start, end);
			}
		}
	}

	isCollidingOutlet(collider: Collider) {
		return this.outletCollider.isColliding(collider);
	}

	isCollidingOutletLine(collider: Collider) {
		return this.outletLineCollider.isColliding(collider);
	}

	isCollidingMain(collider: Collider) {
		return this.collider.isColliding(collider);
	}

	move(delta: Vector2D) {
		this.position.addVector(delta);
		this.updateColliders();

		this.dispatcher.dispatch(EVENT_IDS.onMove, delta);
		this.dispatcher.dispatch(EVENT_IDS.onOutletMove, this.outletPosition);
	}

	checkHover(pointCollider: PointCollider) {
		this.resetHover();

		if (this.isCollidingOutlet(pointCollider)) {
			this.isOutletHovering = true;
			return true;
		} else if (this.isCollidingMain(pointCollider)) {
			this.isHovering = true;
			return true;
		} else if (this.isCollidingOutletLine(pointCollider)) {
			this.isOutletLineHovering = true;
			return true;
		}

		return false;
	}

	resetHover() {
		this.isOutletHovering = false;
		this.isOutletLineHovering = false;
		this.isHovering = false;
	}

	select(pointCollider: PointCollider) {
		if (
			this.isCollidingMain(pointCollider) ||
			this.isCollidingOutlet(pointCollider) ||
			this.isCollidingOutletLine(pointCollider)
		) {
			this.isSelected = true;
		}
	}

	deselect() {
		this.isSelected = false;
	}

	draw(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
		drawLine(
			ctx,
			this.position.x,
			this.position.y,
			this.outletPosition.x,
			this.outletPosition.y,
			new CanvasStyle({
				lineWidth: DEFUALTS.PIN_OUTLET_LINE_WIDTH,
				strokeColor: this.activated ? DEFUALTS.ACTIVATED_COLOR : DEFUALTS.UNACTIVATED_COLOR
			})
		);

		drawCircle(
			ctx,
			this.outletCollider.position.x,
			this.outletCollider.position.y,
			this.outletCollider.radius,
			new CanvasStyle({
				fillColor: this.activated ? DEFUALTS.ACTIVATED_COLOR : DEFUALTS.UNACTIVATED_COLOR
			})
		);

		drawCircle(
			ctx,
			this.position.x,
			this.position.y,
			this.collider.radius,
			new CanvasStyle({
				fillColor: this.activated ? DEFUALTS.ACTIVATED_COLOR : DEFUALTS.UNACTIVATED_COLOR
			})
		);
	}
}
