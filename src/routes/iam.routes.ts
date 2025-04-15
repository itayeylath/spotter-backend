import { Router } from "express";
import { IAMService } from "@/services/iam.service";
import { requireAuth } from "@/middlewares/auth.middleware";

const router = Router();

// Authentication routes
// POST /signin/google - Authenticate user with Google OAuth token
// Returns: User info and session token
router.post("/signin/google", IAMService.signInWithGoogle);

// POST /signout - End user session
// Returns: Success message
router.post("/signout", IAMService.signOut);

// GET /me - Get current authenticated user's information
// Requires: Authentication token
// Returns: User profile data
router.get("/me", requireAuth, IAMService.getCurrentUser);

// Admin specific routes
// GET /admin/check-status - Check if current user has admin privileges
// Requires: Authentication token
// Returns: { isAdmin: boolean }
router.get("/admin/check-status", requireAuth, IAMService.checkAdminStatus);

// GET /admin/list - Get list of all admin user IDs
// Requires: Authentication token
// Returns: { adminUids: string[] }
router.get("/admin/list", requireAuth, IAMService.getAdminList);

export default router;
