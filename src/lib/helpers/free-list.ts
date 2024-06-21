export class FreeList<T> {
	private data: T[] = [];
	private freeIndex: number = -1;
	private size = 0;

	constructor() {}

	get length(): number {
		return this.size;
	}

	empty(): boolean {
		return this.size === 0;
	}

	get(index: number): T {
		return this.data[index];
	}

	set(index: number, value: T) {
		this.data[index] = value;
	}

	pop(): T | undefined {
		if (this.data.length === 0) {
			return undefined;
		}

		const lastIndex = this.data.length - 1;
		const value = this.get(lastIndex);
		this.erase(lastIndex);
		return value;
	}

	insert(value: T): number {
		this.size++;
		
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
		this.size--;
		this.data[index] = this.freeIndex as T;
		this.freeIndex = index;
	}
}
