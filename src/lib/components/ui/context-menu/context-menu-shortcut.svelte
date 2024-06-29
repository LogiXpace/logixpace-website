<script context="module" lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ContextMenuShortcutProps = HTMLAttributes<HTMLSpanElement> & { children: Snippet };
	export type ContextMenuShortcutEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = ContextMenuShortcutProps;
	type $$Events = ContextMenuShortcutEvents;

	let { class: className, children, ...restProps }: ContextMenuShortcutProps = $props();
</script>

<span class={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...restProps}>
	{@render children()}
</span>
