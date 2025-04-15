import { Router } from "express";
import { iamService } from "@/services/iam.service";
import { requireAuth } from "@/middlewares/auth.middleware";
import { logger } from "@/utils/logger";

const router = Router();

// Authentication routes
// POST /signin/google - Authenticate user with Google OAuth token
// Returns: User info and session token
router.post("/signin/google", (req, res) => {
  logger.info("[Route] Received Google sign-in request");
  iamService.signInWithGoogle(req, res);
});

// POST /signout - End user session
// Returns: Success message
router.post("/signout", (req, res) => {
  logger.info("[Route] Received sign-out request");
  iamService.signOut(req, res);
});

// GET /me - Get current authenticated user's information
// Requires: Authentication token
// Returns: User profile data
router.get("/me", requireAuth, (req, res) => {
  logger.info("[Route] Received get current user request");
  iamService.getCurrentUser(req, res);
});

// Admin specific routes
// GET /admin/check-status - Check if current user has admin privileges
// Requires: Authentication token
// Returns: { isAdmin: boolean }
router.get("/admin/check-status", requireAuth, (req, res) => {
  logger.info("[Route] Received check admin status request");
  iamService.checkAdminStatus(req, res);
});

// GET /admin/list - Get list of all admin user IDs
// Requires: Authentication token
// Returns: { adminUids: string[] }
router.get("/admin/list", requireAuth, (req, res) => {
  logger.info("[Route] Received get admin list request");
  iamService.getAdminList(req, res);
});

export default router;
