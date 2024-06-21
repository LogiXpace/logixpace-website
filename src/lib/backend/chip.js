export class Chip {
	/**
	 *
	 * @param {import("./pin").Pin[]} inputPins
	 * @param {number} inputLength
	 * @param {import("./pin").Pin[]} outputPins
	 * @param {number} outputLength
	 */
	constructor(inputPins, inputLength, outputPins, outputLength) {
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

	/**
	 *
	 * @param {import("./simulator").Simulator} simulator
	 */
	process(simulator) {}
}
