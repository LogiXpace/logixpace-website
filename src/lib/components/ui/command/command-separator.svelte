<script context="module" lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';

	export type CommandSeparatorProps = CommandPrimitive.SeparatorProps & {
		children?: never;
	};

	export type CommandSeparatorEvents = never;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = CommandSeparatorProps;

	let { class: className, ...restProps }: CommandSeparatorProps = $props();
</script>

<CommandPrimitive.Separator class={cn('-mx-1 h-px bg-border', className)} {...restProps} />
