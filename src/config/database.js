import 'dotenv/config.js';

import { neon, neonConfig } from '@neondatabase/serverless';

import { drizzle } from 'drizzle-orm/neon-http';

if (process.env.NODE_ENV !== 'production') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql);
