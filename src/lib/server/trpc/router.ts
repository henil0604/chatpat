import { t } from '$lib/server/trpc';
import { userRouter } from '$lib/server/trpc/routers/user';
import { friendRequestRouter } from '$lib/server/trpc/routers/friendRequest';

export const router = t.router({
	user: userRouter,
	friendRequest: friendRequestRouter,
});

export type Router = typeof router;
