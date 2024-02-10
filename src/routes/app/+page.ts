import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {

    const friendsResponse = await trpc(event).user.friend.getBasicAll.query();

    return {
        friends: friendsResponse.data || []
    }
};