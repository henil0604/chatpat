<script>
	import '../app.pcss';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/animations/scale.css';
	import 'tippy.js/animations/perspective.css';
	import { loading, userStore } from '$lib/store/global';
	import GlobalLoading from '$lib/components/GlobalLoading.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import DesktopOnly from '$lib/components/DesktopOnly.svelte';
	import MobileOnly from '$lib/components/MobileOnly.svelte';
	import { page } from '$app/stores';

	page.subscribe(() => {
		$userStore = $page.data.session?.user;
	});

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
