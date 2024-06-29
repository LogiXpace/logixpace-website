<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';

	export type ContextMenuSeparatorProps = ContextMenuPrimitive.SeparatorProps;
	export type ContextMenuSeparatorEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = ContextMenuSeparatorProps;
	type $$Events = ContextMenuSeparatorEvents;

	let { class: className, ...restProps }: ContextMenuSeparatorProps = $props();
</script>

<ContextMenuPrimitive.Separator class={cn('-mx-1 my-1 h-px bg-border', className)} {...restProps} />
