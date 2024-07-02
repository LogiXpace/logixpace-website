import { Chip, type InputPins, type OutputPins } from './chip';

export type BuiltinChipType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "XNOR" | "MUX2" | "DEMUX2" | "DEMUX4" | "DEMUX8" | "DEMUX16" | "MUX4" | "MUX8" | "MUX16";

export class BuiltinChip extends Chip {
	constructor(
		inputPins: InputPins,
		inputLength: number,
		outputPins: OutputPins,
		outputLength: number,
		type: BuiltinChipType
	) {
		super(inputPins, inputLength, outputPins, outputLength, type);

		// connect the pins to this chip
		for (let i = 0; i < inputPins.length; i++) {
			const inputPin = inputPins[i];
			inputPin.connectChip(this);
		}
	}
}
