import dotenv from "dotenv";
dotenv.config();

// Server configuration
export const BACKEND_PORT = process.env.BACKEND_PORT;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// Authentication configuration
export const SECRET_TOKEN_KEY = process.env.SECRET_TOKEN_KEY;
if (!SECRET_TOKEN_KEY) {
  throw new Error('SECRET_TOKEN_KEY is required');
}
export const COOKIE_EXPIRE = parseInt(process.env.COOKIE_EXPIRE, 10); // 24 hours

// Supabase configuration
export const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_PROJECT_URL || !SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_PROJECT_URL and SUPABASE_ANON_KEY are required');
}

// File upload configuration
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10) || 16 * 1024 * 1024; // 16MB
export const UPLOAD_CLEANUP_INTERVAL = parseInt(process.env.UPLOAD_CLEANUP_INTERVAL, 10) || 60 * 60 * 1000; // 1 hour