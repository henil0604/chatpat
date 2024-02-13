import { DefaultTRPCResponseSchema, Regex } from '$lib/const';
import { privateProcedure, t } from '$lib/server/trpc';
import { z } from 'zod';
import { LogType, logger } from '$lib/server/modules/log';
import { isUsernameAvailable } from '$lib/server/utils/isUsernameAvailable';
import { userFriendRouter } from './user.friend';
import type { inferRouterOutputs } from '@trpc/server';
import { sendFriendRequest } from '$lib/server/utils/sendFriendRequest';
import { acceptFriendRequest } from '$lib/server/utils/acceptFriendRequest';
import { pusher } from '$lib/server/pusher';

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
                name: z.string().optional().nullable(),
                friendStatus: z.enum(["FRIEND", "REQUEST_SENT", "REQUEST_RECEIVED", "NOT_FRIEND"])
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
                        },
                        hasCompletedProfile: true
                    },
                    select: {
                        id: true,
                        username: true,
                        image: true,
                        name: true,
                        friends: {
                            select: {
                                id: true,
                                username: true,
                            }
                        },
                        sentFriendRequests: {
                            select: {
                                id: true,
                                status: true,
                                senderUserId: true,
                                receiverUserId: true
                            }
                        },
                        receivedFriendRequests: {
                            select: {
                                id: true,
                                status: true,
                                senderUserId: true,
                                receiverUserId: true
                            }
                        }
                    }
                })

                const metaUsers = users.map(user => {
                    let friendStatus: 'NOT_FRIEND' | 'FRIEND' | 'REQUEST_SENT' | 'REQUEST_RECEIVED' = 'NOT_FRIEND';

                    if (user.friends.find(u => u.id === ctx.session.user.id)) {
                        friendStatus = 'FRIEND'
                    }

                    if (user.sentFriendRequests.find(u => u.receiverUserId === ctx.session.user.id)) {
                        friendStatus = 'REQUEST_RECEIVED';
                    }

                    if (user.receivedFriendRequests.find(u => u.senderUserId === ctx.session.user.id)) {
                        friendStatus = 'REQUEST_SENT';
                    }

                    return {
                        id: user.id,
                        username: user.username,
                        image: user.image,
                        name: user.name,
                        friendStatus: friendStatus
                    }
                })

                return {
                    code: 'DONE',
                    error: false,
                    data: metaUsers
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

    sendFriendRequest: privateProcedure.
        input(z.object({
            userId: z.string()
        }))
        .output(DefaultTRPCResponseSchema.extend({
            data: z.object({
                id: z.string(),
            }).optional(),
        }))
        .query(async ({ ctx, input }) => {

            const user = ctx.session.user;

            try {
                const requestDoc = await sendFriendRequest(user.id, input.userId);

                return {
                    error: false,
                    code: 'DONE',
                    data: {
                        id: requestDoc.id,
                    }
                }

            } catch (error) {
                logger()
                    .clone()
                    .prefix("sendFriendRequest")
                    .message("failed to query", error)
                    .commit();

                return {
                    error: true,
                    code: 'DATABASE_QUERY_ERROR',
                    message: 'friend request creation failed',
                }
            }
        }),

    acceptFriendRequest: privateProcedure.
        input(z.object({
            userId: z.string()
        }))
        .output(DefaultTRPCResponseSchema.extend({
            data: z.object({
                id: z.string()
            }).optional()
        }))
        .query(async ({ ctx, input }) => {

            const user = ctx.session.user;

            const request = await ctx.db.friendRequest.findFirst({
                where: {
                    senderUserId: input.userId,
                    receiverUserId: user.id,
                }
            })

            if (!request) {
                return {
                    error: false,
                    code: 'FORBIDDEN',
                    message: 'Request not found',
                }
            }

            await acceptFriendRequest(request.id, input.userId, user.id);

            return {
                error: false,
                code: 'DONE',
                data: {
                    id: request.id
                }
            }
        }),

    friend: userFriendRouter,
});

export type UserRouter = typeof userRouter;
export type UserRouterOutput = inferRouterOutputs<UserRouter>;