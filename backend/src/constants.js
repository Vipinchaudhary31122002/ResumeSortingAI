import dotenv from "dotenv";
dotenv.config();

export const BACKEND_PORT = process.env.BACKEND_PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const SECRET_TOKEN_KEY = process.env.SECRET_TOKEN_KEY;
export const COOKIE_EXPIRE = parseInt(process.env.COOKIE_EXPIRE, 10);