import { AUTH_GITHUB_CLIENT_ID, AUTH_GITHUB_CLIENT_SECRET, AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET } from "$env/static/private"
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Google from "@auth/sveltekit/providers/google";
import { db } from "$lib/server/db";

export const authHandler = SvelteKitAuth({
    providers: [
        GitHub({
            clientId: AUTH_GITHUB_CLIENT_ID,
            clientSecret: AUTH_GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Google({
            clientId: AUTH_GOOGLE_CLIENT_ID,
            clientSecret: AUTH_GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        })
    ],
    debug: true,
    adapter: DrizzleAdapter(db),
    trustHost: true
});