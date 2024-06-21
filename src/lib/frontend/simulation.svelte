<script context="module" lang="ts">
	import type { SimulationProps } from './simulation';

	export type Props = Partial<Omit<SimulationProps, 'ctx'>>;
</script>

<script lang="ts">
	import { Vector2D } from '$lib/helpers/vector2d';
	import { onMount } from 'svelte';
	import { Simulation } from './simulation';

	const { offset = new Vector2D(), scale = 1, scaleFactor = 1 }: Props = $props();

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

		const simulation = new Simulation({ ctx, offset, scale, scaleFactor });

		window.addEventListener('resize', handleResize);

		let prevFrame = 0;

		function animate() {
			let currFrame = performance.now();
			let delta = currFrame - prevFrame;
			prevFrame = currFrame;
			FPS = 3600 / delta;

			simulation.draw();
			requestAnimationFrame(animate);
		}

		animate();

		return () => {
			window.removeEventListener('resize', handleResize);
			simulation.destroy();
		};
	});
</script>

<div class="h-full w-full" bind:this={simulationElement}>
	<canvas bind:this={canvas}></canvas>
	<div class="fixed left-0 top-0 m-2 text-sm font-semibold">
		FPS: {FPS.toPrecision(3)}
	</div>
</div>
