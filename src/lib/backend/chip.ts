import type { Pin } from './pin';
import type { Simulator } from './simulator';

export type InputPin = Pin;
export type OutputPin = Pin;

export type InputPins = InputPin[];
export type OutputPins = OutputPin[];

export type ChipType =
	| 'AND'
	| 'OR'
	| 'NOT'
	| 'XOR'
	| 'NAND'
	| 'NOR'
	| 'XNOR'
	| 'MUX2'
	| 'DEMUX2'
	| 'DEMUX4'
	| 'DEMUX8'
	| 'DEMUX16'
	| 'MUX4'
	| 'MUX8'
	| 'MUX16'
	| 'CUSTOM'
	| 'STATIC';

export class Chip {
	inputPins: InputPins;
	outputPins: OutputPins;
	inputLength: number;
	outputLength: number;
	type: ChipType;

	constructor(
		inputPins: InputPins,
		inputLength: number,
		outputPins: OutputPins,
		outputLength: number,
		type: ChipType
	) {
		this.type = type;
		this.inputPins = inputPins;
		this.inputLength = inputLength;

		// check if the input length is the same as the inputPins length
		if (inputLength !== inputPins.length) {
			throw new Error('the input length are not equal to the input length defined');
		}

		this.outputPins = outputPins;
		this.outputLength = outputLength;

		// check if the input length is the same as the inputPins length
		if (outputLength !== outputPins.length) {
			throw new Error('the output length are not equal to the output length defined');
		}
	}

	process(simulator: Simulator) { }
}
