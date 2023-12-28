<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';

	onMount(async () => {
		// basic use of trpc
		console.log(await trpc().greeting.query());
	});
</script>

<Button variant="default" class="shadow">Hello World</Button>
