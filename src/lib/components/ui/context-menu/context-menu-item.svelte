<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type ContextMenuItemProps = ContextMenuPrimitive.ItemProps & {
		inset?: boolean;
		children: Snippet;
	};

	export type ContextMenuItemEvents = ContextMenuPrimitive.ItemEvents;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = ContextMenuItemProps;
	type $$Events = ContextMenuItemEvents;

	let { inset, children, class: className, ...restProps }: ContextMenuItemProps = $props();
</script>

<ContextMenuPrimitive.Item
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
		inset && 'pl-8',
		className
	)}
	{...restProps}
>
	{@render children()}
</ContextMenuPrimitive.Item>
