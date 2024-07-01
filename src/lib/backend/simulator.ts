import { Queue } from '$lib/helpers/queue';
import { Pin } from './pin';

export class Simulator {
	/**
	 * holds all the pins that needs to be propagated.
	 */
	propagtePins = new Queue<Pin>();

	constructor() {
	}

	/**
	 * queue pin that needs to be propagated.
	 * @param pin
	 */
	queuePin(pin: Pin) {
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
	 * @param steps - the number of steps to simulate with.
	 */
	simulate(steps = 100) {
		for (let i = 0; i < steps && this.propagtePins.peek() !== undefined; i++) {
			this.step();
		}
	}
}
