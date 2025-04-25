import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// importing routes
// import AuthRoute from "./routes/AuthRoute.js";

const app = express();

app.use(
  cors({})
);

app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }));
app.use(bodyParser.json({ limit: "16kb" }));
app.use(cookieParser());

// routes declaration
// app.use("/api/v1/auth", AuthRoute);

export default app;