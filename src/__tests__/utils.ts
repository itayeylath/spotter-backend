import { Request, Response, NextFunction } from "express";
import { Todo } from "../models/todo.model";

export const mockRequest = (
  body: any = {},
  params: any = {},
  query: any = {},
  headers: any = {}
) => {
  return {
    body,
    params,
    query,
    headers: {
      authorization: "Bearer test-token",
      ...headers,
    },
    user: {
      uid: "test-user-id",
    },
  } as Request;
};

export const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = () => jest.fn() as NextFunction;

interface TodoDocument {
  content: string;
  completed: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createTestTodo = async (data: Partial<TodoDocument> = {}) => {
  return await Todo.create({
    content: "Test Content",
    completed: false,
    userId: "test-user-id",
    ...data,
  });
};
