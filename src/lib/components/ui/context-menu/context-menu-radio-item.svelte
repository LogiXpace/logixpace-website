<script context="module" lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	export type ContextMenuRadioItemProps = ContextMenuPrimitive.RadioItemProps & {
		children: Snippet;
	};
	export type ContextMenuRadioItemEvents = ContextMenuPrimitive.RadioItemEvents;
</script>

<script lang="ts">
	import { DotFilled } from 'svelte-radix';
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = ContextMenuRadioItemProps;
	type $$Events = ContextMenuRadioItemEvents;

	let { class: className, children, value, ...restProps }: ContextMenuRadioItemProps = $props();
</script>

<ContextMenuPrimitive.RadioItem
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
		className
	)}
	{value}
	{...restProps}
>
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		<ContextMenuPrimitive.RadioIndicator>
			<DotFilled class="h-4 w-4 fill-current" />
		</ContextMenuPrimitive.RadioIndicator>
	</span>
	{@render children()}
</ContextMenuPrimitive.RadioItem>
