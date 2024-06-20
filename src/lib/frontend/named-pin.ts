// import type { Pin } from "../core/pin";

type Pin = any;

export class NamedPin {
	name: string;
	backendPin: Pin;

	constructor(name: string, backendPin: Pin) {
		this.name = name;
		this.backendPin = backendPin;
	}
}
