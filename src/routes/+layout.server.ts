import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { locals } = event;

	return {
		session: await locals.auth.validate()
	};
};
