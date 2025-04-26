import { drizzle } from 'drizzle-orm/postgres-js'
import { Pool } from "pg";
import { DATABASE_URL } from "../constants.js";
import postgres from "postgres";

// let db; // to store the drizzle client

// const connectDB = async () => {
//   try {
//     // const pool = new Pool({
//     //   connectionString: DATABASE_URL,
//     // });
//     client = postgres(DATABASE_URL, { prepare: false })
//     db = drizzle(client);
//     console.log("Connected to PostgreSQL");
//   } catch (error) {
//     console.error("PostgreSQL connection error:", error);
//     throw error;
//   }
// };

// export { connectDB, db };

// Create client using postgres.js
export const client = postgres(DATABASE_URL, { prepare: false });

// Set up drizzle ORM with the postgres client
export const db = drizzle(client);
