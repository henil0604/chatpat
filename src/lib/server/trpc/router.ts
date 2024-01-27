import { DefaultTRPCResponseSchema, Regex } from '$lib/const';
import { privateProcedure, t } from '$lib/server/trpc';
import { z } from 'zod';
import { LogType, logger } from '$lib/server/modules/log';

const log = logger().prefix("trpc");

export const router = t.router({
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
			// TODO: remove this

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

			// get the user
			const user = await ctx.db.user.findFirst({
				where: {
					username: input.username
				},
				select: {
					// only the id
					id: true
				}
			}).catch(error => {
				log
					.clone()
					.prefix("isUsernameAvailable")
					.prefix("db")
					.type(LogType.ERROR)
					.message("user fetch failed", error)
					.commit();
			})

			// if user already exists, username is not available
			if (user !== null) {
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

	completeUserProfile: privateProcedure
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

			return {
				error: false,
				code: 'DONE',
				data: {
					id: ctx.session.user.id
				}
			}
		})
});

export type Router = typeof router;
