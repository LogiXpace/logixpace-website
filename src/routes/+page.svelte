<script>
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
</script>

<nav class="fixed w-full bg-transparent py-2 text-gray-400 shadow-lg backdrop-blur-xl">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<a href="#" class="text-2xl font-bold text-blue-500">LogiXpace</a>

			<ul class="mb-0 flex justify-between space-x-4">
				<li>
					<a
						href="#home"
						class="hover-transition rounded-md border-2 border-transparent px-4 py-2 text-lg font-medium hover:text-blue-500"
						>Home</a
					>
				</li>
				<li>
					<a
						href="#about"
						class="hover-transition rounded-md border-2 border-transparent px-4 py-2 text-lg font-medium hover:text-blue-500"
						>About</a
					>
				</li>
				<!-- <li>
					<a
						href="#features"
						class="hover-transition rounded-md border-2 border-transparent px-4 py-2 text-lg font-medium hover:text-blue-500"
						>features</a
					>
				</li> -->
				<!-- <li>
					<a
						href="#contact"
						class="hover-transition rounded-md border-2 border-transparent px-4 py-2 text-lg font-medium hover:text-blue-500"
						>Contact</a
					>
				</li>
				<li>
					<a
						href="/#blog"
						class="hover: hover-transition rounded-md border-2 border-blue-500 px-4 py-2 text-lg font-medium hover:bg-blue-500 hover:text-white"
						>Blog</a
					>
				</li> -->
			</ul>
			<!-- <div class="flex space-x-4">
				<a
					href="/login"
					class="hover-transition rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-400"
					>Login</a
				>
				<a
					href="/signup"
					class="hover-transition rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-400"
					>Sign Up</a
				>
			</div> -->
		</div>
	</div>
</nav>

<!-- 
<nav
	class="fixed bottom-0 flex items-center justify-center space-x-2 rounded-full border bg-background px-4 py-3"
>
	<div
		class="inline-flex cursor-pointer rounded-full border px-5 py-3 text-lg transition-all duration-300 hover:scale-110 hover:border-0 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary"
	>
		Home
	</div>
	<div
		class="inline-flex cursor-pointer rounded-full border px-5 py-3 text-lg transition-all duration-300 hover:scale-110 hover:border-0 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary"
	>
		About
	</div>
</nav> -->

<section
	id="home"
	class="dotted-grid flex h-[80vh] flex-col items-center justify-center text-center"
>
	<h1 class="text-4xl font-bold md:text-6xl">Welcome to LogiXpace</h1>
	<p class="mt-4 text-lg md:text-xl">
		An interactive way to learn and experiment with logic gates.
	</p>
	<p class="mt-4 text-lg font-bold md:text-3xl">We are launching soon, stay tuned!</p>
	<div class="mt-6 flex justify-center space-x-4">
		<Input type="text" placeholder="Drop your email here" class="min-w-96 bg-background" />
		<Button class="flex items-center justify-center space-x-2">
			<i class="fas fa-paper-plane"></i>
			<span>Get Notified</span>
		</Button>
	</div>
	<p class="mt-4 text-lg font-bold md:text-xl">
		btw, you can get early access to the simulator here:
	</p>
	<div class="mt-6 flex justify-center space-x-4">
		<Button href="/simulator">Launch Simulator</Button>
	</div>
</section>

<section id="about" class=" py-20 text-center text-white">
	<h2 class="glow text-3xl font-bold md:text-4xl">Why choose LogiXpace?</h2>

	<p class="mx-auto mt-4 max-w-3xl text-lg md:text-xl">
		The LogiXpace is a comprehensive tool designed to help students, educators, and hobbyists
		understand the fundamentals of logic gates and digital circuits. Our platform provides an
		interactive and hands-on experience, allowing users to build and simulate digital circuits in
		real-time.
	</p>
	<p class="mx-auto mt-4 max-w-3xl text-lg md:text-xl">
		Whether you are a beginner looking to learn the basics of logic gates or an advanced user
		interested in experimenting with complex circuits, our simulator helps you understand the
		fundamentals of logic gates in a hands-on environment and offers a wide range of features to
		suit your needs. With step-by-step tutorials, real-time simulation, and a user-friendly
		interface, the LogiXpace makes learning digital logic both fun and effective.
	</p>
	<p class="mx-auto mt-4 max-w-3xl text-lg md:text-xl">
		Join our community of learners and start exploring the fascinating world of digital logic today!
	</p>
</section>

<!-- 
  if two elements are similar in information and function, they should be grouped together, less space between them.
  if the opposite is true, they should be separated by more space

-->
<footer class="py-4 text-white">
	<div class="container mx-auto text-center">
		<p>&copy; 2024 LogiXpace. All rights reserved.</p>
	</div>
</footer>

<style>
	:global(*) {
		scroll-behavior: smooth;
	}

	section,
	footer {
		@apply text-white;
		background: rgb(7, 7, 20);
	}

	.hover-transition {
		@apply transition-all duration-300;
	}

	.dotted-grid {
		background-image: radial-gradient(circle, #272727 1px, rgba(255, 255, 255, 0) 1px);
		background-size: 20px 20px;
	}
</style>
