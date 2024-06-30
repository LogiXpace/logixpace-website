import { CanvasStyle } from "$lib/helpers/canvas-style";
import { BoxCollider } from "$lib/helpers/colliders";
import { RGB } from "$lib/helpers/color";
import { drawRectangle } from "$lib/helpers/draw";
import { calculateBoxFromTwoPoint } from "$lib/helpers/shape";
import { Vector2D } from "$lib/helpers/vector2d";
import type { Chip } from "./chip";
import type { ChipPin } from "./chip-pin";
import type { Input } from "./input";
import type { IO } from "./io";
import type { Output } from "./output";
import type { SimulationEntityManager } from "./simulation-entity-manager";
import type { Wire } from "./wire";
import type { WirePoint } from "./wire-point";

export class SimulationSelectionManager<T> {
  inputs = new Set<Input<T>>();
  outputs = new Set<Output<T>>();
  chips = new Set<Chip<T>>();
  wirePoints = new Set<WirePoint<T>>();

  private collider = new BoxCollider(new Vector2D(), 0, 0);
  private entityManager: SimulationEntityManager<T>;

  constructor(entityManager: SimulationEntityManager<T>) {
    this.entityManager = entityManager;
  }

  selectFromPoint(startPoint: Vector2D, endPoint: Vector2D) {
    const result = calculateBoxFromTwoPoint(startPoint, endPoint);
    this.collider.position.copy(result.position);
    this.collider.width = result.width;
    this.collider.height = result.height;

    const inputs = this.entityManager.queryInput(this.collider);
    const outputs = this.entityManager.queryOutput(this.collider);
    const wirePoints = this.entityManager.queryWirePoint(this.collider);
    const chips = this.entityManager.queryChip(this.collider);

    for (const input of inputs) {
      this.addInput(input);
    }

    for (const output of outputs) {
      this.addOutput(output);
    }

    for (const wirePoint of wirePoints) {
      this.addWirePoint(wirePoint);
    }

    for (const chip of chips) {
      this.addChip(chip);
    }
  }

  isSelecteed() {
    return this.chips.size > 0 || this.wirePoints.size > 0 || this.inputs.size > 0 || this.outputs.size > 0
  }

  addInput(input: Input<T>) {
    this.inputs.add(input);
    input.select();
  }

  addOutput(output: Output<T>) {
    this.outputs.add(output);
    output.select();
  }

  addChip(chip: Chip<T>) {
    this.chips.add(chip);
    chip.select();
  }

  addWirePoint(wirePoint: WirePoint<T>) {
    this.wirePoints.add(wirePoint);
    wirePoint.select();
  }

  deselectInput(input: Input<T>) {
    this.inputs.delete(input);
    input.deselect();
  }

  deselectOutput(output: Output<T>) {
    this.outputs.delete(output);
    output.deselect();
  }

  deselectChip(chip: Chip<T>) {
    this.chips.delete(chip);
    chip.deselect();
  }

  deselectWirePoint(wirePoint: WirePoint<T>) {
    this.wirePoints.delete(wirePoint);
    wirePoint.deselect();
  }

  selectInput(input: Input<T>) {
    if (this.inputs.has(input)) {
      this.deselectInput(input);
      return false;
    } else {
      this.addInput(input);
      return true;
    }
  }

  selectOutput(output: Output<T>) {
    if (this.outputs.has(output)) {
      this.deselectOutput(output);
      return false;
    } else {
      this.addOutput(output);
      return true;
    }
  }

  selectChip(chip: Chip<T>) {
    if (this.chips.has(chip)) {
      this.deselectChip(chip);
      return false;
    } else {
      this.addChip(chip);
      return true;
    }
  }

  selectWirePoint(wirePoint: WirePoint<T>) {
    if (this.wirePoints.has(wirePoint)) {
      this.deselectWirePoint(wirePoint);
      return false;
    } else {
      this.addWirePoint(wirePoint);
      return true;
    }
  }

  deselectAll() {
    for (const input of this.inputs) {
      input.deselect();
    }

    for (const output of this.outputs) {
      output.deselect();
    }

    for (const wirePoint of this.wirePoints) {
      wirePoint.deselect();
    }

    for (const chip of this.chips) {
      chip.deselect();
    }

    this.clear();
    this.resetSelectionBox();
  }

  clear() {
    this.inputs.clear();
    this.outputs.clear();
    this.wirePoints.clear();
    this.chips.clear();
  }

  resetSelectionBox() {
    this.collider.position.x = 0;
    this.collider.position.y = 0;
    this.collider.width = 0;
    this.collider.height = 0;
  }

  draw(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
    for (const input of this.inputs) {
      input.draw(ctx, currTime, deltaTime);
    }

    for (const output of this.outputs) {
      output.draw(ctx, currTime, deltaTime);
    }

    for (const wirePoint of this.wirePoints) {
      wirePoint.draw(ctx, currTime, deltaTime);
    }

    for (const chip of this.chips) {
      chip.draw(ctx, currTime, deltaTime);
    }

    this.drawSelection(ctx);
  }

  drawSelection(ctx: CanvasRenderingContext2D) {
    drawRectangle(
      ctx,
      this.collider.position.x,
      this.collider.position.y,
      this.collider.width,
      this.collider.height,
      new CanvasStyle({
        strokeColor: new RGB(0, 0, 0, 1),
        lineWidth: 1,
        lineDash: [3, 3]
      })
    )
  }
}