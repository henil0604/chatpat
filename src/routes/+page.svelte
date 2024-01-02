<script lang="ts">
	import { page } from '$app/stores';
	import AnimatedChatpatTitle from '$lib/components/AnimatedChatpatTitle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { login } from '$lib/modules/auth';
	import mediaQueryObserver from '$lib/utils/mediaQuery';
	import { onMount } from 'svelte';
	import { tippy } from 'svelte-tippy';
	import Confetti from 'svelte-confetti';
	import { signIn } from '@auth/sveltekit/client';

	let isMobile = mediaQueryObserver(1000);

	$: userIsHereAfterPreRegistration = $page.url.searchParams.has('prd') && $page.data.session;

	$: console.log($page.data);
</script>

{#if userIsHereAfterPreRegistration}
	<div
		class="pointer-events-none fixed left-0 top-[-50px] flex h-screen w-screen justify-center overflow-hidden"
	>
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[500, 4000]}
			duration={2000}
			amount={300}
			fallDistance="100vh"
			iterationCount={3}
		/>
	</div>
{/if}

<div class="flex w-full flex-col items-center justify-center gap-3 py-32">
	<AnimatedChatpatTitle size={$isMobile ? 50 : 100} class={$isMobile ? `gap-5` : `gap-10`} />

	<div class="text-xl font-semibold max-md:text-base">Flavor of Privacy</div>

	<div class="my-2"></div>

	{#if userIsHereAfterPreRegistration}
		<div class="max-w-[500px] px-4 text-center">
			Thank you for registration! We will try to contact you soon!
		</div>
	{/if}

	{#if userIsHereAfterPreRegistration === false && $page.data.session}
		<div class="max-w-[500px] px-4 text-center">
			Hey <b>{$page.data.session.user.name}</b>! You have already pre-registered! We will try to
			contact you soon!
		</div>
	{/if}

	{#if !$page.data.session || !$page.data.session.user}
		<Button
			size="lg"
			class="text-lg"
			on:click={() => {
				signIn(undefined, {
					callbackUrl: '/?prd=1'
				});
			}}>Pre-register</Button
		>
		<div
			use:tippy={{
				allowHTML: true,
				content:
					'<p class="text-center">Get exclusive access to upcoming pre-releases including alpha version</p>',
				placement: 'bottom',
				animation: 'scale',
				delay: 300,
				interactiveDebounce: 200,
				hideOnClick: false,
				interactiveBorder: 30
			}}
			class="cursor-pointer text-sm underline underline-offset-2"
		>
			Why Pre-register?
		</div>
	{/if}
</div>

<div
	class="wave-wrapper absolute bottom-0 left-0 z-[-3] aspect-[960/540] max-lg:aspect-[960/1200] max-md:aspect-[960/1500]"
></div>

<style scoped>
	.wave-wrapper {
		width: 100%;
		background: url('/svgs/wave1.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}
</style>
