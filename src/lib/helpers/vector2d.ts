export class Vector2D {
	x: number;
	y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	clone() {
		return new Vector2D(this.x, this.y);
	}

	copy(otherVector: Vector2D): Vector2D {
		this.x = otherVector.x;
		this.y = otherVector.y;

		return this;
	}

	addVector(otherVector: Vector2D): Vector2D {
		this.x += otherVector.x;
		this.y += otherVector.y;

		return this;
	}

	addScalar(scalar: number): Vector2D {
		this.x += scalar;
		this.y += scalar;

		return this;
	}

	subVector(otherVector: Vector2D): Vector2D {
		this.x -= otherVector.x;
		this.y -= otherVector.y;

		return this;
	}

	subScalar(scalar: number): Vector2D {
		this.x -= scalar;
		this.y -= scalar;

		return this;
	}

	multVector(otherVector: Vector2D): Vector2D {
		this.x *= otherVector.x;
		this.y *= otherVector.y;

		return this;
	}

	multScalar(scalar: number): Vector2D {
		this.x *= scalar;
		this.y *= scalar;

		return this;
	}

	divVector(otherVector: Vector2D): Vector2D {
		if (otherVector.x !== 0) {
			this.x /= otherVector.x;
		} else {
			this.x = 0;
		}

		if (otherVector.y !== 0) {
			this.y /= otherVector.y;
		} else {
			this.y = 0;
		}

		return this;
	}

	divScalar(scalar: number): Vector2D {
		if (scalar !== 0) {
			this.x /= scalar;
			this.y /= scalar;
		} else {
			this.x = 0;
			this.y = 0;
		}

		return this;
	}

	magnitude(): number {
		return this.x * this.x + this.y * this.y;
	}

	dot(otherVector: Vector2D): number {
		return this.x * otherVector.x + this.y * otherVector.y;
	}

	length(): number {
		return Math.sqrt(this.magnitude());
	}

	normalize(): Vector2D {
		return this.divScalar(this.length());
	}

	distanceToSquared(otherVector: Vector2D): number {
		const dx = this.x - otherVector.x;
		const dy = this.y - otherVector.y;
		return dx * dx + dy * dy;
	}

	distanceTo(otherVector: Vector2D): number {
		return Math.sqrt(this.distanceToSquared(otherVector));
	}

	/**
	 * checks whether the vector is equal to another vector
	 */
	equals(otherVector: Vector2D): boolean {
		return this.x === otherVector.x && this.y === otherVector.y;
	}
}
