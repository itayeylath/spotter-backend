import winston from "winston";
import * as Sentry from "@sentry/node";

// Initialize Sentry if DSN is provided
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 1.0,
  });
}

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Write all logs to file in production
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new winston.transports.File({ filename: "logs/combined.log" }),
        ]
      : []),
  ],
});

// Extend logger to include Sentry reporting for errors
const originalError = logger.error.bind(logger);
logger.error = function (message: any, ...args: any[]): winston.Logger {
  if (process.env.SENTRY_DSN) {
    if (message instanceof Error) {
      Sentry.captureException(message);
    } else {
      Sentry.captureMessage(message);
    }
  }
  return originalError(message, ...args);
};

export { logger };
