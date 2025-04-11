import { Request, Response, NextFunction, RequestHandler } from "express";
import * as admin from "firebase-admin";
import { logger } from "../utils/logger";

// Initialize Firebase Admin (will be configured when you provide the credentials)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

// Middleware to verify Firebase token
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized - No token provided" });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// Middleware to check admin role
export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized - No user found" });
      return;
    }

    const { uid } = req.user;
    const user = await admin.auth().getUser(uid);

    if (user.customClaims?.admin) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden - Admin access required" });
    }
  } catch (error) {
    logger.error("Admin verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
