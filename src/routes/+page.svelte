<nav class="fixed w-full bg-transparent py-2 text-gray-400 shadow-lg backdrop-blur-xl">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<a href="#home" class="text-2xl font-bold"> Logic Gate simulator</a>
			<ul class="mb-0 flex justify-between space-x-4">
				<li>
					<a
						href="#home"
						class="rounded-md px-4 py-2 text-lg font-medium hover:border-2 hover:border-green-600 hover:text-green-600"
						>Home</a
					>
				</li>
				<li>
					<a
						href="#about"
						class="rounded-md px-4 py-2 text-lg font-medium hover:border-2 hover:border-yellow-600 hover:text-yellow-600"
						>About</a
					>
				</li>
				<li>
					<a
						href="#services"
						class="rounded-md px-4 py-2 text-lg font-medium hover:border-2 hover:border-blue-600 hover:text-blue-600"
						>Services</a
					>
				</li>
				<li>
					<a
						href="#contact"
						class="rounded-md px-4 py-2 text-lg font-medium hover:border-2 hover:border-red-600 hover:text-red-600"
						>Contact</a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>
<section id="home" class="h-screen w-screen">
	<div
		class=" inset-0 -z-10 flex h-screen w-screen items-center justify-center bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
	>
		<div
			class="bor flex flex-col space-y-6 rounded-2xl border-2 border-green-500 bg-white px-20 py-16"
		>
			<div class="flex flex-col space-y-1">
				<h2 class="text-center text-4xl text-green-500">
					The Customizable and perfermant<br />circuit simulator
				</h2>
			</div>
			<div class="flex items-center justify-center">
				<a href="/simulator" class="text-green-500 hover:text-green-400">
					<!-- <div
            class="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/85"
          > -->
					Get Started
					<!-- </div> -->
				</a>
			</div>
		</div>
	</div>
</section>

<section id="about" class="flex h-screen items-center justify-center bg-gray-200">
	<h1 class="text-4xl">About Content</h1>
</section>
<section id="services" class="flex h-screen items-center justify-center bg-white">
	<h1 class="text-4xl">Services Content</h1>
</section>
<section id="contact" class="flex h-screen items-center justify-center bg-gray-200">
	<h1 class="text-4xl">Contact Content</h1>
</section>

<style>
	:global(*) {
		scroll-behavior: smooth;
	}
</style>
