import { NamedPin } from './named-pin';
import { Vector2D } from '$lib/helpers/vector2d';
import { SimulatuionEventEmitter } from './simulation-event';
import { BoxCollider } from '$lib/helpers/colliders';
import { DEFUALTS } from './defaults';
import { CanvasStyle } from '$lib/helpers/canvas-style';
import { drawLine, drawRectangle } from '$lib/helpers/draw';
import { HSL } from '$lib/helpers/color';

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

	destroyEventEmitter = new SimulatuionEventEmitter<Pin>();
	movingEventEmitter = new SimulatuionEventEmitter<Pin>();

	direction: Vector2D;

	outletLineCollider: BoxCollider;
	outletCollider: BoxCollider;

	constructor({ namedPin, position, direction }: PinProps) {
		this.namedPin = namedPin;
		this.position = position.clone();

		this.direction = direction.clone();

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

	calculateOutletPosition() {
		return this.position
			.clone()
			.addVector(this.direction.clone().multScalar(DEFUALTS.PIN_OUTLET_LINE_LENGTH))
			.subScalar(DEFUALTS.PIN_OUTLET_SIZE / 2);
	}

	calculateOutletCenterPosition() {
		return this.outletCollider.position.clone().addScalar(DEFUALTS.PIN_OUTLET_SIZE / 2);
	}

	draw(ctx: CanvasRenderingContext2D) {
		const outletCenterPosiion = this.calculateOutletCenterPosition();

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
}
