import { Request, Response } from "express";
import { auth } from "@/config/firebase.config";
import { logger } from "@/utils/logger";
import {
  isError,
  isFirebaseAuthError,
  getErrorMessage,
  hasValidIdToken,
  extractIdToken,
  hasUser,
  AuthResponse,
  AdminCheckResponse,
  AdminListResponse,
} from "@/types";

export async function signInWithGoogle(req: Request, res: Response) {
  try {
    const idToken = extractIdToken(req);

    if (!idToken) {
      logger.warn("[Auth] Sign-in attempt without ID token");
      return res.status(400).json({ error: "ID token is required" });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const user = await auth.getUser(decodedToken.uid);

    if (!user) {
      logger.warn(`[Auth] User not found for UID: ${decodedToken.uid}`);
      return res.status(404).json({ error: "User not found" });
    }

    const sessionToken = await auth.createCustomToken(decodedToken.uid);

    logger.info(`[Auth] Successful sign-in: ${user.email || user.uid}`);
    const response: AuthResponse = {
      message: "Welcome to the app",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      sessionToken,
    };
    res.json(response);
  } catch (error: unknown) {
    logger.error("[Auth] Sign-in failed:", { error: getErrorMessage(error) });
    res.status(401).json({ error: "Authentication failed" });
  }
}

export async function signOut(req: Request, res: Response) {
  try {
    if (!hasUser(req)) {
      logger.warn("[Auth] Sign-out attempt without user session");
      return res.status(401).json({ error: "Not authenticated" });
    }

    logger.info(`[Auth] User signed out: ${req.user.email || req.user.uid}`);
    res.json({ message: "Successfully signed out" });
  } catch (error: unknown) {
    logger.error("[Auth] Sign-out failed:", { error: getErrorMessage(error) });
    res.status(500).json({ error: "Sign out failed" });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!hasUser(req)) {
      logger.warn("[Auth] Unauthorized attempt to get user info");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await auth.getUser(req.user.uid);
    const response: AuthResponse = {
      message: "User data retrieved",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    };
    res.json(response);
  } catch (error: unknown) {
    logger.error("[Auth] Failed to get user data:", {
      error: getErrorMessage(error),
    });
    res.status(500).json({ error: "Failed to get user" });
  }
}

export async function checkAdminStatus(req: Request, res: Response) {
  try {
    if (!hasUser(req)) {
      logger.warn("[Auth] Unauthorized admin status check attempt");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const adminUids = process.env.ADMIN_UIDS?.split(",") || [];
    const isAdmin = adminUids.includes(req.user.uid);

    if (!isAdmin) {
      logger.info(
        `[Auth] Non-admin access attempt: ${req.user.email || req.user.uid}`
      );
    }

    const response: AdminCheckResponse = { isAdmin };
    res.json(response);
  } catch (error: unknown) {
    logger.error("[Auth] Admin status check failed:", {
      error: getErrorMessage(error),
    });
    res.status(500).json({ error: "Failed to check admin status" });
  }
}

export async function getAdminList(req: Request, res: Response) {
  try {
    if (!hasUser(req)) {
      logger.warn("[Auth] Unauthorized attempt to get admin list");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const adminUids = process.env.ADMIN_UIDS?.split(",") || [];
    const response: AdminListResponse = { adminUids };
    res.json(response);
  } catch (error: unknown) {
    logger.error("[Auth] Failed to get admin list:", {
      error: getErrorMessage(error),
    });
    res.status(500).json({ error: "Failed to get admin list" });
  }
}
