import { dev } from '$app/environment';
import { googleAuth } from '$lib/server/lucia';

export const GET = async ({ cookies, url: requestURL }) => {
    const [url, state] = await googleAuth.getAuthorizationUrl();
    const redirectURL = requestURL.searchParams.get('redirectURL');
    // store state
    cookies.set('google_oauth_state', state, {
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
