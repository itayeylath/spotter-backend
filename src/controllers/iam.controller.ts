import { Request, Response } from "express";
import { auth } from "@/config/firebase.config";
import { logger } from "@/utils/logger";

export async function signInWithGoogle(req: Request, res: Response) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "ID token is required" });
    }

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get user data
    const user = await auth.getUser(decodedToken.uid);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create session token
    const sessionToken = await auth.createCustomToken(decodedToken.uid);

    res.json({
      message: "Welcome to the app",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      sessionToken,
    });
  } catch (error) {
    logger.error("Sign in error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
}

export async function signOut(req: Request, res: Response) {
  try {
    res.json({ message: "Successfully signed out" });
  } catch (error) {
    logger.error("Sign out error:", error);
    res.status(500).json({ error: "Sign out failed" });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await auth.getUser(req.user.uid);
    res.json({
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    logger.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
}

export async function checkAdminStatus(req: Request, res: Response) {
  try {
    const adminUids = process.env.ADMIN_UIDS?.split(",") || [];
    const isAdmin = req.user && adminUids.includes(req.user.uid);
    res.json({ isAdmin });
  } catch (error) {
    logger.error("Check admin status error:", error);
    res.status(500).json({ error: "Failed to check admin status" });
  }
}

export async function getAdminList(req: Request, res: Response) {
  try {
    const adminUids = process.env.ADMIN_UIDS?.split(",") || [];
    res.json({ adminUids });
  } catch (error) {
    logger.error("Get admin list error:", error);
    res.status(500).json({ error: "Failed to get admin list" });
  }
}
