import { SECRET_TOKEN_KEY } from "../constants.js";
import jwt from "jsonwebtoken";
import { db } from "../db/connectdb.js";
import { activeUsers } from "../db/schemas/active_users.js";
import { eq } from "drizzle-orm";

export const userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // Check if the token exists in the request
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token not found. Please login again.",
      });
    }

    // Verify the token and extract the user data from it
    let decodedData;
    try {
      decodedData = jwt.verify(token, SECRET_TOKEN_KEY);
    } catch (error) {
      // Handle token expiration or invalid token
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: false,
          message: "Token has expired. Please login again.",
        });
      }
      return res.status(401).json({
        status: false,
        message: "Invalid token. Please login again.",
      });
    }

    // Check if the token is stored in the active_users table
    const result = await db.select().from(activeUsers).where(eq(activeUsers.token, token)).limit(1);
    const activeUser = result[0];

    if (activeUser) {
      // Attach user data to the request object
      req.userdata = { userId: decodedData.id, token: activeUser.token }; 
      return next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Token is not valid or expired in the database.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      status: false,
      message: "Server-side error occurred. Please try again later.",
    });
  }
};
