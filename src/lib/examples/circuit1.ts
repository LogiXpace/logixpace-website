import type { ReturnExample } from '.';
import { BuiltinAndChip, BuiltinOrChip } from '../core/builtin-chips';
import { Pin } from '../core/pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../core/power-state';
import { Simulator } from '../core/simulator';

/**
 * p0 (1)
 *    \
 *      and - p3 (1)
 *    /         \
 * p1 (1)        or - p4 (1)
 *              /
 *            p2 (0)
 *
 */
export function circuit1(): ReturnExample {
	let pins: Pin[] = [];
	let simulator: Simulator;

	return {
		init() {
			pins.push(
				new Pin(POWER_STATE_HIGH),
				new Pin(POWER_STATE_HIGH),
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_LOW)
			);

			new BuiltinAndChip([pins[0], pins[1]], [pins[3]]);
			new BuiltinOrChip([pins[2], pins[3]], [pins[4]]);

			simulator = new Simulator();
			simulator.queuePin(pins[0]);
		},
		run(iterations = 100) {
			simulator.simulate(iterations);
		},
		expectPowerStates: [
			POWER_STATE_HIGH,
			POWER_STATE_HIGH,
			POWER_STATE_LOW,
			POWER_STATE_HIGH,
			POWER_STATE_HIGH
		],
		pins
	};
}
