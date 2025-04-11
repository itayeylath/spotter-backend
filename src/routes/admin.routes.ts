import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import {
  getUsers,
  getUserTodos,
  deleteUser,
  getStats,
} from "../controllers/admin.controller";
import { validate } from "../middlewares/validation.middleware";
import { userIdSchema } from "../utils/validation.schemas";

const router = Router();

// All routes require authentication and admin privileges
router.use(requireAuth, requireAdmin);

// Admin routes
router.get("/users", getUsers);
router.get("/users/:uid/todos", validate(userIdSchema), getUserTodos);
router.delete("/users/:uid", validate(userIdSchema), deleteUser);
router.get("/stats", getStats);

export default router;
