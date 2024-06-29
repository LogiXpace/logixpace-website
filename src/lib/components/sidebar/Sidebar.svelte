<script>
	let user = {
		name: 'John Doe'
	};

	let menuItems = [
		{ name: 'Home', icon: 'home', href: '/dashboard' },
		{ name: 'Profile', icon: 'user', href: '/dashboard/profile' },
		{ name: 'Settings', icon: 'cog', href: '/dashboard/settings' },
		{ name: 'Inbox', icon: 'inbox', href: '#' },
		{ name: 'Logout', icon: 'logout', href: '/logout' }
	];
</script>

<!-- Sidebar -->
<aside class="back-container sidebar stroke flex w-64 flex-col">
	<div class="topbar stroke bg-transparent p-4 text-center">
		<h2 class="text-2xl font-bold text-blue-500">LogiXpace</h2>
		<p class="mt-2 text-gray-400">Welcome, {user.name}</p>
	</div>
	<nav class="mt-10 flex-grow">
		<ul>
			{#each menuItems as item}
				<li class="px-4 py-2 transition-colors duration-300 hover:bg-gray-700">
					<a href={item.href} class="flex items-center space-x-2">
						<i class={`fas fa-${item.icon}`}></i>
						<span>{item.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style>
	.back-container {
		@apply text-white;
		background-color: rgb(7, 7, 20);
	}

	.sidebar {
		border-right-width: 1px;
	}

	.topbar {
		border-bottom-width: 1px;
	}

	.stroke {
		@apply border-gray-700;
	}
</style>
