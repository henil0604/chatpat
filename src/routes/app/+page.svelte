<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { PageData } from './$types';
	import { Plus } from 'lucide-svelte';
	import Header from './Header.svelte';
	import FindFriendsDrawer from '$lib/components/FindFriendsDrawer.svelte';
	import { isFindFriendsDrawerOpen } from '$lib/store/app';

	export let data: PageData;
</script>

<FindFriendsDrawer bind:open={$isFindFriendsDrawerOpen} />

<div class="relative flex h-full min-w-full flex-col">
	<!-- top bar -->
	<Header />
	<div class="fancy-scrollbar min-w-full flex-grow overflow-y-auto">
		{#if data.friends.length === 0}
			<div class="flex-center h-full w-full flex-col gap-2 py-5">
				<div class="text-muted-foreground">You have no Pats</div>
				<div>
					<Button size="sm" class="gap-1" on:click={() => ($isFindFriendsDrawerOpen = true)}
						><Plus /> Add</Button
					>
				</div>
			</div>
		{:else}
			{#each Array(20) as _, i}
				<div class="flex flex-row gap-3 border-t px-5 py-4">
					<div>
						<Skeleton class="h-10 w-10 rounded-full bg-gray-300" />
					</div>
					<div class="flex w-full flex-col gap-1">
						<div>
							<Skeleton class="h-[20px] w-[100px] bg-gray-300" />
						</div>
						<div class="w-full">
							<Skeleton class="h-[16px] w-[90%] bg-gray-300" />
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
