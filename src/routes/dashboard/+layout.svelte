<script>
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	// import DropDownButton from '$lib/components/dropdown-button/DropdownButton.svelte';
	import { setContext } from 'svelte';
	import { ContextMenu } from '$lib/components/ui/context-menu';
	// import { writable } from 'svelte/store';
	// import { ContextMenuTrigger } from '$lib/components/ui/context-menu';

	let { children } = $props();

	let title = $state('Dashboard');
	setContext('title-context', {
		get value() {
			return title;
		},
		set value(val) {
			title = val;
		}
	});
</script>

<div class="back-container flex min-h-screen text-white">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main Content -->
	<div class="flex flex-grow flex-col">
		<!-- Header -->
		<header
			class="topbar flex items-center justify-between border-gray-700 bg-transparent p-4 shadow-md"
		>
			<h1 class="text-2xl font-bold">
				{title}
			</h1>
			<div class="flex items-center space-x-4">
				<div class="relative">
					<input
						type="text"
						placeholder="Search..."
						class="w-full rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
					<i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
					></i>
				</div>
				<!-- <ContextMenu></ContextMenu> -->
				<!-- <ContextMenuTrigger>
					<button> husif </button>
				</ContextMenuTrigger> -->
			</div>
		</header>

		<main class="back-container flex-grow p-6">
			{@render children()}
		</main>
	</div>
</div>
