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
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let {
		offset = new Vector2D(),
		scale = 1,
		scaleFactor = 1,
		adapter,
		simulationContext = $bindable()
	}: Props<T> = $props();

	let simulationStep = $state(adapter.getSimulationStep());
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
			adapter
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

	$effect(() => {
		adapter.setSimulationStep(simulationStep);
	});
</script>

<div class="h-full w-full" bind:this={simulationElement}>
	<canvas bind:this={canvas}></canvas>
	<div
		class="fixed left-0 top-0 m-2 flex flex-col space-y-2 *:max-w-[20ch] *:text-xs *:font-semibold"
	>
		<span>FPS: {FPS.toPrecision(3)}</span>
		<p>
			to toggle the inputs, press <kbd>ctrl</kbd> + click
		</p>
		<p>to create new enitities, right click on an empty area</p>
		<p>
			to create wires, click on the outlet of any inputs, outputs, or chip pins. then a wire will be
			held on the mouse cursor until you click on another outlet.
		</p>
		<p>
			select multiple entites and press <kbd>delete</kbd> to delete them, you can also press
			<kbd>ctrl</kbd>
			+ c to copy and <kbd>ctrl</kbd> + v to paste
		</p>
	</div>
	<div
		class="fixed right-0 top-0 m-2 flex flex-col space-y-2 bg-background *:max-w-[20ch] *:text-xs *:font-semibold"
	>
		<Label>
			Simulation Step
			<Input placeholder="Simulation Step" bind:value={simulationStep} type="number" min="1" />
		</Label>
	</div>
</div>
