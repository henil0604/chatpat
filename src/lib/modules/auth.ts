import { AUTH_ENABLED_METHODS, AUTH_OAUTH_BASE_URL } from '$lib/const';

type Method = (typeof AUTH_ENABLED_METHODS)[number];

export function login(method: Method, redirectURL?: string) {
	let url = new URL(`${location.origin}${AUTH_OAUTH_BASE_URL}/${method}`);
	if (redirectURL) {
		url.searchParams.set('redirectURL', encodeURIComponent(redirectURL));
	}
	location.href = url.toString();
}
