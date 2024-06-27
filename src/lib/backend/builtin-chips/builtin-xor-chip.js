import { BuiltinChip } from '../builtin-chip';
import { MAXIMUM_LEVEL } from '../level';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../power-state';

/**
 * @extends {BuiltinChip}
 */
export class BuiltinXOrChip extends BuiltinChip {
	/**
	 *
	 * @param {import("../pin").Pin[]} inputPins
	 * @param {import("../pin").Pin[]} outputPins
	 */
	constructor(inputPins, outputPins) {
		super(inputPins, 2, outputPins, 1);
	}

	/**
	 *
	 * @param {import("../simulator").Simulator} simulator
	 */
	process(simulator) {
		const a = this.inputPins[0].powerState;
		const b = this.inputPins[1].powerState;
		
		const x = (a === POWER_STATE_HIGH || b === POWER_STATE_HIGH);
		const y = (a === POWER_STATE_LOW && b === POWER_STATE_LOW);
		const o = !(x || y);

		this.outputPins[0].update(o ? POWER_STATE_HIGH : POWER_STATE_LOW, simulator);
	}
}
