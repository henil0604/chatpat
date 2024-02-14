import { DefaultTRPCResponseSchema } from '$lib/const';
import { logger } from '$lib/server/modules/log';
import { privateProcedure, t } from '$lib/server/trpc';
import { $Enums } from '@prisma/client';

import type { inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';

const log = logger().prefix("trpc").prefix("router.friendRequest");

export const friendRequestRouter = t.router({
    getInfoById: privateProcedure
        .input(z.object({
            id: z.string()
        }))
        .output(DefaultTRPCResponseSchema.extend({
            data: z.object({
                id: z.string(),
                status: z.nativeEnum($Enums.FriendRequestStatus),
                senderUserId: z.string(),
                receiverUserId: z.string(),
                createdAt: z.date(),
                updatedAt: z.date()
            }).optional()
        })).
        query(async ({ ctx, input }) => {

            try {
                const friendRequest = await ctx.db.friendRequest.findFirst({
                    where: {
                        id: input.id
                    },
                    select: {
                        id: true,
                        status: true,
                        senderUserId: true,
                        receiverUserId: true,
                        createdAt: true,
                        updatedAt: true
                    },
                })

                if (!friendRequest) {
                    return {
                        error: false,
                        code: 'FORBIDDEN',
                        message: "Friend request not found"
                    }
                }

                return {
                    error: false,
                    code: 'DONE',
                    data: friendRequest
                }

            } catch (error) {
                logger()
                    .clone()
                    .prefix("getBasicInfo")
                    .message("failed to query", error)
                    .commit();

                return {
                    error: true,
                    code: 'DATABASE_QUERY_ERROR',
                    message: 'failed to query'
                }
            }

        }),
});

export type FriendRequestRouter = typeof friendRequestRouter;
export type FriendRequestOutput = inferRouterOutputs<FriendRequestRouter>;