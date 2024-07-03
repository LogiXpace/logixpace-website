<script lang="ts">
	import { BackendAdapter } from '$lib/frontend/backend-adapter';
	import type { SimulationContext } from '$lib/frontend/simulation-context';
	import Simulation from '$lib/frontend/simulation.svelte';

	let simulationContext: SimulationContext<number> | undefined = $state(undefined);

	$effect(() => {
		if (simulationContext === undefined) {
			return;
		}
	});
</script>

<svelte:head>
	<title>Simulator</title>
</svelte:head>

<div class="h-screen w-screen overflow-hidden">
	<Simulation scale={1} adapter={new BackendAdapter(1)} bind:simulationContext />
</div>
