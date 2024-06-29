<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type ContextMenuContentProps = ContextMenuPrimitive.ContentProps & { children: Snippet };
	export type ContextMenuContentEvents = ContextMenuPrimitive.ContentEvents;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';
	import { flyAndScale } from '$lib/utils/transitions';

	type $$Props = ContextMenuContentProps;
	type $$Events = ContextMenuContentEvents;

	let {
		children,
		transition = flyAndScale,
		transitionConfig,
		class: className,
		...restProps
	}: ContextMenuContentProps = $props();
</script>

<ContextMenuPrimitive.Content
	{transition}
	{transitionConfig}
	class={cn(
		'z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none',
		className
	)}
	{...restProps}
>
	{@render children()}
</ContextMenuPrimitive.Content>
