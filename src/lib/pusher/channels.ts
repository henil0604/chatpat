import { userStore } from "$lib/store/global";
import { getPusherChannelName } from "$lib/utils/getPusherChannelName";
import type { Channel } from "pusher-js";
import { get } from "svelte/store";
import { pusher } from "$lib/pusher/client";
import type { PusherChannelNames } from "$lib/const";

const subscriptions: { [key: string]: Channel } = {};

export function getUserId() {
    return get(userStore)?.id || null;
}

export function getChannel(channelName: typeof PusherChannelNames[number]) {
    const id = getUserId();
    if (!id) return null;
    const name = getPusherChannelName(channelName, id);

    if (subscriptions[name]) return subscriptions[name];

    const channel = pusher.subscribe(name);

    channel.bind("pusher:subscription_succeeded", () => {
        console.log(`Subscribed: ${name}`)
    })

    subscriptions[name] = channel;

    return subscriptions[name];
}