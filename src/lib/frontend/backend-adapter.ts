import {
	BuiltinAndChip,
	BuiltinNAndChip,
	BuiltinNOrChip,
	BuiltinNotChip,
	BuiltinOrChip
} from '$lib/core/builtin-chips';
import { BuiltinXOrChip } from '$lib/core/builtin-chips/builtin-xor-chip';
import type { Chip } from '$lib/core/chip';
import { Pin } from '$lib/core/pin';
import { POWER_STATE_HIGH, POWER_STATE_LOW } from '$lib/core/power-state';
import { Simulator } from '$lib/core/simulator';
import { FreeList } from '$lib/helpers/free-list';
import { Adapter } from './adapter';
import { BackendAdapterCustomChipDatabase } from './backend-adapter-custom-chip-database';
import type { ChipType } from './chip-types';
import {
	type PowerState as FrontendPowerState,
	POWER_STATE_HIGH as FRONTEND_POWER_STATE_HIGH
} from './state';

export class BackendAdapter extends Adapter<number> {
	private simulator = new Simulator();
	private pins = new FreeList<Pin>();
	private chips = new FreeList<Chip>();
	private simulationStep = 1;
	private customChipDatabase = new BackendAdapterCustomChipDatabase();

	constructor(simulationStep: number) {
		super('BackendAdapter');
		this.simulationStep = simulationStep;
	}

	createPin(state: FrontendPowerState): number {
		const pin = new Pin(state === FRONTEND_POWER_STATE_HIGH ? POWER_STATE_HIGH : POWER_STATE_LOW);
		return this.pins.insert(pin);
	}

	getPowerState(id: number): FrontendPowerState {
		const pin = this.pins.get(id);
		if (typeof pin === 'number' || pin === undefined) {
			throw new Error('Invalid pin ID');
		}

		return pin.powerState;
	}

	setPowerState(id: number, state: FrontendPowerState): void {
		const pin = this.pins.get(id);
		if (typeof pin === 'number' || pin === undefined) {
			throw new Error('Invalid pin ID');
		}

		pin.update(state === FRONTEND_POWER_STATE_HIGH ? POWER_STATE_HIGH : POWER_STATE_LOW, this.simulator);
	}

	connect(start: number, end: number): void {
		const startPin = this.pins.get(start);
		const endPin = this.pins.get(end);

		if (typeof startPin === 'number' || startPin === undefined) {
			throw new Error('Invalid start pin ID');
		}

		if (typeof endPin === 'number' || endPin === undefined) {
			throw new Error('Invalid end pin ID');
		}

		startPin.connectPin(this.simulator, endPin);
	}

	destroyPin(id: number): void {
		const pin = this.pins.get(id);
		if (typeof pin === 'number' || pin === undefined) {
			throw new Error('Invalid pin ID');
		}

		this.pins.erase(id);
		pin.destroy(this.simulator);
	}

	disconnect(start: number, end: number): void {
		const startPin = this.pins.get(start);
		const endPin = this.pins.get(end);

		if (typeof startPin === 'number' || startPin === undefined) {
			throw new Error('Invalid start pin ID');
		}

		if (typeof endPin === 'number' || endPin === undefined) {
			throw new Error('Invalid end pin ID');
		}

		startPin.disconnectPin(this.simulator, endPin);
	}

	createChip(type: ChipType, inputIds: number[], outputIds: number[]): number | undefined {
		const inputPins = new Array(inputIds.length);
		for (let i = 0; i < inputIds.length; i++) {
			const pin = this.pins.get(inputIds[i]);
			if (typeof pin === 'number' || pin === undefined) {
				throw new Error('Invalid input pin ID');
			}

			inputPins[i] = pin;
		}

		const outputPins = new Array(outputIds.length);
		for (let i = 0; i < outputIds.length; i++) {
			const pin = this.pins.get(outputIds[i]);
			if (typeof pin === 'number' || pin === undefined) {
				throw new Error('Invalid output pin ID');
			}

			outputPins[i] = pin;
		}

		let chip: Chip | undefined = undefined;

		switch (type) {
			case 'and':
				chip = new BuiltinAndChip(inputPins, outputPins);
				break;
			case 'nand':
				chip = new BuiltinNAndChip(inputPins, outputPins);
				break;
			case 'or':
				chip = new BuiltinOrChip(inputPins, outputPins);
				break;
			case 'nor':
				chip = new BuiltinNOrChip(inputPins, outputPins);
				break;
			case 'xor':
				chip = new BuiltinXOrChip(inputPins, outputPins);
				break;
			case 'not':
				chip = new BuiltinNotChip(inputPins, outputPins);
				break;

			default:
				return undefined;
		}

		chip.process(this.simulator);
		return this.chips.insert(chip);
	}

	destroyChip(id: number, inputPinIds: number[], outputPinIds: number[]) {
		const chip = this.chips.get(id);
		if (typeof chip === 'number' || chip === undefined) {
			throw new Error('Invalid chip ID');
		}

		this.chips.erase(id);

		for (const inputPinId of inputPinIds) {
			this.destroyPin(inputPinId);
		}

		for (const outputPinId of outputPinIds) {
			this.destroyPin(outputPinId);
		}
	}

	update(): void {
		this.simulator.simulate(this.simulationStep);
	}

	step() {
		this.simulator.step();
	}

	setSimulationStep(step: number): void {
		this.simulationStep = step;
	}

	getSimulationStep(): number {
		return this.simulationStep;
	}

	addCustomChip(name: string, allPinIds: number[], allChipIds: number[], inputPinIds: number[], outputPinIds: number[]) {
		const allPins = new Array<Pin>(allPinIds.length);
		const allChips = new Array<Chip>(allChipIds.length);

		for (let i = 0; i < allPinIds.length; i++) {
			const pin = this.pins.get(allPinIds[i]);
			if (typeof pin === 'number' || pin === undefined) {
				throw new Error('Invalid pin ID');
			}

			allPins[i] = pin;
		}

		for (let i = 0; i < inputPinIds.length; i++) {
			const inputPinId = inputPinIds[i];
			const pin = this.pins.get(inputPinId);
			if (typeof pin === 'number' || pin === undefined) {
				throw new Error('Invalid input pin ID ' + inputPinId);
			}

			const index = allPins.indexOf(pin);
			if (index === -1) {
				throw new Error('Invalid input pin ID ' + inputPinId);
			}

			inputPinIds[i] = index;
		}

		for (let i = 0; i < outputPinIds.length; i++) {
			const outputPinId = outputPinIds[i];
			const pin = this.pins.get(outputPinId);
			if (typeof pin === 'number' || pin === undefined) {
				throw new Error('Invalid output pin ID ' + outputPinId);
			}

			const index = allPins.indexOf(pin);
			if (index === -1) {
				throw new Error('Invalid output pin ID ' + outputPinId);
			}

			outputPinIds[i] = index;
		}

		for (let i = 0; i < allChips.length; i++) {
			const chip = this.chips.get(allChipIds[i]);
			if (typeof chip === 'number' || chip === undefined) {
				throw new Error('Invalid chip ID');
			}

			allChips[i] = chip;
		}

		this.customChipDatabase.add(name, allPins, allChips, inputPinIds, outputPinIds);
	}

	createCustomChip(name: string, inputPinIds: number[], outputPinIds: number[]): number | undefined {
		const chip = this.customChipDatabase.create(name, this.simulator);
		if (chip === undefined) {
			return undefined;
		}

		const chipId = this.chips.insert(chip);

		for (let i = 0; i < chip.inputLength; i++) {
			inputPinIds[i] = this.pins.insert(chip.inputPins[i]);
		}

		for (let i = 0; i < chip.outputLength; i++) {
			outputPinIds[i] = this.pins.insert(chip.outputPins[i]);
		}

		return chipId;
	}
}
