import type { Vector2D } from "$lib/helpers/vector2d";
import type { SimulationEntityManager } from "./simulation-entity-manager";
import { POWER_STATE_LOW } from "./state";
import { Wire, type WireEntity } from "./wire";
import { WirePoint } from "./wire-point";

export class SimulationCreatingWireManager<T> {
  private wirePointPending: WirePoint<T> | undefined;
  private entityManager: SimulationEntityManager<T>;

  constructor(entityManager: SimulationEntityManager<T>) {
    this.entityManager = entityManager;
  }

  isCreating() {
    return this.wirePointPending !== undefined;
  }

  delete() {
    this.wirePointPending = undefined;
  }

  setPosition(position: Vector2D) {
    if (this.wirePointPending !== undefined) {
      this.wirePointPending.position.copy(position);
      this.wirePointPending.updateCollider();
    }
  }

  splitWire(wire: Wire<T>, wirePoint: WirePoint<T>) {
    // make two wires from the closest point
    // one the half next to point and the other half
    // luckily, we can reuse the wire that was collided as one of the half

    // wire that starts from the closest point and end at the collided wire end position
    const halfWire1 = new Wire({
      start: wirePoint,
      startPosition: wirePoint.position,
      end: wire.end,
      endPosition: wire.endPosition
    });

    // add the wire to each wire entities at the end points of the wire
    wirePoint.addWire(halfWire1);
    wire.end.addWire(halfWire1);

    // add the wire into the entity manager
    this.entityManager.insertWire(halfWire1);
    this.entityManager.wireQueries.add(halfWire1);

    // connect it 
    this.entityManager.adapter.connect(wirePoint.pinId, wire.end.pinId);

    // remove the connection to the end
    wire.end.removeWire(wire);
    this.entityManager.adapter.disconnect(wire.start.pinId, wire.end.pinId);

    // delete and insert again to update it in the quad tree
    this.entityManager.removeWire(wire); // remove it with the old collider

    // wire that starts from its original start position and ends at the closest point
    const halfWire2 = wire;
    halfWire2.endPosition = wirePoint.position;
    halfWire2.end = wirePoint;
    halfWire2.updateCollider(); // update the collider to reflect the new end position

    wirePoint.addWire(halfWire2);

    this.entityManager.adapter.connect(halfWire2.start.pinId, wirePoint.pinId);
    this.entityManager.insertWire(halfWire2); // insert 
  }

  createAndSplitOn(closestPoint: Vector2D, wire: Wire<T>) {
    if (this.wirePointPending !== undefined) {
      // reuse the wire point pending as the closest wire point
      const closestWirePoint = this.wirePointPending;
      closestWirePoint.pinId = this.entityManager.adapter.createPin(POWER_STATE_LOW);

      this.wirePointPending = undefined; // the wire point pending operation is fininshed

      // set the wire point pending position as the closest point position
      closestWirePoint.position = closestPoint;
      closestWirePoint.updateCollider(); // update the collider to reflect the updated position.

      this.entityManager.insertWirePoint(closestWirePoint);
      this.entityManager.wirePointQueries.add(closestWirePoint);

      this.splitWire(wire, closestWirePoint);

      const connectedWirePending = closestWirePoint.wires[0];
      connectedWirePending.end = closestWirePoint;
      connectedWirePending.endPosition = closestPoint; // update the wire end position
      connectedWirePending.updateCollider(); // update the collider to reflect the updated position.

      this.entityManager.wireQueries.add(connectedWirePending);
      this.entityManager.insertWire(connectedWirePending); // at last, insert it into quad tree as it is no longer draged 

      this.entityManager.adapter.connect(connectedWirePending.start.pinId, connectedWirePending.end.pinId);
    } else {
      const closestWirePoint = new WirePoint({
        position: closestPoint,
        pinId: this.entityManager.adapter.createPin(POWER_STATE_LOW)
      });

      this.entityManager.insertWirePoint(closestWirePoint);
      this.entityManager.wirePointQueries.add(closestWirePoint);
      this.splitWire(wire, closestWirePoint);
      this.createOn(closestPoint, closestWirePoint);
    }
  }

  createOn(position: Vector2D, wireEntity: WireEntity<T>) {
    // create a new wire point
    this.wirePointPending = new WirePoint({
      position: position.clone(),
      pinId: -1
    }) as WirePoint<T>;

    // a wire connecting resserved wire point and the newly dragging wire point
    const wire = new Wire({
      start: wireEntity,
      startPosition: position,
      end: this.wirePointPending,
      endPosition: this.wirePointPending.position
    });

    // add the wire to the wire point
    this.wirePointPending.addWire(wire);
  }

  create() {
    if (this.wirePointPending === undefined) {
      return;
    }

    const wirePoint = this.wirePointPending;

    // insert it to the quad tree and add it to be drawn
    this.entityManager.insertWirePoint(wirePoint);
    this.entityManager.wirePointQueries.add(wirePoint);

    // update wire that is connected to it and insert into the quadtree
    const wire = wirePoint.wires[0];
    wire.updateCollider();
    this.entityManager.insertWire(wire);
    this.entityManager.wireQueries.add(wire);

    const start = wire.start;
    start.addWire(wire);

    wirePoint.pinId = this.entityManager.adapter.createPin(this.entityManager.adapter.getPowerState(start.pinId));
    this.entityManager.adapter.connect(start.pinId, wirePoint.pinId);

    this.createOn(wirePoint.position, wirePoint);
  }


  endOn(position: Vector2D, wireEntity: WireEntity<T>) {
    if (this.wirePointPending === undefined) {
      return;
    }

    // get the connected wire to the wire point
    let connectedWire = this.wirePointPending.wires[0];

    // checks if the start and end are not same
    if (connectedWire.startPosition !== position) {
      // set the end position to the outlet position
      connectedWire.endPosition = position;
      connectedWire.end = wireEntity;

      // update the collider and insert it into the quadtree for future querying
      connectedWire.updateCollider();

      this.entityManager.insertWire(connectedWire);
      this.entityManager.wireQueries.add(connectedWire);

      // connect the wire with the wire point
      wireEntity.addWire(connectedWire);

      const start = connectedWire.start;
      start.addWire(connectedWire);
      this.entityManager.adapter.connect(start.pinId, wireEntity.pinId);
    }

    // finally, set the wire point pending to undefined (finished its processing)
    this.wirePointPending = undefined;
  }

  drawWire(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
    if (this.wirePointPending === undefined) {
      return;
    }

    const wire = this.wirePointPending.wires[0];
    wire.draw(ctx, currTime, deltaTime);
  }

  drawWirePoint(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
    if (this.wirePointPending === undefined) {
      return;
    }

    this.wirePointPending.draw(ctx, currTime, deltaTime);
  }

  draw(ctx: CanvasRenderingContext2D, currTime: number, deltaTime: number) {
    this.drawWire(ctx, currTime, deltaTime);
    this.drawWirePoint(ctx, currTime, deltaTime);
  }
}