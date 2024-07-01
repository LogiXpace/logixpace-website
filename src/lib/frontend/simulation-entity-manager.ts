import { QuadTree } from '$lib/helpers/quad-tree';
import type { T } from 'vitest/dist/reporters-yx5ZTtEV.js';
import type { Chip } from './chip';
import type { ChipPin } from './chip-pin';
import type { IO } from './io';
import type { Wire } from './wire';
import type { WirePoint } from './wire-point';
import { Vector2D } from '$lib/helpers/vector2d';
import type { Collider, PointCollider } from '$lib/helpers/colliders';
import type { Adapter } from './adapter';
import { POWER_STATE_HIGH } from './state';
import type { Input } from './input';
import type { Output } from './output';

export type Entity<T> = IO<T> | WirePoint<T> | Chip<T> | ChipPin<T>;

export interface SimulationEntityManagerProps<T> {
	maxCapacity?: number;
	maxLevel?: number;
	size?: number;
	adapter: Adapter<T>;
}

export class SimulationEntityManager<T> {
	private inputTree: QuadTree<Input<T>>;
	inputQueries = new Set<Input<T>>();

	private outputTree: QuadTree<Output<T>>;
	outputQueries = new Set<Output<T>>();

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
		this.inputTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
		this.outputTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
		this.chipPinTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
		this.chipTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
		this.wirePointTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
		this.wireTree = new QuadTree(maxLevel, maxCapacity, position, size, size);
	}

	insertInput(input: Input<T>) {
		this.inputTree.insert(input, input.bound);
	}

	insertOutput(output: Output<T>) {
		this.outputTree.insert(output, output.bound);
	}

	insertChipPin(chipPin: ChipPin<T>) {
		this.chipPinTree.insert(chipPin, chipPin.bound);
	}

	insertChip(chip: Chip<T>) {
		this.chipTree.insert(chip, chip.bound);
	}

	insertWirePoint(wirePoint: WirePoint<T>) {
		this.wirePointTree.insert(wirePoint, wirePoint.bound);
	}

	insertWire(wire: Wire<T>) {
		this.wireTree.insert(wire, wire.collider);
	}

	removeInput(input: Input<T>) {
		this.inputTree.remove(input, input.bound);
	}

	removeOutput(output: Output<T>) {
		this.outputTree.remove(output, output.bound);
	}

	removeChipPin(chipPin: ChipPin<T>) {
		this.chipPinTree.remove(chipPin, chipPin.bound);
	}

	removeChip(chip: Chip<T>) {
		this.chipTree.remove(chip, chip.bound);
	}

	removeWirePoint(wirePoint: WirePoint<T>) {
		this.wirePointTree.remove(wirePoint, wirePoint.bound);
	}

	removeWire(wire: Wire<T>) {
		this.wireTree.remove(wire, wire.collider);
	}

	queryInput(collider: Collider) {
		return this.inputTree.query(collider);
	}

	queryOutput(collider: Collider) {
		return this.outputTree.query(collider);
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

	queryWirePoint(collider: Collider) {
		return this.wirePointTree.query(collider);
	}

	queryInputByPoint(collider: PointCollider) {
		return this.inputTree.queryByPoint(collider);
	}

	queryOutputByPoint(collider: PointCollider) {
		return this.outputTree.queryByPoint(collider);
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
		this.removeWirePoint(wirePoint);
		this.wirePointQueries.delete(wirePoint);

		for (const wire of wirePoint.wires) {
			this.destroyWire(wire);
		}

		this.adapter.destroyPin(wirePoint.pinId);
	}

	destroyInput(input: Input<T>) {
		this.removeInput(input);
		this.inputQueries.delete(input);

		for (const wire of input.wires) {
			this.destroyWire(wire);
		}

		this.adapter.destroyPin(input.pinId);
	}

	destroyOutput(output: Output<T>) {
		this.removeOutput(output);
		this.outputQueries.delete(output);

		for (const wire of output.wires) {
			this.destroyWire(wire);
		}

		this.adapter.destroyPin(output.pinId);
	}

	destroyChipPin(chipPin: ChipPin<T>) {
		this.removeChipPin(chipPin);
		this.chipPinQueries.delete(chipPin);

		for (const wire of chipPin.wires) {
			this.destroyWire(wire);
		}

		this.adapter.destroyPin(chipPin.pinId);
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

		this.adapter.destroyChip(chip.id, [], []);
	}

	query(collider: Collider) {
		this.inputQueries = this.inputTree.query(collider);
		this.outputQueries = this.outputTree.query(collider);
		this.chipPinQueries = this.chipPinTree.query(collider);
		this.chipQueries = this.chipTree.query(collider);
		this.wirePointQueries = this.wirePointTree.query(collider);
		this.wireQueries = this.wireTree.query(collider);
	}

	cleanup() {
		this.inputTree.cleanup();
		this.outputTree.cleanup();
		this.chipPinTree.cleanup();
		this.chipTree.cleanup();
		this.wirePointTree.cleanup();
		this.wireTree.cleanup();
	}

	debug() {
		console.log('inputQueries.size', this.inputQueries.size);
		console.log('outputQueries.size', this.outputQueries.size);
		console.log('chipPinQueries.size', this.chipPinQueries.size);
		console.log('chipQueries.size', this.chipQueries.size);
		console.log('wirePointQueries.size', this.wirePointQueries.size);
		console.log('wireQueries.size', this.wireQueries.size);
	}

	update() {
		for (const wirePoint of this.wirePointQueries) {
			wirePoint.powerState = this.adapter.getPowerState(wirePoint.pinId);
		}

		for (const input of this.inputQueries) {
			input.namedPin.powerState = this.adapter.getPowerState(input.namedPin.id);
		}

		for (const output of this.outputQueries) {
			output.namedPin.powerState = this.adapter.getPowerState(output.namedPin.id);
		}

		for (const chipPin of this.chipPinQueries) {
			chipPin.namedPin.powerState = this.adapter.getPowerState(chipPin.namedPin.id);
		}
	}
}
