import { it } from 'vitest';
import { describe } from 'vitest';
import { BuiltinNotChip } from './builtin-not-chip';
import { Pin } from '../pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../power-state';
import { expect } from 'vitest';
import { test } from 'vitest';
import { Simulator } from '../simulator';
import { expectBuiltinChipOutputCorrectly } from '../test';
import { InwardPin } from "../inward-pin";
import { OutwardPin } from "../outward-pin";

describe('builtin not chip', () => {
	describe('should be created succesfully', () => {
		test('for correct parameters', () => {
			const a = new InwardPin(POWER_STATE_LOW);
			const o = new OutwardPin(POWER_STATE_LOW);
			expect(new BuiltinNotChip([a], [o]));
		});
	});

	describe('should output correclty', () => {
		test('for inputs [0] outputs [1]', () => {
			expectBuiltinChipOutputCorrectly(BuiltinNotChip, [POWER_STATE_LOW], POWER_STATE_HIGH);
		});

		test('for inputs [1] outputs [0]', () => {
			expectBuiltinChipOutputCorrectly(BuiltinNotChip, [POWER_STATE_HIGH], POWER_STATE_LOW);
		});
	});
});
