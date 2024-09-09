import express from "express";
import { AppDataSource } from "./lib/data-source";
import userRoutes from "./routes/users";
import jobRoutes from "./routes/jobs";
import applicationRoutes from "./routes/applications";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3000", // Only allow this origin (React app)
  })
);

// Middleware to parse JSON
app.use(express.json());

// Initialize TypeORM Data Source
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database");
    // Route handling
    app.use("/api/users", userRoutes);
    app.use("/api/jobs", jobRoutes);
    app.use("/api/applications", applicationRoutes);

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error: any) => {
    console.error("Error during Data Source initialization", error);
  });
