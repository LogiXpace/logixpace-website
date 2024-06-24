import { Vector2D } from './vector2d';
import { clamp } from './math';

const DEFAULT_COLLIDER_TYPES = {
	POINT_COLLIDER: 0,
	BOX_COLLIDER: 1,
	CIRCLE_COLLIDER: 2,
	LINE_COLLIDER: 3
};

type CollisionBetweenColliderFunction = (collider1: Collider, collider2: Collider) => boolean;

const COLLIDER_FUNCTIONS: { [K: string]: CollisionBetweenColliderFunction } = {};

type ColliderTypes = keyof typeof DEFAULT_COLLIDER_TYPES;

export class Collider {
	#type: ColliderTypes;

	constructor(type: ColliderTypes) {
		this.#type = type;
	}

	isColliding(otherCollider: Collider): boolean {
		const thisPriority = DEFAULT_COLLIDER_TYPES[this.#type];
		const otherPriority = DEFAULT_COLLIDER_TYPES[otherCollider.#type];
		let colliderFunction;

		let a: Collider;

		let b: Collider;

		if (thisPriority >= otherPriority) {
			a = otherCollider;
			b = this;

			colliderFunction = COLLIDER_FUNCTIONS[`${otherPriority}:${thisPriority}`];
		} else {
			a = this;
			b = otherCollider;

			colliderFunction = COLLIDER_FUNCTIONS[`${thisPriority}:${otherPriority}`];
		}

		const isColliding = colliderFunction(a, b);
		return isColliding;
	}
}

export class PointCollider extends Collider {
	position: Vector2D;

	constructor(position: Vector2D) {
		super('POINT_COLLIDER');
		this.position = position.clone();
	}
}

export class BoxCollider extends Collider {
	position: Vector2D;
	width: number;
	height: number;

	constructor(position: Vector2D, width: number, height: number) {
		super('BOX_COLLIDER');
		this.position = position.clone();
		this.width = width;
		this.height = height;
	}
}

export class LineCollider extends Collider {
	startPosition: Vector2D;
	endPosition: Vector2D;
	thickness: number;

	constructor(startPosition: Vector2D, endPosition: Vector2D, thickness: number) {
		super('LINE_COLLIDER');
		this.startPosition = startPosition.clone();
		this.endPosition = endPosition.clone();
		this.thickness = thickness;
	}
}

export class CircleCollider extends Collider {
	position: Vector2D;
	radius: number;

	constructor(position: Vector2D, radius: number) {
		super('CIRCLE_COLLIDER');
		this.position = position.clone();
		this.radius = radius;
	}
}

function collisionBetweenPoints(point1: PointCollider, point2: PointCollider) {
	return point1.position.x === point2.position.x && point1.position.y === point2.position.y;
}

function collisionBetweenBoxes(box1: BoxCollider, box2: BoxCollider) {
	const box1Position = box1.position;
	const box2Position = box2.position;

	return (
		box1Position.x < box2Position.x + box2.width &&
		box1Position.x + box1.width > box2Position.x &&
		box1Position.y < box2Position.y + box2.height &&
		box1Position.y + box1.height > box2Position.y
	);
}

function collisionBetweenCircles(circle1: CircleCollider, circle2: CircleCollider) {
	const diffX = circle1.position.x - circle2.position.x;
	const diffY = circle1.position.y - circle2.position.y;
	const length = Math.sqrt(diffX * diffX + diffY * diffY);
	return length <= circle1.radius + circle2.radius;
}

function pointOnLineSegment(
	px: number,
	py: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number
) {
	// Check if point (px, py) is on the line segment defined by (x1, y1) to (x2, y2)
	const dx = x2 - x1;
	const dy = y2 - y1;
	const epsilon = 1e-6; // Small tolerance for floating point comparison

	// Check if px and py are within the segment bounds
	const onSegment =
		px >= Math.min(x1, x2) - epsilon &&
		px <= Math.max(x1, x2) + epsilon &&
		py >= Math.min(y1, y2) - epsilon &&
		py <= Math.max(y1, y2) + epsilon;

	if (!onSegment) {
		return false;
	}

	// Check if the point is collinear with the line segment
	const crossProduct = (py - y1) * dx - (px - x1) * dy;
	if (Math.abs(crossProduct) > epsilon) {
		return false;
	}

	return true;
}

function collisionBetweenLines(line1: LineCollider, line2: LineCollider): boolean {
	const { x: x1, y: y1 } = line1.startPosition;
	const { x: x2, y: y2 } = line1.endPosition;
	const { x: x3, y: y3 } = line2.startPosition;
	const { x: x4, y: y4 } = line2.endPosition;

	// Calculate differences
	const dx1 = x2 - x1;
	const dy1 = y2 - y1;
	const dx2 = x4 - x3;
	const dy2 = y4 - y3;

	const dx = x3 - x1;
	const dy = y3 - y1;

	// Determinant to check parallel lines
	const denominator = dx1 * dy2 - dy1 * dx2;

	if (denominator === 0) {
		// Check if line1's start or end point is inside line2
		if (pointOnLineSegment(x1, y1, x3, y3, x4, y4) || pointOnLineSegment(x2, y2, x3, y3, x4, y4)) {
			return true;
		}

		// Check if line2's start or end point is inside line1
		if (pointOnLineSegment(x3, y3, x1, y1, x2, y2) || pointOnLineSegment(x4, y4, x1, y1, x2, y2)) {
			return true;
		}

		// Check if lines are coincident but do not overlap
		return false;
	}

	// Calculate uA and uB
	const t1 = (dx * dy2 - dy * dx2) / denominator;
	const t2 = (dx * dy1 - dy * dx1) / denominator;

	// Check if intersection point is within line segments
	if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
		return true; // Intersection detected
	}

	return false; // No intersection
}

function collisionBetweenPointAndBox(point: PointCollider, box: BoxCollider) {
	const pointPosition = point.position;
	const boxPosition = box.position;

	return (
		pointPosition.x <= boxPosition.x + box.width &&
		pointPosition.x >= boxPosition.x &&
		pointPosition.y <= boxPosition.y + box.height &&
		pointPosition.y >= boxPosition.y
	);
}

function collisionBetweenPointAndCircle(point: PointCollider, circle: CircleCollider) {
	const diffX = circle.position.x - point.position.x;
	const diffY = circle.position.y - point.position.y;
	const length = Math.sqrt(diffX * diffX + diffY * diffY);
	return length <= circle.radius;
}

function collisionBetweenPointAndLine(point: PointCollider, line: LineCollider) {
	const v = line.endPosition.clone().subVector(line.startPosition);
	const w = point.position.clone().subVector(line.startPosition);

	const dotProduct = w.dot(v);
	const vDotv = v.dot(v);

	const t = clamp(dotProduct / vDotv, 0, line.thickness);
	const closestPoint = line.startPosition.clone().addVector(v.multScalar(t));

	const d = point.position.distanceTo(closestPoint);

	return d <= line.thickness;
}

function collisionBetweenBoxAndCircle(box: BoxCollider, circle: CircleCollider) {
	let isIntersectingOutside = false;
	let isIntersectingInside = false;

	const right = box.position.x + box.width;
	const bottom = box.position.y + box.height;

	let tempPosition = circle.position.clone();
	tempPosition.x -= circle.radius;
	tempPosition.y += circle.radius;

	// top left checking
	isIntersectingOutside ||=
		tempPosition.x <= right &&
		tempPosition.x >= box.position.x &&
		tempPosition.y <= bottom &&
		tempPosition.y >= box.position.y;

	tempPosition.x = circle.position.x + circle.radius;
	tempPosition.y = circle.position.y + circle.radius;

	// top right checking
	isIntersectingOutside ||=
		tempPosition.x <= right &&
		tempPosition.x >= box.position.x &&
		tempPosition.y <= bottom &&
		tempPosition.y >= box.position.y;

	tempPosition.x = circle.position.x + circle.radius;
	tempPosition.y = circle.position.y - circle.radius;

	// bottom right checking
	isIntersectingOutside ||=
		tempPosition.x <= right &&
		tempPosition.x >= box.position.x &&
		tempPosition.y <= bottom &&
		tempPosition.y >= box.position.y;

	tempPosition.x = circle.position.x - circle.radius;
	tempPosition.y = circle.position.y - circle.radius;

	// bottom left checking
	isIntersectingOutside ||=
		tempPosition.x <= right &&
		tempPosition.x >= box.position.x &&
		tempPosition.y <= bottom &&
		tempPosition.y >= box.position.y;

	tempPosition.x = circle.position.x;
	tempPosition.y = circle.position.y + circle.radius;

	// top middle checking
	isIntersectingInside ||=
		tempPosition.x <= right &&
		tempPosition.x >= box.position.x &&
		tempPosition.y <= bottom &&
		tempPosition.y >= box.position.y;

	tempPosition.x = circle.position.x;
	tempPosition.y = circle.position.y - circle.radius;

	// bottom middle checking
	isIntersectingInside ||=
		tempPosition.x <= right &&
		tempPosition.x >= box.position.x &&
		tempPosition.y <= bottom &&
		tempPosition.y >= box.position.y;

	tempPosition.x = circle.position.x + circle.radius;
	tempPosition.y = circle.position.y;

	// right middle checking
	isIntersectingInside ||=
		tempPosition.x <= right &&
		tempPosition.x >= box.position.x &&
		tempPosition.y <= bottom &&
		tempPosition.y >= box.position.y;

	tempPosition.x = circle.position.x - circle.radius;
	tempPosition.y = circle.position.y;

	// left middle checking
	isIntersectingInside ||=
		tempPosition.x <= right &&
		tempPosition.x >= box.position.x &&
		tempPosition.y <= bottom &&
		tempPosition.y >= box.position.y;

	return isIntersectingInside && isIntersectingOutside;
}

function collisionBetweenBoxAndLine(box: BoxCollider, line: LineCollider) {
	if (
		collisionBetweenPointAndBox(new PointCollider(line.startPosition), box) ||
		collisionBetweenPointAndBox(new PointCollider(line.endPosition), box)
	) {
		return true;
	}

	const max = new Vector2D(box.position.x + box.width, box.position.y + box.height);

	const left = collisionBetweenLines(
		line,
		new LineCollider(
			new Vector2D(box.position.x, box.position.y),
			new Vector2D(box.position.x, max.y),
			1
		)
	);

	if (left) {
		return true;
	}

	const right = collisionBetweenLines(
		line,
		new LineCollider(new Vector2D(max.x, box.position.y), new Vector2D(max.x, max.y), 1)
	);

	if (right) {
		return true;
	}

	const top = collisionBetweenLines(
		line,
		new LineCollider(
			new Vector2D(box.position.x, box.position.y),
			new Vector2D(max.x, box.position.y),
			1
		)
	);

	if (top) {
		return true;
	}

	const bottom = collisionBetweenLines(
		line,
		new LineCollider(new Vector2D(box.position.x, max.y), new Vector2D(max.x, max.y), 1)
	);

	if (bottom) {
		return true;
	}

	return false;
}

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}`
] = collisionBetweenPoints;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}`
] = collisionBetweenPointAndBox;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['CIRCLE_COLLIDER']}`
] = collisionBetweenPointAndCircle;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['LINE_COLLIDER']}`
] = collisionBetweenPointAndLine;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}`
] = collisionBetweenBoxes;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['CIRCLE_COLLIDER']}`
] = collisionBetweenBoxAndCircle;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['LINE_COLLIDER']}`
] = collisionBetweenBoxAndLine;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['CIRCLE_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['CIRCLE_COLLIDER']}`
] = collisionBetweenCircles;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['LINE_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['LINE_COLLIDER']}`
] = collisionBetweenLines;
