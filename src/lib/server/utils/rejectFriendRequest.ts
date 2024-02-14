import { FriendRequestStatus } from "@prisma/client";
import { db } from "$lib/server/db";

export async function rejectFriendRequest(requestId: string) {
    await db.friendRequest.update({
        where: {
            id: requestId
        },
        data: {
            status: FriendRequestStatus.REJECTED
        }
    })

    return true;
}