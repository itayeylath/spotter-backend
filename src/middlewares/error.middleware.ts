import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err);

  // Handle AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    res.status(400).json({
      status: "error",
      message: "Invalid input data",
      details: err.message,
    });
    return;
  }

  // Handle MongoDB duplicate key errors
  if (err.name === "MongoError" && (err as any).code === 11000) {
    res.status(400).json({
      status: "error",
      message: "Duplicate field value",
    });
    return;
  }

  // Handle Firebase Auth errors
  if (err.name === "FirebaseAuthError") {
    res.status(401).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Handle all other errors
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
