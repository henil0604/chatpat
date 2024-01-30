<script>
	import { loading } from '$lib/store/global';
</script>

<div
	class="flex-center absolute left-0 top-0 z-[100] h-full w-full flex-col bg-background text-foreground"
>
	<l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="black"></l-ring>
	{#if $loading.label && $loading.label.trim() !== ''}
		<div class="my-2"></div>
		<p>{$loading.label}</p>
	{/if}
</div>
