import type { PowerState } from './state';

export class NamedPin {
	id: number;
	name: string;
	powerState: PowerState;

	constructor(id: number, name: string, powerState: PowerState) {
		this.id = id;
		this.name = name;
		this.powerState = powerState;
	}
}
