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
		animation: animate 10s ease infinite alternate;
		transition: all 1s ease-in-out;
	}

	@keyframes animate {
		0% {
			border-radius: 46% 55% 77% 44% / 50% 31% 76% 63%;
		}
		15% {
			border-radius: 46% 55% 56% 64% / 50% 31% 76% 63%;
		}
		25% {
			border-radius: 34% 74% 56% 62% / 50% 24% 76% 63%;
		}
		35% {
			border-radius: 34% 74% 56% 62% / 73% 24% 76% 36%;
		}
		50% {
			border-radius: 34% 74% 33% 73% / 73% 43% 76% 38%;
		}
		60% {
			border-radius: 70% 63% 33% 73% / 73% 43% 61% 38%;
		}
		75% {
			border-radius: 70% 63% 60% 69% / 48% 43% 61% 54%;
		}
		85% {
			border-radius: 30% 63% 60% 69% / 48% 43% 61% 54%;
		}
		100% {
			border-radius: 46% 55% 77% 44% / 50% 31% 76% 63%;
		}
	}
</style>
