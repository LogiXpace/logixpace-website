import { BuiltinChip } from '../builtin-chip';
import { MAXIMUM_LEVEL } from '../level';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../power-state';

/**
 * @extends {BuiltinChip}
 */
export class BuiltinAndChip extends BuiltinChip {
	/**
	 *
	 * @param {import("../pin").Pin[]} inputPins
	 * @param {import("../pin").Pin[]} outputPins
	 */
	constructor(inputPins, outputPins) {
		super(inputPins, 2, outputPins, 1);
	}

	static numberOfInputs() {
		return 2;
	}

	static numberOfOutputs() {
		return 1;
	}

	/**
	 *
	 * @param {import("../simulator").Simulator} simulator
	 */
	process(simulator) {
		const a = this.inputPins[0].powerState;
		const b = this.inputPins[1].powerState;
		const o = a === POWER_STATE_HIGH && b === POWER_STATE_HIGH;
		this.outputPins[0].update(o ? POWER_STATE_HIGH : POWER_STATE_LOW, simulator);
	}
}
