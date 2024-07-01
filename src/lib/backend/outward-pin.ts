import { Pin } from "./pin";
import { POWER_STATE_HIGH, POWER_STATE_LOW, type PowerState } from "./power-state";
import type { Simulator } from "./simulator";

export class OutwardPin extends Pin {
	constructor(powerState: PowerState) {
		super(powerState);
	}

	/**
	 * connect pin
	 * 
	 * @param simulator 
	 * @param pin - the pin to connect to
	 */
	connectPin(simulator: Simulator, pin: Pin) {
		this.connectedPins.add(pin);

		// increment the number of connectors on the pin.
		pin.maximumInfluencers++;

		// change influx based on this power state.
		pin.changeInflux(this.powerState);
		pin.update(this.powerState, simulator);
	}

	/**
	 * disconnect pin
	 * 
	 * @param simulator 
	 * @param pin - the pin to connect to
	 */
	disconnectPin(simulator: Simulator, pin: Pin) {
		this.connectedPins.delete(pin);

		// decrement the number of connectors on the pin.
		pin.maximumInfluencers--;

		if (this.powerState === POWER_STATE_HIGH) {
			pin.influx--;
		}

		if (pin.isUpdatable(POWER_STATE_LOW)) {
			simulator.queuePin(pin);
		}
	}
}