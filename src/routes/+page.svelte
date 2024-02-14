<script lang="ts">
	import { page } from '$app/stores';
	import AnimatedChatpatTitle from '$lib/components/AnimatedChatpatTitle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { tippy } from 'svelte-tippy';
	import { Mail, Twitter } from 'lucide-svelte';
	import colors from 'tailwindcss/colors';
	import { Pages, SOCIAL_EMAIL, SOCIAL_TWITTER_LINK } from '$lib/const';
	import { goto } from '$app/navigation';
	import Avatar from '$lib/components/Avatar.svelte';
	import DesktopOnly from '$lib/components/DesktopOnly.svelte';
	import MobileOnly from '$lib/components/MobileOnly.svelte';
</script>

<svelte:head>
	<title>ChatPat</title>
</svelte:head>

<div class="flex w-full flex-col items-center justify-center gap-3 py-32">
	<DesktopOnly>
		<AnimatedChatpatTitle size={100} class="gap-10" />
	</DesktopOnly>

	<MobileOnly>
		<AnimatedChatpatTitle size={50} class="gap-5" />
	</MobileOnly>

	<div class="text-xl font-semibold max-md:text-base">Flavor of Privacy</div>

	<div class="my-2"></div>

	{#if $page.data.session?.user}
		<Button
			on:click={() => {
				goto(Pages.Application.path);
			}}
			class="flex h-fit gap-2 rounded border border-gray-300 shadow transition-all hover:shadow-lg"
		>
			<div class="flex-center h-8 w-8">
				<Avatar class="rounded border border-gray-800" src={$page.data.session.user.image} />
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
