<script>
	import DropDownButton from '$lib/components/dropdown-button/DropdownButton.svelte';
	import Sidebar from '$lib/components/Sidebar/sidebar.svelte';
	// import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
</script>

<div class="back-container flex min-h-screen text-white">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main Content -->
	<div class="flex flex-grow flex-col">
		<!-- Header -->
		<header class="topbar stroke flex items-center justify-between bg-transparent p-4 shadow-md">
			<h1 class="text-2xl font-bold">settings</h1>
			<div class="flex items-center space-x-4">
				<div class="relative">
					<input
						type="text"
						placeholder="Search..."
						class="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
					<i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
					></i>
				</div>
				<DropDownButton />
			</div>
		</header>

		<!-- Main Dashboard Content -->
		<main class="back-container flex-grow p-6"></main>
	</div>
</div>

<!-- Font Awesome for Icons -->
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
/>

<style>
	.back-container {
		@apply text-white;
		background-color: rgb(7, 7, 20);
	}

	.topbar {
		border-bottom-width: 1px;
	}

	.stroke {
		@apply border-gray-700;
	}
</style>
