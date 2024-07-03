import { describe, expect, test } from 'vitest';
import { BoxCollider, LineCollider } from './colliders';
import { Vector2D } from './vector2d';

describe('collider test', () => {
	describe('should expect collision between', () => {
		test('line and line (perpendicular)', () => {
			const line1 = new LineCollider(new Vector2D(), new Vector2D(2, 2), 1);
			const line2 = new LineCollider(new Vector2D(0, 2), new Vector2D(2, 0), 1);

			expect(line1.isColliding(line2)).toStrictEqual(true);
		});

		test('line and line (simple)', () => {
			const line1 = new LineCollider(new Vector2D(), new Vector2D(2, 2), 1);
			const line2 = new LineCollider(new Vector2D(0, 3), new Vector2D(2, 1), 1);

			expect(line1.isColliding(line2)).toStrictEqual(true);
		});

		test('line and line (collinear and overlapping)', () => {
			const line1 = new LineCollider(new Vector2D(), new Vector2D(2, 2), 1);
			const line2 = new LineCollider(new Vector2D(1, 1), new Vector2D(3, 3), 1);

			expect(line1.isColliding(line2)).toStrictEqual(true);
		});

		test('box and line (non-parallel)', () => {
			const box = new BoxCollider(new Vector2D(0, 1), 1, 1);
			const line = new LineCollider(new Vector2D(-2, 0), new Vector2D(5, 1), 1);

			expect(box.isColliding(line)).toStrictEqual(false);
		});

		test('box and line (insisde)', () => {
			const box = new BoxCollider(new Vector2D(0, 0), 500, 1000);
			const line = new LineCollider(new Vector2D(-1, 5), new Vector2D(5, -1), 1);

			expect(box.isColliding(line)).toStrictEqual(true);
		});
	});

	describe('should expect no collision between', () => {
		test('line and line (collinear but disjoint)', () => {
			const line1 = new LineCollider(new Vector2D(), new Vector2D(2, 2), 1);
			const line2 = new LineCollider(new Vector2D(3, 3), new Vector2D(5, 5), 1);

			expect(line1.isColliding(line2)).toStrictEqual(false);
		});

		test('line and line (parallel)', () => {
			const line1 = new LineCollider(new Vector2D(), new Vector2D(2, 2), 1);
			const line2 = new LineCollider(new Vector2D(0, 1), new Vector2D(2, 3), 1);

			expect(line1.isColliding(line2)).toStrictEqual(false);
		});
	});
});
