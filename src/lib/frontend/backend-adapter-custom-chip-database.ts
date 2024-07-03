import { BuiltinAndChip, BuiltinNAndChip, BuiltinOrChip, BuiltinNOrChip, BuiltinXOrChip, BuiltinNotChip } from "$lib/core/builtin-chips";
import { Chip, type ChipType } from "$lib/core/chip";
import { Pin } from "$lib/core/pin";
import type { PowerState } from "$lib/core/power-state";
import type { Simulator } from "$lib/core/simulator";

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

export type CustomChipSerialized = {
  pins: PinSerialized[];
  chips: ChipSerialized[];
  inputPinIndices: number[];
  outputPinIndices: number[];
}

function createChip(type: ChipType, inputPins: Pin[], outputPins: Pin[]): Chip | undefined {
  let chip: Chip | undefined = undefined;

  switch (type) {
    case 'AND':
      chip = new BuiltinAndChip(inputPins, outputPins);
      break;
    case 'NAND':
      chip = new BuiltinNAndChip(inputPins, outputPins);
      break;
    case 'OR':
      chip = new BuiltinOrChip(inputPins, outputPins);
      break;
    case 'NOR':
      chip = new BuiltinNOrChip(inputPins, outputPins);
      break;
    case 'XOR':
      chip = new BuiltinXOrChip(inputPins, outputPins);
      break;
    case 'NOT':
      chip = new BuiltinNotChip(inputPins, outputPins);
      break;

    default:
      return undefined;
  }

  return chip;
}

export class BackendAdapterCustomChipDatabase {
  private customChips: Map<string, CustomChipSerialized> = new Map();

  constructor() { }

  add(
    name: string,
    allPins: Pin[],
    allChips: Chip[],
    inputPinIndices: number[],
    outputPinIndices: number[]
  ) {
    if (this.customChips.has(name)) {
      return;
    }

    const pinsSerialized: PinSerialized[] = [];
    const chipsSerialized: ChipSerialized[] = [];
    let tempInputPinIndices: number[] = [];
    let tempOutputPinIndices: number[] = [];

    const pins: Pin[] = [];
    const mapPins: Map<Pin, number> = new Map();

    for (const pin of allPins) {
      if (mapPins.has(pin)) {
        continue;
      }

      const serializedPin: PinSerialized = {
        powerState: pin.powerState,
        connectedPinIndices: [],
        connectedChipIndices: []
      };

      const index = pinsSerialized.length;
      pinsSerialized.push(serializedPin);
      pins.push(pin);
      mapPins.set(pin, index);
    }

    for (const pin of pins) {
      const serializedPin = pinsSerialized[mapPins.get(pin) as number];
      for (const connectedPin of pin.connectedPins) {
        const serializedConnectedPinIndex = mapPins.get(connectedPin);
        if (serializedConnectedPinIndex !== undefined) {
          serializedPin.connectedPinIndices.push(serializedConnectedPinIndex);
        }
      }
    }

    for (const chip of allChips) {
      let inputPinIndices: number[] = [];
      let outputPinIndices: number[] = [];

      const serializedChip: ChipSerialized = {
        type: chip.type,
        inputPinIndices,
        outputPinIndices
      };

      let chipIndex = chipsSerialized.length;

      for (const inputPin of chip.inputPins) {
        const serializedInputPinIndex = mapPins.get(inputPin) as number;
        inputPinIndices.push(serializedInputPinIndex);

        const serialzedPin = pinsSerialized[serializedInputPinIndex];
        serialzedPin.connectedChipIndices.push(chipIndex);
      }

      for (const outputPin of chip.outputPins) {
        const serializedInputPinIndex = mapPins.get(outputPin) as number;
        outputPinIndices.push(serializedInputPinIndex);

        const serialzedPin = pinsSerialized[serializedInputPinIndex];
        serialzedPin.connectedChipIndices.push(chipIndex);
      }

      chipsSerialized.push(serializedChip);
    }

    for (const inputPinIndex of inputPinIndices) {
      const pin = allPins[inputPinIndex];
      const serialzedPinIndex = mapPins.get(pin) as number
      const serializedPin = pinsSerialized[serialzedPinIndex];
      const connectedPinIndices = serializedPin.connectedChipIndices;
      for (const connectedPinIndex of connectedPinIndices) {
        const connectedPinSerialized = pinsSerialized[connectedPinIndex];
        const index = connectedPinSerialized.connectedPinIndices.indexOf(serialzedPinIndex);
        if (index !== -1) {
          connectedPinSerialized.connectedPinIndices.splice(index, 1);
        }
      }

      tempInputPinIndices.push(serialzedPinIndex);
    }

    for (const outputPinIndex of outputPinIndices) {
      const pin = allPins[outputPinIndex];
      const serialzedPinIndex = mapPins.get(pin) as number
      tempOutputPinIndices.push(serialzedPinIndex);
    }

    const customChipSerialized: CustomChipSerialized = {
      pins: pinsSerialized,
      chips: chipsSerialized,
      inputPinIndices: tempInputPinIndices,
      outputPinIndices: tempOutputPinIndices
    };

    this.customChips.set(name, customChipSerialized);

    console.log(customChipSerialized);
  }

  create(name: string, simulator: Simulator): Chip | undefined {
    const customChipSerialized = this.customChips.get(name);
    if (customChipSerialized === undefined) {
      return undefined;
    }

    let inputPins: Pin[] = new Array(customChipSerialized.inputPinIndices.length);
    let outputPins: Pin[] = new Array(customChipSerialized.outputPinIndices.length);
    let pins: Pin[] = new Array(customChipSerialized.pins.length);

    for (let i = 0; i < pins.length; i++) {
      pins[i] = new Pin(customChipSerialized.pins[i].powerState);
    }

    for (let i = 0; i < inputPins.length; i++) {
      const inputPinIndex = customChipSerialized.inputPinIndices[i];
      inputPins[i] = pins[inputPinIndex];
    }

    for (let i = 0; i < outputPins.length; i++) {
      const outputPinIndex = customChipSerialized.outputPinIndices[i];
      outputPins[i] = pins[outputPinIndex];
    }

    for (let i = 0; i < customChipSerialized.pins.length; i++) {
      const pinSerialzed = customChipSerialized.pins[i];
      const pin = pins[i];

      for (const connectedPinIndex of pinSerialzed.connectedPinIndices) {
        const otherPin = pins[connectedPinIndex];
        pin.connectPin(simulator, otherPin);
      }
    }

    for (const chipSerialzed of customChipSerialized.chips) {
      let inputPins: Pin[] = new Array(chipSerialzed.inputPinIndices.length);
      let outputPins: Pin[] = new Array(chipSerialzed.outputPinIndices.length);

      for (let i = 0; i < inputPins.length; i++) {
        const inputPinIndex = chipSerialzed.inputPinIndices[i];
        inputPins[i] = pins[inputPinIndex];
      }

      for (let i = 0; i < outputPins.length; i++) {
        const outputPinIndex = chipSerialzed.outputPinIndices[i];
        outputPins[i] = pins[outputPinIndex];
      }

      createChip(chipSerialzed.type, inputPins, outputPins);
    }

    const chip = new Chip(inputPins, inputPins.length, outputPins, outputPins.length, 'CUSTOM');
    return chip;
  }
}