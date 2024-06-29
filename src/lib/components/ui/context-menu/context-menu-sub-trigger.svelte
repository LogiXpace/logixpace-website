<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type ContextMenuSubTriggerProps = ContextMenuPrimitive.SubTriggerProps & {
		inset?: boolean;
		children: Snippet;
	};

	export type ContextMenuSubTriggerEvents = ContextMenuPrimitive.SubTriggerEvents;
</script>

<script lang="ts">
	import { ChevronRight } from 'svelte-radix';
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = ContextMenuSubTriggerProps;
	type $$Events = ContextMenuSubTriggerEvents;

	let { class: className, children, inset, ...restProps }: ContextMenuSubTriggerProps = $props();
</script>

<ContextMenuPrimitive.SubTrigger
	class={cn(
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground',
		inset && 'pl-8',
		className
	)}
	{...restProps}
>
	{@render children()}
	<ChevronRight class="ml-auto h-4 w-4" />
</ContextMenuPrimitive.SubTrigger>
