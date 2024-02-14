<script lang="ts" context="module">
	export type MetaNotification = Notification & {
		meta: {
			[key: string]: any;
		};
	};
</script>

<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import type { Notification } from '@prisma/client';
	import { trpc } from '$lib/trpc/client';
	import colors from 'tailwindcss/colors';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import IncomingFriendRequestNotificationItem from '$lib/components/IncomingFriendRequest.NotificationItem.svelte';
	import OutgoingFriendRequestAcceptedNotificationItem from '$lib/components/OutgoingFriendRequestAccepted.NotificationItem.svelte';

	export let open: boolean = false;
	let notifications: MetaNotification[] = [];
	let loading = false;
	let fetchError = false;

	async function fetchLatestNotifications() {
		loading = true;

		const notificationsResponse = await trpc().user.getLatestNotifications.query({});

		if (notificationsResponse.code !== 'DONE') {
			fetchError = true;
			toast.error(notificationsResponse.message || 'Something went wrong', {
				duration: 5000,
				description: `CODE: ${notificationsResponse.code}`
			});
		} else {
			fetchError = false;
			notifications = notificationsResponse.data.notifications;
		}

		loading = false;
	}

	onMount(() => {
		fetchLatestNotifications();
	});
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="max-h-[80%] min-h-[30%]">
		<div class="fancy-scrollbar mx-auto w-full max-w-md overflow-auto">
			<Drawer.Header>
				<Drawer.Title class="text-left">Notifications</Drawer.Title>
			</Drawer.Header>
			<hr class="bg-gray-300" />

			<div class="w-full py-4">
				{#if loading === true}
					<div>
						<div class="flex-center w-full flex-col py-2">
							<l-ring size="30" stroke="2" bg-opacity="0" speed="1.5" color={colors.gray[700]}
							></l-ring>
						</div>
					</div>
				{:else if notifications.length === 0}
					<div class="py-2 text-center text-muted-foreground">Nothing to see</div>
				{:else}
					<div class="flex w-full flex-col">
						{#each notifications as notification}
							{#if notification.type === 'INCOMING_FRIEND_REQUEST'}
								<IncomingFriendRequestNotificationItem
									on:acceptFriendRequest={() => {
										fetchLatestNotifications();
									}}
									{notification}
									userId={notification.meta.senderUserId}
								/>
							{/if}

							{#if notification.type === 'OUTGOING_FRIEND_REQUEST_ACCEPTED'}
								<OutgoingFriendRequestAcceptedNotificationItem
									{notification}
									userId={notification.meta.receiverUserId}
								/>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
