import { CanvasStyle } from "$lib/helpers/canvas-style";
import { BoxCollider, CircleCollider, Collider, LineCollider, PointCollider } from "$lib/helpers/colliders";
import { RGB, type Color } from "$lib/helpers/color";
import { DIRECTION, getDirectionVector, type Direction } from "$lib/helpers/direction";
import { drawCircle, drawLine, drawRectangle } from "$lib/helpers/draw";
import { Vector2D } from "$lib/helpers/vector2d";
import type { ChipPin } from "./chip-pin";
import { DEFUALTS } from "./defaults";
import { NamedPin } from "./named-pin";
import { POWER_STATE_HIGH } from "./state";
import type { Wire, WireEntity } from "./wire";

export interface ChipProps<T> {
  position: Vector2D;
  name: string;
  textWidth: number;
  color: Color;
  inputPins: ChipPin<T>[];
  outputPins: ChipPin<T>[];
}

export class Chip<T> {
  position: Vector2D;
  name: string;
  color: Color;
  inputPins: ChipPin<T>[];
  outputPins: ChipPin<T>[];

  collider: BoxCollider;

  isHovering = false;
  isSelected = false;

  constructor({
    position,
    textWidth,
    name,
    color,
    inputPins,
    outputPins
  }: ChipProps<T>) {
    this.position = position.clone();
    this.name = name;
    this.color = color;

    const width = 10 + textWidth + 10;
    const maxPins = Math.max(inputPins.length, outputPins.length);
    const height = maxPins * (DEFUALTS.PIN_OUTLET_SIZE + 5) + DEFUALTS.CHIP_FONT_SIZE * 4 / 3;

    this.collider = new BoxCollider(position, width, height);

    this.inputPins = inputPins;

    for (let i = 0; i < this.inputPins.length; i++) {
      const inputPin = inputPins[i];
      inputPin.direction = DIRECTION.LEFT;
      inputPin.position.x = this.position.x;
      inputPin.position.y = this.position.y + i * 20 + 10;
      inputPin.calculateOutletPosition();
      inputPin.updateCollider()
    }

    this.outputPins = outputPins;

    for (let i = 0; i < this.outputPins.length; i++) {
      const outputPin = outputPins[i];
      outputPin.direction = DIRECTION.RIGHT;
      outputPin.position.x = this.position.x + width;
      outputPin.position.y = this.position.y + i * 20 + 10;
      outputPin.calculateOutletPosition();
      outputPin.updateCollider()
    }
  }

  updateCollider() {
    this.collider.position.copy(this.position);
  }

  isCollidingMain(collider: Collider) {
    return this.collider.isColliding(collider);
  }

  select(pointCollider: PointCollider) {
    if (
      this.isCollidingMain(pointCollider)
    ) {
      this.isSelected = true;
    }
  }

  deselect() {
    this.isSelected = false;
  }

  checkHover(pointCollider: PointCollider): boolean {
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

  move(delta: Vector2D) {
    this.position.addVector(delta);
    this.updateCollider();

    for (let i = 0; i < this.inputPins.length; i++) {
      this.inputPins[i].move(delta);
    }

    for (let i = 0; i < this.outputPins.length; i++) {
      this.outputPins[i].move(delta);
    }
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
    )

    const centerPosition = this.position.clone().addVector(new Vector2D(this.collider.width, this.collider.height).divScalar(2));

    ctx.save();
    ctx.lineWidth = DEFUALTS.CHIP_FONT_STROKE_WIDTH;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = DEFUALTS.CHIP_FONT_COLOR;
    ctx.font = `${DEFUALTS.CHIP_FONT_SIZE}px ${DEFUALTS.CHIP_FONT_FAMILY}`
    ctx.fillText(this.name, centerPosition.x, centerPosition.y, this.collider.width);
    ctx.restore();
  }
}