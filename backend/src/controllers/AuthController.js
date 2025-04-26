import { db } from '../db/connectdb.js';
import { users } from '../db/schemas/users.js';
import { sendToken } from "../utils/SecretToken.js";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

// ✅ Signup Controller
export const Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user
    const result = await db.insert(users).values({
      email,
      password: hashedPassword,
      username, // Assuming your users table has a `username` column
    }).returning();
    const user = result[0];
    res.status(201).json({ message: "Account created successfully", user });
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
    if (!user) {
      return res.status(400).json({ message: "Incorrect email" });
    }
    // Compare password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Logout Controller
export const Logout = async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ message: "Logout successful" });
};
