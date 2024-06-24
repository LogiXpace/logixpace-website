import { RGB, type Color } from './color';

const TRANSPARENT_COLOR = new RGB(0, 0, 0, 0);

export interface CanvasStyleConfig {
	fillColor?: Color;
	strokeColor?: Color;

	// line styles
	lineWidth?: number;
	lineType?: CanvasLineCap;
	lineJoin?: CanvasLineJoin;
	miterLimit?: number;
	lineDashOffset?: number;

	lineDash?: number[];
}

export class CanvasStyle {
	fillColor: Color;
	strokeColor: Color;

	// line styles
	lineWidth: number;
	lineType: CanvasLineCap;
	lineJoin: CanvasLineJoin;
	miterLimit: number;
	lineDashOffset: number;

	lineDash: number[];

	constructor({
		fillColor = TRANSPARENT_COLOR,
		strokeColor = TRANSPARENT_COLOR,

		lineWidth = 0,
		lineType = 'square',
		lineJoin = 'miter',
		miterLimit = 0,
		lineDashOffset = 0,
		lineDash = []
	}: CanvasStyleConfig) {
		this.fillColor = fillColor;
		this.strokeColor = strokeColor;

		this.lineWidth = lineWidth;
		this.lineType = lineType;
		this.lineJoin = lineJoin;
		this.miterLimit = miterLimit;

		this.lineDash = lineDash;
		this.lineDashOffset = lineDashOffset;
	}

	set(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.fillColor.string();
		ctx.strokeStyle = this.strokeColor.string();
		ctx.lineWidth = this.lineWidth;
		ctx.lineCap = this.lineType;
		ctx.lineJoin = this.lineJoin;
		ctx.miterLimit = this.miterLimit;
		ctx.lineDashOffset = this.lineDashOffset;

		ctx.setLineDash(this.lineDash);
	}

	apply(ctx: CanvasRenderingContext2D) {
		ctx.fill();
		ctx.stroke();
	}
}
