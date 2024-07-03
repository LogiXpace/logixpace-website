import type { Chip, ChipType } from "$lib/core/chip";
import type { Pin } from "$lib/core/pin";
import type { PowerState } from "$lib/core/power-state";

export type PinSerialized = {
  powerState: PowerState;
  connectedPinIndices: number[];
  connectedChipIndices: number[];
}

export type ChipSerialized = {
  type: ChipType;
  inputPinIndices: number[];
  outputPinIndices: number[];
}

export type AllSerialized = {
  pins: PinSerialized[];
  chips: ChipSerialized[];
}

export class BackendAdapterExport {
  private pinsSerialized: PinSerialized[] = [];
  private chipsSerialized: ChipSerialized[] = [];

  private pins: Pin[] = [];
  private mapPins: Map<Pin, number> = new Map();

  constructor() { }

  private serializeConnections() {
    for (const pin of this.pins) {
      const serializedPin = this.pinsSerialized[this.mapPins.get(pin) as number];
      for (const connectedPin of pin.connectedPins) {
        const serializedConnectedPinIndex = this.mapPins.get(connectedPin);
        if (serializedConnectedPinIndex !== undefined) {
          serializedPin.connectedPinIndices.push(serializedConnectedPinIndex);
        }
      }
    }
  }

  private serializePin(pin: Pin) {
    const serializedPin: PinSerialized = {
      powerState: pin.powerState,
      connectedPinIndices: [],
      connectedChipIndices: []
    };

    const index = this.pinsSerialized.length;
    this.pinsSerialized.push(serializedPin);
    this.pins.push(pin);
    this.mapPins.set(pin, index);
  }

  private serializeChip(chip: Chip) {
    const serializedChip: ChipSerialized = {
      type: chip.type,
      inputPinIndices: chip.inputPins.map(pin => this.mapPins.get(pin) as number),
      outputPinIndices: chip.outputPins.map(pin => this.mapPins.get(pin) as number)
    };

    this.chipsSerialized.push(serializedChip);
  }

  serialize(pins: Pin[], chips: Chip[]): AllSerialized {
    for (const pin of pins) {
      this.serializePin(pin);
    }

    this.serializeConnections();

    for (const chip of chips) {
      this.serializeChip(chip);
    }

    return {
      pins: this.pinsSerialized,
      chips: this.chipsSerialized
    }
  }
}