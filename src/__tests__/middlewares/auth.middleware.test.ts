import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware";
import { mockRequest, mockResponse, mockNext } from "../utils";
import * as admin from "firebase-admin";

jest.mock("firebase-admin");

describe("Auth Middleware", () => {
  describe("requireAuth", () => {
    it("should allow access with valid token", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      await requireAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should deny access without token", async () => {
      const req = mockRequest();
      req.headers.authorization = undefined;
      const res = mockResponse();
      const next = mockNext();

      await requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Unauthorized - No token provided" })
      );
    });

    it("should deny access with invalid token", async () => {
      const req = mockRequest();
      req.headers.authorization = "Bearer invalid-token";
      const res = mockResponse();
      const next = mockNext();

      // Mock Firebase to throw error
      (admin.auth().verifyIdToken as jest.Mock).mockRejectedValueOnce(
        new Error("Invalid token")
      );

      await requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Unauthorized - Invalid token" })
      );
    });
  });

  describe("requireAdmin", () => {
    it("should allow access for admin user", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      await requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should deny access for non-admin user", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      // Mock Firebase to return non-admin user
      (admin.auth().getUser as jest.Mock).mockResolvedValueOnce({
        uid: "test-user-id",
        customClaims: { admin: false },
      });

      await requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Forbidden - Admin access required" })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle Firebase errors", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      // Mock Firebase to throw error
      (admin.auth().getUser as jest.Mock).mockRejectedValueOnce(
        new Error("Firebase error")
      );

      await requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Internal server error" })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
