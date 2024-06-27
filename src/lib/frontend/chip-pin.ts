import { CanvasStyle } from "$lib/helpers/canvas-style";
import { BoxCollider, CircleCollider, LineCollider, type Collider, type PointCollider } from "$lib/helpers/colliders";
import { RGB } from "$lib/helpers/color";
import { DIRECTION, type Direction, getDirectionVector } from "$lib/helpers/direction";
import { drawLine, drawCircle } from "$lib/helpers/draw";
import { calculateBoxFromTwoPoint } from "$lib/helpers/shape";
import { Vector2D } from "$lib/helpers/vector2d";
import { DEFUALTS } from "./defaults";
import type { NamedPin } from "./named-pin";
import { POWER_STATE_HIGH } from "./state";
import type { WireEntity, Wire } from "./wire";

export interface ChipPinProps<T> {
  namedPin: NamedPin<T>;
  position: Vector2D;
  direction: Direction;
}

export class ChipPin<T> implements WireEntity<T> {
  namedPin: NamedPin<T>;
  position: Vector2D;

  outletPosition: Vector2D = new Vector2D();

  outletCollider: CircleCollider;
  outletLineCollider: LineCollider;
  bound: BoxCollider;
  direction: Direction;

  isOutletHovering = false;
  isOutletLineHovering = false;
  isSelected = false;

  wires = new Set<Wire<T>>();

  constructor(props: ChipPinProps<T>) {
    this.namedPin = props.namedPin;
    this.position = props.position.clone();
    this.direction = props.direction;

    this.calculateOutletPosition();

    this.outletCollider = new CircleCollider(this.outletPosition, DEFUALTS.PIN_OUTLET_SIZE);
    this.outletLineCollider = new LineCollider(this.position, this.outletPosition, DEFUALTS.PIN_OUTLET_LINE_WIDTH);

    const result = this.calculateBound();
    this.bound = new BoxCollider(result.position, result.width, result.height);
  }

  calculateOutletPosition() {
    const dir = getDirectionVector(this.direction);
    this.outletPosition.copy(this.position).addVector(dir.multScalar(DEFUALTS.PIN_OUTLET_LINE_LENGTH));
  }

  calculateBound() {
    const dir = this.direction;

    const dirVector = getDirectionVector(dir);
    const end = this.outletPosition
      .clone()
      .addVector(
        dirVector.clone().multScalar(DEFUALTS.PIN_OUTLET_SIZE)
      );
    const start = this.position.clone();

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

  updateCollider() {
    this.outletCollider.position.copy(this.outletPosition);
    this.outletLineCollider.startPosition.copy(this.position);
    this.outletLineCollider.endPosition.copy(this.outletPosition);

    const result = this.calculateBound();
    this.bound.position.copy(result.position);
    this.bound.width = result.width;
    this.bound.height = result.height;
  }

  move(delta: Vector2D) {
    this.position.addVector(delta);
    this.calculateOutletPosition();
    this.updateCollider();
  }

  isCollidingOutlet(collider: Collider) {
    return this.outletCollider.isColliding(collider);
  }

  isCollidingOutletLine(collider: Collider) {
    return this.outletLineCollider.isColliding(collider);
  }

  select(pointCollider: PointCollider) {
    if (
      this.isCollidingOutlet(pointCollider) ||
      this.isCollidingOutletLine(pointCollider)
    ) {
      this.isSelected = true;
    }
  }

  deselect() {
    this.isSelected = false;
  }

  checkHover(pointCollider: PointCollider): boolean {
    this.resetHover();

    if (this.outletCollider.isColliding(pointCollider)) {
      this.isOutletHovering = true;
      return true;
    }

    if (this.outletLineCollider.isColliding(pointCollider)) {
      this.isOutletLineHovering = true;
      return true;
    }

    return false;
  }

  resetHover() {
    this.isOutletHovering = false;
    this.isOutletLineHovering = false;
  }

  addWire(wire: Wire<T>): void {
    this.wires.add(wire);
  }

  removeWire(wire: Wire<T>): void {
    this.wires.delete(wire);
  }

  get pinId() {
    return this.namedPin.id;
  }

  get activated() {
    return this.namedPin.powerState === POWER_STATE_HIGH;
  }

  draw(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
    drawLine(
      ctx,
      this.outletLineCollider.startPosition.x,
      this.outletLineCollider.startPosition.y,
      this.outletLineCollider.endPosition.x,
      this.outletLineCollider.endPosition.y,
      new CanvasStyle({
        strokeColor: this.activated ? DEFUALTS.ACTIVATED_COLOR : DEFUALTS.UNACTIVATED_COLOR,
        lineWidth: DEFUALTS.PIN_OUTLET_LINE_WIDTH
      })
    )

    drawCircle(
      ctx,
      this.outletPosition.x,
      this.outletPosition.y,
      this.outletCollider.radius,
      new CanvasStyle({
        fillColor: this.activated ? DEFUALTS.ACTIVATED_COLOR : DEFUALTS.UNACTIVATED_COLOR,
      })
    )
  }
}