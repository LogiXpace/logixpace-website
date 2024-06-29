<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type ContextMenuRadioGroupProps = ContextMenuPrimitive.RadioGroupProps & {
		children: Snippet;
	};

	export type ContextMenuRadioGroupEvents = never;
</script>

<script lang="ts">
	type $$Props = ContextMenuRadioGroupProps;
	type $$Events = ContextMenuRadioGroupEvents;

	let { class: className, value, children, ...restProps }: ContextMenuRadioGroupProps = $props();
</script>

<ContextMenuPrimitive.RadioGroup {...restProps} bind:value>
	{@render children()}
</ContextMenuPrimitive.RadioGroup>
