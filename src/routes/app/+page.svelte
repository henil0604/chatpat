<script>
	import { page } from '$app/stores';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="relative h-full min-w-full">
	<!-- top bar -->
	<div class="flex w-full justify-between bg-black px-5 py-4 text-white">
		<!-- head -->
		<div class="text-xl">ChatPat</div>
		<!-- tail -->
		<div></div>
	</div>
	<div class="fancy-scrollbar relative h-full min-w-full overflow-y-auto">
		{#each Array(30) as _, i}
			<div class="flex flex-row gap-3 px-5 py-4">
				<div>
					<Skeleton class="h-12 w-12 rounded-full bg-gray-300" />
				</div>
				<div class="flex flex-col gap-1">
					<div>
						<Skeleton class="h-[25px] w-[100px] bg-gray-300" />
					</div>
					<div>
						<Skeleton class="h-[25px] w-[300px] bg-gray-300" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
