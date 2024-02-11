import { DefaultTRPCResponseSchema, Regex } from '$lib/const';
import { privateProcedure, t } from '$lib/server/trpc';
import { z } from 'zod';
import { LogType, logger } from '$lib/server/modules/log';

const log = logger().prefix("trpc").prefix("router.user.friend");

export const userFriendRouter = t.router({
    getBasicAll: privateProcedure
        .output(DefaultTRPCResponseSchema.extend({
            data: z.array(z.object({
                id: z.string(),
                username: z.string().optional().nullable(),
                image: z.string().optional().nullable()
            })).optional()
        }))
        .query(async ({ ctx, input }) => {

            try {

                const friends = await ctx.db.user.findFirst({
                    where: {
                        id: ctx.session.user.id
                    },
                    select: {
                        friends: {
                            select: {
                                id: true,
                                username: true,
                                image: true
                            }
                        }
                    }
                })

                return {
                    code: 'DONE',
                    error: false,
                    data: friends?.friends || []
                }
            } catch (error) {
                log.clone()
                    .prefix("getBasicAll")
                    .type(LogType.ERROR)
                    .message("failed to query", error)
                    .commit()

                return {
                    code: 'DATABASE_QUERY_ERROR',
                    error: false,
                    message: 'Failed to fetch'
                }
            }

        })
});

export type UserFriendRouter = typeof userFriendRouter;
