type SimulationEvent = {
	id: string;
};

type SimulationEventCallback<T> = (data: T, event: SimulationEvent) => void;

export class SimulationEventListener<T> {
	private callback: SimulationEventCallback<T> | undefined = undefined;

	constructor(callback: SimulationEventCallback<T>) {
		this.callback = callback;
	}

	destroy() {
		this.callback = undefined;
	}

	recieve(data: T, event: SimulationEvent) {
		if (this.callback) {
			this.callback(data, event);
		}
	}

	isDestroyed() {
		return this.callback === undefined;
	}
}

export class SimulationEventEmitter<T> {
	private id: string;
	private listeners = new Set<SimulationEventListener<T>>();

	constructor(id: string) {
		this.id = id;
	}

	bind(listener: SimulationEventListener<T>) {
		this.listeners.add(listener);
	}

	remove(listener: SimulationEventListener<T>) {
		this.listeners.delete(listener);
	}

	emit(data: T) {
		const event: SimulationEvent = {
			id: this.id
		};

		for (const listener of this.listeners) {
			if (listener.isDestroyed()) {
				this.listeners.delete(listener);
			} else {
				listener.recieve(data, event);
			}
		}
	}
}

export class SimulationEventDispatcher {
	private emitters = new Map<string, SimulationEventEmitter<any>>();

	constructor() {}

	addEmiiter(id: string): SimulationEventEmitter<any> {
		if (this.emitters.has(id)) {
			throw new Error('emitter already has the emitter specifically set');
		}

		const emitter = new SimulationEventEmitter(id);
		this.emitters.set(id, emitter);

		return emitter;
	}

	listen(id: string, listener: SimulationEventListener<any>) {
		const emitter = this.emitters.get(id);
		if (emitter !== undefined) {
			emitter.bind(listener);
		}
	}

	remove(id: string, listener: SimulationEventListener<any>) {
		const emitter = this.emitters.get(id);
		if (emitter !== undefined) {
			emitter.remove(listener);
		}
	}

	dispatch(id: string, data: any) {
		const emitter = this.emitters.get(id);
		if (emitter !== undefined) {
			emitter.emit(data);
		}
	}
}
