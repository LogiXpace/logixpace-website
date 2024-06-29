<script lang="ts">
	import { BackendAdapter } from '$lib/frontend/backend-adapter';
	import type { SimulationContext } from '$lib/frontend/simulation-context';
	import Simulation from '$lib/frontend/simulation.svelte';
	import { Vector2D } from '$lib/helpers/vector2d';
	import AddEntitiesContextMenu from './add-entities-context-menu.svelte';

	let simulationContext: SimulationContext<number> | undefined = $state(undefined);
</script>

<div class="h-screen w-screen overflow-hidden">
	<AddEntitiesContextMenu {simulationContext}>
		<Simulation scale={1} adapter={new BackendAdapter()} bind:simulationContext />
	</AddEntitiesContextMenu>
</div>

<!-- {#if simulationContext !== undefined}{/if} -->
