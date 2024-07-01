import { DIRECTION } from '$lib/helpers/direction';
import { IO, type IOProps } from './io';
import { POWER_STATE_HIGH } from './state';

export interface InputProps<T> extends Omit<IOProps<T>, 'direction'> {}

export class Input<T> extends IO<T> {
	state: boolean;

	constructor(props: InputProps<T>) {
		super({ ...props, direction: DIRECTION.RIGHT });

		this.state = props.namedPin.powerState === POWER_STATE_HIGH;
	}

	toggle() {
		this.state = !this.state;
	}

	get activated() {
		return this.state;
	}
}
