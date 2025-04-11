import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectDB } from "./config/database";
import errorHandler from "./middlewares/error.middleware";
import todoRoutes from "./routes/todo.routes";
import adminRoutes from "./routes/admin.routes";
import { logger } from "./utils/logger";

// Create Express app
const app = express();

// Connect to MongoDB
connectDB().catch((err) => {
  logger.error("MongoDB connection error:", err);
  process.exit(1);
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

export default app;
