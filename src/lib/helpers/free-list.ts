export class FreeList<T> {
	private data: T[] = [];
	private freeIndex: number = -1;

	constructor() {}

	get length(): number {
		return this.data.length;
	}

	empty(): boolean {
		return this.data.length === 0;
	}

	get(index: number): T {
		return this.data[index];
	}

	set(index: number, value: T) {
		this.data[index] = value;
	}

	pop(): T | undefined {
		if (this.empty()) {
			return undefined;
		}

		const lastIndex = this.data.length - 1;
		const value = this.get(lastIndex);
		this.erase(lastIndex);
		return value;
	}

	insert(value: T): number {
		if (this.freeIndex === -1) {
			const index = this.data.length;
			this.data.push(value);
			return index;
		}

		const index = this.freeIndex;
		this.freeIndex = this.data[index] as number;
		this.data[index] = value;
		return index;
	}

	erase(index: number) {
		this.data[index] = this.freeIndex as T;
		this.freeIndex = index;
	}
}
