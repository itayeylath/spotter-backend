import { Request, Response, NextFunction, RequestHandler } from "express";
import { auth } from "../config/firebase.config";
import { logger } from "../utils/logger";
import * as admin from "firebase-admin";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken & { isAdmin?: boolean };
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
    const decodedToken = await auth.verifyIdToken(token);

    // Check if user is admin based on env variable
    const adminUids = process.env.ADMIN_UIDS?.split(",") || [];
    (decodedToken as any).isAdmin = adminUids.includes(decodedToken.uid);

    req.user = decodedToken as admin.auth.DecodedIdToken & { isAdmin: boolean };
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
    const user = await auth.getUser(uid);

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
