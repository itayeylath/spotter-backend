import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import { Todo } from "../models/todo.model";
import { notFound } from "../utils/AppError";
import { logger } from "../utils/logger";

// Get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { users } = await admin.auth().listUsers();
    res.status(200).json(
      users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.metadata.creationTime,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// Get user's todos
export const getUserTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid } = req.params;

    // Verify user exists
    await admin.auth().getUser(uid);

    const todos = await Todo.find({ userId: uid }).sort({ createdAt: -1 });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

// Delete user and their todos
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid } = req.params;

    // Delete user from Firebase
    await admin.auth().deleteUser(uid);

    // Delete all user's todos
    await Todo.deleteMany({ userId: uid });

    logger.info(`User ${uid} and their todos deleted`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get application statistics
export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [userCount, todoCount, completedTodoCount] = await Promise.all([
      admin
        .auth()
        .listUsers()
        .then((result) => result.users.length),
      Todo.countDocuments(),
      Todo.countDocuments({ completed: true }),
    ]);

    // Get todos created in the last 7 days
    const lastWeekTodos = await Todo.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      users: {
        total: userCount,
      },
      todos: {
        total: todoCount,
        completed: completedTodoCount,
        active: todoCount - completedTodoCount,
        lastWeek: lastWeekTodos,
      },
      updatedAt: new Date(),
    });
  } catch (error) {
    next(error);
  }
};
