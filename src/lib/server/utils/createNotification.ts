import { type NotificationType } from "@prisma/client";
import { db } from "$lib/server/db";

export function createNotification(userId: string, type: NotificationType, meta: { [key: string]: any }) {
    return db.notification.create({
        data: {
            user: {
                connect: {
                    id: userId,
                }
            },
            meta: meta,
            type: type,
            read: false,
        }
    })
}