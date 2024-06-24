import { clamp } from './math';
import { Vector2D } from './vector2d';

interface Box {
	position: Vector2D;
	width: number;
	height: number;
}

export function calculateBoxFromTwoPoint(start: Vector2D, end: Vector2D): Box {
	const diff = end.clone().subVector(start);

	let position = new Vector2D();
	let width = Math.abs(diff.x);
	let height = Math.abs(diff.y);

	if (diff.x > 0) {
		if (diff.y > 0) {
			position.copy(start);
		} else {
			position.copy(start);
			position.y -= height;
		}
	} else {
		if (diff.y > 0) {
			position.copy(start);
			position.x -= width;
		} else {
			position.copy(end);
		}
	}

	return {
		position,
		width,
		height
	};
}

export function calculateBoxTopLeftPositionFromCenterPosition(
	centerPosition: Vector2D,
	width: number,
	height: number
): Vector2D {
	const position = centerPosition.clone();
	position.x -= width / 2;
	position.y -= height / 2;

	return position;
}

export function getClosestPoint(
	point: Vector2D,
	start: Vector2D,
	end: Vector2D,
	thickness: number
) {
	const v = end.clone().subVector(start);
	const w = point.clone().subVector(start);

	const dotProduct = w.dot(v);
	const vDotv = v.dot(v);

	const t = clamp(dotProduct / vDotv, 0, thickness);
	const closestPoint = start.clone().addVector(v.multScalar(t));

	return closestPoint;
}
