import { clearCanvas, drawCircle, drawRectangle } from '$lib/helpers/draw';
import { MouseInput } from '$lib/helpers/mouse-input';
import { Vector2D } from '$lib/helpers/vector2d';
import { NamedPin, type NamedPinProps } from './named-pin';
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
import type { Adapter } from './adapter';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from './state';
import { Chip, type ChipProps } from './chip';
import { ChipPin, type ChipPinProps } from './chip-pin';
import type { ChipType } from './chip-types';
import { SimulationEntityManager } from './simulation-entity-manager';
import { SimulationCreatingWireManager } from './simulation-creating-wire-manager';

const QUADTREE_MAX_CAPACITY = 10;
const QUADTREE_MAX_LEVEL = 15;
const QUADTREE_MAX_NUMBER_OF_VALUES = 1e2;
const QUADTREE_SIZE = 5e5;

export interface SimulationContextProps<T> {
	ctx: CanvasRenderingContext2D;
	offset: Vector2D;
	scale: number;
	scaleFactor: number;
	adapter: Adapter<T>;
}

type HoverAndSelectEntity<T> = WirePoint<T> | IO<T> | Chip<T> | ChipPin<T>;

export class SimulationContext<T> {
	private ctx: CanvasRenderingContext2D;

	private entityManager: SimulationEntityManager<T>;
	private wireCreatingManager: SimulationCreatingWireManager<T>;

	private selected = new Set<HoverAndSelectEntity<T>>();

	private offset: Vector2D;
	private scale: number;
	private scaleFactor: number;

	private mouseInput = new MouseInput();
	private keyboardInput = new KeyboardInput();

	private hover: HoverAndSelectEntity<T> | undefined = undefined;

	private isPanning = false;
	private isDragging = false;

	private adapter: Adapter<T>;

	constructor({
		ctx,
		offset,
		scale,
		scaleFactor,
		adapter
	}: SimulationContextProps<T>) {
		this.ctx = ctx;
		this.offset = offset.clone();
		this.scale = scale;
		this.scaleFactor = scaleFactor;
		this.adapter = adapter;

		this.entityManager = new SimulationEntityManager({
			maxCapacity: QUADTREE_MAX_CAPACITY,
			maxLevel: QUADTREE_MAX_LEVEL,
			size: QUADTREE_SIZE,
			adapter
		});

		this.wireCreatingManager = new SimulationCreatingWireManager(this.entityManager);

		this.initEvents();
	}

	queryAll() {
		const screenCollider = this.getScreenCollider();

		const start = performance.now();
		this.entityManager.query(screenCollider);
		const end = performance.now();

		// console.group();
		// console.log('querying time', end - start);
		// console.log('ios.size', this.ios.size);
		// console.log('wirePoints.size', this.wirePoints.size);
		// console.log('wires.size', this.wires.size);
		// console.groupEnd();
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
		this.ctx.canvas.addEventListener('contextmenu', this.handleContextMenu.bind(this));
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	addIO(param: IOProps<T>) {
		const io = new IO(param);
		this.entityManager.insertIO(io);

		this.queryAll();

		return io;
	}

	addWirePoint(param: Omit<WirePointProps<T>, 'pinId'>) {
		const wirePoint = new WirePoint({ ...param, pinId: this.adapter.createPin(POWER_STATE_LOW) });
		this.entityManager.insertWirePoint(wirePoint);

		this.queryAll();

		return wirePoint;
	}

	addWire(param: WireProps<T>) {
		const wire = new Wire(param);
		this.entityManager.insertWire(wire);

		this.queryAll();

		return wire;
	}

	addChipPin(param: { namedPin: ChipPinProps<T>['namedPin'] }) {
		const chipPin = new ChipPin({ ...param, position: new Vector2D(), direction: DIRECTION.LEFT });
		this.entityManager.insertChipPin(chipPin);

		this.queryAll();

		return chipPin;
	}

	addChip(
		chipType: ChipType,
		inputNames: string[],
		outputNames: string[],
		param: Omit<ChipProps<T>, 'textWidth' | 'inputPins' | 'outputPins'>
	) {
		const inputPins: ChipPin<T>[] = new Array(inputNames.length);

		for (let i = 0; i < inputNames.length; i++) {
			inputPins[i] = this.addChipPin({
				namedPin: this.addNamedPin({ powerState: POWER_STATE_LOW, name: inputNames[i] })
			});
		}

		const outputPins: ChipPin<T>[] = new Array(outputNames.length);

		for (let i = 0; i < outputNames.length; i++) {
			outputPins[i] = this.addChipPin({
				namedPin: this.addNamedPin({ powerState: POWER_STATE_LOW, name: outputNames[i] })
			});
		}

		this.ctx.beginPath();
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillStyle = DEFUALTS.CHIP_FONT_COLOR;
		this.ctx.lineWidth = DEFUALTS.CHIP_FONT_STROKE_WIDTH;
		this.ctx.font = `${DEFUALTS.CHIP_FONT_SIZE}px ${DEFUALTS.CHIP_FONT_FAMILY}`;
		const measure = this.ctx.measureText(param.name);
		const textWidth = measure.width;

		const chip = new Chip({ ...param, inputPins, outputPins, textWidth });
		this.entityManager.insertChip(chip);
		this.adapter.createChip(
			chipType,
			inputPins.map((pin) => pin.namedPin.id),
			outputPins.map((pin) => pin.namedPin.id)
		);

		this.queryAll();

		return chip;
	}

	addNamedPin(param: Omit<NamedPinProps<T>, 'id'>) {
		const namedPin = new NamedPin({ ...param, id: this.adapter.createPin(param.powerState) });
		return namedPin;
	}

	destroy() {
		this.ctx.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
		this.ctx.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
		this.ctx.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
		this.ctx.canvas.removeEventListener('wheel', this.handleWheel.bind(this));
		this.ctx.canvas.removeEventListener('contextmenu', this.handleContextMenu.bind(this));
		this.ctx.canvas.removeEventListener('dblclick', this.handleDblClick.bind(this));
		window.removeEventListener('keydown', this.handleKeyDown.bind(this));
		window.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	handleKeyDown(e: KeyboardEvent) {
		this.keyboardInput.handleKeyPressed(e.key);
	}

	handleContextMenu(e: MouseEvent) {
		e.preventDefault();

		if (this.hover !== undefined) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}

	handleKeyUp(e: KeyboardEvent) {
		this.keyboardInput.handleKeyReleased(e.key);
	}

	handleDblClick(e: MouseEvent) {
		e.stopPropagation();

		this.mouseInput.handleMouseDown(e);
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.downPosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		if (!this.wireCreatingManager.isCreating()) {
			const wire = this.entityManager.queryWireByPoint(mouseCollider);
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
				this.entityManager.wirePointQueries.add(closestWirePoint);

				this.wireCreatingManager.createAndSplitOn(closestPoint, wire);
			}
		}
	}

	handleLeftMouseDown(
		mouseWorldPosition: Vector2D,
		mouseCollider: PointCollider
	) {
		if (this.hover === undefined) {
			if (this.wireCreatingManager.isCreating()) {
				const wire = this.entityManager.queryWireByPoint(mouseCollider);
				if (wire !== undefined) {
					// get the closest point to the line
					const closestPoint = getClosestPoint(
						mouseWorldPosition,
						wire.startPosition,
						wire.endPosition,
						DEFUALTS.WIRE_WIDTH
					);

					this.wireCreatingManager.createAndSplitOn(closestPoint, wire);
				} else {
					this.wireCreatingManager.create();
				}
			} else {
				this.isPanning = true;
				this.deselect();
			}
			return
		}

		if (
			(this.hover instanceof IO && this.hover.isOutletHovering) ||
			(this.hover instanceof ChipPin && this.hover.isOutletHovering)
		) {
			if (!this.wireCreatingManager.isCreating()) {
				this.wireCreatingManager.createOn(this.hover.outletPosition, this.hover);
			} else {
				this.wireCreatingManager.endOn(this.hover.outletPosition, this.hover);
			}
			return
		}

		if (this.hover instanceof WirePoint && !this.keyboardInput.isKeyPressed('Control')) {
			if (!this.wireCreatingManager.isCreating()) {
				this.wireCreatingManager.createOn(this.hover.position, this.hover);
			} else {
				this.wireCreatingManager.endOn(this.hover.position, this.hover);
			}
			return;
		}

		if (this.hover instanceof IO && this.keyboardInput.isKeyPressed('Shift')) {
			this.adapter.setPowerState(
				this.hover.namedPin.id,
				this.hover.namedPin.powerState === POWER_STATE_HIGH ? POWER_STATE_LOW : POWER_STATE_HIGH
			);
			return;
		}

		this.select(this.hover);
		this.isDragging = true;
	}

	handleMouseDown(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseDown(mouseEvent);
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.downPosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		if (this.mouseInput.isLeftDown) {
			this.handleLeftMouseDown(mouseWorldPosition, mouseCollider);
		} else if (this.mouseInput.isRightDown) {
			if (this.hover !== undefined) {
				if (this.hover instanceof Chip) {
					this.entityManager.destroyChip(this.hover);
				} else if (this.hover instanceof IO) {
					this.entityManager.destroyIO(this.hover);
				} else if (this.hover instanceof WirePoint) {
					this.entityManager.destroyWirePoint(this.hover);
				}

				this.hover = undefined;

				mouseEvent.stopPropagation();
				mouseEvent.stopImmediatePropagation();
			} else if (this.wireCreatingManager.isCreating()) {
				this.wireCreatingManager.delete();

				mouseEvent.stopPropagation();
				mouseEvent.stopImmediatePropagation();
			}
		}
	}

	handleMouseUp(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseUp(mouseEvent);

		this.isPanning = false;
		this.isDragging = false;
	}

	moveWirePoint(wirePoint: WirePoint<T>, delta: Vector2D) {
		this.entityManager.removeWirePoint(wirePoint);
		wirePoint.move(delta);
		this.entityManager.insertWirePoint(wirePoint);

		for (let i = 0; i < wirePoint.wires.length; i++) {
			const wire = wirePoint.wires[i];
			this.entityManager.removeWire(wire);
			wire.updateCollider();
			this.entityManager.insertWire(wire);
		}
	}

	moveIO(io: IO<T>, delta: Vector2D) {
		this.entityManager.removeIO(io);
		io.move(delta);
		this.entityManager.insertIO(io);

		for (let i = 0; i < io.wires.length; i++) {
			const wire = io.wires[i];
			this.entityManager.removeWire(wire);
			wire.updateCollider();
			this.entityManager.insertWire(wire);
		}
	}

	moveChip(chip: Chip<T>, delta: Vector2D) {
		this.entityManager.removeChip(chip);
		chip.move(delta);
		this.entityManager.insertChip(chip);

		for (let i = 0; i < chip.inputPins.length; i++) {
			this.entityManager.removeChipPin(chip.inputPins[i]);
			chip.inputPins[i].move(delta);
			this.entityManager.insertChipPin(chip.inputPins[i]);
		}

		for (let i = 0; i < chip.outputPins.length; i++) {
			this.entityManager.removeChipPin(chip.outputPins[i]);
			chip.outputPins[i].move(delta);
			this.entityManager.insertChipPin(chip.outputPins[i]);
		}
	}

	handleMouseMove(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseMove(mouseEvent);
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.movePosition);

		const delta = mouseWorldPosition
			.clone()
			.subVector(this.screenVectorToWorldVector(this.mouseInput.prevMovePosition));

		if (this.wireCreatingManager.isCreating()) {
			this.wireCreatingManager.setPosition(mouseWorldPosition);
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
				} else if (entity instanceof Chip) {
					this.moveChip(entity, delta);
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

	getHover(): HoverAndSelectEntity<T> | undefined {
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.movePosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		if (this.hover !== undefined) {
			if (this.hover.checkHover(mouseCollider)) {
				return this.hover;
			}
		}

		let queried: HoverAndSelectEntity<T> | undefined = this.entityManager.queryIOByPoint(mouseCollider);
		if (queried !== undefined && queried.checkHover(mouseCollider)) {
			return queried;
		}

		queried = this.entityManager.queryWirePointByPoint(mouseCollider)
		if (queried !== undefined && queried.checkHover(mouseCollider)) {
			return queried;
		}

		queried = this.entityManager.queryChipByPoint(mouseCollider)
		if (queried !== undefined && queried.checkHover(mouseCollider)) {
			return queried;
		}

		queried = this.entityManager.queryChipPinByPoint(mouseCollider)
		if (queried !== undefined && queried.checkHover(mouseCollider)) {
			return queried;
		}

		return undefined;
	}

	select(element: HoverAndSelectEntity<T>) {
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.movePosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		if (this.selected.has(element)) {
			this.selected.delete(element);
			element.deselect();
			return;
		}

		this.selected.add(element);
		// element.select(mouseCollider);
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
		const wires = this.entityManager.wireQueries.difference(this.selected);
		for (const wire of wires) {
			wire.draw(this.ctx, currTime, deltaTime);
		}

		const wirePoints = this.entityManager.wirePointQueries.difference(this.selected);
		for (const wirePoint of wirePoints) {
			wirePoint.draw(this.ctx, currTime, deltaTime);
		}

		const ios = this.entityManager.ioQueries.difference(this.selected);
		for (const io of ios) {
			io.draw(this.ctx, currTime, deltaTime);
		}

		const chipPins = this.entityManager.chipPinQueries.difference(this.selected);
		for (const chipPin of chipPins) {
			chipPin.draw(this.ctx, currTime, deltaTime);
		}

		const chips = this.entityManager.chipQueries.difference(this.selected);
		for (const chip of chips) {
			chip.draw(this.ctx, currTime, deltaTime);
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

		this.wireCreatingManager.drawWire(this.ctx, currTime, deltaTime);
		this.drawEntities(currTime, deltaTime);
		this.wireCreatingManager.drawWirePoint(this.ctx, currTime, deltaTime);
	}

	update(currTime: number, deltaTime: number) {
		this.adapter.update();
		this.entityManager.update();
		this.draw(currTime, deltaTime);
		this.entityManager.cleanup();
	}
}