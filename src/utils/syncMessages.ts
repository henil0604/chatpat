import { getRoomProp, setRoomProp } from "@/store/room";
import { api } from "@/utils/api";

export default async function syncMessages(client: any) {

    const response = await client.room.getMessages.fetch({
        roomName: getRoomProp("roomName")
    })

    if (response.code !== 'MESSAGE_FETCHED') {
        return;
    }

    setRoomProp("chats", response.data || []);
}