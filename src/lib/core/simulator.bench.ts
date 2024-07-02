import { bench, describe } from 'vitest';
import { circuits, type ReturnExample } from '../examples';

/**
 *
 * @param example
 * @param name - the name of the function
 */
function benchExampleOnlyRun(example: ReturnExample, name: string) {
	example.init();
	bench(`${name}`, example.run);
}

/**
 *
 * @param example
 * @param name - the name of the function
 */
function benchExampleOnlyInit(example: ReturnExample, name: string) {
	bench(`${name}`, () => {
		example.init();
	});
}

/**
 *
 * @param example
 * @param name - the name of the function
 */
function benchExampleRunAndInit(example: ReturnExample, name: string) {
	bench(`${name}`, () => {
		example.init();
		example.run();
	});
}

describe('simulator', () => {
	for (let i = 0; i < circuits.length; i++) {
		const circuit = circuits[i];
		benchExampleOnlyRun(circuit(), `run only: ${circuit.name}`);
		benchExampleOnlyInit(circuit(), `init only: ${circuit.name}`);
		benchExampleRunAndInit(circuit(), `run and init: ${circuit.name}`);
	}
});
