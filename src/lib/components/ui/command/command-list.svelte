<script context="module" lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';
	import type { Snippet } from 'svelte';

	export type CommandListProps = CommandPrimitive.ListProps & {
		children: Snippet;
	};

	export type CommandListEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';
	import * as ScrollArea from '$lib/components/ui/scroll-area';

	type $$Props = CommandListProps;

	let { class: className, children, ...restProps }: CommandListProps = $props();
</script>

<ScrollArea.Root orientation="vertical">
	<CommandPrimitive.List class={cn('max-h-[300px]', className)} {...restProps}>
		{@render children()}
	</CommandPrimitive.List>
</ScrollArea.Root>
