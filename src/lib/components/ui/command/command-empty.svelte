<script context="module" lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';
	import type { Snippet } from 'svelte';

	export type CommandEmptyProps = CommandPrimitive.EmptyProps & {
		children: Snippet;
	};

	export type CommandEmptyEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = CommandEmptyProps;

	let { class: className, children, ...restProps }: CommandEmptyProps = $props();
</script>

<CommandPrimitive.Empty class={cn('py-6 text-center text-sm', className)} {...restProps}>
	{@render children()}
</CommandPrimitive.Empty>
