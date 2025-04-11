import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { badRequest } from "../utils/AppError";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(badRequest(error.message));
      } else {
        next(badRequest("Invalid input data"));
      }
    }
  };
