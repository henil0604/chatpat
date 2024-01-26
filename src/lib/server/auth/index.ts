import {
	AUTH_GITHUB_CLIENT_ID,
	AUTH_GITHUB_CLIENT_SECRET,
	AUTH_GOOGLE_CLIENT_ID,
	AUTH_GOOGLE_CLIENT_SECRET
} from '$env/static/private';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import Google from '@auth/sveltekit/providers/google';
import { db } from '$lib/server/db';
import type { Session } from '@auth/core/types';
import type { AdapterUser } from '@auth/core/adapters';

export const authHandler = SvelteKitAuth({
	providers: [
		GitHub({
			clientId: AUTH_GITHUB_CLIENT_ID,
			clientSecret: AUTH_GITHUB_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true
		}),
		Google({
			clientId: AUTH_GOOGLE_CLIENT_ID,
			clientSecret: AUTH_GOOGLE_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true
		})
	],
	debug: true,
	// @ts-ignore
	adapter: PrismaAdapter(db),
	trustHost: true,
	callbacks: {
		session: async (params) => {
			const { session, user } = params as {
				session: Session;
				user: AdapterUser;
			};

			if (session.user) {
				session.user.id = user.id;
				session.user.hasCompletedProfile = user.hasCompletedProfile;
				session.user.username = user.username;
			}

			return session;
		}
	},
	events: {
		// triggered when new users is created
		async createUser({ user }) {
			await db.user.update({
				where: {
					id: user.id
				},
				data: {
					hasCompletedProfile: false
				}
			});
		}
	}
});
