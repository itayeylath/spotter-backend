import { Request, Response } from "express";
import { IAMService } from "@/services/iam.service";
import { auth } from "@/config/firebase.config";

jest.mock("@/config/firebase.config");
jest.mock("@/utils/logger");

describe("IAMService", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: { idToken: "test-token" },
      user: { uid: "test-uid" },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("signInWithGoogle", () => {
    it("should sign in successfully", async () => {
      const mockUser = {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "test-url",
      };

      (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "test-uid" });
      (auth.getUser as jest.Mock).mockResolvedValue(mockUser);
      (auth.createCustomToken as jest.Mock).mockResolvedValue("session-token");

      await IAMService.signInWithGoogle(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Welcome to the app",
        user: {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL,
        },
        sessionToken: "session-token",
      });
    });

    it("should handle missing token", async () => {
      mockReq.body = {};
      await IAMService.signInWithGoogle(
        mockReq as Request,
        mockRes as Response
      );
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe("signOut", () => {
    it("should sign out successfully", async () => {
      await IAMService.signOut(mockReq as Request, mockRes as Response);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Successfully signed out",
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user", async () => {
      const mockUser = {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "test-url",
      };

      (auth.getUser as jest.Mock).mockResolvedValue(mockUser);

      await IAMService.getCurrentUser(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        user: {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL,
        },
      });
    });

    it("should handle unauthenticated user", async () => {
      mockReq.user = undefined;
      await IAMService.getCurrentUser(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });
});
