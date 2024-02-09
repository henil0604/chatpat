import { t } from '$lib/server/trpc';
import { userRouter } from '$lib/server/trpc/routers/user';

export const router = t.router({
	user: userRouter
});

export type Router = typeof router;
