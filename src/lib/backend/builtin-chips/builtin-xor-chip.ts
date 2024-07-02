import { BuiltinChip } from '../builtin-chip';
import { MAXIMUM_LEVEL } from '../level';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../power-state';
import type { InputPins, OutputPins } from '../chip';
import type { Simulator } from '../simulator';

export class BuiltinXOrChip extends BuiltinChip {
	constructor(inputPins: InputPins, outputPins: OutputPins) {
		super(inputPins, 2, outputPins, 1, 'XOR');
	}

	process(simulator: Simulator) {
		const a = this.inputPins[0].powerState === POWER_STATE_HIGH;
		const b = this.inputPins[1].powerState === POWER_STATE_HIGH;

		const x = !(a || b);
		const y = a && b;
		const o = !(x || y);

		this.outputPins[0].update(o ? POWER_STATE_HIGH : POWER_STATE_LOW, simulator);
	}
}
