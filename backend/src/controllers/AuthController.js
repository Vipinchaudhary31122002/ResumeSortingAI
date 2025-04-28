import { db } from '../db/connectdb.js';
import { users } from '../db/schemas/users.js';
import { activeUsers } from '../db/schemas/active_users.js';
import { sendToken } from "../utils/SecretToken.js"; // Import your sendToken function
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

// ✅ Signup Controller
export const Signup = async (req, res) => {
  try {
    const { email, password} = req.body;
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into users table
    const result = await db.insert(users).values({
      email,
      password: hashedPassword,
    }).returning();
    
    const user = result[0];

    // Generate JWT token and send it to the client
    const token = sendToken(user, 201, res); // Use sendToken to create and send the token
    // Create an entry in active_users table
    await db.insert(activeUsers).values({
      userId: user.id,
      token: token, 
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Login Controller
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const foundUser = await db.select().from(users).where(eq(users.email, email));
    const user = foundUser[0];
    if (!user) return res.status(400).json({ message: "Incorrect email" });

    // Compare password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return res.status(400).json({ message: "Incorrect password" });

    // Generate JWT token and send it to the client
    const token = sendToken(user, 200, res); 
    // Create or update entry in active_users table
    await db.insert(activeUsers).values({
      userId: user.id,
      token: token,  // Assuming sendToken set this token as cookie, adjust if necessary
    }).onConflictDoUpdate({
      target: [activeUsers.userId], // Update the entry if userId already exists
      set: { token: token },  // Update token if needed
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Logout Controller
export const Logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }

    // Delete the active user entry matching the token
    await db.delete(activeUsers)
      .where(eq(activeUsers.token, token));

    // Clear the cookie
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
