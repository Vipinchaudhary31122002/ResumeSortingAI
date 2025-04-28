import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const job_batches = pgTable('job_batches', {
  id: uuid('id').defaultRandom().primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  job_title: varchar('job_title', { length: 255 }).notNull(),
  job_description: text('job_description').notNull(),
  csv_url: varchar('csv_url', { length: 255 }),
});
