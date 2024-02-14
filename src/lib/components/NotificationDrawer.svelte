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
	import OutgoingFriendRequestRejectedNotificationItem from '$lib/components/OutgoingFriendRequestRejected.NotificationItem.svelte';
	import { getChannel } from '$lib/pusher/channels';
	import OutgoingFriendRequestAccepted from '$lib/components/OutgoingFriendRequestAccepted.NotificationItem.svelte';
	import OutgoingFriendRequestRejected from '$lib/components/OutgoingFriendRequestRejected.NotificationItem.svelte';

	export let open: boolean = false;
	let notifications: MetaNotification[] = [];
	let notificationComponents: {
		[key: string]:
			| IncomingFriendRequestNotificationItem
			| OutgoingFriendRequestAccepted
			| OutgoingFriendRequestRejected;
	} = {};
	let loading = false;
	// TODO resolve this
	let fetchError = false;

	async function fetchLatestNotifications() {
		loading = true;

		const notificationsResponse = await trpc().user.getLatestNotifications.query();

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

	async function fetchNotificationById(id: string) {
		const notificationResponse = await trpc().user.getNotificationById.query({
			id: id
		});

		console.log('notificationResponse?', notificationResponse);

		if (notificationResponse.code !== 'DONE') {
			toast.error(notificationResponse.message || 'Something went wrong', {
				duration: 5000,
				description: `CODE: ${notificationResponse.code}`
			});
		} else {
			// if notification is already there
			if (notifications.find((e) => e.id === id)) {
				notifications = notifications.map((notification) => {
					if (notification.id === id) {
						// replace old data with new data
						return {
							...notificationResponse.data.notification
						};
					}
					return notification;
				});
			} else {
				// its a new notification, push it to the top
				notifications = [notificationResponse.data.notification, ...notifications];
			}
		}
	}

	onMount(() => {
		fetchLatestNotifications();

		// on new notification
		getChannel('NOTIFICATION')?.bind('new', (data: any) => {
			if (!data.notificationId) return;
			fetchNotificationById(data.notificationId);
		});
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
							{#key notification.id}
								{#if notification.type === 'INCOMING_FRIEND_REQUEST'}
									<IncomingFriendRequestNotificationItem
										on:acceptFriendRequest={() => {
											fetchNotificationById(notification.id);
											notificationComponents[notification.id].refetch();
										}}
										on:rejectFriendRequest={() => {
											fetchNotificationById(notification.id);
											notificationComponents[notification.id].refetch();
										}}
										bind:this={notificationComponents[notification.id]}
										{notification}
										bind:userId={notification.meta.senderUserId}
										bind:friendRequestId={notification.meta.friendRequestId}
									/>
								{/if}

								{#if notification.type === 'OUTGOING_FRIEND_REQUEST_ACCEPTED'}
									<OutgoingFriendRequestAcceptedNotificationItem
										bind:this={notificationComponents[notification.id]}
										{notification}
										bind:userId={notification.meta.receiverUserId}
									/>
								{/if}

								{#if notification.type === 'OUTGOING_FRIEND_REQUEST_REJECTED'}
									<OutgoingFriendRequestRejectedNotificationItem
										bind:this={notificationComponents[notification.id]}
										{notification}
										bind:userId={notification.meta.receiverUserId}
									/>
								{/if}
							{/key}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
