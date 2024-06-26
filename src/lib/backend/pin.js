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
		 * @type {Array<Pin>}
		 */
		this.connectedPins = new Array();

		/**
		 * holds all the chips that this pin has connection to.
		 * @type {Array<import("./chip").Chip>}
		 */
		this.connectedChips = new Array();

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
	 * @param {Pin} pin - the pin to connect to
	 */
	connectPin(pin) {
		this.connectedPins.push(pin);

		// increment the number of connectors on the pin.
		pin.maximumInfluencers++;

		// change influx based on this power state.
		pin.changeInflux(this.powerState);
	}

	/**
	 * connect pin
	 * @param {Pin} pin - the pin to connect to
	 */
	disconnectPin(pin) {
		const index = this.connectedPins.indexOf(pin);
		if (index === -1) {
			return;
		}

		this.connectedPins.splice(index, 1);

		// decrement the number of connectors on the pin.
		pin.maximumInfluencers--;
		pin.influx--;
	}

	/**
	 * connect chip
	 * @param {import("./chip").Chip} chip - the chip to connect to
	 */
	connectChip(chip) {
		this.connectedChips.push(chip);
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
		 * Influx will only be 0 when every other sorrounding pin is off and maximumInfluencers when all are on.
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
	 * @param {import("./power-state").PowerState} powerState - the power state to use to determine whether the influx will decrement or increment.
	 */
	changeInflux(powerState) {
		this.influx += Number(powerState === POWER_STATE_HIGH) - Number(powerState !== POWER_STATE_LOW);
	}

	/**
	 * set the internal power state when it is updatable and queue it on the simulator to propagte it later.
	 *
	 * @important this method can ONLY be called on the pins or chips that has connections to this pin.
	 * @param {import("./power-state").PowerState} powerState - the power state to update to
	 * @param {import("./simulator").Simulator} simulator - the simulator to run this update method
	 */
	update(powerState, simulator) {
		// change influx
		this.changeInflux(powerState);

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
		for (let i = 0; i < this.connectedPins.length; i++) {
			const connectedPin = this.connectedPins[i];
			connectedPin.update(this.powerState, simulator);
		}

		// loop over the connected pins to process.
		for (let i = 0; i < this.connectedChips.length; i++) {
			const connectedChip = this.connectedChips[i];
			// if (!simulator.isChipProcessable(connectedChip)) continue;
			connectedChip.process(simulator);
		}
	}
}
