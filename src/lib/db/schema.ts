import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique(),
  createdAt: timestamp('created_at').defaultNow()
});

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;