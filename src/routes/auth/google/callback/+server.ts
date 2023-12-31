
import { auth, googleAuth } from '$lib/server/lucia';
import { LogType, logger } from '$lib/server/modules/log/index.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { isRedirect, redirect } from '@sveltejs/kit';

const log = logger()
    .type(LogType.OK)
    .prefix("auth")
    .prefix("google")
    .prefix("callback")

export const GET = async ({ url, cookies, locals }) => {
    const storedState = cookies.get('google_oauth_state');
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');
    // validate state
    if (!storedState || !state || storedState !== state || !code) {
        return new Response(null, {
            status: 400
        });
    }
    try {
        const { getExistingUser, googleUser, createUser } = await googleAuth.validateCallback(code);

        const getUser = async () => {
            const existingUser = await getExistingUser();
            if (existingUser) return existingUser;
            const user = await createUser({
                attributes: {
                    username: googleUser.name.replaceAll(" ", ".")
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

        cookies.delete('oauth_redirectURL', {
            path: '/'
        });

        log.clone()
            .prefix("user")
            .prefix("id")
            .message(user.userId)
            .commit();

        log.clone()
            .prefix("redirectURL")
            .message(decodeURIComponent(redirectURL))
            .commit();
        throw redirect(302, decodeURIComponent(redirectURL));
    } catch (error) {
        if (isRedirect(error)) {
            throw error;
        }

        console.log('error: ', error);
        if (error instanceof OAuthRequestError) {
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
