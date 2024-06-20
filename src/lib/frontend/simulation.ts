import { clearCanvas } from '$lib/helpers/draw';
import { MouseInput } from '$lib/helpers/mouse-input';
import { Vector2D } from '$lib/helpers/vector2d';
import { NamedPin } from './named-pin';
import { Pin } from './pin';

export class Simulation {
	private ctx: CanvasRenderingContext2D;
	private pins: Pin[] = [];

	private offset: Vector2D;
	private scale: number;
	private scaleFactor: number;

	private mouseInput = new MouseInput();

	constructor(ctx: CanvasRenderingContext2D, offset: Vector2D, scale: number, scaleFactor: number) {
		this.ctx = ctx;
		this.offset = offset.clone();
		this.scale = scale;
		this.scaleFactor = scaleFactor;

		for (let i = 0; i < 100; i++) {
			this.pins.push(
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
	}

	destroy() {
		this.ctx.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
		this.ctx.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
		this.ctx.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
	}

	handleMouseDown(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseDown(mouseEvent);
	}

	handleMouseUp(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseUp(mouseEvent);
	}

	handleMouseMove(mouseEvent: MouseEvent) {
		this.mouseInput.handleMouseMove(mouseEvent);
	}

	draw() {
		clearCanvas(this.ctx);

		for (let i = 0; i < this.pins.length; i++) {
			const pin = this.pins[i];
			pin.draw(this.ctx);
		}
	}
}
