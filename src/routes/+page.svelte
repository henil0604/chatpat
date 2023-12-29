<script lang="ts">
	import AnimatedChatpatTitle from '$lib/components/AnimatedChatpatTitle.svelte';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';

	onMount(async () => {
		// basic use of trpc
		console.log(await trpc().greeting.query());
	});
</script>

<AnimatedChatpatTitle size={100} class="gap-10" />
