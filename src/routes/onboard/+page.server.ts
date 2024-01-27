import { Pages } from '$lib/const';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { parent, url } = event;

    const { session } = await parent();

    if (session?.user.hasCompletedProfile === true) {
        throw redirect(301, url.searchParams.get("redirectTo") || Pages.Application.path);
    }
};
