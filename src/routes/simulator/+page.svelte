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
	let isContextMenuOpen = $state(false);
	let contextMenuPosition = $state(new Vector2D());

	$effect(() => {
		if (simulationContext === undefined) {
			return;
		}

		simulationContext.addChip('and', ['input-pin-1', 'input-pin-2'], ['output-pin'], {
			position: new Vector2D(400, 200),
			name: 'and',
			color: new RGB(0, 0, 0)
		});
		simulationContext.addChip('or', ['input-pin-1', 'input-pin-2'], ['output-pin'], {
			position: new Vector2D(400, 400),
			name: 'or',
			color: new RGB(0, 0, 0)
		});
		simulationContext.addChip('not', ['input-pin'], ['output-pin'], {
			position: new Vector2D(400, 600),
			name: 'not',
			color: new RGB(0, 0, 0)
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
		simulationContext.addIO({
			direction: DIRECTION.RIGHT,
			position: new Vector2D(0, 100),
			namedPin: simulationContext.addNamedPin({
				name: 'hello',
				powerState: POWER_STATE_HIGH
			}),
			color: new RGB(0, 0, 0)
		});
		simulationContext.addIO({
			direction: DIRECTION.RIGHT,
			position: new Vector2D(0, 200),
			namedPin: simulationContext.addNamedPin({
				name: 'hello',
				powerState: POWER_STATE_HIGH
			}),
			color: new RGB(0, 0, 0)
		});
		simulationContext.addIO({
			direction: DIRECTION.RIGHT,
			position: new Vector2D(0, 300),
			namedPin: simulationContext.addNamedPin({
				name: 'hello',
				powerState: POWER_STATE_HIGH
			}),
			color: new RGB(0, 0, 0)
		});
		simulationContext.addIO({
			direction: DIRECTION.LEFT,
			position: new Vector2D(600, 0),
			namedPin: simulationContext.addNamedPin({
				name: 'hello',
				powerState: POWER_STATE_HIGH
			}),
			color: new RGB(0, 0, 0)
		});
		simulationContext.addIO({
			direction: DIRECTION.LEFT,
			position: new Vector2D(600, 100),
			namedPin: simulationContext.addNamedPin({
				name: 'hello',
				powerState: POWER_STATE_HIGH
			}),
			color: new RGB(0, 0, 0)
		});
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
		class="fixed z-10 flex min-w-56 flex-col overflow-hidden rounded-md bg-gray-500 p-1 shadow-lg data-[open=false]:hidden"
		data-open={isContextMenuOpen ? 'true' : 'false'}
		style:top="{contextMenuPosition.y}px"
		style:left="{contextMenuPosition.x}px"
		onblur={() => (isContextMenuOpen = false)}
	>
		<div class="flex items-center text-lg font-bold text-white">Add Chip</div>
		<div class="flex h-full w-full items-center rounded-sm bg-gray-700 px-2 py-1 text-white">
			And
		</div>
	</div>
{/if}
