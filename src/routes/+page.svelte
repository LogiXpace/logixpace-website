<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { EmailSchema } from '$lib/validations/email';
	import * as v from 'valibot';

	let value = $state('');
	let message = $state('');
	let currState = $state<'idle' | 'success' | 'error'>('idle');

	function validate() {
		const valid = v.safeParse(EmailSchema, value);
		if (!valid.success) {
			currState = 'error';
			message = valid.issues[0].message;
			return false;
		} else {
			currState = 'idle';
			message = '';
			return true;
		}
	}

	const handleSubmit = () => {
		if (!validate()) return;
		fetch('/api/waitlist', {
			method: 'POST',
			body: value,
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(async (res) => {
			message = await res.text();
			if (res.status === 200) {
				currState = 'success';
			} else {
				currState = 'error';
			}
		});
	};

	$effect(() => {
		if (value === '') {
			return;
		}

		validate();
	});
</script>

<section class="relative flex h-screen w-screen flex-col items-center justify-center p-24">
	<div
		class="absolute left-0 top-0 -z-50 h-full w-full blur-3xl filter [background:radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.3),transparent_50%)] lg:[background:radial-gradient(circle_at_20%_49%,hsl(var(--primary)/0.3),transparent_50%)]"
	></div>
	<div class="grid grid-cols-1 grid-rows-1 lg:grid-cols-2 lg:gap-x-4">
		<div class="flex flex-col items-center justify-center lg:items-start">
			<span
				class="mb-2 w-fit rounded-full border border-primary bg-primary/55 px-1.5 py-1 text-xs text-primary-foreground"
			>
				LogiXpace
			</span>
			<h1
				class="-leading-tight mb-4 text-center text-6xl font-bold tracking-tight text-foreground lg:text-left"
			>
				Where Circuit Design Comes to Life
			</h1>
			<p class="mb-8 text-center leading-normal tracking-wider lg:text-left">
				At LogiXpace, we empower you to bring your electronic circuit ideas to reality. Whether
				you're a hobbyist, student, or professional engineer, our intuitive platform offers the
				tools you need to create and simulate complex circuits with ease.
			</p>
			<div class="mb-4 flex flex-col">
				<div class="flex items-center space-x-2">
					<Input
						bind:value
						class="data-[state='success']:border-success data-[state='success']:ring-success data-[state='success']:text-success-foreground min-w-48 bg-background/40 data-[state='error']:border-destructive data-[state='error']:text-destructive-foreground data-[state='error']:ring-destructive lg:w-96"
						data-state={currState}
						placeholder="drop your email to get regular updates"
						type="email"
					/>
					<Button class="w-fit" onclick={handleSubmit}>Get Notified</Button>
				</div>
				{#if currState !== 'idle'}
					<span
						data-state={currState}
						class="data-[state='success']:text-success-foreground mt-0.5 text-sm data-[state='error']:text-destructive-foreground"
					>
						{message}
					</span>
				{/if}
			</div>
			<p class="font-semibold">
				btw, you can try the <a
					href="/simulator"
					class="text-primary/80 transition-colors duration-150 hover:text-primary hover:underline"
					>simulator</a
				>
				now!
			</p>
			<div class="mt-6 flex items-center space-x-2">
				<Button
					variant="outline"
					size="icon"
					class="group flex items-center justify-center bg-background/40 hover:bg-primary/40"
					href="https://github.com/LogiXpace/logixpace-website"
					target="_blank"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M10 1.25C5.16562 1.25 1.25 5.16562 1.25 10C1.25 13.8719 3.75469 17.1422 7.23281 18.3016C7.67031 18.3781 7.83437 18.1156 7.83437 17.8859C7.83437 17.6781 7.82344 16.9891 7.82344 16.2563C5.625 16.6609 5.05625 15.7203 4.88125 15.2281C4.78281 14.9766 4.35625 14.2 3.98438 13.9922C3.67812 13.8281 3.24063 13.4234 3.97344 13.4125C4.6625 13.4016 5.15469 14.0469 5.31875 14.3094C6.10625 15.6328 7.36406 15.2609 7.86719 15.0312C7.94375 14.4625 8.17344 14.0797 8.425 13.8609C6.47813 13.6422 4.44375 12.8875 4.44375 9.54062C4.44375 8.58906 4.78281 7.80156 5.34062 7.18906C5.25313 6.97031 4.94687 6.07344 5.42812 4.87031C5.42812 4.87031 6.16094 4.64063 7.83437 5.76719C8.53438 5.57031 9.27813 5.47187 10.0219 5.47187C10.7656 5.47187 11.5094 5.57031 12.2094 5.76719C13.8828 4.62969 14.6156 4.87031 14.6156 4.87031C15.0969 6.07344 14.7906 6.97031 14.7031 7.18906C15.2609 7.80156 15.6 8.57812 15.6 9.54062C15.6 12.8984 13.5547 13.6422 11.6078 13.8609C11.925 14.1344 12.1984 14.6594 12.1984 15.4797C12.1984 16.65 12.1875 17.5906 12.1875 17.8859C12.1875 18.1156 12.3516 18.3891 12.7891 18.3016C14.5261 17.7152 16.0355 16.5988 17.1048 15.1096C18.1741 13.6204 18.7495 11.8333 18.75 10C18.75 5.16562 14.8344 1.25 10 1.25Z"
						></path></svg
					>
				</Button>
			</div>
		</div>
	</div>
</section>
