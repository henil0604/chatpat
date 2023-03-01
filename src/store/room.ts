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

export default $room;