import { drizzle } from 'drizzle-orm/postgres-js'
import { Pool } from "pg";
import { DATABASE_URL } from "../constants.js";
import postgres from "postgres";


// Create client using postgres.js
export const client = postgres(DATABASE_URL, { prepare: false });

// Set up drizzle ORM with the postgres client
export const db = drizzle(client);
