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

export interface SimulationProps {
	ctx: CanvasRenderingContext2D;
	offset: Vector2D;
	scale: number;
	scaleFactor: number;
}

export class Simulation {
	private ctx: CanvasRenderingContext2D;
	private pins: QuadTree<Pin>;

	private offset: Vector2D;
	private scale: number;
	private scaleFactor: number;

	private mouseInput = new MouseInput();

	private hover: Pin | undefined = undefined;

	private isPanning = false;
	private isDragging = false;

	constructor({ ctx, offset, scale, scaleFactor }: SimulationProps) {
		this.ctx = ctx;
		this.offset = offset.clone();
		this.scale = scale;
		this.scaleFactor = scaleFactor;

		const size = 5100000;
		// -size / 2, -size / 2
		this.pins = new QuadTree(8, 20, new Vector2D(-size / 2, -size / 2), size, size);

		for (let i = 0; i < 100000; i++) {
			this.pins.insert(
				new Pin({
					namedPin: new NamedPin('test', 0),
					position: new Vector2D(i * 25, i * 25),
					direction: new Vector2D(i % 2 === 0 ? 1 : -1, 0)
				})
			);
		}

		this.initEvents();
	}

	private initEvents() {
		this.ctx.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
		this.ctx.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
		this.ctx.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		this.ctx.canvas.addEventListener('wheel', this.handleWheel.bind(this));
	}

	destroy() {
		this.ctx.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
		this.ctx.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
		this.ctx.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
		this.ctx.canvas.removeEventListener('wheel', this.handleWheel.bind(this));
	}

	handleMouseDown(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseDown(mouseEvent);

		if (this.mouseInput.isMouseLeftDown) {
			if (this.hover === undefined) {
				this.isPanning = true;
			} else {
				this.isDragging = true;
			}
		}
	}

	handleMouseUp(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseUp(mouseEvent);

		this.isPanning = false;
		this.isDragging = false;
	}

	handleMouseMove(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseMove(mouseEvent);
		const mouseWorldPosition = this.screenVectorToWorldVector(this.mouseInput.mouseMovePosition);
		const mouseCollider = new PointCollider(mouseWorldPosition);

		const delta = mouseWorldPosition
			.clone()
			.subVector(this.screenVectorToWorldVector(this.mouseInput.prevMouseMovePosition));

		if (this.isPanning) {
			this.offset.addVector(delta);
		} else if (this.isDragging) {
			this.hover = this.hover as Pin;
			this.pins.remove(this.hover);
			this.hover.move(delta);
			this.pins.insert(this.hover);
			// console.log(this.pins);
		} else {
			this.hover = this.pins.queryByPoint(mouseCollider);
		}
	}

	handleWheel(scrollEvent: WheelEvent) {
		this.mouseInput.handleWheel(scrollEvent);

		const beforePosition = this.screenVectorToWorldVector(this.mouseInput.mouseMovePosition);

		this.scale *= 0.99;
		this.scale = clamp(this.scale, 0.4, 5);

		const afterPosition = this.screenVectorToWorldVector(this.mouseInput.mouseMovePosition);

		this.offset.addVector(afterPosition.subVector(beforePosition));
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
		const gridSize = this.worldScalarToScreenScalar(50);
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
						fillColor: new RGB(25, 25, 25)
					})
				);
			}
		}
	}

	drawEntities() {
		const screenCollider = new BoxCollider(
			this.screenVectorToWorldVector(new Vector2D()),
			this.screenScalarToWorldScalar(this.ctx.canvas.width),
			this.screenScalarToWorldScalar(this.ctx.canvas.height)
		);

		const pins = this.pins.query(screenCollider);
		for (const pin of pins) {
			pin.draw(this.ctx);
		}
	}

	draw() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		this.drawGrid();
		this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offset.x, this.offset.y);

		drawRectangle(
			this.ctx,
			-5100000 / 2,
			-5100000 / 2,
			5100000,
			5100000,
			new CanvasStyle({
				strokeColor: new RGB(25, 25, 25)
			})
		);

		this.drawEntities();

		this.pins.cleanup();
	}
}
