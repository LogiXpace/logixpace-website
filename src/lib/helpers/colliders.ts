import { Vector2D } from './vector2d';
import { clamp } from './math';

const DEFAULT_COLLIDER_TYPES = {
	POINT_COLLIDER: 0,
	BOX_COLLIDER: 1,
	CIRCLE_COLLIDER: 2
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

/**
 * @implements {Collider}
 */
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

export class CircleCollider extends Collider {
	position: Vector2D;
	radius: number;

	constructor(position: Vector2D, radius: number) {
		super('CIRCLE_COLLIDER');
		this.position = position.clone();
		this.radius = radius;
	}
}

function collistionBetweenPoints(point1: PointCollider, point2: PointCollider) {
	return point1.position.x === point2.position.x && point1.position.y === point2.position.y;
}

function collisionBetweenBoxes(box1: BoxCollider, box2: BoxCollider) {
	return (
		box1.position.x < box2.position.x + box2.width &&
		box1.position.x + box1.width > box2.position.x &&
		box1.position.y < box2.position.y + box2.height &&
		box1.position.y + box1.height > box2.position.y
	);
}

function collistionBetweenCircles(circle1: CircleCollider, circle2: CircleCollider) {
	const diffX = circle1.position.x - circle2.position.x;
	const diffY = circle1.position.y - circle2.position.y;
	const length = Math.sqrt(diffX * diffX + diffY * diffY);
	return length <= circle1.radius + circle2.radius;
}

function collistionBetweenPointAndBox(point: PointCollider, box: BoxCollider) {
	return (
		point.position.x <= box.position.x + box.width &&
		point.position.x >= box.position.x &&
		point.position.y <= box.position.y + box.height &&
		point.position.y >= box.position.y
	);
}

function collistionBetweenPointAndCircle(point: PointCollider, circle: CircleCollider) {
	const diffX = circle.position.x - point.position.x;
	const diffY = circle.position.y - point.position.y;
	const length = Math.sqrt(diffX * diffX + diffY * diffY);
	return length <= circle.radius;
}

function collistionBetweenBoxAndCircle(box: BoxCollider, circle: CircleCollider) {
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

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}`
] = collistionBetweenPoints;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}`
] = collistionBetweenPointAndBox;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['POINT_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['CIRCLE_COLLIDER']}`
] = collistionBetweenPointAndCircle;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}`
] = collisionBetweenBoxes;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['BOX_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['CIRCLE_COLLIDER']}`
] = collistionBetweenBoxAndCircle;

// @ts-ignore
COLLIDER_FUNCTIONS[
	`${DEFAULT_COLLIDER_TYPES['CIRCLE_COLLIDER']}:${DEFAULT_COLLIDER_TYPES['CIRCLE_COLLIDER']}`
] = collistionBetweenCircles;
