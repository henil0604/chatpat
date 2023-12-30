// LINK: https://lucia-auth.com/guidebook/github-oauth/sveltekit/#generate-authorization-url

import { dev } from '$app/environment';
import { githubAuth } from '$lib/server/lucia';

export const GET = async ({ cookies, url: requestURL }) => {
	const [url, state] = await githubAuth.getAuthorizationUrl();
	const redirectURL = requestURL.searchParams.get('redirectURL');
	// store state
	cookies.set('github_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	if (redirectURL) {
		cookies.set('oauth_redirectURL', redirectURL, {
			httpOnly: true,
			secure: !dev,
			path: '/',
			maxAge: 60 * 60
		});
	} else {
		cookies.delete('oauth_redirectURL', {
			path: '/'
		});
	}
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
