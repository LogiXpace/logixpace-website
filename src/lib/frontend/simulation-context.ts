import { clearCanvas, drawCircle, drawRectangle } from '$lib/helpers/draw';
import { MouseInput } from '$lib/helpers/mouse-input';
import { Vector2D } from '$lib/helpers/vector2d';
import { NamedPin } from './named-pin';
import { Pin } from './pin';
import { CanvasStyle } from '$lib/helpers/canvas-style';
import { HSL, RGB } from '$lib/helpers/color';
import { QuadTree } from '$lib/helpers/quad-tree';
import { BoxCollider, PointCollider } from '$lib/helpers/colliders';
import { clamp } from '$lib/helpers/math';
import { DEFUALTS, EVENT_IDS, KEYBOARD_INPUTS } from './defaults';
import { IO, type IOProps } from './io';
import { DIRECTION } from '../helpers/direction';
import { KeyboardInput } from '$lib/helpers/keyboard-input';
import { WirePoint, type WirePointProps } from './wire-point';
import { Wire, type WireProps } from './wire';
import { SimulationEventListener } from './simulation-event';
import { getClosestPoint } from '$lib/helpers/shape';

const QUADTREE_MAX_CAPACITY = 10;
const QUADTREE_MAX_LEVEL = 15;
const QUADTREE_MAX_NUMBER_OF_VALUES = 1e2;
const QUADTREE_SIZE = 50 * QUADTREE_MAX_NUMBER_OF_VALUES;
const QUADTREE_POSITION = new Vector2D(-QUADTREE_SIZE / 2, -QUADTREE_SIZE / 2);

export interface SimulationContextProps {
	ctx: CanvasRenderingContext2D;
	offset: Vector2D;
	scale: number;
	scaleFactor: number;
}

type Entity = WirePoint | IO | Wire;
type HoverAndSelectEntity = WirePoint | IO;

export class SimulationContext {
	private ctx: CanvasRenderingContext2D;

	private ioTree: QuadTree<IO>;
	private ios: Set<IO> = new Set();

	private wirePointTree: QuadTree<WirePoint>;
	private wirePoints: Set<WirePoint> = new Set();

	private wireTree: QuadTree<Wire>;
	private wires: Set<Wire> = new Set();

	private selected = new Set<HoverAndSelectEntity>();

	private offset: Vector2D;
	private scale: number;
	private scaleFactor: number;

	private mouseInput = new MouseInput();
	private keyboardInput = new KeyboardInput();

	private hover: HoverAndSelectEntity | undefined = undefined;

	private isPanning = false;
	private isDragging = false;

	private wirePointPending: WirePoint | undefined = undefined;

	constructor({ ctx, offset, scale, scaleFactor }: SimulationContextProps) {
		this.ctx = ctx;
		this.offset = offset.clone();
		this.scale = scale;
		this.scaleFactor = scaleFactor;

		this.ioTree = new QuadTree(
			QUADTREE_MAX_LEVEL,
			QUADTREE_MAX_CAPACITY,
			QUADTREE_POSITION,
			QUADTREE_SIZE,
			QUADTREE_SIZE
		);
		this.wirePointTree = new QuadTree(
			QUADTREE_MAX_LEVEL,
			QUADTREE_MAX_CAPACITY,
			QUADTREE_POSITION,
			QUADTREE_SIZE,
			QUADTREE_SIZE
		);
		this.wireTree = new QuadTree(
			QUADTREE_MAX_LEVEL,
			QUADTREE_MAX_CAPACITY,
			QUADTREE_POSITION,
			QUADTREE_SIZE,
			QUADTREE_SIZE
		);

		const io1 = this.addIO({
			namedPin: new NamedPin(0, 'test', 0),
			position: new Vector2D(-100, 0),
			direction: DIRECTION.RIGHT
		});

		const io2 = this.addIO({
			namedPin: new NamedPin(1, 'test', 0),
			position: new Vector2D(100, 0),
			direction: DIRECTION.LEFT
		});

		const io3 = this.addIO({
			namedPin: new NamedPin(1, 'test', 0),
			position: new Vector2D(0, 100),
			direction: DIRECTION.TOP
		});

		const io4 = this.addIO({
			namedPin: new NamedPin(1, 'test', 0),
			position: new Vector2D(0, -100),
			direction: DIRECTION.BOTTOM
		});

		this.queryAll();

		this.initEvents();
	}

	queryAll() {
		const screenCollider = this.getScreenCollider();

		const start = performance.now();
		this.ios = this.ioTree.query(screenCollider);
		this.wirePoints = this.wirePointTree.query(screenCollider);
		this.wires = this.wireTree.query(screenCollider);
		const end = performance.now();

		console.group();
		console.log('querying time', end - start);
		console.log('ios.size', this.ios.size);
		console.log('wirePoints.size', this.wirePoints.size);
		console.log('wires.size', this.wires.size);
		console.groupEnd();
	}

	getScreenCollider() {
		return new BoxCollider(
			this.screenVectorToWorldVector(new Vector2D()),
			this.screenScalarToWorldScalar(this.ctx.canvas.width),
			this.screenScalarToWorldScalar(this.ctx.canvas.height)
		);
	}

	private initEvents() {
		this.ctx.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
		this.ctx.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
		this.ctx.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		this.ctx.canvas.addEventListener('wheel', this.handleWheel.bind(this));
		this.ctx.canvas.addEventListener('dblclick', this.handleDblClick.bind(this));
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	addIO(param: IOProps) {
		const io = new IO(param);
		this.ioTree.insert(io, io.bound);
		return io;
	}

	addWirePoint(param: WirePointProps) {
		const wirePoint = new WirePoint(param);
		this.wirePointTree.insert(wirePoint, wirePoint.collider);
		return wirePoint;
	}

	addWire(param: WireProps) {
		const wire = new Wire(param);
		this.wireTree.insert(wire, wire.collider);
		return wire;
	}

	destroy() {
		this.ctx.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
		this.ctx.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
		this.ctx.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
		this.ctx.canvas.removeEventListener('wheel', this.handleWheel.bind(this));
		this.ctx.canvas.removeEventListener('dblclick', this.handleDblClick.bind(this));
		window.removeEventListener('keydown', this.handleKeyDown.bind(this));
		window.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	handleKeyDown(e: KeyboardEvent) {
		this.keyboardInput.handleKeyPressed(e.key);
	}

	handleKeyUp(e: KeyboardEvent) {
		this.keyboardInput.handleKeyReleased(e.key);
	}

	handleDblClick(e: MouseEvent) {
		e.stopPropagation();

		this.mouseInput.handleMouseDown(e);
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.downPosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		if (this.wirePointPending === undefined) {
			const wire = this.wireTree.queryByPoint(mouseCollider);
			if (wire !== undefined) {
				// get the closest point to the line
				const closestPoint = getClosestPoint(
					mouseWorldPosition,
					wire.startPosition,
					wire.endPosition,
					DEFUALTS.WIRE_WIDTH
				);

				// make a new wire point on the closest point
				const closestWirePoint = this.addWirePoint({
					position: closestPoint // make sure it refrences the closest position
				});

				// add it to the scene to be able to be drawn
				this.wirePoints.add(closestWirePoint);

				// make two wires from the closest point
				// one the half next to point and the other half
				// luckily, we can reuse the wire that was collided as one of the half

				// wire that starts from the closest point and end at the collided wire end position
				const halfWire1 = this.addWire({
					start: closestWirePoint,
					startPosition: closestPoint,
					end: wire.end,
					endPosition: wire.endPosition,
				});

				// remove the connection from the end
				wire.end.removeWire(wire);

				// wire that starts from its original start position and ends at the closest point
				const halfWire2 = wire;
				halfWire2.endPosition = closestPoint;
				halfWire2.end = closestWirePoint;

				// add the connection to the closes wire point
				closestWirePoint.addWire(halfWire2);

				// delete and insert again to update it in the quad tree
				this.wireTree.remove(wire, wire.collider); // remove it with the old collider
				halfWire2.updateCollider(); // update the collider to reflect the new end position
				this.wireTree.insert(halfWire2, halfWire2.collider); // insert

				// add the half wire to the scene to be drawn.
				// no need to add the other half wire, because it was already on the screen to be able to be dblclicked
				this.wires.add(halfWire1);

				// assign a new wire point to become pending
				this.wirePointPending = new WirePoint({
					// IMPORTANT: to clone instead of refrencing, because it may also modify
					// other variables that refrenceing this position to changed when wire point pending is moving
					position: closestPoint.clone()
				});

				// create a new wire that is connecting the closest wire point to the wire point pending
				const connectedWirePending = new Wire({
					start: closestWirePoint,
					// IMPORTANT: refrence instead of clone, to be autoamatically drawn properly whenever the refrences is changed
					startPosition: closestPoint,
					end: this.wirePointPending,
					endPosition: this.wirePointPending.position
				});

				// add it to the scene to be drawn again
				this.wires.add(connectedWirePending);
			}
		}
	}

	handleMouseDown(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseDown(mouseEvent);
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.downPosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		if (this.mouseInput.isLeftDown) {
			if (this.hover === undefined) {
				if (this.wirePointPending !== undefined) {
					const wire = this.wireTree.queryByPoint(mouseCollider);
					if (wire !== undefined) {
						// get the closest point to the line
						const closestPoint = getClosestPoint(
							mouseWorldPosition,
							wire.startPosition,
							wire.endPosition,
							DEFUALTS.WIRE_WIDTH
						);

						// reuse the wire point pending as the closest wire point
						const closestWirePoint = this.wirePointPending;
						this.wirePointPending = undefined; // the wire point pending operation is fininshed

						// set the wire point pending position as the closest point position
						closestWirePoint.position = closestPoint;
						closestWirePoint.updateCollider(); // update the collider to reflect the updated position.
						this.wirePointTree.insert(closestWirePoint, closestWirePoint.collider); // add it into the qaud tree

						// add it to the scene to be able to be drawn
						this.wirePoints.add(closestWirePoint);

						// make two wires from the closest point
						// one the half next to point and the other half
						// luckily, we can reuse the wire that was collided as one of the half

						// wire that starts from the closest point and end at the collided wire end position
						const halfWire1 = this.addWire({
							start: closestWirePoint,
							startPosition: closestPoint,
							end: wire.end,
							endPosition: wire.endPosition,
						});

						// remove the connection from the end
						wire.end.removeWire(wire);

						// wire that starts from its original start position and ends at the closest point
						const halfWire2 = wire;
						halfWire2.endPosition = closestPoint;
						halfWire2.end = closestWirePoint;

						// add the connection to the closes wire point
						closestWirePoint.addWire(halfWire2);

						// delete and insert again to update it in the quad tree
						this.wireTree.remove(wire, wire.collider); // remove it with the old collider
						halfWire2.updateCollider(); // update the collider to reflect the new end position
						this.wireTree.insert(halfWire2, halfWire2.collider); // insert

						// add the half wire to the scene to be drawn.
						// no need to add the other half wire, because it was already on the screen to be able to be dblclicked
						this.wires.add(halfWire1);

						const connectedWirePending = closestWirePoint.wires[0];
						connectedWirePending.endPosition = closestPoint; // update the wire end position
						connectedWirePending.updateCollider(); // update the collider to reflect the updated position.
						this.wireTree.insert(connectedWirePending, connectedWirePending.collider); // at last, insert it into quad tree as it is no longer draged
					} else {
						const reservedWirePoint = this.wirePointPending;

						// insert it to the quad tree and add it to be drawn
						this.wirePointTree.insert(reservedWirePoint, reservedWirePoint.collider);
						this.wirePoints.add(reservedWirePoint);

						// update wire that is connected to it and insert into the quadtree
						const reservedwire = reservedWirePoint.wires[0];
						reservedwire.updateCollider();
						this.wireTree.insert(reservedwire, reservedwire.collider);

						// create a new wire point
						this.wirePointPending = new WirePoint({
							position: reservedWirePoint.position.clone()
						});

						// a wire connecting resserved wire point and the newly dragging wire point
						const wire = new Wire({
							start: reservedWirePoint,
							startPosition: reservedWirePoint.position,
							end: this.wirePointPending,
							endPosition: this.wirePointPending.position
						});

						// to be drawn, add it to the wires
						this.wires.add(wire);
					}
				} else {
					this.isPanning = true;
					this.deselect();
				}
			} else {
				if (this.hover instanceof IO && this.hover.isOutletHovering) {
					if (this.wirePointPending === undefined) {
						// create a new wire point
						this.wirePointPending = new WirePoint({
							position: this.hover.outletPosition.clone()
						});

						// a wire connecting resserved wire point and the newly dragging wire point
						const wire = new Wire({
							start: this.hover,
							startPosition: this.hover.outletPosition,
							end: this.wirePointPending,
							endPosition: this.wirePointPending.position
						});

						// to be drawn, add it to the wires
						this.wires.add(wire);
					} else {
						// get the connected wire to the wire point
						const connectedWire = this.wirePointPending.wires[0];

						// set the end position to the outlet position
						connectedWire.endPosition = this.hover.outletPosition;
						connectedWire.end = this.hover;

						// checks if the start and end are same
						if (connectedWire.startPosition === connectedWire.endPosition) {
							// delete the wire, wire that has the same start and end is not a wire.
							this.wires.delete(connectedWire);
						} else {
							// update the collider and insert it into the quadtree for future querying
							connectedWire.updateCollider();
							this.wireTree.insert(connectedWire, connectedWire.collider);

							// connect the wire with the io
							this.hover.addWire(connectedWire);
						}

						// finally, set the wire point pending to undefined (finished its processing)
						this.wirePointPending = undefined;
					}
				} else if (this.hover instanceof WirePoint && !this.keyboardInput.isKeyPressed('Control')) {
					if (this.wirePointPending === undefined) {
						// create a new wire point
						this.wirePointPending = new WirePoint({
							position: this.hover.position.clone()
						});

						// a wire connecting resserved wire point and the newly dragging wire point
						const wire = new Wire({
							start: this.hover,
							startPosition: this.hover.position,
							end: this.wirePointPending,
							endPosition: this.wirePointPending.position
						});

						// to be drawn, add it to the wires
						this.wires.add(wire);
					} else {
						// get the connected wire to the wire point
						const connectedWire = this.wirePointPending.wires[0];

						// set the end position to the outlet position
						connectedWire.endPosition = this.hover.position;
						connectedWire.end = this.hover;

						// checks if the start and end are same
						if (connectedWire.startPosition === connectedWire.endPosition) {
							// delete the wire, wire that has the same start and end is not a wire.
							this.wires.delete(connectedWire);
						} else {
							// update the collider and insert it into the quadtree for future querying
							connectedWire.updateCollider();
							this.wireTree.insert(connectedWire, connectedWire.collider);

							// connect the wire with the wire point
							this.hover.addWire(connectedWire);
						}

						// finally, set the wire point pending to undefined (finished its processing)
						this.wirePointPending = undefined;
					}
				} else {
					this.select(this.hover);
					this.isDragging = true;
				}
			}
		}
	}

	handleMouseUp(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseUp(mouseEvent);

		this.isPanning = false;
		this.isDragging = false;
	}

	moveWirePoint(wirePoint: WirePoint, delta: Vector2D) {
		this.wirePointTree.remove(wirePoint, wirePoint.collider);
		wirePoint.move(delta);
		this.wirePointTree.insert(wirePoint, wirePoint.collider);

		for (let i = 0; i < wirePoint.wires.length; i++) {
			const wire = wirePoint.wires[i];
			this.wireTree.remove(wire, wire.collider);
			wire.updateCollider();
			this.wireTree.insert(wire, wire.collider);
		}
	}

	moveIO(io: IO, delta: Vector2D) {
		this.ioTree.remove(io, io.bound);
		io.move(delta);
		this.ioTree.insert(io, io.bound);

		for (let i = 0; i < io.wires.length; i++) {
			const wire = io.wires[i];
			this.wireTree.remove(wire, wire.collider);
			wire.updateCollider();
			this.wireTree.insert(wire, wire.collider);
		}
	}

	handleMouseMove(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseMove(mouseEvent);
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.movePosition);

		const delta = mouseWorldPosition
			.clone()
			.subVector(this.screenVectorToWorldVector(this.mouseInput.prevMovePosition));

		if (this.wirePointPending !== undefined) {
			this.wirePointPending.position.copy(mouseWorldPosition);
			this.wirePointPending.updateCollider();
		}

		if (this.isPanning) {
			this.offset.addVector(delta);
			this.queryAll();
		} else if (this.isDragging) {
			for (const entity of this.selected) {
				if (entity instanceof IO) {
					this.moveIO(entity, delta);
				} else if (entity instanceof WirePoint) {
					this.moveWirePoint(entity, delta);
				}
			}
		} else {
			this.hover = this.getHover();
		}
	}

	handleWheel(scrollEvent: WheelEvent) {
		this.mouseInput.handleWheel(scrollEvent);

		const beforePosition = this.screenVectorToWorldVector(this.mouseInput.movePosition);

		this.scale *= 0.99;
		this.scale = clamp(this.scale, 0.4, 5);

		const afterPosition = this.screenVectorToWorldVector(this.mouseInput.movePosition);

		this.offset.addVector(beforePosition.subVector(afterPosition));
	}

	getHover(): HoverAndSelectEntity | undefined {
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.movePosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		let queried: HoverAndSelectEntity | undefined = this.ioTree.queryByPoint(mouseCollider);
		if (queried !== undefined && queried.checkHover(mouseCollider)) {
			return queried;
		}

		queried = this.wirePointTree.queryByPoint(mouseCollider);
		if (queried !== undefined && queried.checkHover(mouseCollider)) {
			return queried;
		}

		return undefined;
	}

	select(element: HoverAndSelectEntity) {
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.movePosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		if (this.selected.has(element)) {
			this.selected.delete(element);
			element.deselect();
			return;
		}

		this.selected.add(element);
		element.select(mouseCollider);
	}

	deselect() {
		for (const element of this.selected) {
			element.deselect();
		}

		this.selected.clear();
	}

	worldScalarToScreenScalar(worldScalar: number) {
		return worldScalar * this.scale;
	}

	worldVectorToScreenVector(worldVector: Vector2D) {
		return worldVector.clone().multScalar(this.scale).addVector(this.offset);
	}

	screenScalarToWorldScalar(screenScalar: number) {
		return screenScalar / this.scale;
	}

	screenVectorToWorldVector(screenVector: Vector2D) {
		return screenVector.clone().subVector(this.offset).divScalar(this.scale);
	}

	drawGrid() {
		const gridSize = this.worldScalarToScreenScalar(20);
		const gridRadius = this.worldScalarToScreenScalar(1);

		const gridWidth = this.screenScalarToWorldScalar(this.ctx.canvas.width);
		const gridHeight = this.screenScalarToWorldScalar(this.ctx.canvas.height);

		for (let x = this.offset.x % gridSize; x < gridWidth; x += gridSize) {
			for (let y = this.offset.y % gridSize; y < gridHeight; y += gridSize) {
				drawCircle(
					this.ctx,
					x,
					y,
					gridRadius,
					new CanvasStyle({
						fillColor: new RGB(25, 25, 25, 0.2)
					})
				);
			}
		}
	}

	drawEntities(currTime: number, deltaTime: number) {
		const wires = this.wires.difference(this.selected);
		for (const wire of wires) {
			wire.draw(this.ctx, currTime, deltaTime);
		}

		const wirePoints = this.wirePoints.difference(this.selected);
		for (const wirePoint of wirePoints) {
			wirePoint.draw(this.ctx, currTime, deltaTime);
		}

		const ios = this.ios.difference(this.selected);
		for (const io of ios) {
			io.draw(this.ctx, currTime, deltaTime);
		}

		for (const entity of this.selected) {
			entity.draw(this.ctx, currTime, deltaTime);
		}
	}

	applyZoomAndPan() {
		// apply zooming and paaning transformation
		this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offset.x, this.offset.y);
	}

	draw(currTime: number, deltaTime: number) {
		// reset the transformation to draw the grid.
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.drawGrid();

		this.applyZoomAndPan();
		drawRectangle(
			this.ctx,
			QUADTREE_POSITION.x,
			QUADTREE_POSITION.y,
			QUADTREE_SIZE,
			QUADTREE_SIZE,
			new CanvasStyle({
				strokeColor: new RGB(0, 0, 0)
			})
		);

		this.drawEntities(currTime, deltaTime);

		if (this.wirePointPending !== undefined) {
			this.wirePointPending.draw(this.ctx, currTime, deltaTime);
		}
	}

	update(currTime: number, deltaTime: number) {
		this.draw(currTime, deltaTime);

		this.ioTree.cleanup();
		this.wirePointTree.cleanup();
		this.wireTree.cleanup();
	}
}
