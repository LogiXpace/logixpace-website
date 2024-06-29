<script context="module" lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';
	import type { Snippet } from 'svelte';

	export type CommandItemProps = CommandPrimitive.ItemProps & {
		children: Snippet<[any, any]>;
	};

	export type CommandItemEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = CommandItemProps;

	let { asChild, class: className, children, ...restProps }: CommandItemProps = $props();
</script>

<CommandPrimitive.Item
	{asChild}
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...restProps}
	let:action
	let:attrs
>
	{@render children(action, attrs)}
</CommandPrimitive.Item>
