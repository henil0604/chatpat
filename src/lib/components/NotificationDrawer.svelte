<script lang="ts" context="module">
	export type MetaNotification = Notification & {
		meta: {
			[key: string]: any;
		};
	};
	export type ContextType = {
		notifications: Writable<MetaNotification[]>;
		'notifications.getById': (id: string) => MetaNotification | undefined;
	};
</script>

<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import type { Notification } from '@prisma/client';
	import { trpc } from '$lib/trpc/client';
	import colors from 'tailwindcss/colors';
	import { onMount, setContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import IncomingFriendRequestNotificationItem from '$lib/components/IncomingFriendRequest.NotificationItem.svelte';
	import OutgoingFriendRequestAcceptedNotificationItem from '$lib/components/OutgoingFriendRequestAccepted.NotificationItem.svelte';
	import OutgoingFriendRequestRejectedNotificationItem from '$lib/components/OutgoingFriendRequestRejected.NotificationItem.svelte';
	import { getChannel } from '$lib/pusher/channels';
	import OutgoingFriendRequestAccepted from '$lib/components/OutgoingFriendRequestAccepted.NotificationItem.svelte';
	import OutgoingFriendRequestRejected from '$lib/components/OutgoingFriendRequestRejected.NotificationItem.svelte';
	import { writable, type Writable } from 'svelte/store';

	export let open: boolean = false;
	let notifications = writable<MetaNotification[]>([]);
	let notificationComponents: {
		[key: string]:
			| IncomingFriendRequestNotificationItem
			| OutgoingFriendRequestAccepted
			| OutgoingFriendRequestRejected
			| undefined;
	} = {};
	let wrapperElementRefs: {
		[key: string]: HTMLDivElement;
	} = {};
	let loading = false;
	// TODO resolve this
	let fetchError = false;
	export let numberOfUnreadNotifications: number;

	$: numberOfUnreadNotifications = $notifications.filter(
		(notification) => notification.read === false
	).length;

	function getLocalNotificationById(id: string) {
		return $notifications.find((e) => e.id === id);
	}

	// set the local notification to context
	setContext<ContextType['notifications']>('notifications', notifications);
	setContext<ContextType['notifications.getById']>(
		'notifications.getById',
		getLocalNotificationById
	);

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
			$notifications = notificationsResponse.data.notifications;
		}

		loading = false;
	}

	async function fetchNotificationById(id: string) {
		const notificationResponse = await trpc().user.getNotificationById.query({
			id: id
		});

		if (notificationResponse.code !== 'DONE') {
			toast.error(notificationResponse.message || 'Something went wrong', {
				duration: 5000,
				description: `CODE: ${notificationResponse.code}`
			});
		} else {
			// if notification is already there
			if (getLocalNotificationById(id)) {
				$notifications = $notifications.map((notification) => {
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
				$notifications = [notificationResponse.data.notification, ...$notifications];
			}
		}
	}

	async function markNotificationAsRead(notificationId: string) {
		const markNotificationAsReadResponse = await trpc().user.markNotificationAsRead.mutate({
			notificationId
		});

		if (markNotificationAsReadResponse.error) {
			toast.error(markNotificationAsReadResponse.message || 'Something went wrong', {
				duration: 5000,
				description: `CODE: ${markNotificationAsReadResponse.code}`
			});
			return;
		}

		$notifications = $notifications.map((notification) => {
			if (notification.id === notificationId) {
				notification.read = true;
			}
			return notification;
		});
	}

	async function observeNotificationWrapperElementVisibility(
		element: HTMLElement,
		durationInSeconds: number = 2
	) {
		let isVisibleForDuration = false;
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Element is currently on the screen
					setTimeout(() => {
						const notificationId = element.dataset?.notificationId;
						// Check if the element is still on the screen after the timeout
						if (isVisibleForDuration && notificationId) {
							// mark the notification read
							markNotificationAsRead(notificationId);
						}
					}, durationInSeconds * 1000); // Convert seconds to milliseconds for setTimeout

					isVisibleForDuration = true;
				} else {
					// Element is not on the screen
					isVisibleForDuration = false;
				}
			});
		});

		observer.observe(element);
	}

	$: if (wrapperElementRefs) {
		for (const notificationId in wrapperElementRefs) {
			const ref = wrapperElementRefs[notificationId];
			if (!ref) continue;

			observeNotificationWrapperElementVisibility(ref);
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
				{:else if $notifications.length === 0}
					<div class="py-2 text-center text-muted-foreground">Nothing to see</div>
				{:else}
					<div class="flex w-full flex-col">
						{#each $notifications as notification, index}
							{#key notification.id}
								<div
									bind:this={wrapperElementRefs[notification.id]}
									data-notification-id={notification.id}
								>
									{#if notification.type === 'INCOMING_FRIEND_REQUEST'}
										<IncomingFriendRequestNotificationItem
											on:acceptFriendRequest={() => {
												fetchNotificationById(notification.id);
												notificationComponents[notification.id]?.refetch();
											}}
											on:rejectFriendRequest={() => {
												fetchNotificationById(notification.id);
												notificationComponents[notification.id]?.refetch();
											}}
											bind:this={notificationComponents[notification.id]}
											bind:notificationId={notification.id}
											bind:userId={notification.meta.senderUserId}
											wrapperElement={void 0}
											bind:friendRequestId={notification.meta.friendRequestId}
										/>
									{/if}

									{#if notification.type === 'OUTGOING_FRIEND_REQUEST_ACCEPTED'}
										<OutgoingFriendRequestAcceptedNotificationItem
											bind:this={notificationComponents[notification.id]}
											bind:notificationId={notification.id}
											bind:userId={notification.meta.receiverUserId}
										/>
									{/if}

									{#if notification.type === 'OUTGOING_FRIEND_REQUEST_REJECTED'}
										<OutgoingFriendRequestRejectedNotificationItem
											bind:this={notificationComponents[notification.id]}
											bind:notificationId={notification.id}
											bind:userId={notification.meta.receiverUserId}
										/>
									{/if}
								</div>
							{/key}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
