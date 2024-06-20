type SimulationEvent<T> = T;

type SimulationEventCallback<T> = (event: SimulationEvent<T>) => void;

export class SimulationEventReceiver<T> {
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

export class SimulatuionEventEmitter<T> {
	private receivers = new Set<SimulationEventReceiver<T>>();

	constructor() {}

	addReceiver(receiver: SimulationEventReceiver<T>) {
		this.receivers.add(receiver);
	}

	deleteReceiver(receiver: SimulationEventReceiver<T>) {
		this.receivers.delete(receiver);
	}

	emit(event: SimulationEvent<T>) {
		for (const receiver of this.receivers) {
			if (receiver.isDestroyed()) {
				this.receivers.delete(receiver);
			} else {
				receiver.recieve(event);
			}
		}
	}
}
