import { Queue } from './queue';
import { BoxCollider, Collider, PointCollider } from './colliders';
import { FreeList } from './free-list';
import { Vector2D } from './vector2d';

export function calculateDimension(width: number, height: number, level: number) {
	const ratio = Math.pow(2, level);
	return new Vector2D(width * ratio, height * ratio);
}

export interface ColliderInterface {
	isColliding(collider: Collider): boolean;
}

interface QuadNodeConstructor {
	/**
	 * where to start the index to find its children. 0 when has no children.
	 */
	firstChildIndex?: number;

	/**
	 * the number of elements that this quad node has. -1 when has children.
	 */
	count?: number;

	/**
	 * the level of the quad node. 0 when the the quad node is a leaf
	 */
	level: number;

	/**
	 * the collider of the quad node
	 */
	collider: BoxCollider;

	/**
	 * the index of the element node, -1 when has no elements
	 */
	valueNodeIndex?: number;
}

class QuadNode {
	firstChildIndex: number;
	count: number;
	level: number;
	collider: BoxCollider;
	valueNodeIndex: number;

	constructor({
		firstChildIndex = 0,
		collider,
		count = 0,
		level,
		valueNodeIndex = -1
	}: QuadNodeConstructor) {
		this.firstChildIndex = firstChildIndex;
		this.collider = collider;
		this.level = level;
		this.count = count;
		this.valueNodeIndex = valueNodeIndex;
	}

	isLeaf(): boolean {
		return this.firstChildIndex === 0 || this.count !== -1;
	}

	isExceededCapacity(capacity: number) {
		return this.count >= capacity;
	}

	isLastLevel() {
		return this.level === 0;
	}
}

interface QuadValueNodeConstructor {
	/**
	 * the valueIndex of the elemet node (external data can use it)
	 */
	valueIndex: number;

	/**
	 * the next element node index
	 */
	nextIndex: number;

	/**
	 * the next element node index
	 */
	prevIndex: number;
}

class QuadValueNode {
	valueIndex: number;
	nextIndex: number;
	prevIndex: number;

	constructor({ prevIndex, valueIndex, nextIndex }: QuadValueNodeConstructor) {
		this.valueIndex = valueIndex;
		this.nextIndex = nextIndex;
		this.prevIndex = prevIndex;
	}

	isPrevQuadNode(): boolean {
		return this.prevIndex < 0;
	}

	getQuadNodeIndex(): number {
		return Math.abs(this.prevIndex + 1);
	}
}

class QuadValue<T> {
	value: T;
	nodeIndices: Set<number>;

	constructor(value: T) {
		this.value = value;
		this.nodeIndices = new Set();
	}
}

export class QuadTree<T extends ColliderInterface> {
	private quadValues = new FreeList<QuadValue<T>>();
	private quadNodes = new FreeList<QuadNode>();
	private quadValueNodes = new FreeList<QuadValueNode>();

	private maxCapacity: number;

	constructor(
		maxLevel: number,
		maxCapacity: number,
		position: Vector2D,
		width: number,
		height: number
	) {
		this.maxCapacity = maxCapacity;

		const rootQuadNode = new QuadNode({
			level: maxLevel,
			collider: new BoxCollider(position, width, height)
		});
		this.quadNodes.insert(rootQuadNode);
	}

	private removeQuadValueNode(quadValueNodeIndex: number) {
		/**
		 * how to handle the quad value node index when the quad value node is removed
		 * case 1: ... -> quadValueNode -> ...
		 * case 2: quadValueNode -> ...
		 * case 3: quadValueNode
		 */

		const quadValueNode = this.quadValueNodes.get(quadValueNodeIndex);

		// update the value node index of the quad node
		if (quadValueNode.nextIndex !== -1) {
			// case 1
			if (!quadValueNode.isPrevQuadNode()) {
				const prevQuadValueNode = this.quadValueNodes.get(quadValueNode.prevIndex);
				prevQuadValueNode.nextIndex = quadValueNode.nextIndex;

				const nextQuadValueNode = this.quadValueNodes.get(quadValueNode.nextIndex);
				nextQuadValueNode.prevIndex = quadValueNode.prevIndex;

				this.quadValueNodes.erase(quadValueNodeIndex);
			} else {
				const quadNodeIndex = quadValueNode.getQuadNodeIndex();
				const quadNode = this.quadNodes.get(quadNodeIndex);

				// case 2
				quadNode.valueNodeIndex = quadValueNode.nextIndex;
				quadNode.count--;

				const nextQuadValueNode = this.quadValueNodes.get(quadValueNode.nextIndex);
				nextQuadValueNode.prevIndex = quadValueNodeIndex;

				this.quadValueNodes.erase(quadValueNodeIndex);
			}
		} else {
			const quadNodeIndex = quadValueNode.getQuadNodeIndex();
			const quadNode = this.quadNodes.get(quadNodeIndex);

			this.quadValueNodes.erase(quadNode.valueNodeIndex);

			// case 3
			quadNode.valueNodeIndex = -1;
			quadNode.count--;
		}
	}

	private getRootNode(): QuadNode {
		return this.quadNodes.get(0);
	}

	private createChildren(quadNode: QuadNode) {
		const childWidth = quadNode.collider.width / 2;
		const childHeight = quadNode.collider.width / 2;

		const x1 = quadNode.collider.position.x;
		const x2 = quadNode.collider.position.x + childWidth;

		const y1 = quadNode.collider.position.y;
		const y2 = quadNode.collider.position.y + childHeight;

		const childLevel = quadNode.level - 1;

		// north east
		const northeast = new QuadNode({
			level: childLevel,
			collider: new BoxCollider(new Vector2D(x1, y1), childWidth, childHeight)
		});

		// north west
		const northwest = new QuadNode({
			level: childLevel,
			collider: new BoxCollider(new Vector2D(x2, y1), childWidth, childHeight)
		});

		// south east
		const southeast = new QuadNode({
			level: childLevel,
			collider: new BoxCollider(new Vector2D(x1, y2), childWidth, childHeight)
		});

		// south west
		const southwest = new QuadNode({
			level: childLevel,
			collider: new BoxCollider(new Vector2D(x2, y2), childWidth, childHeight)
		});

		quadNode.firstChildIndex = this.quadNodes.insert(northeast);
		this.quadNodes.insert(northwest);
		this.quadNodes.insert(southeast);
		this.quadNodes.insert(southwest);
	}

	private transferValuesToChildren(quadNode: QuadNode) {
		const processQueueQuadNode = new Queue<QuadNode>();
		// enqueue the quad node
		processQueueQuadNode.enqueue(quadNode);

		while (processQueueQuadNode.size > 0) {
			// dequeue the quad node
			const processQuadNode = processQueueQuadNode.dequeue() as QuadNode;
			let quadValueNodeIndex = processQuadNode.valueNodeIndex;

			processQuadNode.count = -1;
			processQuadNode.valueNodeIndex = -1;

			// loop through the quad value nodes
			while (quadValueNodeIndex !== -1) {
				const previosQuadValueNodeIndex = quadValueNodeIndex;
				const quadValueNode = this.quadValueNodes.get(quadValueNodeIndex);
				quadValueNodeIndex = quadValueNode.nextIndex;

				/**
				 * case 1: the value was transfered to one of the children
				 * case 2: the value was transfered to multiple children - need to create new quad value nodes
				 */

				const quadValue = this.quadValues.get(quadValueNode.valueIndex);
				let isAlreadyUsed = false;

				for (let i = 0; i < 4; i++) {
					const quadNodeIndex = processQuadNode.firstChildIndex + i;
					const quadNode = this.quadNodes.get(quadNodeIndex);

					// early check if the value is not colliding with the quad node
					if (!quadValue.value.isColliding(quadNode.collider)) {
						continue;
					}

					// check if the value was once used anywhere
					if (isAlreadyUsed) {
						// create a new quad value node
						const newQuadValueNode = new QuadValueNode({
							prevIndex: -quadNodeIndex - 1,
							valueIndex: quadValueNode.valueIndex,
							nextIndex: quadNode.valueNodeIndex
						});

						const prevQuadValueNode = this.quadValueNodes.get(quadNode.valueNodeIndex);
						prevQuadValueNode.prevIndex = this.quadValueNodes.insert(newQuadValueNode);

						// set the next index of the quad node
						quadNode.valueNodeIndex = prevQuadValueNode.prevIndex;
					} else {
						// backwardly reconnect the quad node
						quadValueNode.nextIndex = quadNode.valueNodeIndex;
						quadNode.valueNodeIndex = previosQuadValueNodeIndex;

						// mark the vale as used
						isAlreadyUsed = true;
					}

					// increase the count of the quad node
					quadNode.count++;

					// split the quad node if it has exceeded capacity
					if (this.isQuadNodeExceededCapacity(quadNode)) {
						// create children of the quad node
						this.createChildren(quadNode);

						// enqueue the the quad node for later processing
						processQueueQuadNode.enqueue(quadNode);
					}
				}
			}
		}
	}

	private split(quadNode: QuadNode) {
		this.createChildren(quadNode);
		this.transferValuesToChildren(quadNode);
	}

	private isQuadNodeExceededCapacity(quadNode: QuadNode): boolean {
		return quadNode.isExceededCapacity(this.maxCapacity) && !quadNode.isLastLevel();
	}

	private enqueueChildren(queueQuadNode: Queue<QuadNode>, index: number) {
		// enqueue the children of the quad node
		queueQuadNode.enqueue(this.quadNodes.get(index)); // north east
		queueQuadNode.enqueue(this.quadNodes.get(index + 1)); // north west
		queueQuadNode.enqueue(this.quadNodes.get(index + 2)); // south east
		queueQuadNode.enqueue(this.quadNodes.get(index + 3)); // south west
	}

	private enqueueChildrenIndices(queueQuadNodeIndices: Queue<number>, index: number) {
		// enqueue the children of the quad node
		queueQuadNodeIndices.enqueue(index); // north east
		queueQuadNodeIndices.enqueue(index + 1); // north west
		queueQuadNodeIndices.enqueue(index + 2); // south east
		queueQuadNodeIndices.enqueue(index + 3); // south west
	}

	private nodeInsert(quadNodeIndex: number, valueIndex: number) {
		const quadNode = this.quadNodes.get(quadNodeIndex);
		const quadValue = this.quadValues.get(valueIndex);

		// create a quad value node
		const quadValueNode = new QuadValueNode({
			prevIndex: -quadNodeIndex - 1,
			valueIndex: valueIndex,
			nextIndex: quadNode.valueNodeIndex
		});

		if (quadNode.valueNodeIndex !== -1) {
			const prevQuadValueNode = this.quadValueNodes.get(quadNode.valueNodeIndex);
			prevQuadValueNode.prevIndex = this.quadValueNodes.insert(quadValueNode);

			// set the value node index of the quad node
			quadNode.valueNodeIndex = prevQuadValueNode.prevIndex;
		} else {
			quadNode.valueNodeIndex = this.quadValueNodes.insert(quadValueNode);
		}

		quadValue.nodeIndices.add(quadNode.valueNodeIndex);

		// increase the count of the quad node
		quadNode.count++;

		// check if the quad node has exceeded capacity
		if (this.isQuadNodeExceededCapacity(quadNode)) {
			// split the quad node
			this.split(quadNode);
		}
	}

	multipleRootInsert(quadValues: T[]): (-1 | number)[] {
		const rootQuadNode = this.getRootNode();

		const valueIndexes: (-1 | number)[] = new Array(quadValues.length);
		let quadValueNodeIndex = -1;
		let lastQuadValueNodeIndex = -1;
		let count = 0;

		for (let i = 0; i < quadValues.length; i++) {
			const value = quadValues[i];
			if (value.isColliding(rootQuadNode.collider)) {
				const quadValue = new QuadValue(value);
				const valueIndex = this.quadValues.insert(quadValue);
				valueIndexes[i] = valueIndex;

				const quadValueNode = new QuadValueNode({
					prevIndex: 0,
					valueIndex: valueIndex,
					nextIndex: quadValueNodeIndex
				});

				if (quadValueNodeIndex === -1) {
					lastQuadValueNodeIndex = this.quadValueNodes.insert(quadValueNode);
					quadValueNodeIndex = lastQuadValueNodeIndex;
				} else {
					quadValueNode.prevIndex = quadValueNodeIndex;
					quadValueNodeIndex = this.quadValueNodes.insert(quadValueNode);
				}

				quadValue.nodeIndices.add(quadValueNodeIndex);

				count++;
			}
			{
				valueIndexes[i] = -1;
			}
		}

		if (count === 0) {
			return valueIndexes;
		}

		if (rootQuadNode.isLeaf()) {
			if (lastQuadValueNodeIndex !== -1) {
				const lastQuadValueNode = this.quadValueNodes.get(lastQuadValueNodeIndex);
				lastQuadValueNode.nextIndex = rootQuadNode.valueNodeIndex;

				const prevQuadValueNode = this.quadValueNodes.get(rootQuadNode.valueNodeIndex);
				prevQuadValueNode.prevIndex = lastQuadValueNodeIndex;
			}

			rootQuadNode.valueNodeIndex = quadValueNodeIndex;
			rootQuadNode.count += count;

			if (this.isQuadNodeExceededCapacity(rootQuadNode)) {
				this.split(rootQuadNode);
			}

			return valueIndexes;
		}

		// const processQueueQuadNode = new Queue<QuadNode>();
		// this.enqueueChildren(processQueueQuadNode, rootQuadNode.firstChildIndex);

		// const processQueueQuadNodeValueIndex: number[] = [];
		// processQueueQuadNodeValueIndex.push(quadValueNodeIndex);

		// while (
		//   processQueueQuadNode.size > 0 &&
		//   processQueueQuadNodeValueIndex.length > 0
		// ) {
		//   const quadNode = processQueueQuadNode.dequeue() as QuadNode;

		//   if (!quadNode.isLeaf()) {
		//     this.enqueueChildren(processQueueQuadNode, quadNode.firstChildIndex);
		//     continue;
		//   }

		//   const quadValueNodeIndex = processQueueQuadNodeValueIndex.pop() as number;
		//   let quadNodeCount = 0;

		//   let tempQuadValueNodeIndex = quadValueNodeIndex;
		//   while (tempQuadValueNodeIndex !== -1) {
		//     const quadValueNode = this.quadValueNodes.get(tempQuadValueNodeIndex);
		//     const value = this.quadValues.get(quadValueNode.valueIndex);
		//     const nextQuadValueNodeIndex = quadValueNode.nextIndex;

		//     if (value.isColliding(quadNode.collider)) {
		//       quadValueNode.nextIndex = quadNode.valueNodeIndex;
		//       quadNode.valueNodeIndex = tempQuadValueNodeIndex;
		//       quadNodeCount++;
		//     } else {
		//       if (processQueueQuadNodeValueIndex.length === 0) {
		//         quadNode.valueNodeIndex = -1;
		//       } else {
		//         const poppedQuadNodeValueIndex = processQueueQuadNodeValueIndex.pop() as number;
		//         quadValueNode.nextIndex = poppedQuadNodeValueIndex;
		//       }

		//       processQueueQuadNodeValueIndex.push(tempQuadValueNodeIndex);
		//     }

		//     tempQuadValueNodeIndex = nextQuadValueNodeIndex;
		//   }

		//   console.log(quadNodeCount)
		//   quadNode.count += quadNodeCount;
		//   // if (this.isQuadNodeExceededCapacity(quadNode)) {
		//   //   this.split(quadNode);
		//   // }
		// }

		return valueIndexes;
	}

	insert(value: T): -1 | number {
		const rootQuadNode = this.getRootNode();

		// early return if the value is not colliding with the root quad node
		if (!value.isColliding(rootQuadNode.collider)) {
			return -1;
		}

		// push the value to the quadValues array and get the value index
		const valueIndex = this.quadValues.insert(new QuadValue(value));

		// check if the root node is a leaf itself
		if (rootQuadNode.isLeaf()) {
			this.nodeInsert(0, valueIndex);
			return valueIndex;
		}

		const processQueueQuadNodeIndices = new Queue<number>();

		// enqueue the root quad node children
		this.enqueueChildrenIndices(processQueueQuadNodeIndices, rootQuadNode.firstChildIndex);

		while (processQueueQuadNodeIndices.size > 0) {
			// dequeue the quad node
			const quadNodeIndex = processQueueQuadNodeIndices.dequeue() as number;
			const quadNode = this.quadNodes.get(quadNodeIndex);

			// check is it colldiing with the quad node
			if (!value.isColliding(quadNode.collider)) {
				continue;
			}

			// check if it is a leaf
			if (quadNode.isLeaf()) {
				// insert the value to the quad node
				this.nodeInsert(quadNodeIndex, valueIndex);
				continue;
			}

			// enqueue the children of the quad node
			this.enqueueChildrenIndices(processQueueQuadNodeIndices, quadNode.firstChildIndex);
		}

		return valueIndex;
	}

	private getCollidingValues(quadNode: QuadNode, collider: Collider): T[] {
		const quadValues: T[] = [];

		// loop through the quad value nodes
		let quadValueNodeIndex = quadNode.valueNodeIndex;
		while (quadValueNodeIndex !== -1) {
			const quadValueNode = this.quadValueNodes.get(quadValueNodeIndex);
			const value = this.quadValues.get(quadValueNode.valueIndex).value;

			// check if the value is colliding with the collider
			if (value.isColliding(collider)) {
				quadValues.push(value);
			}

			// set the next index of the current quad value node
			quadValueNodeIndex = quadValueNode.nextIndex;
		}

		return quadValues;
	}

	private removeQuadValue(quadValueIndex: number) {
		const quadValue = this.quadValues.get(quadValueIndex);

		for (const quadValueNdeIndex of quadValue.nodeIndices) {
			this.removeQuadValueNode(quadValueNdeIndex);
		}

		this.quadValues.erase(quadValueIndex);
	}

	private nodeRemoveValue(quadNode: QuadNode, value: T) {
		// loop through the quad value nodes
		let quadValueNodeIndex = quadNode.valueNodeIndex;
		while (quadValueNodeIndex !== -1) {
			const quadValueNode = this.quadValueNodes.get(quadValueNodeIndex);
			const quadValue = this.quadValues.get(quadValueNode.valueIndex).value;

			// check if the value is the same
			if (value === quadValue) {
				// remove the value
				this.removeQuadValue(quadValueNode.valueIndex);
			}

			// set the next index of the current quad value node
			quadValueNodeIndex = quadValueNode.nextIndex;
		}
	}

	queryByPoint(pointCollider: PointCollider): T | undefined {
		const rootQuadNode = this.getRootNode();

		const processQueueQuadNode = new Queue<QuadNode>();

		// enqueue the root quad node
		processQueueQuadNode.enqueue(rootQuadNode);

		while (processQueueQuadNode.size > 0) {
			// dequeue the quad node
			const quadNode = processQueueQuadNode.dequeue() as QuadNode;

			// check is it colldiing with the quad node
			if (!pointCollider.isColliding(quadNode.collider)) {
				continue;
			}

			// check if it is a leaf
			if (quadNode.isLeaf()) {
				return this.getCollidingValues(quadNode, pointCollider)[0];
			}

			// enqueue the children of the quad node
			this.enqueueChildren(processQueueQuadNode, quadNode.firstChildIndex);
		}

		return undefined;
	}

	query(collider: Collider): Set<T> {
		const rootQuadNode = this.getRootNode();

		const processQueueQuadNode = new Queue<QuadNode>();

		// enqueue the root quad node
		processQueueQuadNode.enqueue(rootQuadNode);

		let quadValues = new Set<T>();

		while (processQueueQuadNode.size > 0) {
			// dequeue the quad node
			const quadNode = processQueueQuadNode.dequeue() as QuadNode;

			// check is it colldiing with the quad node
			if (!collider.isColliding(quadNode.collider)) {
				continue;
			}

			// check if it is a leaf
			if (quadNode.isLeaf()) {
				quadValues = quadValues.union(new Set(this.getCollidingValues(quadNode, collider)));
				continue;
			}

			// enqueue the children of the quad node
			this.enqueueChildren(processQueueQuadNode, quadNode.firstChildIndex);
		}

		return quadValues;
	}

	remove(value: T) {
		const rootQuadNode = this.getRootNode();
		const processQueueQuadNode = new Queue<QuadNode>();

		// enqueue the root quad node
		processQueueQuadNode.enqueue(rootQuadNode);

		while (processQueueQuadNode.size > 0) {
			// dequeue the quad node
			const quadNode = processQueueQuadNode.dequeue() as QuadNode;

			// check is it colldiing with the quad node
			if (!value.isColliding(quadNode.collider)) {
				continue;
			}

			// check if it is a leaf
			if (quadNode.isLeaf()) {
				this.nodeRemoveValue(quadNode, value);
				continue;
			}

			// enqueue the children of the quad node
			this.enqueueChildren(processQueueQuadNode, quadNode.firstChildIndex);
		}

		return false;
	}

	cleanup() {
		const rootQuadNode = this.getRootNode();
		const processQuadNodes: QuadNode[] = [];

		// enqueue the root quad node to process
		processQuadNodes.push(rootQuadNode);

		while (processQuadNodes.length > 0) {
			// dequeue the quad node
			const quadNode = processQuadNodes.pop() as QuadNode;

			// check if it is a leaf
			if (quadNode.isLeaf()) {
				continue;
			}

			let numberOfEmpty = 0;
			for (let i = 0; i < 4; i++) {
				const child = this.quadNodes.get(quadNode.firstChildIndex + i);

				// check if the child is empty
				if (child.count === 0) {
					// increase the number of empty children
					numberOfEmpty++;
				}
			}

			// check if all the children are empty
			if (numberOfEmpty === 4) {
				// remove the children
				this.quadNodes.erase(quadNode.firstChildIndex);
				this.quadNodes.erase(quadNode.firstChildIndex + 1);
				this.quadNodes.erase(quadNode.firstChildIndex + 2);
				this.quadNodes.erase(quadNode.firstChildIndex + 3);

				// reset the quad node
				quadNode.firstChildIndex = 0;
				quadNode.count = 0;
				quadNode.valueNodeIndex = -1;

				continue;
			}

			// enqueue the children of the quad node
			processQuadNodes.push(this.quadNodes.get(quadNode.firstChildIndex)); // north east
			processQuadNodes.push(this.quadNodes.get(quadNode.firstChildIndex + 1)); // north west
			processQuadNodes.push(this.quadNodes.get(quadNode.firstChildIndex + 2)); // south east
			processQuadNodes.push(this.quadNodes.get(quadNode.firstChildIndex + 3)); // south west
		}
	}

	relocate(value: T) {
		this.remove(value);
		this.insert(value);
	}
}
