import type { ReturnExample } from '.';
import { BuiltinAndChip, BuiltinNotChip, BuiltinOrChip } from '../core/builtin-chips';
import { Pin } from '../core/pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '../core/power-state';
import { Simulator } from '../core/simulator';

/**
 * initial:
 * p0 (0) - not0 - p4 (1)
 *                  \
 *                    and0 - p6 (0)
 *                  /         \
 *                 p1 (0)      \
 *                              or1 - p8 (1)
 * p2 (0) - not1 - p5 (1)      /
 *                   \        /
 *                    or0 - p7 (1)
 *                  /
 *                p3 (0)
 *
 * update p0 to 1
 *
 * update:
 * p0 (1) - not0 - p4 (0)
 *                  \
 *                    and0 - p6 (0)
 *                  /         \
 *                 p1 (0)      \
 *                              or1 - p8 (1)
 * p2 (0) - not1 - p5 (1)      /
 *                   \        /
 *                    or0 - p7 (1)
 *                  /
 *                p3 (0)
 *
 */
export function circuit2(): ReturnExample {
	let pins: Pin[] = [];
	let simulator: Simulator;

	return {
		init() {
			pins.push(
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_HIGH),
				new Pin(POWER_STATE_HIGH),
				new Pin(POWER_STATE_LOW),
				new Pin(POWER_STATE_HIGH),
				new Pin(POWER_STATE_HIGH)
			);

			new BuiltinNotChip([pins[0]], [pins[4]]);
			new BuiltinAndChip([pins[4], pins[1]], [pins[6]]);
			new BuiltinNotChip([pins[2]], [pins[5]]);
			new BuiltinOrChip([pins[5], pins[3]], [pins[7]]);
			new BuiltinOrChip([pins[6], pins[7]], [pins[8]]);

			simulator = new Simulator();
		},
		run(iterations = 100) {
			pins[0].update(POWER_STATE_HIGH, simulator);
			simulator.simulate(iterations);
		},
		expectPowerStates: [
			POWER_STATE_HIGH,
			POWER_STATE_LOW,
			POWER_STATE_LOW,
			POWER_STATE_LOW,
			POWER_STATE_LOW,
			POWER_STATE_HIGH,
			POWER_STATE_LOW,
			POWER_STATE_HIGH,
			POWER_STATE_HIGH
		],
		pins
	};
}
