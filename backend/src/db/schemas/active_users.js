import { pgTable, serial, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Create the schema for the 'active_users' table
export const activeUsers = pgTable('active_users', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: uuid('user_id').notNull().defaultRandom(),
  token: text('token'),
});