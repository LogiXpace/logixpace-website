import type { ChipType } from './chip-types';
import { POWER_STATE_LOW, type PowerState } from './state';

export class Adapter<T> {
	#name: string;

	constructor(name: string) {
		this.#name = name;
	}

	get name(): string {
		return this.#name;
	}

	createPin(state: PowerState): T {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	createInputPin(state: PowerState): T {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	createOutputPin(state: PowerState): T {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	getPowerState(id: T): PowerState {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	setPowerState(id: T, state: PowerState): void {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	createChip(type: ChipType, inputIds: T[], outputIds: T[]): T | undefined {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	destroyPin(id: T): void {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	destroyChip(id: T, inputPinIds: T[], outputPinIds: T[]): void {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	connect(start: T, end: T): void {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	disconnect(start: T, end: T): void {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}

	update(): void {
		// TODO: implement in the child class
		throw new Error('Not implemented');
	}
}
