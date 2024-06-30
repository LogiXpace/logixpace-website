<script context="module" lang="ts">
	import { Vector2D } from '$lib/helpers/vector2d';
	import type { Snippet } from 'svelte';

	export type AddEntitiesContextMenuProps<T> = {
		simulationContext: SimulationContext<T>;
		children: Snippet;
	};
</script>

<script lang="ts" generics="T">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import * as Command from '$lib/components/ui/command';

	import type { SimulationContext } from '$lib/frontend/simulation-context';
	import { RGB } from '$lib/helpers/color';
	import { DIRECTION } from '$lib/helpers/direction';
	import { POWER_STATE_LOW } from '$lib/frontend/state';
	import { POWER_STATE_HIGH } from '$lib/backend/power-state';

	type $$Props = AddEntitiesContextMenuProps<T>;

	let { children, simulationContext }: AddEntitiesContextMenuProps<T> = $props();

	let position = $state(new Vector2D());
	let open = $state(false);
</script>

<ContextMenu.Root bind:open>
	<ContextMenu.Trigger
		oncontextmenu={(e) => {
			position.x = e.clientX;
			position.y = e.clientY;

			// stop any propagation, so other context menus don't open
			e.stopPropagation();
			e.stopImmediatePropagation();
		}}
	>
		{@render children()}
	</ContextMenu.Trigger>
	<ContextMenu.Content class="">
		<Command.Root class="w-64">
			<Command.Input placeholder="Type an entity to add..." />
			<Command.List class="">
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group heading="Entities">
					<Command.Item
						onSelect={() => {
							open = false;
							simulationContext.addChip('and', ['a', 'b'], ['o'], {
								position: simulationContext.screenVectorToWorldVector(position),
								name: 'AND',
								color: new RGB(0, 0, 0)
							});
						}}
					>
						AND
					</Command.Item>
					<Command.Item
						onSelect={() => {
							open = false;
							simulationContext.addChip('nand', ['a', 'b'], ['o'], {
								position: simulationContext.screenVectorToWorldVector(position),
								name: 'NAND',
								color: new RGB(0, 0, 0)
							});
						}}
					>
						NAND
					</Command.Item>
					<Command.Item
						onSelect={() => {
							open = false;
							simulationContext.addChip('or', ['a', 'b'], ['o'], {
								position: simulationContext.screenVectorToWorldVector(position),
								name: 'OR',
								color: new RGB(0, 0, 0)
							});
						}}
					>
						OR
					</Command.Item>
					<Command.Item
						onSelect={() => {
							open = false;
							simulationContext.addChip('nor', ['a', 'b'], ['o'], {
								position: simulationContext.screenVectorToWorldVector(position),
								name: 'NOR',
								color: new RGB(0, 0, 0)
							});
						}}
					>
						NOR
					</Command.Item>
					<Command.Item
						onSelect={() => {
							open = false;
							simulationContext.addChip('xor', ['a', 'b'], ['o'], {
								position: simulationContext.screenVectorToWorldVector(position),
								name: 'XOR',
								color: new RGB(0, 0, 0)
							});
						}}
					>
						XOR
					</Command.Item>
					<Command.Item
						onSelect={() => {
							open = false;
							simulationContext.addChip('not', ['a'], ['o'], {
								position: simulationContext.screenVectorToWorldVector(position),
								name: 'NOT',
								color: new RGB(0, 0, 0)
							});
						}}
					>
						NOT
					</Command.Item>
				</Command.Group>
				<Command.Separator />
				<Command.Group heading="IO">
					<Command.Item
						onSelect={() => {
							open = false;
							simulationContext.addInput(
								{
									position,
									color: new RGB(0, 0, 0)
								},
								'input',
								POWER_STATE_LOW
							);
						}}
					>
						Input
					</Command.Item>
					<Command.Item
						onSelect={() => {
							open = false;
							simulationContext.addOutput(
								{
									position,
									color: new RGB(0, 0, 0)
								},
								'output',
								POWER_STATE_LOW
							);
						}}
					>
						Output
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Root>
	</ContextMenu.Content>
</ContextMenu.Root>
