import { DefaultTRPCResponseSchema, Regex } from '$lib/const';
import { privateProcedure, t } from '$lib/server/trpc';
import { z } from 'zod';
import { LogType, logger } from '$lib/server/modules/log';
import { isUsernameAvailable } from '$lib/server/utils/isUsernameAvailable';
import { userFriendRouter } from './user.friend';

const log = logger().prefix("trpc").prefix("router.user");

export const userRouter = t.router({
    isUsernameAvailable: privateProcedure
        .input(z.object({
            username: z.string()
        }))
        .output(DefaultTRPCResponseSchema.extend({
            data: z.object({
                isAvailable: z.boolean()
            }).optional()
        }))
        .query(async ({ ctx, input }) => {
            // check if the username is empty
            if (input.username.trim() === "") {
                return {
                    error: true,
                    code: 'EMPTY_INPUT',
                    message: 'Username must not be empty',
                }
            }

            // Regex Check
            if (Regex.username.test(input.username) === false) {
                return {
                    error: true,
                    code: 'INVALID_INPUT',
                    message: 'Usernames can only contain a-z, A-Z, 0-9, . (Dot), _ (Underscore)'
                }
            }

            const usernameAvailableCheck = await isUsernameAvailable(input.username);

            if (usernameAvailableCheck === false) {
                return {
                    error: false,
                    code: 'DONE',
                    data: {
                        isAvailable: false
                    }
                }
            }

            // username is available
            return {
                error: false,
                code: 'DONE',
                data: {
                    isAvailable: true
                }
            }
        }),

    completeProfile: privateProcedure
        .input(z.object({
            username: z.string(),
            image: z.string()
        }))
        .output(DefaultTRPCResponseSchema.extend({
            data: z.object({
                id: z.string()
            }).optional()
        }))
        .mutation(async ({ ctx, input }) => {

            // if user has already completed profile
            if (ctx.session.user.hasCompletedProfile === true) {
                return {
                    error: true,
                    code: 'FORBIDDEN',
                    message: 'User has already completed profile'
                }
            }

            const usernameAvailableCheck = await isUsernameAvailable(input.username);

            // if username is not available
            if (usernameAvailableCheck === false) {
                return {
                    error: true,
                    code: 'FORBIDDEN',
                    message: 'Username is not available'
                }
            }

            try {
                await ctx.db.user.update({
                    where: {
                        id: ctx.session.user.id
                    },
                    data: {
                        username: input.username,
                        image: input.image,
                        hasCompletedProfile: true,
                    },
                })
            } catch (error) {
                log
                    .clone()
                    .prefix("completeUserProfile")
                    .prefix("db")
                    .type(LogType.ERROR)
                    .message("user update failed", error)
                    .commit();

                return {
                    error: true,
                    code: 'DATABASE_QUERY_ERROR',
                    message: 'Something went wrong'
                }
            }

            log
                .clone()
                .prefix("completeUserProfile")
                .type(LogType.OK)
                .message("user profile complete", `(ID: ${ctx.session.user.id})`)
                .commit();

            return {
                error: false,
                code: 'DONE',
                data: {
                    id: ctx.session.user.id
                }
            }
        }),

    searchMany: privateProcedure
        .input(z.object({
            filters: z.object({
                username: z.string(),
            })
        }))
        .output(DefaultTRPCResponseSchema.extend({
            data: z.array(z.object({
                id: z.string(),
                username: z.string().optional().nullable(),
                image: z.string().optional().nullable(),
                name: z.string().optional().nullable()
            })).optional()
        }))
        .query(async ({ ctx, input }) => {

            try {
                const users = await ctx.db.user.findMany({
                    where: {
                        username: {
                            contains: input.filters.username,
                            not: {
                                equals: ctx.session.user.username
                            }
                        }
                    },
                    select: {
                        id: true,
                        username: true,
                        image: true,
                        name: true
                    }
                })

                return {
                    code: 'DONE',
                    error: false,
                    data: users || []
                }
            } catch (error) {
                log.clone()
                    .prefix("searchMany")
                    .type(LogType.ERROR)
                    .message("failed to query", error)
                    .commit()

                return {
                    code: 'DATABASE_QUERY_ERROR',
                    error: false,
                    message: 'Failed to fetch'
                }
            }

        }),

    friend: userFriendRouter,
});

export type UserRouter = typeof userRouter;
