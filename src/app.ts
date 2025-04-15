import express from "express";
import cors from "cors";
import adminRoutes from "@/routes/admin.routes";
import errorHandler from "@/middlewares/error.middleware";
import { logger } from "@/utils/logger";

// Import Firebase config to initialize it
import "@/config/firebase.config";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Spotter backend is running" });
});

// Admin routes
app.use("/api/admin", adminRoutes);

// Error handling
app.use(errorHandler);

export default app;
