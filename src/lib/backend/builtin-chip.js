import { Chip } from './chip';

/**
 * @extends {Chip}
 */
export class BuiltinChip extends Chip {
	/**
	 *
	 * @param {import("./pin").Pin[]} inputPins
	 * @param {number} inputLength
	 * @param {import("./pin").Pin[]} outputPins
	 * @param {number} outputLength
	 */
	constructor(inputPins, inputLength, outputPins, outputLength) {
		super(inputPins, inputLength, outputPins, outputLength);

		// connect the pins to this chip
		for (let i = 0; i < inputPins.length; i++) {
			const inputPin = inputPins[i];
			inputPin.connectChip(this);
		}
	}

	/**
	 *
	 * @param {import("./simulator").Simulator} simulator
	 */
	process(simulator) {}
}
