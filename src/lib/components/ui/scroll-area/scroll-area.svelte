<script context="module" lang="ts">
	import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui';
	import { Scrollbar } from './index.js';

	export type ScrollAreaProps = ScrollAreaPrimitive.Props & {
		orientation?: 'vertical' | 'horizontal' | 'both';
		scrollbarXClasses?: string;
		scrollbarYClasses?: string;
		children: Snippet;
	};

	export type ScrollAreaEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';
	import type { Snippet } from 'svelte';

	type $$Props = ScrollAreaProps;

	let {
		class: className,
		orientation = 'vertical',
		scrollbarXClasses,
		scrollbarYClasses,
		children,
		...restProps
	}: ScrollAreaProps = $props();
</script>

<ScrollAreaPrimitive.Root {...restProps} class={cn('relative overflow-hidden', className)}>
	<ScrollAreaPrimitive.Viewport class="h-full w-full rounded-[inherit]">
		<ScrollAreaPrimitive.Content>
			{@render children()}
		</ScrollAreaPrimitive.Content>
	</ScrollAreaPrimitive.Viewport>
	{#if orientation === 'vertical' || orientation === 'both'}
		<Scrollbar orientation="vertical" class={scrollbarYClasses} />
	{/if}
	{#if orientation === 'horizontal' || orientation === 'both'}
		<Scrollbar orientation="horizontal" class={scrollbarXClasses} />
	{/if}
	<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
