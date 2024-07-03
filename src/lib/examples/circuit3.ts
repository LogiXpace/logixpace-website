import type { ReturnExample } from '.';
import { BuiltinNotChip } from '../core/builtin-chips';
import { Pin } from '../core/pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../core/power-state';
import { Simulator } from '../core/simulator';

/**
 * initial:
 * p0 (0) - not - p2 (1) - not - p3 (0)
 *                /
 *              p1 (0)
 *
 * update p0 to 1
 *
 * after running it:
 * p0 (1) - not - p2 (0) - not - p3 (1)
 *                /
 *              p1 (0)
 *
 */
export function circuit3(): ReturnExample {
	let pins: Pin[] = [];
	let simulator: Simulator;

	return {
		init() {
			simulator = new Simulator();

			pins.push(
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_HIGH),
				new Pin(POWER_STATE_LOW)
			);

			pins[1].connectPin(simulator, pins[2]);

			new BuiltinNotChip([pins[0]], [pins[2]]);
			new BuiltinNotChip([pins[2]], [pins[3]]);
		},
		run(iterations = 100) {
			pins[0].update(POWER_STATE_HIGH, simulator);
			simulator.simulate(iterations);
		},
		expectPowerStates: [POWER_STATE_HIGH, POWER_STATE_LOW, POWER_STATE_LOW, POWER_STATE_HIGH],
		pins
	};
}
