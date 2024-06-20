// import type { Collider, PointCollider } from "$lib/helpers/colliders";
// import { calculateDimension, QuadTree } from "$lib/helpers/quad-tree";
// import { Vector2D } from "$lib/helpers/vector2d";
// import { type VisualChip, type VisualInput, type VisualWirePoint, type VisualOutput, VISUAL_TYPES } from "./visuals";

// export type SimulationEntity = VisualChip | VisualInput | VisualOutput //| VisualWirePoint;

// // export interface SimulationEntityManagerConstructor {
// //   visualChipMaxWidth: number;
// //   visualChipMaxHeight: number;

// //   visualInputMaxWidth: number;
// //   visualInputMaxHeight: number;

// //   visualOutputMaxWidth: number;
// //   visualOutputMaxHeight: number;

// //   // visualWirePointMaxWidth: number;
// //   // visualWirePointMaxHeight: number;

// //   level?: number;
// //   capcity?: number;
// //   position?: Vector2D;
// // }

// // export class SimulationEntityManager {
// //   visualChips: QuadTree<VisualChip>;
// //   visualInputs: QuadTree<VisualInput>;
// //   visualOutputs: QuadTree<VisualOutput>;
// //   // visualWirePoints: QuadTree<VisualWirePoint>;

// //   constructor ({
// //     visualChipMaxWidth,
// //     visualChipMaxHeight,

// //     visualInputMaxWidth,
// //     visualInputMaxHeight,

// //     visualOutputMaxWidth,
// //     visualOutputMaxHeight,

// //     // visualWirePointMaxWidth,
// //     // visualWirePointMaxHeight,

// //     level = 8,
// //     capcity = 10,
// //     position = new Vector2D()
// //   }: SimulationEntityManagerConstructor) {
// //     const visualChipQuadTreeDimension = calculateDimension(visualChipMaxWidth, visualChipMaxHeight, level);
// //     this.visualChips = new QuadTree(level, capcity, position, visualChipQuadTreeDimension.x, visualChipQuadTreeDimension.y);

// //     const visualInputQuadTreeDimension = calculateDimension(visualInputMaxWidth, visualInputMaxHeight, level);
// //     this.visualInputs = new QuadTree(level, capcity, position, visualInputQuadTreeDimension.x, visualInputQuadTreeDimension.y);

// //     const visualOutputQuadTreeDimension = calculateDimension(visualOutputMaxWidth, visualOutputMaxHeight, level);
// //     this.visualOutputs = new QuadTree(level, capcity, position, visualOutputQuadTreeDimension.x, visualOutputQuadTreeDimension.y);

// //     // const visualWirePointQuadTreeDimension = calculateDimension(visualWirePointMaxWidth, visualWirePointMaxHeight, level);
// //     // this.visualWirePoints = new QuadTree(level, capcity, position, visualWirePointQuadTreeDimension.x, visualWirePointQuadTreeDimension.y);
// //   }

// //   removeChip(chip: VisualChip) {
// //     this.visualChips.remove(chip);
// //   }

// //   removeInput(input: VisualInput) {
// //     this.visualInputs.remove(input);
// //   }

// //   removeOutput(output: VisualOutput) {
// //     this.visualOutputs.remove(output);
// //   }

// //   // removeWirePoint(wirePoint: VisualWirePoint) {
// //   //   // this.visualWirePoints.remove(wirePoint);
// //   // }

// //   remove(entity: SimulationEntity) {
// //     switch (entity.type) {
// //       case VISUAL_TYPES.CHIP:
// //         this.removeChip(entity as VisualChip);
// //         break;
// //       case VISUAL_TYPES.INPUT:
// //         this.removeInput(entity as VisualInput);
// //         break;
// //       case VISUAL_TYPES.OUTPUT:
// //         this.removeOutput(entity as VisualOutput);
// //         break;
// //       case VISUAL_TYPES.WIRE_POINT:
// //       // this.removeWirePoint(entity as VisualWirePoint);
// //       // break;
// //       default:
// //         break;
// //     }
// //   }

// //   insertChip(chip: VisualChip) {
// //     this.visualChips.insert(chip);
// //   }

// //   insertInput(input: VisualInput) {
// //     this.visualInputs.insert(input);
// //   }

// //   insertOutput(output: VisualOutput) {
// //     this.visualOutputs.insert(output);
// //   }

// //   // insertWirePoint(wirePoint: VisualWirePoint) {
// //   //   // this.visualWirePoints.insert(wirePoint);
// //   // }

// //   queryChips(collider: Collider): VisualChip[] {
// //     return [...this.visualChips.query(collider)];
// //   }

// //   queryInputs(collider: Collider): VisualInput[] {
// //     return [...this.visualInputs.query(collider)];
// //   }

// //   queryOutputs(collider: Collider): VisualOutput[] {
// //     return [...this.visualOutputs.query(collider)];
// //   }

// //   // queryWirePoints(collider: Collider): VisualWirePoint[] {
// //   //   // return [...this.visualWirePoints.query(collider)];
// //   // }

// //   queryChipByPoint(pointCollider: PointCollider): VisualChip | undefined {
// //     return this.visualChips.queryByPoint(pointCollider);
// //   }

// //   queryInputByPoint(pointCollider: PointCollider): VisualInput | undefined {
// //     return this.visualInputs.queryByPoint(pointCollider);
// //   }

// //   queryOutputByPoint(pointCollider: PointCollider): VisualOutput | undefined {
// //     return this.visualOutputs.queryByPoint(pointCollider);
// //   }

// //   // queryWirePointByPoint(pointCollider: PointCollider): VisualWirePoint | undefined {
// //   //   // return this.visualWirePoints.queryByPoint(pointCollider);
// //   // }

// //   query(collider: Collider): SimulationEntity[] {
// //     let result: SimulationEntity[] = [];
// //     result = result.concat([...this.visualChips.query(collider)]);
// //     result = result.concat([...this.visualInputs.query(collider)]);
// //     result = result.concat([...this.visualOutputs.query(collider)]);
// //     // result = result.concat([...this.visualWirePoints.query(collider)]);
// //     return result;
// //   }

// //   queryByPoint(pointCollider: PointCollider): SimulationEntity | undefined {
// //     let result: SimulationEntity | undefined = undefined;
// //     result = this.visualChips.queryByPoint(pointCollider);
// //     if (result !== undefined) {
// //       return result;
// //     }

// //     result = this.visualInputs.queryByPoint(pointCollider);
// //     if (result !== undefined) {
// //       return result;
// //     }

// //     result = this.visualOutputs.queryByPoint(pointCollider);
// //     if (result !== undefined) {
// //       return result;
// //     }

// //     // result = this.visualWirePoints.queryByPoint(pointCollider);
// //     if (result !== undefined) {
// //       return result;
// //     }

// //     return result;
// //   }

// //   relocateChip(chip: VisualChip) {
// //     this.visualChips.relocate(chip);
// //   }

// //   relocateInput(input: VisualInput) {
// //     this.visualInputs.relocate(input);
// //   }

// //   relocateOutput(output: VisualOutput) {
// //     this.visualOutputs.relocate(output);
// //   }

// //   // relocateWirePoint(wirePoint: VisualWirePoint) {
// //   //   // this.visualWirePoints.relocate(wirePoint);
// //   // }

// //   relocate(entity: SimulationEntity) {
// //     switch (entity.type) {
// //       case VISUAL_TYPES.CHIP:
// //         this.relocateChip(entity as VisualChip);
// //         break;
// //       case VISUAL_TYPES.INPUT:
// //         this.relocateInput(entity as VisualInput);
// //         break;
// //       case VISUAL_TYPES.OUTPUT:
// //         this.relocateOutput(entity as VisualOutput);
// //         break;
// //       case VISUAL_TYPES.WIRE_POINT:
// //       // this.relocateWirePoint(entity as VisualWirePoint);
// //       // break;
// //       default:
// //         break;
// //     }
// //   }

// //   update() {
// //     this.visualChips.cleanup();
// //     this.visualInputs.cleanup();
// //     this.visualOutputs.cleanup();
// //     // this.visualWirePoints.cleanup();
// //   }
// // }
