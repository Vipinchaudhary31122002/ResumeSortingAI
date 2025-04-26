import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { db } from './db/connectdb.js';
import { users } from './db/schemas/users.js';

// importing routes
// import AuthRoute from "./routes/AuthRoute.js";

const app = express();

app.use(
  cors({})
);

app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }));
app.use(bodyParser.json({ limit: "16kb" }));
app.use(cookieParser());


const addUser = async (email, password) => {
  try {
    const result = await db.insert(users).values({
      email: "alice@example.com",
      password: "securepassword123", // you should hash this in production!
    });

    console.log("✅ User added:", result);
  } catch (error) {
    console.error("❌ Failed to insert user:", error);
  }
};

app.post("/adduser", (req, res)=>{
  addUser(res.email, req.password)
})



// routes declaration
// app.use("/api/v1/auth", AuthRoute);

export default app;