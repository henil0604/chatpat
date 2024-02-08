<script>
	import '../app.pcss';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/animations/scale.css';
	import 'tippy.js/animations/perspective.css';
	import { loading } from '$lib/store/global';
	import GlobalLoading from '$lib/components/GlobalLoading.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import DesktopOnly from '$lib/components/DesktopOnly.svelte';
	import MobileOnly from '$lib/components/MobileOnly.svelte';
	import { browser, dev } from '$app/environment';

	async function initializeVercel() {
		if (browser) return;
		const { logger, LogType } = await import('$lib/server/modules/log');
		const log = logger().prefix('initializeVercel');
		const { isVercel } = await import('$lib/server/utils/isVercel');
		// if not vercel, return
		if (isVercel() === false) {
			log.type(LogType.OK).message('Vercel not detected').commit();
			return;
		}

		log.type(LogType.OK).message('Initializing vercel dependencies').commit();

		const { inject } = await import('@vercel/analytics');
		const { injectSpeedInsights } = await import('@vercel/speed-insights/sveltekit');

		inject({ mode: dev ? 'development' : 'production' });
		injectSpeedInsights();
	}

	initializeVercel();

	onMount(() => {
		import('ldrs/ring');
	});
</script>

{#if $loading.show === true}
	{#if $loading.device === 'desktop'}
		<DesktopOnly>
			<GlobalLoading />
		</DesktopOnly>
	{:else if $loading.device === 'mobile'}
		<MobileOnly>
			<GlobalLoading />
		</MobileOnly>
	{:else}
		<GlobalLoading />
	{/if}
{/if}

<ModeWatcher defaultMode={'light'} />
<Toaster richColors theme={$mode} />

<slot />
