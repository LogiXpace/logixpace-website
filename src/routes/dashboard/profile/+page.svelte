<script lang="ts">
	import { getContext } from 'svelte';
	let title = getContext('title-context');
	title.value = 'Profile';
</script>
