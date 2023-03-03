import { setRoomProp } from "@/store/room";
import { Channel } from "pusher-js";
import pusher from "./pusher-client";

interface initPusherChannelProps {
    room: any;
    user: any;
    client: any
}

export interface pusherClientI {
    // channel: Channel;
    bindIfNotExist: (event: string, fun: any) => boolean;

}

export default function initPusherClient({ room, user, client }: initPusherChannelProps): pusherClientI {
    const channel = pusher.subscribe(`r-${room.id}`)

    const bindIfNotExist = (event: string, fun: any) => {
        if (channel.callbacks.get(event)) {
            return false;
        }
        channel.bind(event, fun);
        return true;
    }

    return {
        // channel,
        bindIfNotExist
    }

}