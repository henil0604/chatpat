import { trpc } from "$lib/trpc/client";
import { toast } from "svelte-sonner";

export async function getFriendRequestInfoById(id: string) {
    const response = await trpc().friendRequest.getInfoById.query({
        id
    })

    if (response.error) {
        toast.error(response.message || 'Something went wrong', {
            duration: 5000,
            description: `CODE: ${response.code}`
        });
        return null;
    }

    return response.data!;
}