import { Vector2D } from './vector2d';

export class MouseInput {
	prevMovePosition = new Vector2D();
	movePosition = new Vector2D();

	prevDownPosition = new Vector2D();
	downPosition = new Vector2D();

	prevUpPosition = new Vector2D();
	upPosition = new Vector2D();

	prevwheelPosition = new Vector2D();
	wheelPosition = new Vector2D();

	isDown = false;
	isMoving = false;
	isLeftDown = false;
	isRightDown = false;
	isWheeling = false;

	constructor() {}

	handleMouseDown(mouseEvent: MouseEvent) {
		this.isDown = true;
		this.prevDownPosition.copy(this.downPosition);
		this.downPosition.x = mouseEvent.offsetX;
		this.downPosition.y = mouseEvent.offsetY;

		if (mouseEvent.button === 0) {
			this.isLeftDown = true;
		} else if (mouseEvent.button === 2) {
			this.isRightDown = true;
		}
	}

	handleMouseUp(mouseEvent: MouseEvent) {
		this.isDown = false;
		this.prevUpPosition.copy(this.upPosition);
		this.upPosition.x = mouseEvent.offsetX;
		this.upPosition.y = mouseEvent.offsetY;

		if (mouseEvent.button === 0) {
			this.isLeftDown = false;
		} else if (mouseEvent.button === 2) {
			this.isRightDown = false;
		}
	}

	handleMouseMove(mouseEvent: MouseEvent) {
		this.prevMovePosition.copy(this.movePosition);

		if (
			this.prevDownPosition.x === mouseEvent.offsetX &&
			this.prevDownPosition.y === mouseEvent.offsetY
		) {
			this.isMoving = false;
			return;
		}

		this.movePosition.x = mouseEvent.offsetX;
		this.movePosition.y = mouseEvent.offsetY;
		this.isMoving = true;
	}

	handleWheel(WheelEvent: WheelEvent) {
		this.isWheeling = true;
		this.prevwheelPosition.copy(this.wheelPosition);
		this.wheelPosition.x = WheelEvent.x;
		this.wheelPosition.x = WheelEvent.y;
	}

	handleWheelEnd() {
		this.isWheeling = false;
	}
}
