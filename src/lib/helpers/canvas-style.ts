import type { Color } from './color';

export interface CanvasStyleConfig {
	fillColor?: Color;
	strokeColor?: Color;

	// line styles
	lineWidth?: number;
	lineType?: CanvasLineCap;
	lineJoin?: CanvasLineJoin;
	miterLimit?: number;
	lineDashOffset?: number;
}

export class CanvasStyle {
	fillColor: Color | undefined = undefined;
	strokeColor: Color | undefined = undefined;

	// line styles
	lineWidth: number | undefined = undefined;
	lineType: CanvasLineCap | undefined = undefined;
	lineJoin: CanvasLineJoin | undefined = undefined;
	miterLimit: number | undefined = undefined;
	lineDashOffset: number | undefined = undefined;

	constructor({
		fillColor,
		strokeColor,

		lineWidth,
		lineType,
		lineJoin,
		miterLimit,
		lineDashOffset
	}: CanvasStyleConfig) {
		this.fillColor = fillColor;
		this.strokeColor = strokeColor;

		this.lineWidth = lineWidth;
		this.lineType = lineType;
		this.lineJoin = lineJoin;
		this.miterLimit = miterLimit;
		this.lineDashOffset = lineDashOffset;
	}

	set(ctx: CanvasRenderingContext2D) {
		if (this.fillColor) {
			ctx.fillStyle = this.fillColor.string();
		}

		if (this.strokeColor) {
			ctx.strokeStyle = this.strokeColor.string();
		}

		if (this.lineWidth) {
			ctx.lineWidth = this.lineWidth;
		}

		if (this.lineType) {
			ctx.lineCap = this.lineType;
		}

		if (this.lineJoin) {
			ctx.lineJoin = this.lineJoin;
		}

		if (this.miterLimit) {
			ctx.miterLimit = this.miterLimit;
		}

		if (this.lineDashOffset) {
			ctx.lineDashOffset = this.lineDashOffset;
		}
	}

	apply(ctx: CanvasRenderingContext2D) {
		if (this.fillColor) {
			ctx.fill();
		}

		if (
			this.strokeColor ||
			this.lineWidth ||
			this.lineType ||
			this.lineJoin ||
			this.miterLimit ||
			this.lineDashOffset
		) {
			ctx.stroke();
		}
	}
}
