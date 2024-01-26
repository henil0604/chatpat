<script lang="ts">
	import { page } from '$app/stores';
	import AnimatedChatpatTitle from '$lib/components/AnimatedChatpatTitle.svelte';
	import { Button } from '$lib/components/ui/button';
	import mediaQueryObserver from '$lib/utils/mediaQuery';
	import { tippy } from 'svelte-tippy';
	import { Mail, Twitter } from 'lucide-svelte';
	import colors from 'tailwindcss/colors';
	import { SOCIAL_EMAIL, SOCIAL_TWITTER_LINK } from '$lib/const';

	let isMobile = mediaQueryObserver(1000);

	$: console.log($page.data);
</script>

<svelte:head>
	<title>ChatPat</title>
</svelte:head>

<div class="flex w-full flex-col items-center justify-center gap-3 py-32">
	<AnimatedChatpatTitle size={$isMobile ? 50 : 100} class={$isMobile ? `gap-5` : `gap-10`} />

	<div class="text-xl font-semibold max-md:text-base">Flavor of Privacy</div>

	<div class="my-2"></div>

	<Button size="lg" class="text-lg" on:click={() => {}}>Get Started</Button>

	<div class="my-2"></div>

	<div class="flex gap-2">
		<div
			use:tippy={{
				content: 'Follow us on Twitter',
				placement: 'bottom',
				animation: 'scale',
				delay: 300,
				interactiveDebounce: 200,
				hideOnClick: false,
				interactiveBorder: 30
			}}
		>
			<Button
				size="sm"
				variant="outline"
				href={SOCIAL_TWITTER_LINK}
				class="bg-white p-3 shadow [&>svg]:stroke-sky-600"
				target="_blank"
			>
				<Twitter />
			</Button>
		</div>
		<div
			use:tippy={{
				content: 'Contact us via email',
				placement: 'bottom',
				animation: 'scale',
				delay: 300,
				interactiveDebounce: 200,
				hideOnClick: false,
				interactiveBorder: 30
			}}
		>
			<Button size="sm" href="mailto:{SOCIAL_EMAIL}" variant="outline" class="bg-white p-3 shadow">
				<Mail color={colors.red[500]} />
			</Button>
		</div>
	</div>
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
