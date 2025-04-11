import { Request, Response, NextFunction } from "express";
import { Todo } from "../models/todo.model";
import { AppError, notFound } from "../utils/AppError";
import { logger } from "../utils/logger";

// Get all todos for current user
export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todos = await Todo.find({ userId: req.user!.uid }).sort({
      createdAt: -1,
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

// Get a specific todo
export const getTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user!.uid,
    });

    if (!todo) {
      throw notFound("Todo not found");
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

// Create a new todo
export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todo.create({
      userId: req.user!.uid,
      content: req.body.content,
      completed: false,
    });

    logger.info(`Todo created with ID: ${todo._id}`);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

// Update a todo
export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.uid,
      },
      {
        content: req.body.content,
        completed: req.body.completed,
      },
      { new: true }
    );

    if (!todo) {
      throw notFound("Todo not found");
    }

    logger.info(`Todo updated with ID: ${todo._id}`);
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

// Delete a todo
export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.uid,
    });

    if (!todo) {
      throw notFound("Todo not found");
    }

    logger.info(`Todo deleted with ID: ${todo._id}`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
