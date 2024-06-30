import { MAXIMUM_LEVEL } from './level';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from './power-state';

export class Pin {
	/**
	 *
	 * @param {import("./power-state").PowerState} powerState - the inital power state
	 */
	constructor(powerState) {
		this.powerState = powerState;

		/**
		 * holds all the pins that this pin has connection to.
		 * @type {Set<Pin>}
		 */
		this.connectedPins = new Set();

		/**
		 * holds all the chips that this pin has connection to.
		 * @type {Set<import("./chip").Chip>}
		 */
		this.connectedChips = new Set();

		/**
		 * records number of connections that other pins linked to this
		 */
		this.maximumInfluencers = 0;

		/**
		 * number of power state high of the other pins, which have connection to this pin.
		 */
		this.influx = 0;
	}

	/**
	 * connect pin
	 * 
	 * @param {import('./simulator').Simulator} simulator 
	 * @param {Pin} pin - the pin to connect to
	 */
	connectPin(simulator, pin) {
		pin.connectedPins.add(this);
		this.connectedPins.add(pin);

		// increment the number of connectors on the pin.
		pin.maximumInfluencers++;
		this.maximumInfluencers++;

		// change influx based on this power state.
		pin.changeInflux(this.powerState);
		pin.update(this.powerState, simulator);

		this.changeInflux(pin.powerState);
		this.update(pin.powerState, simulator);
	}

	/**
	 * disconnect pin
	 * 
	 * @param {import('./simulator').Simulator} simulator 
	 * @param {Pin} pin - the pin to connect to
	 */
	disconnectPin(simulator, pin) {
		this.connectedPins.delete(pin);
		pin.connectedPins.delete(this);

		// decrement the number of connectors on the pin.
		pin.maximumInfluencers--;

		if (this.powerState === POWER_STATE_HIGH) {
			pin.influx--;
		}

		this.maximumInfluencers--;

		if (pin.powerState === POWER_STATE_HIGH) {
			this.influx--;
		}

		if (pin.isUpdatable(POWER_STATE_LOW)) {
			simulator.queuePin(pin);
		}

		if (this.isUpdatable(POWER_STATE_LOW)) {
			simulator.queuePin(this);
		}
	}

	/**
	 * 
	 * @param {import('./simulator').Simulator} simulator 
	 */
	destroy(simulator) {
		for (const connectedPin of this.connectedPins) {
			connectedPin.disconnectPin(simulator, this);
		}

		this.connectedPins.clear();
		this.connectedChips.clear();
	}

	/**
	 * connect chip
	 * @param {import("./chip").Chip} chip - the chip to connect to
	 */
	connectChip(chip) {
		this.connectedChips.add(chip);
	}

	/**
	 * check if the pin is updatable
	 * @param {import("./power-state").PowerState} powerState - the power state to check if it is updatable
	 * @returns {boolean}
	 */
	isUpdatable(powerState) {
		/**
		 * update when the power state is different from the internal power state. there are 2 cases.
		 * case 1: power state high && internal power state low
		 * case 2: power state low && internal power state high
		 *
		 * But case 2 is a bit special, it needs to know whether all the sorrunding pins that influnece this pin is off. this is basically what influx is.
		 * Influx will only be 0 when every other sorrounding pin is off and equal to maximumInfluencers when all are on.
		 *
		 * modifying the cases:
		 * case 1 (will stay the same): power state high && internal power state low
		 * case 2: power state low && internal power state high && influx === 0
		 */

		return (
			(powerState === POWER_STATE_HIGH && this.powerState === POWER_STATE_LOW) ||
			(powerState === POWER_STATE_LOW && this.powerState === POWER_STATE_HIGH && this.influx === 0)
		);
	}

	/**
	 * change influx based on the power state from other pins: power state high, increment; power state low, decrement.
	 * 
	 * @important this method can ONLY be called on the pins or chips that has connections to this pin.
	 * @param {import("./power-state").PowerState} powerState - the power state to use to determine whether the influx will decrement or increment.
	 */
	changeInflux(powerState) {
		this.influx += Number(powerState === POWER_STATE_HIGH) - Number(powerState !== POWER_STATE_LOW);
	}

	/**
	 * set the internal power state when it is updatable and queue it on the simulator to propagte it later.
	 *
	 * @param {import("./power-state").PowerState} powerState - the power state to update to
	 * @param {import("./simulator").Simulator} simulator - the simulator to run this update method
	 */
	update(powerState, simulator) {
		// check if it is updatable
		if (!this.isUpdatable(powerState)) return;

		// set the power state
		this.powerState = powerState;

		// queue it on the simulator.
		simulator.queuePin(this);
	}

	/**
	 * propogating the internal power state to other connected chips or pins.
	 *
	 * @important this method is ONLY called in the simulator step method.
	 * @param {import("./simulator").Simulator} simulator
	 */
	propogate(simulator) {		
		// loop over the connected pins to update them with this internal power state.
		for (const connectedPin of this.connectedPins) {
			// change influx
			connectedPin.changeInflux(this.powerState);

			// update the power state
			connectedPin.update(this.powerState, simulator);
		}

		// loop over the connected pins to process.
		for (const connectedChip of this.connectedChips) {
			// if (!simulator.isChipProcessable(connectedChip)) continue;
			connectedChip.process(simulator);
		}
	}
}
