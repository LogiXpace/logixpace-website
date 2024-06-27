<script>
	let user = {
		name: 'John Doe'
	};

	let menuItems = [
		{ name: 'Home', icon: 'home', href: '/dashboard' },
		{ name: 'Profile', icon: 'user', href: '/dashboard/profile' },
		{ name: 'Settings', icon: 'cog', href: '/dashboard/settings' },
		{ name: 'Logout', icon: 'logout', href: '/logout' }
	];
</script>

<div class="back-container flex min-h-screen text-white">
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

	<!-- Main Content -->
	<div class="flex flex-grow flex-col">
		<!-- Header -->
		<header class="topbar stroke flex items-center justify-between bg-transparent p-4 shadow-md">
			<h1 class="text-2xl font-bold">Dashboard</h1>
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
				<button
					class="rounded bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-400"
					>Notifications</button
				>
				<button
					class="rounded bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-400"
					>Profile</button
				>
			</div>
		</header>

		<!-- Main Dashboard Content -->
		<main class="back-container flex-grow p-6">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
				<!-- Example Widget 1 -->
				<div class="rounded-lg bg-gray-800 p-6 shadow-md">
					<h2 class="mb-4 text-xl font-bold">Widget 1</h2>
					<p class="text-gray-400">Content for widget 1 goes here...</p>
				</div>
				<!-- Example Widget 2 -->
				<div class="rounded-lg bg-gray-800 p-6 shadow-md">
					<h2 class="mb-4 text-xl font-bold">Widget 2</h2>
					<p class="text-gray-400">Content for widget 2 goes here...</p>
				</div>
				<!-- Example Widget 3 -->
				<div class="rounded-lg bg-gray-800 p-6 shadow-md">
					<h2 class="mb-4 text-xl font-bold">Widget 3</h2>
					<p class="text-gray-400">Content for widget 3 goes here...</p>
				</div>
				<!-- Example Widget 3 -->
				<div class="rounded-lg bg-gray-800 p-6 shadow-md">
					<h2 class="mb-4 text-xl font-bold">Widget 3</h2>
					<p class="text-gray-400">Content for widget 3 goes here...</p>
				</div>
			</div>
		</main>
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
	.dotted-grid {
		background-image: radial-gradient(circle, #272727 1px, rgba(255, 255, 255, 0) 1px);
		background-size: 20px 20px;
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
