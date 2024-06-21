import { Queue } from '../../helpers/queue';

export class Simulator {
	constructor() {
		/**
		 * holds all the pins that needs to be propagated.
		 * @type {Queue<import("./pin").Pin>}
		 */
		this.propagtePins = new Queue();
	}

	/**
	 * queue pin that needs to be propagated.
	 * @param {import("./pin").Pin} pin
	 */
	queuePin(pin) {
		this.propagtePins.enqueue(pin);
	}

	/**
	 * takes a simulation step
	 */
	step() {
		// take the last element from the queue.
		const propagtePin = this.propagtePins.dequeue();

		if (propagtePin === undefined) return;

		// propagate the pin and queue any pin that needs to be propagated.
		propagtePin.propogate(this);

		// this.currentLevel++;
	}

	/**
	 * run the simulation with how many steps.
	 * @param {number} steps - the number of steps to simulate with.
	 */
	simulate(steps = 100) {
		for (let i = 0; i < steps && this.propagtePins.peek() !== undefined; i++) {
			this.step();
		}
	}
}
