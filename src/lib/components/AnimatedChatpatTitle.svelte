<script lang="ts">
	import AnimatedFloatingBlob from '$lib/components/AnimatedFloatingBlob.svelte';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	export let size = 30;
	let className = '';
	export { className as class };

	const DEFAULT_ANIMATION_SPEED = 0.004;
	let animationSpeed = DEFAULT_ANIMATION_SPEED;
	let wrapperRef: HTMLDivElement;

	onMount(() => {
		wrapperRef.addEventListener('mouseover', () => {
			animationSpeed = 0.01;
		});
		wrapperRef.addEventListener('mouseleave', () => {
			animationSpeed = DEFAULT_ANIMATION_SPEED;
		});
	});
</script>

<!-- <AnimatedFloatingBlob class="h-[100px] w-[100px]" /> -->
<div
	class={cn('flex gap-2 overflow-visible font-extrabold', className)}
	style="font-size: {size | 0}px;"
	bind:this={wrapperRef}
>
	<div>Chat</div>
	<div class="group relative max-h-fit max-w-fit overflow-visible text-white">
		<div class="absolute left-0 top-0 z-[-1] h-full w-full overflow-visible">
			<AnimatedFloatingBlob
				noiseStep={animationSpeed}
				class="scale-x-[1.1] scale-y-[0.9] transition duration-[300ms]"
			/>
		</div>
		<span>Pat</span>
	</div>
</div>
