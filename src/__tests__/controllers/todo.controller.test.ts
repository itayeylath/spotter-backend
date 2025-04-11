import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../../controllers/todo.controller";
import { mockRequest, mockResponse, mockNext, createTestTodo } from "../utils";
import { Todo } from "../../models/todo.model";
import mongoose from "mongoose";

describe("Todo Controller", () => {
  describe("getTodos", () => {
    it("should return all todos for the current user", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      // Create test todos
      await createTestTodo({ content: "Todo 1" });
      await createTestTodo({ content: "Todo 2" });

      await getTodos(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ content: "Todo 1" }),
          expect.objectContaining({ content: "Todo 2" }),
        ])
      );
    });
  });

  describe("getTodo", () => {
    it("should return a specific todo", async () => {
      const todo = await createTestTodo({ content: "Specific Todo" });
      const req = mockRequest({}, { id: todo._id });
      const res = mockResponse();
      const next = mockNext();

      await getTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ _id: todo._id, content: "Specific Todo" })
      );
    });

    it("should return 404 if todo not found", async () => {
      const req = mockRequest(
        {},
        { id: new mongoose.Types.ObjectId().toString() }
      );
      const res = mockResponse();
      const next = mockNext();

      await getTodo(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404 })
      );
    });
  });

  describe("createTodo", () => {
    it("should create a new todo", async () => {
      const req = mockRequest({
        content: "New Todo Content",
      });
      const res = mockResponse();
      const next = mockNext();

      await createTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "New Todo Content",
          completed: false,
        })
      );
    });
  });

  describe("updateTodo", () => {
    it("should update an existing todo", async () => {
      const todo = await createTestTodo();
      const req = mockRequest(
        { content: "Updated Content", completed: true },
        { id: todo._id }
      );
      const res = mockResponse();
      const next = mockNext();

      await updateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: todo._id,
          content: "Updated Content",
          completed: true,
        })
      );
    });
  });

  describe("deleteTodo", () => {
    it("should delete an existing todo", async () => {
      const todo = await createTestTodo();
      const req = mockRequest({}, { id: todo._id });
      const res = mockResponse();
      const next = mockNext();

      await deleteTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);

      // Verify todo is deleted
      const deletedTodo = await Todo.findById(todo._id);
      expect(deletedTodo).toBeNull();
    });
  });
});
