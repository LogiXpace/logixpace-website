import { it } from 'vitest';
import { describe } from 'vitest';
import { BuiltinNAndChip } from './builtin-nand-chip';
import { Pin } from '../pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../power-state';
import { expect } from 'vitest';
import { test } from 'vitest';
import { Simulator } from '../simulator';
import { expectBuiltinChipOutputCorrectly } from '../test';


describe('builtin and chip', () => {
	describe('should be created succesfully', () => {
		test('for correct parameters', () => {
			const a = new Pin(POWER_STATE_LOW);
			const b = new Pin(POWER_STATE_LOW);
			const o = new Pin(POWER_STATE_LOW);
			expect(new BuiltinNAndChip([a, b], [o]));
		});
	});

	describe('should output correclty', () => {
		test('for inputs [0, 0] outputs [1]', () => {
			expectBuiltinChipOutputCorrectly(
				BuiltinNAndChip,
				[POWER_STATE_LOW, POWER_STATE_LOW],
				POWER_STATE_HIGH
			);
		});

		test('for inputs [0, 1] outputs [1]', () => {
			expectBuiltinChipOutputCorrectly(
				BuiltinNAndChip,
				[POWER_STATE_LOW, POWER_STATE_HIGH],
				POWER_STATE_HIGH
			);
		});

		test('for inputs [1, 0] outputs [1]', () => {
			expectBuiltinChipOutputCorrectly(
				BuiltinNAndChip,
				[POWER_STATE_HIGH, POWER_STATE_LOW],
				POWER_STATE_HIGH
			);
		});

		test('for inputs [1, 1] outputs [0]', () => {
			expectBuiltinChipOutputCorrectly(
				BuiltinNAndChip,
				[POWER_STATE_HIGH, POWER_STATE_HIGH],
				POWER_STATE_LOW
			);
		});
	});
});
