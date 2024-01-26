import { Pages } from '$lib/const';
import { isSecureRoute } from '$lib/server/utils/isSecureRoute';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { locals, url } = event;

	// get the session
	const session = await locals.getSession()
	// if `session` and `session.user` exists, its `true`
	const isLoggedIn = (session && session.user) ? true : false;

	// if the route is secure and the user is not logged in
	if (isSecureRoute(url.pathname) === true && isLoggedIn === false) {
		// redirect to auth page with callback url to the incoming page pathname
		throw redirect(301, Pages.SignIn.path + `?callbackUrl=${url.pathname}`);
	}

	return {
		session
	};
};
