import { Input } from "./input";
import { ChipPin } from "./chip-pin";
import { Output } from "./output";
import type { SimulationEntityManager } from "./simulation-entity-manager";
import type { AllSerialized } from "./simulation-export-json";
import { WirePoint } from "./wire-point";
import { NamedPin } from "./named-pin";
import { RGB } from "$lib/helpers/color";
import { Vector2D } from "$lib/helpers/vector2d";
import { DIRECTION } from "$lib/helpers/direction";
import { Chip } from "./chip";
import type { SimulationContext } from "./simulation-context";
import { DEFUALTS } from "./defaults";
import { Wire, type WireEntity } from "./wire";

export function importJSON<T>(json: string, simulationContext: SimulationContext<T>) {
  let {
    oldPosition: oldPositionSerialized,
    namedPins: namedPinsSerialized,
    inputs: inputsSerialized,
    outputs: outputsSerialized,
    wires: wiresSerialized,
    wirePoints: wirePointsSerialized,
    chipPins: chipPinsSerialized,
    chips: chipsSerialized
  } = JSON.parse(json) as AllSerialized<T>;

  const mapChipPins: Map<number, ChipPin<T>> = new Map();
  const mapInputs: Map<number, Input<T>> = new Map();
  const mapOutputs: Map<number, Output<T>> = new Map();
  const mapWirePoints: Map<number, WirePoint<T>> = new Map();
  const mapNamedPins: Map<number, NamedPin<T>> = new Map();
  const oldPosition = new Vector2D(oldPositionSerialized.x, oldPositionSerialized.y);
  const worldPosition = simulationContext.screenVectorToWorldVector(simulationContext.mouseInput.movePosition);
  const delta = worldPosition.clone().subVector(oldPosition);

  for (let i = 0; i < inputsSerialized.length; i++) {
    const inputSerialized = inputsSerialized[i];

    const namedPinSerialzedIndex = inputSerialized.namedPinIndex;
    let namedPin = mapNamedPins.get(namedPinSerialzedIndex);

    if (namedPin === undefined) {
      const namedPinSerialized = namedPinsSerialized[namedPinSerialzedIndex];
      namedPin = new NamedPin({
        id: simulationContext.entityManager.adapter.createInputPin(namedPinSerialized.powerState),
        name: namedPinSerialized.name,
        powerState: namedPinSerialized.powerState
      });

      mapNamedPins.set(namedPinSerialzedIndex, namedPin);
    }

    const input = new Input({
      namedPin,
      position: new Vector2D(inputSerialized.position.x, inputSerialized.position.y).addVector(delta),
      color: new RGB(inputSerialized.color.red, inputSerialized.color.green, inputSerialized.color.blue)
    });

    mapInputs.set(i, input);
    simulationContext.entityManager.insertInput(input);
    simulationContext.selectionManager.selectInput(input);
  }

  for (let i = 0; i < outputsSerialized.length; i++) {
    const outputSerialized = outputsSerialized[i];

    const namedPinSerialzedIndex = outputSerialized.namedPinIndex;
    let namedPin = mapNamedPins.get(namedPinSerialzedIndex);

    if (namedPin === undefined) {
      const namedPinSerialized = namedPinsSerialized[namedPinSerialzedIndex];
      namedPin = new NamedPin({
        id: simulationContext.entityManager.adapter.createOutputPin(namedPinSerialized.powerState),
        name: namedPinSerialized.name,
        powerState: namedPinSerialized.powerState
      });

      mapNamedPins.set(namedPinSerialzedIndex, namedPin);
    }

    const output = new Output({
      namedPin,
      position: new Vector2D(outputSerialized.position.x, outputSerialized.position.y).addVector(delta),
      color: new RGB(outputSerialized.color.red, outputSerialized.color.green, outputSerialized.color.blue)
    });

    mapOutputs.set(i, output);
    simulationContext.entityManager.insertOutput(output);
    simulationContext.selectionManager.selectOutput(output);
  }

  const addChipPin = (chipPinSerialzedIndex: number) => {
    const chipPinSerialized = chipPinsSerialized[chipPinSerialzedIndex];

    const namedPinSerialzedIndex = chipPinSerialized.namedPinIndex;
    let namedPin = mapNamedPins.get(namedPinSerialzedIndex);

    if (namedPin === undefined) {
      const namedPinSerialized = namedPinsSerialized[namedPinSerialzedIndex];
      namedPin = new NamedPin({
        id: simulationContext.entityManager.adapter.createPin(namedPinSerialized.powerState),
        name: namedPinSerialized.name,
        powerState: namedPinSerialized.powerState
      });

      mapNamedPins.set(namedPinSerialzedIndex, namedPin);
    }

    const chipPin = new ChipPin({
      namedPin,
      position: new Vector2D(),
      direction: DIRECTION.LEFT
    });

    mapChipPins.set(chipPinSerialzedIndex, chipPin);
    simulationContext.entityManager.insertChipPin(chipPin);

    return chipPin;
  }

  for (let i = 0; i < wirePointsSerialized.length; i++) {
    const wirePointSerialized = wirePointsSerialized[i];

    const wirePoint = new WirePoint({
      pinId: simulationContext.entityManager.adapter.createPin(wirePointSerialized.powerState),
      position: new Vector2D(wirePointSerialized.position.x, wirePointSerialized.position.y).addVector(delta)
    });

    mapWirePoints.set(i, wirePoint);
    simulationContext.entityManager.insertWirePoint(wirePoint);
    simulationContext.selectionManager.selectWirePoint(wirePoint);
  }

  for (let i = 0; i < chipsSerialized.length; i++) {
    const chipSerialized = chipsSerialized[i];

    simulationContext.ctx.beginPath();
    simulationContext.ctx.textAlign = 'center';
    simulationContext.ctx.textBaseline = 'middle';
    simulationContext.ctx.fillStyle = DEFUALTS.CHIP_FONT_COLOR;
    simulationContext.ctx.lineWidth = DEFUALTS.CHIP_FONT_STROKE_WIDTH;
    simulationContext.ctx.font = `${DEFUALTS.CHIP_FONT_SIZE}px ${DEFUALTS.CHIP_FONT_FAMILY}`;
    const measure = simulationContext.ctx.measureText(chipSerialized.name);
    const textWidth = measure.width;

    const chip = new Chip({
      name: chipSerialized.name,
      position: new Vector2D(chipSerialized.position.x, chipSerialized.position.y).addVector(delta),
      color: new RGB(chipSerialized.color.red, chipSerialized.color.green, chipSerialized.color.blue),
      textWidth,
      id: chipSerialized.id,
      simulationContext,
      inputPins: chipSerialized.inputPinIndices.map(pinIndex => addChipPin(pinIndex)),
      outputPins: chipSerialized.outputPinIndices.map(pinIndex => addChipPin(pinIndex))
    });

    simulationContext.entityManager.insertChip(chip);
    simulationContext.selectionManager.selectChip(chip);
  }

  for (let i = 0; i < wiresSerialized.length; i++) {
    const wireSerialized = wiresSerialized[i];

    const startType = wireSerialized.startType;
    let start: WireEntity<T>;
    let startPosition: Vector2D;

    if (startType === 'input') {
      start = mapInputs.get(wireSerialized.startEntityIndex) as Input<T>;
      startPosition = (mapInputs.get(wireSerialized.startEntityIndex) as Input<T>).outletPosition;
    } else if (startType === 'output') {
      start = mapOutputs.get(wireSerialized.startEntityIndex) as Output<T>;
      startPosition = (mapOutputs.get(wireSerialized.startEntityIndex) as Output<T>).outletPosition;
    } else if (startType === 'wire-point') {
      start = mapWirePoints.get(wireSerialized.startEntityIndex) as WirePoint<T>;
      startPosition = (mapWirePoints.get(wireSerialized.startEntityIndex) as WirePoint<T>).position;
    } else {
      start = mapChipPins.get(wireSerialized.startEntityIndex) as ChipPin<T>;
      startPosition = (mapChipPins.get(wireSerialized.startEntityIndex) as ChipPin<T>).outletPosition;
    }

    let end: WireEntity<T>;
    let endPosition: Vector2D;

    if (wireSerialized.endType === 'input') {
      end = mapInputs.get(wireSerialized.endEntityIndex) as Input<T>;
      endPosition = (mapInputs.get(wireSerialized.endEntityIndex) as Input<T>).outletPosition;
    } else if (wireSerialized.endType === 'output') {
      end = mapOutputs.get(wireSerialized.endEntityIndex) as Output<T>;
      endPosition = (mapOutputs.get(wireSerialized.endEntityIndex) as Output<T>).outletPosition;
    } else if (wireSerialized.endType === 'wire-point') {
      end = mapWirePoints.get(wireSerialized.endEntityIndex) as WirePoint<T>;
      endPosition = (mapWirePoints.get(wireSerialized.endEntityIndex) as WirePoint<T>).position;
    } else {
      end = mapChipPins.get(wireSerialized.endEntityIndex) as ChipPin<T>;
      endPosition = (mapChipPins.get(wireSerialized.endEntityIndex) as ChipPin<T>).outletPosition;
    }

    const wire = new Wire({
      startPosition,
      endPosition,
      start,
      end
    });

    start.addWire(wire);
    end.addWire(wire);

    simulationContext.adapter.connect(start.pinId, wire.end.pinId);
    simulationContext.entityManager.insertWire(wire);
  }

  simulationContext.queryAll();
}