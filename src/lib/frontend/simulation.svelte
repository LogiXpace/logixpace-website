<script context="module" lang="ts">
	export interface Props {
		scaleFactor: number;
	}
</script>

<script lang="ts">
	import { Vector2D } from '$lib/helpers/vector2d';
	import { onMount } from 'svelte';
	// import { Pin as BackendPin } from '$lib/chim/core/pin';
	import { SimulatuionEventEmitter } from './simulation-event';
	import { BoxCollider } from '$lib/helpers/colliders';
	import { CanvasStyle } from '$lib/helpers/canvas-style';
	import { drawRectangle, drawCircle, drawLine, clearCanvas } from '$lib/helpers/draw';
	import { HSL } from '$lib/helpers/color';

	const { scaleFactor }: Props = $props();

	let simulationElement: HTMLDivElement;
	let canvas: HTMLCanvasElement;

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

		function handleMouseMove(e: MouseEvent) {}

		window.addEventListener('resize', handleResize);

		const pins: Pin[] = [];

		for (let i = 0; i < 100; i++) {
			pins.push(
				new Pin({
					namedPin: {
						name: 'pin',
						pin: new BackendPin(0)
					},
					position: new Vector2D(i * 25, i * 25),
					direction: new Vector2D(1, 0)
				})
			);
		}

		const gridSize = 10;
		const gridRadius = 1;

		function draw(ctx: CanvasRenderingContext2D) {
			clearCanvas(ctx);

			for (let x = 0; x < canvas.width; x += gridSize) {
				for (let y = 0; y < canvas.height; y += gridSize) {
					drawCircle(
						ctx,
						x,
						y,
						gridRadius,
						new CanvasStyle({
							fillColor: new HSL(0, 0, 0.5)
						})
					);
				}
			}

			for (let i = 0; i < pins.length; i++) {
				const pin = pins[i];
				pin.draw(ctx);
			}
		}

		// Redraw shapes continuously
		function animate(ctx: CanvasRenderingContext2D) {
			draw(ctx);
			requestAnimationFrame(() => animate(ctx));
		}

		// Start animation
		animate(ctx);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="h-full w-full" bind:this={simulationElement}>
	<canvas bind:this={canvas}></canvas>
</div>
