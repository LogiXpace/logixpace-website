import type { RGB } from '$lib/helpers/color';
import type { Vector2D } from '$lib/helpers/vector2d';
import type { Chip } from './chip';
import { ChipPin } from './chip-pin';
import type { ChipType } from './chip-types';
import { Input } from './input';
import type { NamedPin } from './named-pin';
import { Output } from './output';
import type { PowerState } from './state';
import type { Wire, WireEntity } from './wire';
import { WirePoint } from './wire-point';

export type InputSerialized = {
	namedPinIndex: number;
	position: Vector2D;
	color: RGB;
	wireIndices: number[];
};

export type OutputSerialized = {
	namedPinIndex: number;
	position: Vector2D;
	color: RGB;
	wireIndices: number[];
};

export type WirePointSerialized = {
	position: Vector2D;
	powerState: PowerState;
	wireIndices: number[];
};

export type ChipPinSerialized = {
	namedPinIndex: number;
	wireIndices: number[];
};

export type ChipSerialized<T> = {
	type: ChipType;
	name: string;
	position: Vector2D;
	color: RGB;
	inputPinIndices: number[];
	outputPinIndices: number[];
};

export type WireEntityType = 'input' | 'output' | 'wire-point' | 'chip-pin';

export type WireSerialized = {
	startType: WireEntityType;
	startEntityIndex: number;

	endType: WireEntityType;
	endEntityIndex: number;
};

export type NamedPinSerialized = {
	name: string;
	powerState: PowerState;
};

export type AllSerialized<T> = {
	inputs: InputSerialized[];
	outputs: OutputSerialized[];
	wires: WireSerialized[];
	wirePoints: WirePointSerialized[];
	namedPins: NamedPinSerialized[];
	chipPins: ChipPinSerialized[];
	chips: ChipSerialized<T>[];
	oldPosition: Vector2D;
};

export class SimulationExportJSON<T> {
	private inputsSerialized: InputSerialized[] = [];
	private outputsSerialized: OutputSerialized[] = [];
	private wiresSerialized: WireSerialized[] = [];
	private wirePointsSerialized: WirePointSerialized[] = [];
	private namedPinsSerialized: NamedPinSerialized[] = [];
	private chipPinsSerialized: ChipPinSerialized[] = [];
	private chipsSerialized: ChipSerialized<T>[] = [];

	private mapNamedPins: Map<NamedPin<T>, number> = new Map();
	private mapWirePoints: Map<WirePoint<T>, number> = new Map();
	private mapChipPins: Map<ChipPin<T>, number> = new Map();
	private mapInputs: Map<Input<T>, number> = new Map();
	private mapOutputs: Map<Output<T>, number> = new Map();

	constructor() {}

	serializeNamedPin(namedPin: NamedPin<T>) {
		if (this.mapNamedPins.has(namedPin)) {
			return this.mapNamedPins.get(namedPin) as number;
		}

		const serializedNamedPin: NamedPinSerialized = {
			name: namedPin.name,
			powerState: namedPin.powerState
		};

		const index = this.namedPinsSerialized.length;
		this.namedPinsSerialized.push(serializedNamedPin);
		this.mapNamedPins.set(namedPin, index);
		return index;
	}

	private serializeConnectedWires(
		wireIndices: number[],
		wireEntity: WireEntity<T>,
		connectedWires: Wire<T>[]
	) {
		for (const wire of connectedWires) {
			let otherWireEntity: WireEntity<T>;
			if (wire.start === wireEntity) {
				otherWireEntity = wire.end;
			} else {
				otherWireEntity = wire.start;
			}

			if (otherWireEntity instanceof Input) {
				const serializedIndex = this.mapInputs.get(otherWireEntity);
				if (serializedIndex !== undefined) {
					const serialized = this.inputsSerialized[serializedIndex];
					const wireIndex = this.serializeWire(wire);
					serialized.wireIndices.push(wireIndex);
					wireIndices.push(wireIndex);
					continue;
				}
			}

			if (otherWireEntity instanceof Output) {
				const serializedIndex = this.mapOutputs.get(otherWireEntity);
				if (serializedIndex !== undefined) {
					const serialized = this.outputsSerialized[serializedIndex];
					const wireIndex = this.serializeWire(wire);
					serialized.wireIndices.push(wireIndex);
					wireIndices.push(wireIndex);
					continue;
				}
			}

			if (otherWireEntity instanceof ChipPin) {
				const serializedIndex = this.mapChipPins.get(otherWireEntity);
				if (serializedIndex !== undefined) {
					const serialized = this.chipPinsSerialized[serializedIndex];
					const wireIndex = this.serializeWire(wire);
					serialized.wireIndices.push(wireIndex);
					wireIndices.push(wireIndex);
					continue;
				}
			}

			if (otherWireEntity instanceof WirePoint) {
				const serializedIndex = this.mapWirePoints.get(otherWireEntity);
				if (serializedIndex !== undefined) {
					const serialized = this.wirePointsSerialized[serializedIndex];
					const wireIndex = this.serializeWire(wire);
					serialized.wireIndices.push(wireIndex);
					wireIndices.push(wireIndex);
					continue;
				}
			}
		}
	}

	serializeWirePoint(wirePoint: WirePoint<T>) {
		let wireIndices: number[] = [];
		const serializedWirePoint: WirePointSerialized = {
			position: wirePoint.position,
			powerState: wirePoint.powerState,
			wireIndices
		};

		const index = this.wirePointsSerialized.length;
		this.wirePointsSerialized.push(serializedWirePoint);
		this.mapWirePoints.set(wirePoint, index);
		this.serializeConnectedWires(wireIndices, wirePoint, wirePoint.wires);
		return index;
	}

	private serializeWire(wire: Wire<T>) {
		let startType: WireEntityType;
		let startEntityIndex: number;

		if (wire.start instanceof Input) {
			startType = 'input';
			startEntityIndex = this.mapNamedPins.get(wire.start.namedPin) as number;
		} else if (wire.start instanceof Output) {
			startType = 'output';
			startEntityIndex = this.mapNamedPins.get(wire.start.namedPin) as number;
		} else if (wire.start instanceof WirePoint) {
			startType = 'wire-point';
			startEntityIndex = this.mapWirePoints.get(wire.start) as number;
		} else {
			startType = 'chip-pin';
			startEntityIndex = this.mapChipPins.get(wire.start as ChipPin<T>) as number;
		}

		let endType: WireEntityType;
		let endEntityIndex: number;

		if (wire.end instanceof Input) {
			endType = 'input';
			endEntityIndex = this.mapNamedPins.get(wire.end.namedPin) as number;
		} else if (wire.end instanceof Output) {
			endType = 'output';
			endEntityIndex = this.mapNamedPins.get(wire.end.namedPin) as number;
		} else if (wire.end instanceof WirePoint) {
			endType = 'wire-point';
			endEntityIndex = this.mapWirePoints.get(wire.end) as number;
		} else {
			endType = 'chip-pin';
			endEntityIndex = this.mapChipPins.get(wire.end as ChipPin<T>) as number;
		}

		const serializedWire: WireSerialized = {
			startType,
			startEntityIndex,

			endType,
			endEntityIndex
		};

		const index = this.wiresSerialized.length;
		this.wiresSerialized.push(serializedWire);
		return index;
	}

	serializeInput(input: Input<T>) {
		let wireIndices: number[] = [];
		const serializedInput: InputSerialized = {
			namedPinIndex: this.serializeNamedPin(input.namedPin),
			position: input.position,
			color: input.color.toRGB(),
			wireIndices
		};

		const index = this.inputsSerialized.length;
		this.inputsSerialized.push(serializedInput);
		this.mapInputs.set(input, index);
		this.serializeConnectedWires(wireIndices, input, input.wires);
		return index;
	}

	serializeOutput(output: Output<T>) {
		let wireIndices: number[] = [];
		const serializedOutput: OutputSerialized = {
			namedPinIndex: this.serializeNamedPin(output.namedPin),
			position: output.position,
			color: output.color.toRGB(),
			wireIndices
		};

		const index = this.outputsSerialized.length;
		this.outputsSerialized.push(serializedOutput);
		this.mapOutputs.set(output, index);
		this.serializeConnectedWires(wireIndices, output, output.wires);
		return index;
	}

	private serializeChipPin(chipPin: ChipPin<T>) {
		let wireIndices: number[] = [];
		const serializedChipPin: ChipPinSerialized = {
			namedPinIndex: this.serializeNamedPin(chipPin.namedPin),
			wireIndices
		};

		const index = this.chipPinsSerialized.length;
		this.chipPinsSerialized.push(serializedChipPin);
		this.mapChipPins.set(chipPin, index);
		this.serializeConnectedWires(wireIndices, chipPin, chipPin.wires);
		return index;
	}

	serializeChip(chip: Chip<T>) {
		const serializedChip: ChipSerialized<T> = {
			name: chip.name,
			position: chip.position,
			type: chip.type,
			color: chip.color.toRGB(),
			inputPinIndices: chip.inputPins.map((pin) => this.serializeChipPin(pin)),
			outputPinIndices: chip.outputPins.map((pin) => this.serializeChipPin(pin))
		};

		const index = this.chipsSerialized.length;
		this.chipsSerialized.push(serializedChip);
		return index;
	}

	allSerialized(position: Vector2D): AllSerialized<T> {
		return {
			oldPosition: position,
			inputs: this.inputsSerialized,
			outputs: this.outputsSerialized,
			wires: this.wiresSerialized,
			wirePoints: this.wirePointsSerialized,
			namedPins: this.namedPinsSerialized,
			chipPins: this.chipPinsSerialized,
			chips: this.chipsSerialized
		};
	}
}
