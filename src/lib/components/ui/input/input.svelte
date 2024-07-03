<script context="module" lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type InputProps = HTMLInputAttributes;

	export type FormInputEvent<T extends Event = Event> = T & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	export type InputEvents = {
		blur: FormInputEvent<FocusEvent>;
		change: FormInputEvent<Event>;
		click: FormInputEvent<MouseEvent>;
		focus: FormInputEvent<FocusEvent>;
		focusin: FormInputEvent<FocusEvent>;
		focusout: FormInputEvent<FocusEvent>;
		keydown: FormInputEvent<KeyboardEvent>;
		keypress: FormInputEvent<KeyboardEvent>;
		keyup: FormInputEvent<KeyboardEvent>;
		mouseover: FormInputEvent<MouseEvent>;
		mouseenter: FormInputEvent<MouseEvent>;
		mouseleave: FormInputEvent<MouseEvent>;
		mousemove: FormInputEvent<MouseEvent>;
		paste: FormInputEvent<ClipboardEvent>;
		input: FormInputEvent<InputEvent>;
		wheel: FormInputEvent<WheelEvent>;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwindcss';

	type $$Props = InputProps;
	type $$Events = InputEvents;

	let { value = $bindable(), class: className, readonly, ...restProps }: InputProps = $props();
</script>

<input
	class={cn(
		'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:value
	{readonly}
	{...restProps}
/>
