import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // load local envs

import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL!,
  },
} satisfies Config;
