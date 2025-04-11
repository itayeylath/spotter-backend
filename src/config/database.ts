import mongoose from "mongoose";
// import { logger } from "../utils/logger";

export async function connectDB(): Promise<void> {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/todo-app";

    await mongoose.connect(mongoUri);

    // logger.info("Successfully connected to MongoDB.");

    // Handle connection events
    mongoose.connection.on("error", (error) => {
    //   logger.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
    //   logger.warn("MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error) {
    // logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
