import { Pin } from "./pin";
import { POWER_STATE_HIGH, POWER_STATE_LOW } from "./power-state";

export class InputPin extends Pin {
  /**
   * 
   * @param {import("./power-state").PowerState} powerState 
   */
  constructor(powerState) {
    super(powerState);
  }

  /**
	 * connect pin
	 * 
	 * @param {import('./simulator').Simulator} simulator 
	 * @param {Pin} pin - the pin to connect to
	 */
	connectPin(simulator, pin) {
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
	 * @param {import('./simulator').Simulator} simulator 
	 * @param {Pin} pin - the pin to connect to
	 */
	disconnectPin(simulator, pin) {
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