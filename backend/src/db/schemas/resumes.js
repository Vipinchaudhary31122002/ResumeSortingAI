import { pgTable, varchar, uuid, text, integer } from 'drizzle-orm/pg-core';
import { job_batches } from './job_batches.js';

export const resumes = pgTable('resumes', {
  id: varchar('id', { length: 255 }).primaryKey(),
  batch_id: uuid('batch_id').references(() => job_batches.id).defaultRandom().notNull(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  email: varchar('email', { length: 255 }).default(''),
  phone: varchar('phone', { length: 255 }).default(''),
  skills: varchar('skills', { length: 255 }), // Changed from json to varchar
  experience: text('experience').default(''), // text with default ''
  education: text('education').default(''),   // text with default ''
  certification: text('certification').default(''), // text with default ''
  jd_score: integer('jd_score'),
  ats_score: integer('ats_score'),
  keyword_match: integer('keyword_match'),
  resume_url: varchar('resume_url', { length: 255 }).notNull().default(''),
});
