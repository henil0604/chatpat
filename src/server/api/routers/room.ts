import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@/server/api/trpc";

import { prisma } from '@/server/db'

import { Status, Visibility } from '@prisma/client'
import hash from "@/utils/hash";
import pusher from "@/utils/pusher-server";


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
                    password: input.visibility === 'private' ? hash(input.password as string) : undefined,
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
                    owner: true,
                    Chat: {
                        take: 30,
                        orderBy: {
                            createdAt: 'asc'
                        },
                        include: {
                            owner: true
                        }
                    }
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
                    ...room,
                },
                code: 'ROOM_FOUND'
            }
        }),

    sendMessage: protectedProcedure
        .input(z.object({ messageId: z.string(), roomName: z.string(), message: z.string(), sentAt: z.number() }))
        .query(async ({ input, ctx }) => {

            const user = ctx.session.user;

            const room = await prisma.room.findFirst({
                where: {
                    roomName: input.roomName
                }
            });

            if (!room) {
                return {
                    error: true,
                    message: "Room Not found",
                    code: 'ROOM_NOT_FOUND'
                }
            }

            const message = await prisma.chat.create({
                data: {
                    message: input.message,
                    id: input.messageId,
                    status: Status.RECEIVED,
                    room: {
                        connect: {
                            roomName: input.roomName
                        }
                    },
                    owner: {
                        connect: {
                            id: user.id
                        }
                    },
                    createdAt: new Date(input.sentAt)
                }
            })

            try {
                const pusherResponse = await pusher.trigger(`r-${room.id}`, "MSG-SENT", {
                    message: {
                        ...message,
                        owner: {
                            ...user
                        },
                        ownerId: user.id,
                        roomId: room.id,
                        room: undefined
                    }
                });

                console.log(pusherResponse)
            } catch (e) {
                console.warn(e)
            }

            return {
                message: "Message Sent",
                data: {
                    ...message
                },
                updates: {
                    status: Status.RECEIVED,
                },
                code: 'MESSAGE_SENT'
            }
        }),

    getMessages: protectedProcedure
        .input(z.object({ roomName: z.string(), count: z.number().default(30) }))
        .query(async ({ input, ctx }) => {

            const user = ctx.session.user;

            const room = await prisma.room.findFirst({
                where: {
                    roomName: input.roomName
                }
            });

            if (!room) {
                return {
                    error: true,
                    message: "Room Not found",
                    code: 'ROOM_NOT_FOUND'
                }
            }

            const messages = await prisma.chat.findMany({
                where: {
                    roomId: room.id
                },
                take: input.count,
                orderBy: {
                    createdAt: 'asc'
                },
                include: {
                    owner: true
                }
            })

            return {
                message: "Message Fetched",
                data: messages,
                code: 'MESSAGE_FETCHED'
            }
        }),
});
