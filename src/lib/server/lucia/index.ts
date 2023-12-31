// LINK: https://lucia-auth.com/guidebook/github-oauth/sveltekit/#configure-lucia

import { lucia } from 'lucia';
import { pg } from '@lucia-auth/adapter-postgresql';
import { pool } from '$lib/server/db';
import { dev } from '$app/environment';
import { sveltekit } from 'lucia/middleware';
import { AUTH_GITHUB_CLIENT_ID, AUTH_GITHUB_CLIENT_SECRET, AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { github, google } from '@lucia-auth/oauth/providers';
import { getLoginURL } from '$lib/modules/auth';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	adapter: pg(pool, {
		key: 'auth_key',
		session: 'auth_session',
		user: 'auth_user'
	}),
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			username: data.username
		};
	}
});

export const githubAuth = github(auth, {
	clientId: AUTH_GITHUB_CLIENT_ID,
	clientSecret: AUTH_GITHUB_CLIENT_SECRET
});

export const googleAuth = google(auth, {
	clientId: AUTH_GOOGLE_CLIENT_ID,
	clientSecret: AUTH_GOOGLE_CLIENT_SECRET,
	redirectUri: process.env.VERCEL_URL ? `${process.env.VERCEL_URL}/auth/google/callback` : 'http://localhost:5173/auth/google/callback'
})

export type Auth = typeof auth;
