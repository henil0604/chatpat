// See https://kit.svelte.dev/docs/types#app

import type { Session, AuthRequest } from 'lucia';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: AuthRequest;
		}
		interface PageData {
			session: Awaited<ReturnType<AuthRequest['validate']>>;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

// LINK: https://lucia-auth.com/guidebook/github-oauth/sveltekit/#update-your-database
/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
