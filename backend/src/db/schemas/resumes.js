// src/db/schemas/resumes.js
import { pgTable, varchar, uuid, text, integer, json, array } from 'drizzle-orm/pg-core';
import { resume_batches } from './resumeBatches.js';

export const resumes = pgTable('resumes', {
  id: varchar('id', { length: 255 }).primaryKey(),
  batch_id: uuid('batch_id').references(() => resume_batches.id).defaultRandom().notNull(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  email: varchar('email', { length: 255 }).default(''),
  phone: varchar('phone', { length: 255 }).default(''),
  skills: array(varchar('skills', { length: 255 })), // Array of strings
  experience: json('experience'),
  education: json('education'),
  certification: json('certification'),
  jd_score: integer('jd_score'),
  ats_score: integer('ats_score'),
  ai_score: integer('ai_score'),
  length_score: integer('length_score'),
  keyword_match: integer('keyword_match'),
  resume_url: varchar('resume_url', { length: 255 }).notNull().default(''),
});
