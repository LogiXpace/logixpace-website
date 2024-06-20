import { Vector2D } from './vector2d';

export class MouseInput {
	prevMouseMovePosition = new Vector2D();
	mouseMovePosition = new Vector2D();

	prevMouseDownPosition = new Vector2D();
	mouseDownPosition = new Vector2D();

	prevMouseUpPosition = new Vector2D();
	mouseUpPosition = new Vector2D();

	prevMouseScrollPosition = new Vector2D();
	mouseScrollPosition = new Vector2D();

	deltaMouseDownMovePosition = new Vector2D();

	isMouseDown = false;
	isMouseMoving = false;
	isMouseLeftDown = false;
	isMouseRightDown = false;
	isScrolling = false;

	constructor() {}

	handleMouseDown(mouseEvent: MouseEvent) {
		this.isMouseDown = true;
		this.prevMouseDownPosition.copy(this.mouseDownPosition);
		this.mouseDownPosition.x = mouseEvent.offsetX;
		this.mouseDownPosition.y = mouseEvent.offsetY;

		if (mouseEvent.button === 0) {
			this.isMouseLeftDown = true;
		} else if (mouseEvent.button === 2) {
			this.isMouseRightDown = true;
		}
	}

	handleMouseUp(mouseEvent: MouseEvent) {
		this.isMouseDown = false;
		this.prevMouseUpPosition.copy(this.mouseUpPosition);
		this.mouseUpPosition.x = mouseEvent.offsetX;
		this.mouseUpPosition.y = mouseEvent.offsetY;

		if (mouseEvent.button === 0) {
			this.isMouseLeftDown = false;
		} else if (mouseEvent.button === 2) {
			this.isMouseRightDown = false;
		}
	}

	handleMouseMove(mouseEvent: MouseEvent) {
		this.prevMouseMovePosition.copy(this.mouseMovePosition);
		this.deltaMouseDownMovePosition
			.copy(this.mouseDownPosition)
			.subVector(this.prevMouseDownPosition);

		if (
			this.prevMouseDownPosition.x === mouseEvent.offsetX &&
			this.prevMouseDownPosition.y === mouseEvent.offsetY
		) {
			this.isMouseMoving = false;
			return;
		}

		this.mouseMovePosition.x = mouseEvent.offsetX;
		this.mouseMovePosition.y = mouseEvent.offsetY;
		this.isMouseMoving = true;
	}

	handleScroll(scrollEvent: WheelEvent) {
		this.isScrolling = true;
		this.prevMouseScrollPosition.copy(this.mouseScrollPosition);
		this.mouseScrollPosition.x = scrollEvent.x;
		this.mouseScrollPosition.x = scrollEvent.y;
	}

	handleScrollEnd() {
		this.isScrolling = false;
	}
}
