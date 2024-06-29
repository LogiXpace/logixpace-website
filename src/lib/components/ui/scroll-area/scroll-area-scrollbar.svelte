<script context="module" lang="ts">
	import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui';
	import { tv, type VariantProps } from 'tailwind-variants';

	export const scrollAreaSrcollbarVariants = tv({
		base: 'flex touch-none select-none transition-colors',
		variants: {
			orientation: {
				vertical: 'h-full w-2 border-l border-l-transparent p-px',
				horizontal: 'h-2 w-full border-t border-t-transparent p-px'
			}
		},
		defaultVariants: {
			orientation: 'vertical'
		}
	});

	export type ScrollAreaScrollbarVariants = VariantProps<typeof scrollAreaSrcollbarVariants>;

	export type ScrollAreaScrollbarProps = ScrollAreaPrimitive.ScrollbarProps &
		ScrollAreaScrollbarVariants;

	export type ScrollAreaScrollbarEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = ScrollAreaScrollbarProps;
	let { class: className, orientation = 'vertical' }: ScrollAreaScrollbarProps = $props();
</script>

<ScrollAreaPrimitive.Scrollbar
	{orientation}
	class={scrollAreaSrcollbarVariants({ orientation, className })}
>
	<ScrollAreaPrimitive.Thumb
		class={cn('relative rounded-full bg-border', orientation === 'vertical' && 'flex-1')}
	/>
</ScrollAreaPrimitive.Scrollbar>
