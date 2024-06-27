<script lang="ts">
	import { BackendAdapter } from '$lib/frontend/backend-adapter';
	import type { SimulationContext } from '$lib/frontend/simulation-context';
	import Simulation from '$lib/frontend/simulation.svelte';
	import { POWER_STATE_HIGH, POWER_STATE_LOW } from '$lib/frontend/state';
	import { RGB } from '$lib/helpers/color';
	import { DIRECTION } from '$lib/helpers/direction';
	import { Vector2D } from '$lib/helpers/vector2d';

	let simulationContext: SimulationContext<number> | undefined = $state(undefined);
	let isContextMenuOpen = $state(false);
	let contextMenuPosition = $state(new Vector2D());

	$effect(() => {
		if (simulationContext === undefined) {
			return;
		}
	});

	$inspect(simulationContext);
</script>

<div class="h-screen w-screen overflow-hidden">
	<Simulation
		scale={1}
		adapter={new BackendAdapter()}
		onVoidContextMenuOpen={(position) => {
			contextMenuPosition = position;
			isContextMenuOpen = true;
		}}
		bind:simulationContext
	/>
</div>

{#if simulationContext !== undefined}
	<div
		class="fixed z-10 flex min-w-56 flex-col overflow-hidden rounded-md bg-gray-800 p-1 shadow-lg data-[open=false]:hidden"
		data-open={isContextMenuOpen ? 'true' : 'false'}
		style:top="{contextMenuPosition.y}px"
		style:left="{contextMenuPosition.x}px"
		onblur={() => (isContextMenuOpen = false)}
	>
		<div class="flex items-center text-lg font-bold text-white">Add Entities</div>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex h-full w-full items-center rounded-sm bg-gray-900 px-2 py-1 text-white"
			onclick={() => {
				isContextMenuOpen = false;
				simulationContext.addChip('and', ['a', 'b'], ['o'], {
					position: simulationContext.screenVectorToWorldVector(contextMenuPosition),
					name: 'and',
					color: new RGB(0, 0, 0)
				});
			}}
		>
			and
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex h-full w-full items-center rounded-sm bg-gray-900 px-2 py-1 text-white"
			onclick={() => {
				isContextMenuOpen = false;
				simulationContext.addChip('or', ['a', 'b'], ['o'], {
					position: simulationContext.screenVectorToWorldVector(contextMenuPosition),
					name: 'or',
					color: new RGB(0, 0, 0)
				});
			}}
		>
			or
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex h-full w-full items-center rounded-sm bg-gray-900 px-2 py-1 text-white"
			onclick={() => {
				isContextMenuOpen = false;
				simulationContext.addChip('xor', ['a', 'b'], ['o'], {
					position: simulationContext.screenVectorToWorldVector(contextMenuPosition),
					name: 'xor',
					color: new RGB(0, 0, 0)
				});
			}}
		>
			xor
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex h-full w-full items-center rounded-sm bg-gray-900 px-2 py-1 text-white"
			onclick={() => {
				isContextMenuOpen = false;
				simulationContext.addChip('not', ['a'], ['o'], {
					position: simulationContext.screenVectorToWorldVector(contextMenuPosition),
					name: 'not',
					color: new RGB(0, 0, 0)
				});
			}}
		>
			not
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex h-full w-full items-center rounded-sm bg-gray-900 px-2 py-1 text-white"
			onclick={() => {
				isContextMenuOpen = false;
				simulationContext.addIO({
					direction: DIRECTION.RIGHT,
					position: simulationContext.screenVectorToWorldVector(contextMenuPosition),
					namedPin: simulationContext.addNamedPin({
						name: 'input',
						powerState: POWER_STATE_LOW
					}),
					color: new RGB(0, 0, 0)
				});
			}}
		>
			input
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex h-full w-full items-center rounded-sm bg-gray-900 px-2 py-1 text-white"
			onclick={() => {
				isContextMenuOpen = false;
				simulationContext.addIO({
					direction: DIRECTION.LEFT,
					position: simulationContext.screenVectorToWorldVector(contextMenuPosition),
					namedPin: simulationContext.addNamedPin({
						name: 'output',
						powerState: POWER_STATE_LOW
					}),
					color: new RGB(0, 0, 0)
				});
			}}
		>
			output
		</div>
	</div>
{/if}
