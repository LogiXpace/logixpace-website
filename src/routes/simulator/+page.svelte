<script lang="ts">
	import { BackendAdapter } from '$lib/frontend/backend-adapter';
	import { NamedPin } from '$lib/frontend/named-pin';
	import type { SimulationContext } from '$lib/frontend/simulation-context';
	import Simulation from '$lib/frontend/simulation.svelte';
	import { DIRECTION } from '$lib/helpers/direction';
	import { Vector2D } from '$lib/helpers/vector2d';

	let simulationContext: SimulationContext<number> | undefined = $state(undefined);

	$effect(() => {
		if (simulationContext === undefined) {
			return;
		}

		simulationContext.addIO({
			namedPin: simulationContext.addNamedPin({
				name: 'input-test',
				powerState: 1
			}),
			position: new Vector2D(-100, 0),
			direction: DIRECTION.RIGHT
		});

		simulationContext.addIO({
			namedPin: simulationContext.addNamedPin({
				name: 'output',
				powerState: 1
			}),
			position: new Vector2D(100, 0),
			direction: DIRECTION.LEFT
		});
	});
</script>

<div class="h-screen w-screen overflow-hidden">
	<Simulation scale={1} adapter={new BackendAdapter()} bind:simulationContext />
</div>
