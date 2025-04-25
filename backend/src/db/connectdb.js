import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE_URL } from "../constants.js";

let db; // to store the drizzle client

const connectDB = async () => {
  try {
    const pool = new Pool({
      connectionString: DATABASE_URL,
    });

    db = drizzle(pool);
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    throw error;
  }
};

export { connectDB, db };
