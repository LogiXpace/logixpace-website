import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();
const { SUPABASE_DATABASE_URL } = process.env;

if (!SUPABASE_DATABASE_URL) {
  throw new Error('No url');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: SUPABASE_DATABASE_URL
  }
} satisfies Config;