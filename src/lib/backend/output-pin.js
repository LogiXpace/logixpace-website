import { Pin } from "./pin";
import { POWER_STATE_HIGH, POWER_STATE_LOW } from "./power-state";

export class OutputPin extends Pin {
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
	 * @param {import('./simulator').Simulator} simulator 
	 * @param {Pin} pin - the pin to connect to
	 */
	disconnectPin(simulator, pin) {
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