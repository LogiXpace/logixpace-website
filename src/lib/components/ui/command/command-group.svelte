<script context="module" lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';
	import type { Snippet } from 'svelte';

	export type CommandGroupProps = CommandPrimitive.GroupProps & {
		children: Snippet;
	};

	export type CommandGroupEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = CommandGroupProps;

	let { class: className, children, ...restProps }: CommandGroupProps = $props();
</script>

<CommandPrimitive.Group
	class={cn(
		'overflow-hidden p-1 text-foreground [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:py-1.5 [&_[data-cmdk-group-heading]]:text-xs [&_[data-cmdk-group-heading]]:font-medium [&_[data-cmdk-group-heading]]:text-muted-foreground',
		className
	)}
	{...restProps}
>
	{@render children()}
</CommandPrimitive.Group>
