import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@/server/api/trpc";

import { prisma } from '@/server/db'

import { Visibility } from '@prisma/client'
import hash from "@/utils/hash";


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
                    password: input.visibility === 'private' ? hash(input.password) : undefined,
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

    getInfo: publicProcedure
        .input(z.object({ roomName: z.string() }))
        .query(async ({ input }) => {
            const room = await prisma.room.findFirst({
                where: {
                    roomName: input.roomName
                },
                include: {
                    owner: true
                }
            });

            if (null === room) {
                return {
                    error: true,
                    message: `Room Not Found`,
                    code: 'ROOM_NOT_FOUND'
                }
            }

            return {
                message: "Room Found",
                data: {
                    ...room
                },
                code: 'ROOM_FOUND'
            }
        }),
});
