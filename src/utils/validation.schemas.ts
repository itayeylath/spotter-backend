import { z } from "zod";
import { Types } from "mongoose";

// Helper function to check if string is valid MongoDB ObjectId
const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

// Base todo schema
export const todoSchema = z.object({
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .max(1000, "Content cannot exceed 1000 characters"),
  completed: z.boolean().optional(),
});

// Create todo schema
export const createTodoSchema = z.object({
  body: todoSchema,
});

// Update todo schema
export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().refine(isValidObjectId, "Invalid todo ID"),
  }),
  body: todoSchema.partial(),
});

// Get/Delete todo schema
export const todoIdSchema = z.object({
  params: z.object({
    id: z.string().refine(isValidObjectId, "Invalid todo ID"),
  }),
});

// User ID schema for admin routes
export const userIdSchema = z.object({
  params: z.object({
    uid: z.string().min(1, "User ID is required"),
  }),
});
