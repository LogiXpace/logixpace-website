<script context="module" lang="ts">
	export type Props<T> = Partial<Omit<SimulationContextProps<T>, 'ctx'>> & {
		adapter: SimulationContextProps<T>['adapter'];
		simulationContext: SimulationContext<T> | undefined;
	};
</script>

<script lang="ts" generics="T">
	import type { SimulationContextProps } from './simulation-context';
	import { Vector2D } from '$lib/helpers/vector2d';
	import { onMount } from 'svelte';
	import { SimulationContext } from './simulation-context';

	let {
		offset = new Vector2D(),
		scale = 1,
		scaleFactor = 1,
		adapter,
		onVoidContextMenuOpen = () => {},
		simulationContext = $bindable()
	}: Props<T> = $props();

	let simulationElement: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let FPS = $state(0);

	onMount(() => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext('2d');
		if (ctx === null) {
			throw new Error('Could not get canvas context');
		}

		function handleResize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		simulationContext = new SimulationContext({
			ctx,
			offset,
			scale,
			scaleFactor,
			adapter,
			onVoidContextMenuOpen
		});

		window.addEventListener('resize', handleResize);

		let prevFrame = 0;

		const animate = () => {
			let currFrame = performance.now();
			let delta = currFrame - prevFrame;
			prevFrame = currFrame;
			FPS = 1000 / delta;

			// @ts-ignore
			simulationContext.update(currFrame, delta);

			requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener('resize', handleResize);

			// @ts-ignore
			simulationContext.destroy();
		};
	});
</script>

<div class="h-full w-full" bind:this={simulationElement}>
	<canvas bind:this={canvas}></canvas>
	<div
		class="fixed left-0 top-0 m-2 flex flex-col space-y-2 *:max-w-[20ch] *:text-xs *:font-semibold"
	>
		<span>FPS: {FPS.toPrecision(3)}</span>
		<p>
			to toggle the inputs, press <kbd>shift</kbd> + mouse click
		</p>
		<p>to create new enitities, right click on an empty area</p>
		<p>
			to create wires, click on the outlet of any inputs, outputs, or chip pins. then a wire will be
			held on the mouse cursor until you click on another outlet.
		</p>
		<p>
			finally: have fun creating your own circuits! (but be careful, the simulation lacks so many
			features and has many bugs)
		</p>
	</div>
</div>
