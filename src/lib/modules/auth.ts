import { AUTH_ENABLED_METHODS, AUTH_OAUTH_BASE_URL } from '$lib/const';

type Method = (typeof AUTH_ENABLED_METHODS)[number];

export function getLoginURL(method: Method, redirectURL?: string, origin?: string) {
	let url = new URL(`${origin || location.origin}${AUTH_OAUTH_BASE_URL}/${method}`);
	if (redirectURL) {
		url.searchParams.set('redirectURL', encodeURIComponent(redirectURL));
	}
	return url.toString();
}

export function login(method: Method, redirectURL?: string) {
	location.href = getLoginURL(method, redirectURL);
}
