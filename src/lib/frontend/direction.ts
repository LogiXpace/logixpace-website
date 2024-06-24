import { Vector2D } from '$lib/helpers/vector2d';

export const DIRECTION: {
	LEFT: 0;
	RIGHT: 1;
	BOTTOM: 2;
	TOP: 3;
} = {
	LEFT: 0,
	RIGHT: 1,
	BOTTOM: 2,
	TOP: 3
};

export type Direction = 0 | 1 | 2 | 3;

export function getDirectionVector(direction: Direction, inverse = false) {
	switch (direction) {
		case DIRECTION['BOTTOM']:
			return new Vector2D(0, 1);

		case DIRECTION['TOP']:
			return new Vector2D(0, -1);

		case DIRECTION['LEFT']:
			return new Vector2D(-1, 0);

		case DIRECTION['RIGHT']:
			return new Vector2D(1, 0);
	}
}
