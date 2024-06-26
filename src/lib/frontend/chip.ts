import { BoxCollider, CircleCollider, LineCollider } from "$lib/helpers/colliders";
import type { Color } from "$lib/helpers/color";
import { DIRECTION, getDirectionVector, type Direction } from "$lib/helpers/direction";
import { Vector2D } from "$lib/helpers/vector2d";
import { DEFUALTS } from "./defaults";
import { NamedPin } from "./named-pin";
import { POWER_STATE_HIGH } from "./state";
import type { Wire, WireEntity } from "./wire";

export interface ChipPinProps<T> {
  namedPin: NamedPin<T>;
  position: Vector2D;
  direction: Direction;
}

export class ChipPin<T> implements WireEntity<T> {
  namedPin: NamedPin<T>;
  position: Vector2D;

  // @ts-ignore
  outletPosition: Vector2D;

  outletCollider: CircleCollider;
  outletLineCollider: LineCollider;
  direction: Direction;

  wires = new Set<Wire<T>>();

  constructor(props: ChipPinProps<T>) {
    this.namedPin = props.namedPin;
    this.position = props.position.clone();
    this.direction = props.direction;

    this.calculateOutletPosition();

    // @ts-ignore
    this.outletCollider = new CircleCollider(this.outletPosition, DEFUALTS.PIN_OUTLET_SIZE);

    // @ts-ignore
    this.outletLineCollider = new LineCollider(this.position, this.outletPosition, DEFUALTS.PIN_OUTLET_LINE_WIDTH);
  }

  calculateOutletPosition() {
    const dir = getDirectionVector(this.direction);
    this.outletPosition.copy(this.position).addVector(dir.multScalar(DEFUALTS.PIN_OUTLET_LINE_LENGTH));
  }

  updateCollider() {
    this.calculateOutletPosition();
    this.outletCollider.position.copy(this.outletPosition);
    this.outletLineCollider.startPosition.copy(this.position);
    this.outletLineCollider.endPosition.copy(this.outletPosition);
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
}

export interface ChipProps<T> {
  position: Vector2D;
  name: string;
  textWidth: number;
  color: Color;
  inputNamedPins: NamedPin<T>[];
  outputNamedPins: NamedPin<T>[];
}

export class Chip<T> {
  position: Vector2D;
  name: string;
  color: Color;
  inputPins: ChipPin<T>[];
  outputPins: ChipPin<T>[];
  collider: BoxCollider;

  constructor({ position, textWidth, name, color, inputNamedPins, outputNamedPins }: ChipProps<T>) {
    this.position = position;
    this.name = name;
    this.color = color;

    const width = 10 + textWidth + 10;
    const maxPins = Math.max(inputNamedPins.length, outputNamedPins.length);
    const height = maxPins * (DEFUALTS.PIN_OUTLET_SIZE + 10) + 10;

    this.collider = new BoxCollider(position, width, height);

    this.inputPins = new Array(inputNamedPins.length);

    for (let i = 0; i < inputNamedPins.length; i++) {
      const namedPin = inputNamedPins[i];
      this.inputPins[i] = new ChipPin({
        namedPin,
        direction: DIRECTION.LEFT,
        position: new Vector2D(this.position.x, this.position.y + i * 20 + 10)
      })
    }

    this.outputPins = new Array(outputNamedPins.length);

    for (let i = 0; i < outputNamedPins.length; i++) {
      const namedPin = outputNamedPins[i];
      this.outputPins[i] = new ChipPin({
        namedPin,
        direction: DIRECTION.RIGHT,
        position: new Vector2D(this.position.x + , this.position.y + i * 20 + 10)
      })
    }
  }
}