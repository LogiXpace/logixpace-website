import { it } from 'vitest';
import { describe } from 'vitest';
import { BuiltinAndChip } from './builtin-and-chip';
import { Pin } from '../pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../power-state';
import { expect } from 'vitest';
import { test } from 'vitest';
import { Simulator } from '../simulator';
import { expectBuiltinChipOutputCorrectly } from '$lib/chim/helpers/test';

describe('builtin and chip', () => {
	describe('should be created succesfully', () => {
		test('for correct parameters', () => {
			const a = new Pin(POWER_STATE_LOW);
			const b = new Pin(POWER_STATE_LOW);
			const o = new Pin(POWER_STATE_LOW);
			expect(new BuiltinAndChip([a, b], [o]));
		});
	});

	describe('should output correclty', () => {
		test('for inputs [0, 0] outputs [0]', () => {
			expectBuiltinChipOutputCorrectly(
				BuiltinAndChip,
				[POWER_STATE_LOW, POWER_STATE_LOW],
				POWER_STATE_LOW
			);
		});

		test('for inputs [0, 1] outputs [0]', () => {
			expectBuiltinChipOutputCorrectly(
				BuiltinAndChip,
				[POWER_STATE_LOW, POWER_STATE_HIGH],
				POWER_STATE_LOW
			);
		});

		test('for inputs [1, 0] outputs [0]', () => {
			expectBuiltinChipOutputCorrectly(
				BuiltinAndChip,
				[POWER_STATE_HIGH, POWER_STATE_LOW],
				POWER_STATE_LOW
			);
		});

		test('for inputs [1, 1] outputs [1]', () => {
			expectBuiltinChipOutputCorrectly(
				BuiltinAndChip,
				[POWER_STATE_HIGH, POWER_STATE_HIGH],
				POWER_STATE_HIGH
			);
		});
	});
});
