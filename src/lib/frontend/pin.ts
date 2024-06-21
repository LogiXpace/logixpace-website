import { NamedPin } from './named-pin';
import { Vector2D } from '$lib/helpers/vector2d';
import { SimulationEventDispatcher, SimulationEventEmitter } from './simulation-event';
import { BoxCollider, Collider } from '$lib/helpers/colliders';
import { DEFUALTS } from './defaults';
import { CanvasStyle } from '$lib/helpers/canvas-style';
import { drawLine, drawRectangle } from '$lib/helpers/draw';
import { HSL } from '$lib/helpers/color';
import { calculateBoxFromTwoPoint } from '$lib/helpers/shape';

export interface PinProps {
	position: Vector2D;
	namedPin: NamedPin;
	direction: Vector2D;
}

export class Pin {
	namedPin: NamedPin;
	position: Vector2D;

	isSelected = false;
	isHovering = false;

	eventDispatcher = new SimulationEventDispatcher();

	direction: Vector2D;

	outletLineCollider: BoxCollider;
	outletCollider: BoxCollider;

	constructor({ namedPin, position, direction }: PinProps) {
		this.namedPin = namedPin;
		this.position = position.clone();

		this.direction = direction.clone();

		this.eventDispatcher.addEmiiter("move");
		this.eventDispatcher.addEmiiter("destroy");

		this.outletLineCollider = new BoxCollider(
			this.position,
			DEFUALTS.PIN_OUTLET_LINE_LENGTH,
			DEFUALTS.PIN_OUTLET_LINE_WIDTH
		);

		const outletPosiion = this.calculateOutletPosition();
		this.outletCollider = new BoxCollider(
			outletPosiion,
			DEFUALTS.PIN_OUTLET_SIZE,
			DEFUALTS.PIN_OUTLET_SIZE
		);
	}

	updateColliders() {
		this.outletCollider.position = this.calculateOutletPosition();
		
		const result = calculateBoxFromTwoPoint(this.position, this.outletCollider.position);
		this.outletLineCollider.position.copy(result.position);
		this.outletCollider.width = result.width;
		this.outletCollider.height = result.height;
	}

	move(delta: Vector2D) {
		this.position.addVector(delta);
		this.updateColliders();

		const movingEventEmitter = this.eventDispatcher.getEmitter("move");
		movingEventEmitter.emit(this);
	}

	calculateOutletPosition() {
		return this.position
			.clone()
			.addVector(this.direction.clone().multScalar(DEFUALTS.PIN_OUTLET_LINE_LENGTH))
			.subScalar(DEFUALTS.PIN_OUTLET_SIZE / 2);
	}

	draw(ctx: CanvasRenderingContext2D) {
		const outletCenterPosiion = this.outletCollider.position
			.clone()
			.addScalar(DEFUALTS.PIN_OUTLET_SIZE / 2);

		drawLine(
			ctx,
			this.position.x,
			this.position.y,
			outletCenterPosiion.x,
			outletCenterPosiion.y,
			new CanvasStyle({
				lineWidth: DEFUALTS.PIN_OUTLET_LINE_WIDTH,
				strokeColor: new HSL(0, 0, 0.5)
			})
		);

		drawRectangle(
			ctx,
			this.outletCollider.position.x,
			this.outletCollider.position.y,
			DEFUALTS.PIN_OUTLET_SIZE,
			DEFUALTS.PIN_OUTLET_SIZE,
			new CanvasStyle({
				fillColor: new HSL(0, 0, 0.5)
			})
		);
	}

	isColliding(collider: Collider) {
		return this.outletCollider.isColliding(collider) || this.outletCollider.isColliding(collider);
	}
}
