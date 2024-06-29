<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type CheckboxItemProps = ContextMenuPrimitive.CheckboxItemProps & { children: Snippet };
	export type CheckboxItemEvents = ContextMenuPrimitive.CheckboxItemEvents;
</script>

<script lang="ts">
	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = CheckboxItemProps;
	type $$Events = CheckboxItemEvents;

	let {
		checked = $bindable(false),
		children,
		class: className,
		...restProps
	}: CheckboxItemProps = $props();
</script>

<ContextMenuPrimitive.CheckboxItem
	bind:checked
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
		className
	)}
	{...restProps}
>
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		<ContextMenuPrimitive.CheckboxIndicator>
			<Check class="h-4 w-4" />
		</ContextMenuPrimitive.CheckboxIndicator>
	</span>
	{@render children()}
</ContextMenuPrimitive.CheckboxItem>
