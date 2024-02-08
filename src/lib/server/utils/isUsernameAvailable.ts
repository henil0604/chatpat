/*
    This utility checks if the given username is already assigned to a user
*/

import { db } from "$lib/server/db";
import { LogType, logger } from "$lib/server/modules/log";

export async function isUsernameAvailable(username: string) {
    // get the user
    const user = await db.user.findFirst({
        where: {
            username: username
        },
        select: {
            // only the id for less data transfer
            id: true
        }
    }).catch(error => {
        logger()
            .prefix("isUsernameAvailable")
            .prefix("db")
            .type(LogType.ERROR)
            .message("user fetch failed", error)
            .commit();
    })

    return user ? false : true;
}