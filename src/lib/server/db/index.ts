// LINK: https://orm.drizzle.team/docs/get-started-postgresql#node-postgres

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';
import { LogType, logger } from '../modules/log';

export const pool = new pg.Pool({
	connectionString: DATABASE_URL
});

pool.on('connect', () => {
	logger()
		.type(LogType.SUCCESS)
		.prefix("db")
		.message("connected")
		.commit()
})

pool.on('error', () => {
	logger()
		.type(LogType.ERROR)
		.prefix("db")
		.message("error")
		.commit();
})

await pool.connect();

export const db = drizzle(pool);
