import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DATABASE = 'DATABASE';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DrizzleDB = typeof db;

export const databaseProvider = {
  provide: DATABASE,
  useValue: db,
};
