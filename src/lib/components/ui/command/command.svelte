<script context="module" lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';

	export type CommandProps = CommandPrimitive.CommandProps;
	export type CommandEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = CommandProps;

	let { value, class: className, children, ...restProps }: CommandProps = $props();
</script>

<CommandPrimitive.Root
	class={cn(
		'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
		className
	)}
	bind:value
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</CommandPrimitive.Root>
