// LINK: https://lucia-auth.com/guidebook/github-oauth/sveltekit/#validate-callback

import { auth, githubAuth } from '$lib/server/lucia';
import { LogType, logger } from '$lib/server/modules/log/index.js';
import { OAuthRequestError } from '@lucia-auth/oauth';

const log = logger()
	.type(LogType.OK)
	.prefix("auth")
	.prefix("github")
	.prefix("callback")

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			const user = await createUser({
				attributes: {
					username: githubUser.login
				}
			});
			return user;
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session);

		const redirectURL = cookies.get('oauth_redirectURL') || '/';

		log.clone()
			.prefix("user")
			.prefix("id")
			.message(user.userId)
			.commit();

		log.clone()
			.prefix("redirectURL")
			.message(decodeURIComponent(redirectURL))
			.commit();

		return new Response(null, {
			status: 302,
			headers: {
				Location: `${url.origin}${decodeURIComponent(redirectURL)}`
			}
		});
	} catch (e) {
		console.log('error: ', e);
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
