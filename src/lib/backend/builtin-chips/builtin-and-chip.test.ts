import { BuiltinAndChip } from './builtin-and-chip';
import { Pin } from '../pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../power-state';
import { expect, describe, test } from 'vitest';
import { expectBuiltinChipOutputCorrectly } from '../test';
import { InwardPin } from '../inward-pin';
import { OutwardPin } from '../outward-pin';

describe('builtin and chip', () => {
	describe('should be created succesfully', () => {
		test('for correct parameters', () => {
			const a = new InwardPin(POWER_STATE_LOW);
			const b = new InwardPin(POWER_STATE_LOW);
			const o = new OutwardPin(POWER_STATE_LOW);
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
