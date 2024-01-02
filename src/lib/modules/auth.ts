import { AUTH_ENABLED_METHODS, AUTH_OAUTH_BASE_URL } from '$lib/const';
import { signIn } from '@auth/sveltekit/client';

type Method = (typeof AUTH_ENABLED_METHODS)[number];

export function login(method: Method, redirectURL?: string) {
	signIn(method, {
		callbackUrl: redirectURL
	});
}
