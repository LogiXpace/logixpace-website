import { DIRECTION } from '$lib/helpers/direction';
import { IO, type IOProps } from './io';

export interface OutputProps<T> extends Omit<IOProps<T>, 'direction'> {}

export class Output<T> extends IO<T> {
	constructor(props: OutputProps<T>) {
		super({ ...props, direction: DIRECTION.LEFT });
	}
}
