import { db } from "$lib/server/db";
import { FriendRequestStatus } from "@prisma/client";

export async function isFriendOf(userAId: string, userBId: string): Promise<boolean> {
    const request = await db.friendRequest.findFirst({
        where: {
            OR: [
                {
                    senderUserId: userAId,
                    receiverUserId: userBId
                },
                {
                    senderUserId: userBId,
                    receiverUserId: userAId
                }
            ],
            status: FriendRequestStatus.ACCEPTED
        }
    });

    return request === null ? false : true;
}