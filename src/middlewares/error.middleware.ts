import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Invalid input data",
      details: err.message,
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.name === "MongoError" && (err as any).code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "Duplicate field value",
    });
  }

  // Handle Firebase Auth errors
  if (err.name === "FirebaseAuthError") {
    return res.status(401).json({
      status: "error",
      message: err.message,
    });
  }

  // Handle all other errors
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
