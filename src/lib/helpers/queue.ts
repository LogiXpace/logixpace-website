type SingleLinkedItem<T> = {
	value: T;
	next: SingleLinkedItem<T> | undefined;
};

export class Queue<T> {
	#head: SingleLinkedItem<T> | undefined = undefined;

	#tail: SingleLinkedItem<T> | undefined = undefined;

	#size: number = 0;

	constructor() {}

	get size() {
		return this.#size;
	}

	merge(queue: Queue<T>) {
		if (queue.size === 0) {
			return;
		}

		const head = queue.#head;
		const tail = queue.#tail;

		if (this.#head === undefined) {
			this.#head = head;
			this.#tail = tail;
			return;
		}

		this.#tail.next = head;
		this.#tail = tail;
	}

	/**
	 *
	 * @param value - the value to add
	 */
	enqueue(value: T) {
		const link = { value, next: undefined };

		// @ts-ignore
		this.#tail = this.#head ? (this.#tail.next = link) : (this.#head = link);

		this.#size++;
	}

	dequeue(): T | undefined {
		if (this.#head) {
			const value = this.#head.value;
			this.#head = this.#head.next;
			this.#size--;
			return value;
		}

		return undefined;
	}

	peek(): T | undefined {
		if (this.#head) {
			return this.#head.value;
		}

		return undefined;
	}
}
