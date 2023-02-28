import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@/server/api/trpc";

import { prisma } from '@/server/db'

import { Visibility } from '@prisma/client'


export const roomRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ roomName: z.string(), visibility: z.string(), password: z.string().optional() }))
        .query(async ({ input, ctx }) => {

            const user = ctx.session.user

            const findRoom = await prisma.room.findFirst({
                where: {
                    roomName: input.roomName
                }
            });

            if (null !== findRoom) {
                return {
                    error: true,
                    message: `Room Already Exists`,
                    code: 'ROOM_ALREADY_EXISTS'
                }
            }

            const room = await prisma.room.create({
                data: {
                    roomName: input.roomName,
                    visibility: input.visibility === 'private' ? Visibility.PRIVATE : Visibility.PUBLIC,
                    password: input.visibility === 'private' ? input.password : undefined,
                    owner: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })

            return {
                message: "Room Created",
                data: {
                    ...room
                },
                code: 'ROOM_CREATED'
            }
        }),

});
