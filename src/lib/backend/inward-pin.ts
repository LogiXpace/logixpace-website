import { Pin } from "./pin";
import { POWER_STATE_HIGH, POWER_STATE_LOW, type PowerState } from "./power-state";
import type { Simulator } from "./simulator";

export class InwardPin extends Pin {
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
		pin.connectedPins.add(this);

		// increment the number of connectors on the pin.
		this.maximumInfluencers++;

		// change influx based on this power state.
		this.changeInflux(pin.powerState);
		this.update(pin.powerState, simulator);
	}

	/**
	 * disconnect pin
	 * 
	 * @param simulator 
	 * @param pin - the pin to connect to
	 */
	disconnectPin(simulator: Simulator, pin: Pin) {
		pin.connectedPins.delete(pin);

		// decrement the number of connectors on the pin.
		this.maximumInfluencers--;

		if (pin.powerState === POWER_STATE_HIGH) {
			this.influx--;
		}

		if (this.isUpdatable(POWER_STATE_LOW)) {
			simulator.queuePin(this);
		}
	}
}