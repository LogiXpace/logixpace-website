import type { Pin } from './pin';
import type { Simulator } from './simulator';

export type InputPin = Pin;
export type OutputPin = Pin;

export type InputPins = InputPin[];
export type OutputPins = OutputPin[];

export class Chip {
	inputPins: InputPins;
	outputPins: OutputPins;
	inputLength: number;
	outputLength: number;

	constructor(
		inputPins: InputPins,
		inputLength: number,
		outputPins: OutputPins,
		outputLength: number
	) {
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
