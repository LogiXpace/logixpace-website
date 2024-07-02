import type { Pin } from '$lib/engine/pin';
import type { PowerState } from '$lib/core/power-state';
import { circuit1 } from './circuit1';
import { circuit2 } from './circuit2';
import { circuit3 } from './circuit3';

export interface ReturnExample {
	init: () => void;
	run: (iterations?: number) => void;
	pins: Pin[];
	expectPowerStates: PowerState[];
}

export const circuits: (() => ReturnExample)[] = [circuit1, circuit2, circuit3];
