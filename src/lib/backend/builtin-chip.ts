import { Chip, type InputPins, type OutputPins } from './chip';

export class BuiltinChip extends Chip {
	constructor(
		inputPins: InputPins,
		inputLength: number,
		outputPins: OutputPins,
		outputLength: number
	) {
		super(inputPins, inputLength, outputPins, outputLength);

		// connect the pins to this chip
		for (let i = 0; i < inputPins.length; i++) {
			const inputPin = inputPins[i];
			inputPin.connectChip(this);
		}
	}
}
