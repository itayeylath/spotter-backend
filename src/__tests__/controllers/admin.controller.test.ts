import {
  getUsers,
  getUserTodos,
  deleteUser,
  getStats,
} from "../../controllers/admin.controller";
import { mockRequest, mockResponse, mockNext, createTestTodo } from "../utils";
import { Todo } from "../../models/todo.model";
import * as admin from "firebase-admin";

jest.mock("firebase-admin");

describe("Admin Controller", () => {
  describe("getUsers", () => {
    it("should return all users", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      // Mock Firebase listUsers response
      (admin.auth().listUsers as jest.Mock).mockResolvedValueOnce({
        users: [
          {
            uid: "user1",
            email: "user1@example.com",
            displayName: "User 1",
            metadata: { creationTime: new Date().toISOString() },
          },
          {
            uid: "user2",
            email: "user2@example.com",
            displayName: "User 2",
            metadata: { creationTime: new Date().toISOString() },
          },
        ],
      });

      await getUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ uid: "user1", email: "user1@example.com" }),
          expect.objectContaining({ uid: "user2", email: "user2@example.com" }),
        ])
      );
    });
  });

  describe("getUserTodos", () => {
    it("should return todos for a specific user", async () => {
      const userId = "test-user-id";
      await createTestTodo({ userId, content: "User Todo 1" });
      await createTestTodo({ userId, content: "User Todo 2" });

      const req = mockRequest({}, { uid: userId });
      const res = mockResponse();
      const next = mockNext();

      // Mock Firebase getUser response
      (admin.auth().getUser as jest.Mock).mockResolvedValueOnce({
        uid: userId,
      });

      await getUserTodos(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ content: "User Todo 1" }),
          expect.objectContaining({ content: "User Todo 2" }),
        ])
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete a user and their todos", async () => {
      const userId = "user-to-delete";
      await createTestTodo({ userId, content: "Todo to delete" });

      const req = mockRequest({}, { uid: userId });
      const res = mockResponse();
      const next = mockNext();

      // Mock Firebase deleteUser response
      (admin.auth().deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

      await deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);

      // Verify todos are deleted
      const remainingTodos = await Todo.find({ userId });
      expect(remainingTodos).toHaveLength(0);
    });
  });

  describe("getStats", () => {
    it("should return application statistics", async () => {
      // Create test data
      await createTestTodo({ content: "Todo 1", completed: true });
      await createTestTodo({ content: "Todo 2", completed: false });
      await createTestTodo({ content: "Todo 3", completed: true });

      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      // Mock Firebase listUsers response
      (admin.auth().listUsers as jest.Mock).mockResolvedValueOnce({
        users: [{ uid: "user1" }, { uid: "user2" }],
      });

      await getStats(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          users: expect.objectContaining({
            total: 2,
          }),
          todos: expect.objectContaining({
            total: 3,
            completed: 2,
            active: 1,
          }),
        })
      );
    });
  });
});
