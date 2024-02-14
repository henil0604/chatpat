<script lang="ts">
	import { getBasicUserInfoById } from '$lib/utils/getBasicUserInfoById';
	import Avatar from '$lib/components/Avatar.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import moment from 'moment';
	import type { MetaNotification } from '$lib/components/NotificationDrawer.svelte';
	import { loadingAction } from 'svelte-legos';
	import { trpc } from '$lib/trpc/client';
	import { toast } from 'svelte-sonner';
	import { createEventDispatcher } from 'svelte';

	export let userId: string;
	export let notification: MetaNotification;
	let userPromise = getBasicUserInfoById(userId);
	let loading = false;

	let eventDispatcher = createEventDispatcher();

	async function handleAcceptFriendRequest() {
		loading = true;

		const acceptFriendRequestResponse = await trpc().user.acceptFriendRequest.query({
			userId
		});

		if (acceptFriendRequestResponse.code !== 'DONE') {
			toast.error(acceptFriendRequestResponse.message || 'Something went wrong', {
				duration: 5000,
				description: `CODE: ${acceptFriendRequestResponse.code}`
			});
			return false;
		}

		loading = false;
		eventDispatcher('acceptFriendRequest');
	}
</script>

{#await userPromise}
	<!--  -->
	<div class="flex flex-row gap-3 px-5 py-2">
		<div>
			<Skeleton class="h-12 w-12 rounded-full border bg-gray-400" />
		</div>
		<div class="flex w-full flex-grow flex-col gap-1">
			<div>
				<Skeleton class="h-[16px] w-[60%] bg-gray-300" />
			</div>
			<div class="w-full">
				<Skeleton class="h-[14px] w-[30%] bg-gray-300" />
			</div>
		</div>
		<div class="flex gap-1">
			<Skeleton class="h-8 w-14 bg-gray-600" />
			<Skeleton class="h-8 w-14 bg-gray-600" />
		</div>
	</div>
{:then user}
	<div use:loadingAction={loading} class="flex flex-row gap-3 px-5 py-2">
		<div>
			<Avatar class="min-w-10 rounded-full border border-gray-400" src={user?.image} alt="" />
		</div>
		<div class="flex w-full flex-grow flex-col gap-0">
			<div class="text-sm">
				{#if user?.isFriend}
					<b>{user?.name}</b> is now your friend
				{:else}
					<b>{user?.name}</b> wants to add you as a friend
				{/if}
			</div>
			<div class="text-xs text-muted-foreground">
				{moment(notification.createdAt).fromNow()}
			</div>
		</div>
		{#if !user?.isFriend}
			<div class="flex gap-1">
				<Button on:click={handleAcceptFriendRequest} size="sm">Accept</Button>
				<Button size="sm" variant="outline" class="bg-gray-100">Reject</Button>
			</div>
		{/if}
	</div>
{/await}
