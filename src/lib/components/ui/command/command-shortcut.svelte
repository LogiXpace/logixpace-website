<script context="module" lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type CommandShortCutProps = HTMLAttributes<HTMLSpanElement> & {
		children: Snippet;
	};

	export type CommandShortCutEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = CommandShortCutProps;

	let { class: className, children, ...restProps }: CommandShortCutProps = $props();
</script>

<span class={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...restProps}>
	{@render children()}
</span>
