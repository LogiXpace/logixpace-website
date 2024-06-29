<script context="module" lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';

	export type CommandInputProps = CommandPrimitive.InputProps;

	export type CommandInputEvents = never;
</script>

<script lang="ts">
	import { MagnifyingGlass } from 'svelte-radix';
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = CommandInputProps;

	let { class: className, value, ...restProps }: CommandInputProps = $props();
</script>

<div class="flex items-center border-b px-3" data-cmdk-input-wrapper="">
	<MagnifyingGlass class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	<CommandPrimitive.Input
		class={cn(
			'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{...restProps}
		bind:value
	/>
</div>
