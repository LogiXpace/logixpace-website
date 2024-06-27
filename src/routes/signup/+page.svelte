<script>
	let form = {
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	};

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	function handleSubmit(event) {
		event.preventDefault();
		console.log(form);
		// Add sign-up logic here (e.g., register the user with a server)
		alert('Sign up submitted successfully!');
	}
</script>

<div class="back-container dotted-grid h-screen overflow-hidden">
	<div class="absolute bg-transparent px-10 py-8 text-blue-500">
		<a href="/" class="text-3xl font-bold"> LogiXpace </a>
	</div>
	<div class="flex min-h-screen items-center justify-center bg-transparent">
		<div class="w-full max-w-md rounded-lg bg-gray-800 p-8 text-white shadow-md">
			<h2 class=" mb-6 text-center text-3xl font-bold">Sign Up</h2>
			<form on:submit={handleSubmit}>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-bold text-gray-400" for="name">Name</label>
					<input
						id="name"
						type="text"
						bind:value={form.name}
						class="focus:shadow-outline w-full appearance-none rounded border bg-gray-900 px-3 py-2 leading-tight text-gray-300 shadow focus:outline-none"
						required
					/>
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-bold text-gray-400" for="email">Email</label>
					<input
						id="email"
						type="email"
						bind:value={form.email}
						class="focus:shadow-outline w-full appearance-none rounded border bg-gray-900 px-3 py-2 leading-tight text-gray-300 shadow focus:outline-none"
						required
					/>
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-bold text-gray-400" for="password">Password</label>
					<input
						id="password"
						type="password"
						bind:value={form.password}
						class="focus:shadow-outline w-full appearance-none rounded border bg-gray-900 px-3 py-2 leading-tight text-gray-300 shadow focus:outline-none"
						required
					/>
				</div>
				<div class="mb-6">
					<label class="mb-2 block text-sm font-bold text-gray-400" for="confirmPassword"
						>Confirm Password</label
					>
					<input
						id="confirmPassword"
						type="password"
						bind:value={form.confirmPassword}
						class="focus:shadow-outline w-full appearance-none rounded border bg-gray-900 px-3 py-2 leading-tight text-gray-300 shadow focus:outline-none"
						required
					/>
				</div>
				<div class="flex items-center justify-between">
					<button
						type="submit"
						class="focus:shadow-outline w-full rounded bg-blue-600 px-4 py-2 font-bold text-white transition-all duration-300 hover:bg-blue-400 focus:outline-none"
					>
						Sign Up
					</button>
				</div>
				<div class="mt-4 text-center">
					<a href="/login" class="text-blue-400 transition-all duration-300 hover:text-blue-600"
						>Already have an account? Login</a
					>
				</div>
			</form>
		</div>
	</div>
</div>

<style>
	.back-container {
		@apply text-white;
		background: rgb(7, 7, 20);
	}
	.dotted-grid {
		background-image: radial-gradient(circle, #272727 1px, rgba(255, 255, 255, 0) 1px);
		background-size: 20px 20px;
	}
</style>
