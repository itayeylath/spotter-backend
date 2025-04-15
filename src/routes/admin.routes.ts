import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";

const router = Router();

// Check if current user is admin
router.get("/check-status", requireAuth, AdminController.checkAdminStatus);

// Get all admin users
router.get("/list", requireAuth, AdminController.getAdmins);

export default router;
