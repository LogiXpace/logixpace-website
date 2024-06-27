import type { ReturnExample } from '.';
import { BuiltinNotChip } from '../backend/builtin-chips';
import { Pin } from '../backend/pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../backend/power-state';
import { Simulator } from '../backend/simulator';

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
			pins.push(
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_HIGH),
				new Pin(POWER_STATE_LOW)
			);

			pins[1].connectPin(pins[2]);

			new BuiltinNotChip([pins[0]], [pins[2]]);
			new BuiltinNotChip([pins[2]], [pins[3]]);

			simulator = new Simulator();
		},
		run(iterations = 100) {
			pins[0].update(POWER_STATE_HIGH, simulator);
			simulator.simulate(iterations);
		},
		expectPowerStates: [POWER_STATE_HIGH, POWER_STATE_LOW, POWER_STATE_LOW, POWER_STATE_HIGH],
		pins
	};
}
