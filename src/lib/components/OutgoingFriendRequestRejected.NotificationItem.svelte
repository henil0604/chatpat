<script lang="ts">
	import { getBasicUserInfoById } from '$lib/utils/getBasicUserInfoById';
	import Avatar from '$lib/components/Avatar.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import moment from 'moment';
	import type { MetaNotification } from '$lib/components/NotificationDrawer.svelte';
	import { loadingAction } from 'svelte-legos';

	export let userId: string;
	export let notification: MetaNotification;

	let userPromise = getBasicUserInfoById(userId);
	let loading = false;
</script>

{#await userPromise}
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
	</div>
{:then user}
	<div
		use:loadingAction={loading}
		class="flex flex-row gap-3 px-5 py-2"
		class:bg-blue-100={!notification.read}
	>
		<div>
			<Avatar class="min-w-10 rounded-full border border-gray-400" src={user?.image} alt="" />
		</div>
		<div class="flex w-full flex-grow flex-col gap-0">
			<div class="text-sm">
				<b>{user?.name}</b> has rejected your friend request.
			</div>
			<div class="text-xs text-muted-foreground">
				{moment(notification.createdAt).fromNow()}
			</div>
		</div>
	</div>
{/await}
