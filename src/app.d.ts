// See https://kit.svelte.dev/docs/types#app

import type { UserRole } from "@prisma/client";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals { }
		// interface PageData { }
		// interface PageState {}
		// interface Platform {}
	}
}

export declare module '@auth/core/types' {
	// User coming from database
	interface User {
		id: string;
		username?: string;
		hasCompletedProfile: boolean;
		role: UserRole
	}
	interface Session {
		// user that will be set to session
		user: {
			id: string;
			username?: string;
			hasCompletedProfile: boolean;
			role: UserRole
		} & DefaultSession['user'];
	}
}

export { };
