type SimulationEvent<T> = {
	id: string;
	data: T;
};

type SimulationEventCallback<T> = (event: SimulationEvent<T>) => void;

export class SimulationEventListener<T> {
	private callback: SimulationEventCallback<T> | undefined = undefined;

	constructor(callback: SimulationEventCallback<T>) {
		this.callback = callback;
	}

	destroy() {
		this.callback = undefined;
	}

	recieve(event: SimulationEvent<T>) {
		if (this.callback) {
			this.callback(event);
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

	delete(listener: SimulationEventListener<T>) {
		this.listeners.delete(listener);
	}

	emit(data: T) {
		const event: SimulationEvent<T> = {
			id: this.id,
			data
		};

		for (const listener of this.listeners) {
			if (listener.isDestroyed()) {
				this.listeners.delete(listener);
			} else {
				listener.recieve(event);
			}
		}
	}
}

export class SimulationEventDispatcher {
	private emiiters = new Map<string, SimulationEventEmitter<any>>();

	constructor() {}

	getEmitter(id: string) {
		return this.emiiters.get(id);
	}

	addEmiiter(id: string): SimulationEventEmitter<any> {
		if (this.emiiters.has(id)) {
			throw new Error('emiiter already has the emiiter specifically set');
		}

		const emiiter = new SimulationEventEmitter(id);
		this.emiiters.set(id, emiiter);

		return emiiter;
	}
}
