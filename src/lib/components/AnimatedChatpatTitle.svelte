<script lang="ts">
	import AnimatedFloatingBlob from '$lib/components/AnimatedFloatingBlob.svelte';
	import { cn } from '$lib/utils';

	export let size = 30;
	let className = '';
	export { className as class };
</script>

<div
	class={cn('flex gap-2 overflow-visible font-extrabold', className)}
	style="font-size: {size | 0}px;"
>
	<div>Chat</div>
	<div class="group relative overflow-visible text-white">
		<div class="absolute left-0 top-0 z-[-1] h-full w-full">
			<AnimatedFloatingBlob
				class="scale-x-[1.3] scale-y-[1.1] bg-black transition duration-[300ms]"
			/>
		</div>
		<span>Pat</span>
	</div>
</div>
