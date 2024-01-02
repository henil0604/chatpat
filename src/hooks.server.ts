import { authHandler } from '$lib/server/auth';
import trpcHandle from '$lib/server/trpc/handler';
import { LogType, logger } from '$lib/server/modules/log';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(async ({ event, resolve }) => {
	logger()
		.type(LogType.OK)
		.prefix('hook')
		.prefix(event.request.method.toLowerCase())
		.message(event.url.pathname + event.url.search)
		.commit();

	return resolve(event);
}, authHandler, trpcHandle);
