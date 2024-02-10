<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { PageData } from './$types';
	import { Plus } from 'lucide-svelte';
	import Header from '../Header.svelte';
	import Footer from '../Footer.svelte';

	export let data: PageData;
</script>

<div class="relative flex h-full min-w-full flex-col">
	<!-- top bar -->
	<Header />
	<div class="flex-grow">hi friends!</div>
	<Footer />
</div>
