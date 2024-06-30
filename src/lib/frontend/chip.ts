import { CanvasStyle } from '$lib/helpers/canvas-style';
import {
	BoxCollider,
	CircleCollider,
	Collider,
	LineCollider,
	PointCollider
} from '$lib/helpers/colliders';
import { RGB, type Color } from '$lib/helpers/color';
import { DIRECTION, getDirectionVector, type Direction } from '$lib/helpers/direction';
import { drawCircle, drawLine, drawRectangle } from '$lib/helpers/draw';
import { Vector2D } from '$lib/helpers/vector2d';
import type { ChipPin } from './chip-pin';
import { DEFUALTS } from './defaults';
import { NamedPin } from './named-pin';
import type { SimulationContext } from './simulation-context';
import { POWER_STATE_HIGH } from './state';
import type { Wire, WireEntity } from './wire';

export interface ChipProps<T> {
	id: T;
	position: Vector2D;
	name: string;
	textWidth: number;
	color: Color;
	inputPins: ChipPin<T>[];
	outputPins: ChipPin<T>[];
	simulationContext: SimulationContext<T>;
}

export class Chip<T> {
	id: T;
	position: Vector2D;
	name: string;
	color: Color;
	inputPins: ChipPin<T>[];
	outputPins: ChipPin<T>[];

	collider: BoxCollider;
	bound: BoxCollider;

	isHovering = false;
	isSelected = false;

	constructor({ position, id, textWidth, name, color, inputPins, outputPins, simulationContext }: ChipProps<T>) {
		this.position = position.clone();
		this.name = name;
		this.color = color;
		this.id = id;

		const width = 10 + textWidth + 10;
		const maxPins = Math.max(inputPins.length, outputPins.length);
		const height = maxPins * (DEFUALTS.PIN_OUTLET_SIZE + 5) + (DEFUALTS.CHIP_FONT_SIZE * 4) / 3;

		this.collider = new BoxCollider(position, width, height);
		this.bound = new BoxCollider(position.clone().subScalar(DEFUALTS.CHIP_SELECT_PADDING), width + DEFUALTS.CHIP_SELECT_PADDING * 2, height + DEFUALTS.CHIP_SELECT_PADDING * 2);

		this.inputPins = inputPins;

		for (let i = 0; i < this.inputPins.length; i++) {
			const inputPin = inputPins[i];
			simulationContext.entityManager.removeChipPin(inputPin);
			inputPin.direction = DIRECTION.LEFT;
			inputPin.position.x = this.position.x;
			inputPin.position.y = this.position.y + i * 20 + 10;
			inputPin.calculateOutletPosition();
			inputPin.updateCollider();
			simulationContext.entityManager.insertChipPin(inputPin);
		}

		this.outputPins = outputPins;

		for (let i = 0; i < this.outputPins.length; i++) {
			const outputPin = outputPins[i];
			simulationContext.entityManager.removeChipPin(outputPin);
			outputPin.direction = DIRECTION.RIGHT;
			outputPin.position.x = this.position.x + width;
			outputPin.position.y = this.position.y + i * 20 + 10;
			outputPin.calculateOutletPosition();
			outputPin.updateCollider();
			simulationContext.entityManager.insertChipPin(outputPin);
		}
	}

	updateCollider() {
		this.collider.position.copy(this.position);
		this.bound.position.copy(this.position).subScalar(DEFUALTS.CHIP_SELECT_PADDING);
	}

	isCollidingMain(collider: Collider) {
		return this.collider.isColliding(collider);
	}

	select() {
		this.isSelected = true;
	}

	deselect() {
		this.isSelected = false;
	}

	checkHover(pointCollider: PointCollider): boolean {
		this.resetHover();

		if (this.isSelected && this.bound.isColliding(pointCollider)) {
			return true;
		}

		if (this.isCollidingMain(pointCollider)) {
			this.isHovering = true;
			return true;
		}

		return false;
	}

	resetHover() {
		this.isHovering = false;
	}

	move(delta: Vector2D) {
		this.position.addVector(delta);
		this.updateCollider();
	}

	draw(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
		drawRectangle(
			ctx,
			this.position.x,
			this.position.y,
			this.collider.width,
			this.collider.height,
			new CanvasStyle({
				fillColor: this.color
			})
		);

		if (this.isSelected) {
			drawRectangle(
				ctx,
				this.bound.position.x,
				this.bound.position.y,
				this.bound.width,
				this.bound.height,
				new CanvasStyle({
					strokeColor: new RGB(0, 0, 0),
					lineWidth: 1,
					lineDash: [3, 3]
				})
			);
		}

		const centerPosition = this.position
			.clone()
			.addVector(new Vector2D(this.collider.width, this.collider.height).divScalar(2));

		ctx.beginPath();
		ctx.lineWidth = DEFUALTS.CHIP_FONT_STROKE_WIDTH;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'white';
		ctx.font = `${DEFUALTS.CHIP_FONT_SIZE}px ${DEFUALTS.CHIP_FONT_FAMILY}`;
		ctx.fillText(this.name, centerPosition.x, centerPosition.y, this.collider.width);
	}
}
