import type { CanvasStyle } from './canvas-style';

// Define a function to clear the canvas
export function clearCanvas(ctx: CanvasRenderingContext2D) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Function to draw a rectangle
export function drawRectangle(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	style: CanvasStyle
) {
	ctx.beginPath();
	style.set(ctx);
	ctx.rect(x, y, width, height);
	style.apply(ctx);
}

// Function to draw a circle
export function drawCircle(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	radius: number,
	style: CanvasStyle
) {
	ctx.beginPath();
	style.set(ctx);
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	style.apply(ctx);
}

export function drawLine(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	style: CanvasStyle
) {
	ctx.beginPath();
	style.set(ctx);
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	style.apply(ctx);
}
