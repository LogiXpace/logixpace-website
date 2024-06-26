import type { PowerState } from './state';

export interface NamedPinProps<T> {
	id: T;
	name: string;
	powerState: PowerState;
}

export class NamedPin<T> {
	id: T;
	name: string;
	powerState: PowerState;

	constructor({ id, name, powerState }: NamedPinProps<T>) {
		this.id = id;
		this.name = name;
		this.powerState = powerState;
	}
}
