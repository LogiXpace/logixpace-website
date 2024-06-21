import { bench, describe } from 'vitest';
import { circuits } from '../examples';

/**
 *
 * @param {import('../examples').ReturnExample} example
 * @param {string} name - the name of the function
 */
function benchExampleOnlyRun(example, name) {
	example.init();
	bench(`${name}`, example.run);
}

/**
 *
 * @param {import('../examples').ReturnExample} example
 * @param {string} name - the name of the function
 */
function benchExampleOnlyInit(example, name) {
	bench(`${name}`, () => {
		example.init();
	});
}

/**
 *
 * @param {import('../examples').ReturnExample} example
 * @param {string} name - the name of the function
 */
function benchExampleRunAndInit(example, name) {
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
