import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Todo routes
router.get("/", getTodos);
router.get("/:id", getTodo);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
