<script>
	import { Button } from '$lib/components/ui/button';
	import { isNotificationsDrawerOpen, numberOfUnreadNotifications } from '$lib/store/app';
	import { Bell } from 'lucide-svelte';
</script>

<div class="flex h-fit w-full justify-between bg-black px-5 py-4 text-white">
	<!-- head -->
	<div class="text-xl">ChatPat</div>
	<!-- tail -->
	<div class="flex gap-1">
		<Button
			variant="ghost"
			size="sm"
			on:click={() => ($isNotificationsDrawerOpen = true)}
			class="relative h-fit w-fit rounded-full p-1"
		>
			{#if $numberOfUnreadNotifications > 0}
				<div class="absolute right-0 top-0 h-2 w-2 rounded-full bg-blue-600"></div>
			{/if}
			<Bell size={20} />
		</Button>
	</div>
</div>
