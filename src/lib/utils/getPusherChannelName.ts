import type { PusherChannelNames } from "$lib/const";

export function getPusherChannelName(channel: typeof PusherChannelNames[number], secret: string) {
    return `${channel}.${secret}`;
}