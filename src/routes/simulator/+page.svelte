<script lang="ts">
	import { BackendAdapter } from '$lib/frontend/backend-adapter';
	import { NamedPin } from '$lib/frontend/named-pin';
	import type { SimulationContext } from '$lib/frontend/simulation-context';
	import Simulation from '$lib/frontend/simulation.svelte';
	import { POWER_STATE_HIGH } from '$lib/frontend/state';
	import { Color, RGB } from '$lib/helpers/color';
	import { DIRECTION } from '$lib/helpers/direction';
	import { Vector2D } from '$lib/helpers/vector2d';

	let simulationContext: SimulationContext<number> | undefined = $state(undefined);

	$effect(() => {
		if (simulationContext === undefined) {
			return;
		}

		simulationContext.addChip({
			position: new Vector2D(400, 200),
			name: 'chip',
			color: new RGB(0, 0, 0),
			inputPins: [
				simulationContext.addChipPin({
					namedPin: simulationContext.addNamedPin({
						name: 'input-pin',
						powerState: 1
					})
				})
			],
			outputPins: [
				simulationContext.addChipPin({
					namedPin: simulationContext.addNamedPin({
						name: 'output-pin',
						powerState: 1
					})
				})
			]
		});

		simulationContext.addIO({
			direction: DIRECTION.RIGHT,
			position: new Vector2D(),
			namedPin: simulationContext.addNamedPin({
				name: 'hello',
				powerState: POWER_STATE_HIGH
			}),
			color: new RGB(0, 0, 0)
		});
	});
</script>

<div class="h-screen w-screen overflow-hidden">
	<Simulation scale={1} adapter={new BackendAdapter()} bind:simulationContext />
</div>
