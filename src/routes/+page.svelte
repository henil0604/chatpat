<script lang="ts">
	import { page } from '$app/stores';
	import AnimatedChatpatTitle from '$lib/components/AnimatedChatpatTitle.svelte';
	import { Button } from '$lib/components/ui/button';
	import mediaQueryObserver from '$lib/utils/mediaQuery';
	import { tippy } from 'svelte-tippy';
	import { Mail, Twitter } from 'lucide-svelte';
	import colors from 'tailwindcss/colors';
	import { Pages, SOCIAL_EMAIL, SOCIAL_TWITTER_LINK } from '$lib/const';
	import { goto } from '$app/navigation';

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

	{#if $page.data.session?.user}
		<Button
			on:click={() => {
				goto(Pages.Application.path);
			}}
			variant="outline"
			class="flex h-fit gap-2 rounded border border-gray-300 shadow transition-all hover:shadow-lg"
		>
			<div class="flex-center h-8 w-8">
				<img
					class="rounded-full border border-gray-800"
					src={$page.data.session.user.image}
					alt=""
				/>
			</div>

			<div>
				Continue as <span class="font-bold">{$page.data.session.user.name}</span>
			</div>
		</Button>
	{:else}
		<Button
			size="lg"
			class="text-lg"
			on:click={() => {
				goto(Pages.Application.path);
			}}>Get Started</Button
		>
	{/if}

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
