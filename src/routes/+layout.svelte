<script lang="ts">
	import '../app.css';

	const { children } = $props();
</script>

<svelte:head>
	<title>LogiXpace</title>
</svelte:head>

{@render children()}
