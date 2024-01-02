// LINK: https://orm.drizzle.team/docs/get-started-postgresql#node-postgres

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';
import { LogType, logger } from '$lib/server/modules/log';
import * as schema from './schema';

const log = logger().prefix('db');

export const pool = new pg.Pool({
	connectionString: DATABASE_URL,
	log: (...messages) => {
		// internal pool logs
		log
			.clone()
			.type(LogType.UNKNOWN)
			.prefix('internal')
			.message(...messages)
			.commit();
	}
});

// connect to database
function connect() {
	return new Promise(async (resolve) => {
		function onConnectionError() {
			log.type(LogType.ERROR).message('connection error').commit();

			log.type(LogType.OK).message('retry in 3 seconds').commit();

			// retry after n seconds
			setTimeout(async () => {
				resolve(await connect());
			}, 3 * 1000);
		}

		await pool
			.connect()
			.then(() => {
				// if connection is successful, resolve the promise

				log.type(LogType.SUCCESS).message('connected').commit();

				resolve(void 0);
			})
			.catch(onConnectionError);
	});
}

// wait for the connection
await connect();

export const db = drizzle(pool, {
	schema: schema,
	logger: true
});