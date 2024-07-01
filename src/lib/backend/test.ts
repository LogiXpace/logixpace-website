import { expect } from 'vitest';
import { Pin } from './pin';
import { POWER_STATE_LOW, type PowerState } from './power-state';
import { Simulator } from './simulator';
import type { BuiltinChip } from './builtin-chip';
import type { InputPins, OutputPins } from './chip';
import { InwardPin } from './inward-pin';
import { OutwardPin } from './outward-pin';

/**
 *
 * @param builtinChipConstructor - the constructor to create the builtin chip
 * @param inputPowerStates - the initial input powerStates
 * @param expectedPowerState - the expected power state to test with
 */
export function expectBuiltinChipOutputCorrectly<T>(
	builtinChipConstructor: new (inputPins: InputPins, outputPins: OutputPins) => T,
	inputPowerStates: PowerState[],
	expectedPowerState: PowerState
) {
	const inputPins = [];

	for (let i = 0; i < inputPowerStates.length; i++) {
		const powerState = inputPowerStates[i];
		inputPins.push(new InwardPin(powerState));
	}

	const o = new OutwardPin(POWER_STATE_LOW);
	new builtinChipConstructor(inputPins, [o]);

	const simulator = new Simulator();
	simulator.queuePin(inputPins[0]);
	simulator.step();

	expect(o.powerState).toStrictEqual(expectedPowerState);
}
