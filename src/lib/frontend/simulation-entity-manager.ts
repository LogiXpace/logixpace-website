import { QuadTree } from "$lib/helpers/quad-tree";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";
import type { Chip } from "./chip";
import type { ChipPin } from "./chip-pin";
import type { IO } from "./io";
import type { Wire } from "./wire";
import type { WirePoint } from "./wire-point";
import { Vector2D } from "$lib/helpers/vector2d";
import type { Collider, PointCollider } from "$lib/helpers/colliders";
import type { Adapter } from "./adapter";
import { POWER_STATE_HIGH } from "./state";

export type Entity<T> = IO<T> | WirePoint<T> | Chip<T> | ChipPin<T>;

export interface SimulationEntityManagerProps<T> {
  maxCapacity?: number;
  maxLevel?: number;
  size?: number;
  adapter: Adapter<T>;
}

export class SimulationEntityManager<T> {
  private ioTree: QuadTree<IO<T>>;
  ioQueries = new Set<IO<T>>();

  private wirePointTree: QuadTree<WirePoint<T>>;
  wirePointQueries = new Set<WirePoint<T>>();

  private wireTree: QuadTree<Wire<T>>;
  wireQueries = new Set<Wire<T>>();

  private chipTree: QuadTree<Chip<T>>;
  chipQueries = new Set<Chip<T>>();

  private chipPinTree: QuadTree<ChipPin<T>>;
  chipPinQueries = new Set<ChipPin<T>>();

  adapter: Adapter<T>;

  constructor({
    maxCapacity = 10,
    maxLevel = 15,
    size = 5000,
    adapter
  }: SimulationEntityManagerProps<T>) {
    this.adapter = adapter;

    const position = new Vector2D(-size / 2, -size / 2);
    this.ioTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
    this.chipPinTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
    this.chipTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
    this.wirePointTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
    this.wireTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
  }

  insertIO(io: IO<T>) {
    this.ioTree.insert(io, io.bound);
  }

  insertChipPin(chipPin: ChipPin<T>) {
    this.chipPinTree.insert(chipPin, chipPin.bound);
  }

  insertChip(chip: Chip<T>) {
    this.chipTree.insert(chip, chip.collider);
  }

  insertWirePoint(wirePoint: WirePoint<T>) {
    this.wirePointTree.insert(wirePoint, wirePoint.collider);
  }

  insertWire(wire: Wire<T>) {
    this.wireTree.insert(wire, wire.collider);
  }

  removeIO(io: IO<T>) {
    this.ioTree.remove(io, io.collider);
  }

  removeChipPin(chipPin: ChipPin<T>) {
    this.chipPinTree.remove(chipPin, chipPin.bound);
  }

  removeChip(chip: Chip<T>) {
    this.chipTree.remove(chip, chip.collider);
  }

  removeWirePoint(wirePoint: WirePoint<T>) {
    this.wirePointTree.remove(wirePoint, wirePoint.collider);
  }

  removeWire(wire: Wire<T>) {
    this.wireTree.remove(wire, wire.collider);
  }

  queryIO(collider: Collider) {
    return this.ioTree.query(collider);
  }

  queryChipPin(collider: Collider) {
    return this.chipPinTree.query(collider);
  }

  queryChip(collider: Collider) {
    return this.chipTree.query(collider);
  }

  queryWire(collider: Collider) {
    return this.wireTree.query(collider);
  }

  queryIOByPoint(collider: PointCollider) {
    return this.ioTree.queryByPoint(collider);
  }

  queryWirePointByPoint(collider: PointCollider) {
    return this.wirePointTree.queryByPoint(collider);
  }

  queryChipPinByPoint(collider: PointCollider) {
    return this.chipPinTree.queryByPoint(collider);
  }

  queryChipByPoint(collider: PointCollider) {
    return this.chipTree.queryByPoint(collider);
  }

  queryWireByPoint(collider: PointCollider) {
    return this.wireTree.queryByPoint(collider);
  }

  destroyWire(wire: Wire<T>) {
    this.adapter.disconnect(wire.start.pinId, wire.end.pinId);
    this.removeWire(wire);
    this.wireQueries.delete(wire);

    wire.end.removeWire(wire);
    wire.start.removeWire(wire);
  }

  destroyWirePoint(wirePoint: WirePoint<T>) {
    this.adapter.destroyPin(wirePoint.pinId);
    this.removeWirePoint(wirePoint);
    this.wirePointQueries.delete(wirePoint);

    for (const wire of wirePoint.wires) {
      this.destroyWire(wire);
    }
  }

  destroyIO(io: IO<T>) {
    this.adapter.destroyPin(io.pinId);
    this.removeIO(io);
    this.ioQueries.delete(io);

    for (const wire of io.wires) {
      this.destroyWire(wire);
    }
  }

  destroyChipPin(chipPin: ChipPin<T>) {
    this.removeChipPin(chipPin);
    this.chipPinQueries.delete(chipPin);

    for (const wire of chipPin.wires) {
      this.destroyWire(wire);
    }
  }

  destroyChip(chip: Chip<T>) {
    this.removeChip(chip);
    this.chipQueries.delete(chip);

    for (const inputPin of chip.inputPins) {
      this.destroyChipPin(inputPin);
    }

    for (const outputPin of chip.outputPins) {
      this.destroyChipPin(outputPin);
    }
  }

  query(collider: Collider) {
    this.ioQueries = this.ioTree.query(collider);
    this.chipPinQueries = this.chipPinTree.query(collider);
    this.chipQueries = this.chipTree.query(collider);
    this.wirePointQueries = this.wirePointTree.query(collider);
    this.wireQueries = this.wireTree.query(collider);

    this.debug();
  }

  cleanup() {
    this.ioTree.cleanup();
    this.chipPinTree.cleanup();
    this.chipTree.cleanup();
    this.wirePointTree.cleanup();
    this.wireTree.cleanup();
  }

  debug() {
    console.log('ioQueries.size', this.ioQueries.size);
    console.log('chipPinQueries.size', this.chipPinQueries.size);
    console.log('chipQueries.size', this.chipQueries.size);
    console.log('wirePointQueries.size', this.wirePointQueries.size);
    console.log('wireQueries.size', this.wireQueries.size);
  }

  update() {
    for (const wirePoint of this.wirePointQueries) {
      wirePoint.isActivated = this.adapter.getPowerState(wirePoint.pinId) === POWER_STATE_HIGH;
    }

    for (const io of this.ioQueries) {
      io.namedPin.powerState = this.adapter.getPowerState(io.namedPin.id);
    }

    for (const chipPin of this.chipPinQueries) {
      chipPin.namedPin.powerState = this.adapter.getPowerState(chipPin.namedPin.id);
    }
  }
}