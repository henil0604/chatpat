import { FriendRequestStatus } from "@prisma/client";
import { db } from "$lib/server/db";

export async function acceptFriendRequest(requestId: string, senderUserId: string, receiverUserId: string) {
    await db.user.update({
        where: {
            id: senderUserId
        },
        data: {
            friends: {
                connect: {
                    id: receiverUserId
                }
            }
        },
    });

    await db.user.update({
        where: {
            id: receiverUserId
        },
        data: {
            friends: {
                connect: {
                    id: senderUserId
                }
            }
        }
    });

    await db.friendRequest.update({
        where: {
            id: requestId
        },
        data: {
            status: FriendRequestStatus.ACCEPTED
        }
    })

    return true;
}