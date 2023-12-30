import { luciaHandler } from '$lib/server/lucia/handler';
import trpcHandle from '$lib/server/trpc/handler';
import { LogType, logger } from '$lib/server/modules/log';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(luciaHandler, trpcHandle, async ({ event, resolve }) => {
	logger()
		.type(LogType.OK)
		.prefix('hook')
		.prefix(event.request.method.toLowerCase())
		.message(event.url.pathname)
		.commit();

	return resolve(event);
});
