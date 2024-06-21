import { Vector2D } from './vector2d';

export function calculateBoxFromTwoPoint(
	start: Vector2D,
	end: Vector2D
): { position: Vector2D; width: number; height: number } {
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
