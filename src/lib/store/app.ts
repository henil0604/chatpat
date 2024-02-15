import { writable } from "svelte/store";

export let isFindFriendsDrawerOpen = writable(false);

export let isNotificationsDrawerOpen = writable(false);

export let numberOfUnreadNotifications = writable(0);