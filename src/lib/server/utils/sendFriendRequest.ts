import { db } from "$lib/server/db";
import { FriendRequestStatus } from "@prisma/client";

export function sendFriendRequest(senderUserId: string, receiverUserId: string) {
    return db.friendRequest.create({
        data: {
            senderUserId: senderUserId,
            receiverUserId: receiverUserId,
            status: FriendRequestStatus.PENDING
        },
        include: {
            receiverUser: true,
            senderUser: true
        }
    })
}