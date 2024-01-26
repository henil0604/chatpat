import { Pages } from '$lib/const';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { url, params, parent } = event;

	const { session } = await parent();

	if (session?.user.hasCompletedProfile === false) {
		throw redirect(301, Pages.OnBoarding.path);
	}
};
