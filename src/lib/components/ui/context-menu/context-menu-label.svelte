<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type ContextMenuLabelProps = ContextMenuPrimitive.LabelProps & {
		inset?: boolean;
		children: Snippet;
	};

	export type ContextMenuLabelEvents = HTMLLabelElement;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = ContextMenuLabelProps;
	type $$Events = ContextMenuLabelEvents;

	let { inset, children, class: className, ...restProps }: ContextMenuLabelProps = $props();
</script>

<ContextMenuPrimitive.Label
	class={cn('px-2 py-1.5 text-sm font-semibold text-foreground', inset && 'pl-8', className)}
	{...restProps}
>
	{@render children()}
</ContextMenuPrimitive.Label>
