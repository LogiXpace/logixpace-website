<script context="module" lang="ts">
	import { Label as LabelPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type LabelProps = LabelPrimitive.Props & {
		children: Snippet;
	};
	export type LabelEvents = LabelPrimitive.Events;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = LabelProps;
	type $$Events = LabelEvents;

	let { class: className, children, ...restProps }: LabelProps = $props();
</script>

<LabelPrimitive.Root
	class={cn(
		'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...restProps}
>
	{@render children()}
</LabelPrimitive.Root>
