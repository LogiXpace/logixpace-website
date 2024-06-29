<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type ContextMenuSubContentProps = ContextMenuPrimitive.SubContentProps & {
		children: Snippet;
	};

	export type ContextMenuSubContentEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';
	import { flyAndScale } from '$lib/utils/transitions';

	type $$Props = ContextMenuSubContentProps;
	type $$Events = ContextMenuSubContentEvents;

	let {
		class: className,
		children,
		transition = flyAndScale,
		transitionConfig,
		...restProps
	}: ContextMenuSubContentProps = $props();
</script>

<ContextMenuPrimitive.SubContent
	{transition}
	{transitionConfig}
	class={cn(
		'z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg focus:outline-none',
		className
	)}
	{...restProps}
>
	{@render children()}
</ContextMenuPrimitive.SubContent>
