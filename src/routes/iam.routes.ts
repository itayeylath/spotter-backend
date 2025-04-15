import { Router } from "express";
import { iamService } from "@/services/iam.service";
import { requireAuth } from "@/middlewares/auth.middleware";

const router = Router();

// Authentication routes
// POST /signin/google - Authenticate user with Google OAuth token
// Returns: User info and session token
router.post("/signin/google", (req, res) =>
  iamService.signInWithGoogle(req, res)
);

// POST /signout - End user session
// Returns: Success message
router.post("/signout", (req, res) => iamService.signOut(req, res));

// GET /me - Get current authenticated user's information
// Requires: Authentication token
// Returns: User profile data
router.get("/me", requireAuth, (req, res) =>
  iamService.getCurrentUser(req, res)
);

// Admin specific routes
// GET /admin/check-status - Check if current user has admin privileges
// Requires: Authentication token
// Returns: { isAdmin: boolean }
router.get("/admin/check-status", requireAuth, (req, res) =>
  iamService.checkAdminStatus(req, res)
);

// GET /admin/list - Get list of all admin user IDs
// Requires: Authentication token
// Returns: { adminUids: string[] }
router.get("/admin/list", requireAuth, (req, res) =>
  iamService.getAdminList(req, res)
);

export default router;
