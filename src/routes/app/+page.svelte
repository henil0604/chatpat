<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import Header from './Header.svelte';
	import FindFriendsDrawer from '$lib/components/FindFriendsDrawer.svelte';
	import {
		isFindFriendsDrawerOpen,
		isNotificationsDrawerOpen,
		numberOfUnreadNotifications
	} from '$lib/store/app';
	import Avatar from '$lib/components/Avatar.svelte';
	import NotificationDrawer from '$lib/components/NotificationDrawer.svelte';
	import { Icons } from '$lib/const';

	export let data: PageData;
</script>

<FindFriendsDrawer bind:open={$isFindFriendsDrawerOpen} />
<NotificationDrawer
	bind:numberOfUnreadNotifications={$numberOfUnreadNotifications}
	bind:open={$isNotificationsDrawerOpen}
/>

<div class="relative flex h-full min-w-full flex-col">
	<!-- top bar -->
	<Header />
	<div class="fancy-scrollbar min-w-full flex-grow overflow-y-auto">
		{#if data.friends.length === 0}
			<div class="flex-center h-full w-full flex-col gap-2 py-5">
				<div class="text-muted-foreground">You have no Pats</div>
				<div>
					<Button size="sm" class="gap-1" on:click={() => ($isFindFriendsDrawerOpen = true)}
						><Icon width={17} icon={Icons.Plus} /> Add</Button
					>
				</div>
			</div>
		{:else}
			{#each data.friends as friend}
				<div class="flex flex-row gap-3 border-t px-5 py-4">
					<div>
						<Avatar class="w-12 rounded-full border border-gray-400" src={friend.image} alt="" />
					</div>
					<div class="flex w-full flex-col gap-1">
						<div>
							{friend.name}
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
