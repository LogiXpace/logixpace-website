import { Pin } from "$lib/backend/pin";
import { POWER_STATE_HIGH, POWER_STATE_LOW } from "$lib/backend/power-state";
import { Simulator } from "$lib/backend/simulator";
import { FreeList } from "$lib/helpers/free-list";
import { Adapter } from "./adapter";
import type { ChipType } from "./chip-types";
import { type PowerState as FrontendPowerState, POWER_STATE_HIGH as FRONTEND_POWER_STATE_HIGH } from "./state";

export class BackendAdapter extends Adapter<number> {
  private simulator = new Simulator();
  private pins = new FreeList<Pin>();

  constructor() {
    super("BackendAdapter");
  }

  createPin(state: FrontendPowerState): number {
    const pin = new Pin(state === FRONTEND_POWER_STATE_HIGH ? POWER_STATE_HIGH : POWER_STATE_LOW);
    return this.pins.insert(pin);
  }

  getPowerState(id: number): FrontendPowerState {
    const pin = this.pins.get(id);
    if (typeof pin === 'number' || pin === undefined) {
      throw new Error("Invalid pin ID");
    }

    return pin.powerState;
  }

  setPowerState(id: number, state: FrontendPowerState): void {
    const pin = this.pins.get(id);
    if (typeof pin === 'number' || pin === undefined) {
      throw new Error("Invalid pin ID");
    }

    pin.update(state, this.simulator);
  }

  connect(start: number, end: number): void {
    const startPin = this.pins.get(start);
    const endPin = this.pins.get(end);

    if (typeof startPin === 'number' || startPin === undefined) {
      throw new Error("Invalid start pin ID");
    }

    if (typeof endPin === 'number' || endPin === undefined) {
      throw new Error("Invalid end pin ID");
    }

    startPin.connectPin(endPin);
    this.simulator.queuePin(startPin);
  }

  destroyPin(id: number): void {
    const pin = this.pins.get(id);
    if (typeof pin === 'number' || pin === undefined) {
      throw new Error("Invalid pin ID");
    }

    this.pins.erase(id);
  }

  disconnect(start: number, end: number): void {
    const startPin = this.pins.get(start);
    const endPin = this.pins.get(end);

    if (typeof startPin === 'number' || startPin === undefined) {
      throw new Error("Invalid start pin ID");
    }

    if (typeof endPin === 'number' || endPin === undefined) {
      throw new Error("Invalid end pin ID");
    }

    startPin.disconnectPin(endPin);
  }

  createChip(type: ChipType): void {

  }

  update(): void {
    this.simulator.step();
  }
}