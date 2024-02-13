import { userStore } from "$lib/store/global";
import { get } from "svelte/store";

export function getUserId() {
    return get(userStore)?.id || null;
}

export function getNotificationChannelName() {
    const id = getUserId();
    if (!id) return null;
    return `notifications:${id}`;
}