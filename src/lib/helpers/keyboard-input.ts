export class KeyboardInput {
	private keysPressed: string[] = [];
	constructor() {}

	isTakingInput() {
		return this.keysPressed.length > 0;
	}

	isKeyCombinationPressed(keyCombination: string[]) {
		for (let i = 0; i < keyCombination.length; i++) {
			if (!this.isKeyPressed(keyCombination[i])) return false;
		}

		return true;
	}

	isKeyCombinationPressedOnly(keyCombination: string[]) {
		if (keyCombination.length !== this.keysPressed.length) return false;
		return this.isKeyCombinationPressed(keyCombination);
	}

	isKeyPressed(key: string) {
		return this.keysPressed.indexOf(key) !== -1;
	}

	handleKeyPressed(key: string) {
		if (this.isKeyPressed(key)) return;

		this.keysPressed.push(key);
	}

	handleKeyReleased(key: string) {
		const index = this.keysPressed.indexOf(key);
		if (index !== -1) {
			this.keysPressed.splice(index, 1);
		}
	}
}
