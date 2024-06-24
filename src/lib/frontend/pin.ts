import { NamedPin } from './named-pin';
import { Vector2D } from '$lib/helpers/vector2d';
import { SimulationEventDispatcher, SimulationEventEmitter } from './simulation-event';
import { BoxCollider, Collider, PointCollider } from '$lib/helpers/colliders';
import { DEFUALTS, EVENT_IDS } from './defaults';
import { CanvasStyle } from '$lib/helpers/canvas-style';
import { drawLine, drawRectangle } from '$lib/helpers/draw';
import { HSL } from '$lib/helpers/color';
import { calculateBoxFromTwoPoint } from '$lib/helpers/shape';
import { DIRECTION, getDirectionVector, type Direction } from '../helpers/direction';

export interface PinProps {
	position: Vector2D;
	namedPin: NamedPin;
	direction: Direction;
}

export class Pin {
	#namedPin: NamedPin;
	#position: Vector2D;

	outletPosition: Vector2D = new Vector2D();

	dispatcher = new SimulationEventDispatcher();

	isOutletLineHovering = false;
	isOutletHovering = false;

	#direction: Direction;

	#outletLineCollider: BoxCollider;
	#outletCollider: BoxCollider;

	constructor({ namedPin, position, direction }: PinProps) {
		this.#namedPin = namedPin;
		this.#position = position.clone();

		this.#direction = direction;

		this.calculateOutletPosition();

		this.#outletLineCollider = new BoxCollider(
			this.#position,
			DEFUALTS.PIN_OUTLET_LINE_LENGTH,
			DEFUALTS.PIN_OUTLET_LINE_WIDTH
		);

		this.#outletCollider = new BoxCollider(
			this.getOutletTopLeftPosition(),
			DEFUALTS.PIN_OUTLET_SIZE,
			DEFUALTS.PIN_OUTLET_SIZE
		);

		this.initEvents();
	}

	private initEvents() {
		this.dispatcher.addEmiiter(EVENT_IDS.DESTROY);
		this.dispatcher.addEmiiter(EVENT_IDS.MOVE);
	}

	set position(vector: Vector2D) {
		this.#position.copy(vector);
		this.updateColliders();
	}

	get position() {
		return this.#position.clone();
	}

	set direction(direction: Direction) {
		this.#direction = direction;
		this.updateColliders();
	}

	get direction() {
		return this.#direction;
	}

	get directionLength() {
		return DEFUALTS.PIN_OUTLET_LINE_LENGTH;
	}

	get outletSize() {
		return DEFUALTS.PIN_OUTLET_SIZE;
	}

	updateColliders() {
		this.calculateOutletPosition();
		this.#outletCollider.position = this.getOutletTopLeftPosition();

		const result = calculateBoxFromTwoPoint(this.position, this.#outletCollider.position);
		this.#outletLineCollider.position = result.position;
	}

	private getOutletTopLeftPosition() {
		return this.outletPosition.clone().subScalar(DEFUALTS.PIN_OUTLET_SIZE / 2);
	}

	private calculateOutletPosition() {
		this.outletPosition
			.copy(this.#position)
			.addVector(getDirectionVector(this.#direction).multScalar(this.directionLength));
	}

	isCollidingOutlet(collider: Collider) {
		return this.#outletCollider.isColliding(collider);
	}

	isCollidingOutletLine(collider: Collider) {
		return this.#outletLineCollider.isColliding(collider);
	}

	move(delta: Vector2D) {
		this.position = this.position.addVector(delta);

		const movingEventEmitter = this.dispatcher.getEmitter(EVENT_IDS.MOVE);

		// @ts-ignore
		movingEventEmitter.emit(delta);
	}

	hover(pointCollider: PointCollider) {
		this.resetHover();

		if (this.isCollidingOutlet(pointCollider)) {
			this.isOutletHovering = true;
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
	}

	draw(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
		const position = this.#position;
		const outletTopLeftPosition = this.#outletCollider.position;
		const outletPosition = this.outletPosition;

		drawLine(
			ctx,
			position.x,
			position.y,
			outletPosition.x,
			outletPosition.y,
			new CanvasStyle({
				lineWidth: DEFUALTS.PIN_OUTLET_LINE_WIDTH,
				strokeColor: new HSL(0, 0, 0.5)
			})
		);

		drawRectangle(
			ctx,
			outletTopLeftPosition.x,
			outletTopLeftPosition.y,
			DEFUALTS.PIN_OUTLET_SIZE,
			DEFUALTS.PIN_OUTLET_SIZE,
			new CanvasStyle({
				fillColor: new HSL(0, 0, 0.5)
			})
		);
	}
}
