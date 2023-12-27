// LINK: https://orm.drizzle.team/docs/get-started-postgresql#node-postgres

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';
import { LogType, logger } from '../modules/log';

export const pool = new pg.Pool({
	connectionString: DATABASE_URL
});

await pool.connect().then(() => {
	logger()
		.type(LogType.SUCCESS)
		.prefix("db")
		.message("connected")
		.commit()
});

export const db = drizzle(pool);
