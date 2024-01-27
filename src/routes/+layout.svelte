<script>
	import '../app.pcss';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/animations/scale.css';
	import 'tippy.js/animations/perspective.css';
	import { loading } from '$lib/store/global';
	import GlobalLoading from '$lib/components/GlobalLoading.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, mode } from 'mode-watcher';
</script>

{#if $loading === true}
	<GlobalLoading />
{/if}

<ModeWatcher defaultMode={'light'} />
<Toaster richColors theme={$mode} />

<slot />
