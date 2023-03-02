import {
    atom
} from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus'

const $room = atom({
    key: 'room',
    default: {
        isInside: false,
        roomName: undefined,
        'room.visibility': undefined,
        isAuthorized: false,
        chats: []
    }
});

export function setRoomProp(key: string, value: any) {
    return setRecoil($room, {
        ...getRecoil($room),
        [key]: value
    });
}

export function getRoomProp(key: string) {
    return (getRecoil($room) as unknown as any)[key];
}

export function addChat(data: any) {
    return setRoomProp("chats", [
        ...getRoomProp("chats"),
        data
    ])
}

export function getChat(id: string) {
    const chats = getRoomProp("chats")
    const index = chats.findIndex((chat: any) => chat.id === id)
    return {
        chat: index === -1 ? null : chats[index],
        index
    };
}

export function updateChat(id: string, data: any) {
    let chats = getRoomProp("chats");

    chats = chats.map((chat: any) => {
        if (chat.id !== id) { return chat };
        return {
            ...chat,
            ...data
        }
    })

    setRoomProp("chats", chats)
}

export default $room;