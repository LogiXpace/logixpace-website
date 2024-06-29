<script>
	let isOpen = $state(false);

	function toggleDropdown() {
		isOpen = !isOpen;
	}
</script>

<div class="relative">
	<button
		onclick={toggleDropdown}
		class="rounded bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-500"
	>
		<div class="flex items-center gap-1 space-x-2">
			Notifications
			<i class="fas fa-caret-down text-white"></i>
		</div>
	</button>
	{#if isOpen}
		<div class="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 text-white shadow-lg">
			<a href="/dashboard/profile" class="block px-4 py-2 hover:bg-gray-700">Profile</a>
			<a href="/dashboard/settings" class="block px-4 py-2 hover:bg-gray-700">Settings</a>
			<a href="/logout" class="block px-4 py-2 hover:bg-gray-700">Logout</a>
		</div>
	{/if}
</div>
