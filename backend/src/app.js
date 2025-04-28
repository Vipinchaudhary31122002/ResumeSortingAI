import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// importing routes
import AuthRoute from "./routes/AuthRoute.js";
import JobBatch from "./routes/JobBatchRoute.js"

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Exactly your frontend URL
  credentials: true,               // Allow cookies to be sent
}));

app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }));
app.use(bodyParser.json({ limit: "16kb" }));
app.use(cookieParser());

// routes declaration
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/jobbatch", JobBatch)
// app.use("/api/v1/csv", CsvRoute);

export default app;