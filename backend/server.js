import { BACKEND_PORT } from "./src/constants.js";
import { connectDB } from "./src/db/connectdb.js"; 
import app from "./src/app.js";

connectDB()
  .then(() => {
    app.listen(BACKEND_PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${BACKEND_PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err);
  });
