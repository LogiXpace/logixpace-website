import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { SUPABASE_DATABASE_URL } from "$env/static/private"

const client = postgres(SUPABASE_DATABASE_URL, { prepare: false })
export const db = drizzle(client);
