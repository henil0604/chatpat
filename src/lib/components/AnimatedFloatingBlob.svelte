<script lang="ts">
	import { cn } from '$lib/utils';

	export let width: number = 0;
	export let height: number = 0;
	let className = '';
	export { className as class };
</script>

<div
	class={cn('blob ', className)}
	style="width: {width === 0 ? '100%' : `${width}px`}; height: {height === 0
		? '100%'
		: `${height}px`};"
></div>

<style scoped>
	.blob {
		animation: animate 7s ease infinite alternate forwards;
	}

	@keyframes animate {
		0% {
			border-radius: 46% 51% 58% 21% / 41% 31% 76% 63%;
		}
		25% {
			border-radius: 46% 55% 49% 74% / 50% 31% 76% 63%;
		}
		50% {
			border-radius: 19% 81% 49% 74% / 39% 31% 76% 63%;
		}
		75% {
			border-radius: 46% 55% 77% 44% / 50% 31% 76% 63%;
		}
		100% {
			border-radius: 100% 75% 92% 74% / 60% 80% 30% 70%;
		}
	}
</style>
