import { SECRET_TOKEN_KEY } from "../constants.js";
import jwt from "jsonwebtoken";
import { db } from "../db/connectdb.js";
import { users } from "../db/schemas/users.js";
import { eq } from "drizzle-orm";

export const userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token not found",
      });
    }

    // Verify token and extract payload
    const data = jwt.verify(token, SECRET_TOKEN_KEY);

    // Get user from DB using Drizzle
    const result = await db.select().from(users).where(eq(users.id, data.id));
    const user = result[0];

    if (user) {
      req.userdata = user;
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Token is not valid",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      status: false,
      message: "Server-side error occurred",
    });
  }
};
