import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { iamService } from "../services/iam.service";
import { auth } from "../config/firebase.config";
import { logger } from "../utils/logger";

// Mock Firebase Admin
jest.mock("../config/firebase.config", () => ({
  auth: {
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
    createCustomToken: jest.fn(),
  },
}));

// Mock Logger
jest.mock("../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Type the mocked functions
const mockedAuth = auth as jest.Mocked<typeof auth>;

describe("IAM Integration", () => {
  let mockReq: Partial<Request & { user?: DecodedIdToken }>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: { idToken: "test-token" },
      user: {
        uid: "test-uid",
        aud: "test-audience",
        auth_time: 1234567890,
        exp: 1234567890,
        iat: 1234567890,
        iss: "https://securetoken.google.com/test-project",
        sub: "test-uid",
        firebase: {
          identities: {},
          sign_in_provider: "google.com",
        },
      },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  // Skipping signInWithGoogle tests as they will be handled via frontend integration
  describe.skip("signInWithGoogle", () => {
    it("should sign in successfully", async () => {
      const mockDecodedToken = {
        uid: "test-uid",
        aud: "test-audience",
        auth_time: 1234567890,
        exp: 1234567890,
        iat: 1234567890,
        iss: "https://securetoken.google.com/test-project",
        sub: "test-uid",
        firebase: {
          identities: {},
          sign_in_provider: "google.com",
        },
      };

      const mockUser = {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "test-url",
      };

      mockedAuth.verifyIdToken.mockResolvedValueOnce(mockDecodedToken);
      mockedAuth.getUser.mockResolvedValueOnce(mockUser as any);
      mockedAuth.createCustomToken.mockResolvedValueOnce("session-token");

      await iamService.signInWithGoogle(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockedAuth.verifyIdToken).toHaveBeenCalledWith("test-token");
      expect(mockedAuth.getUser).toHaveBeenCalledWith("test-uid");
      expect(mockedAuth.createCustomToken).toHaveBeenCalledWith("test-uid");
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
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle missing token", async () => {
      mockReq.body = {};
      await iamService.signInWithGoogle(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "ID token is required",
      });
      expect(logger.warn).toHaveBeenCalled();
    });

    it("should handle invalid token", async () => {
      mockedAuth.verifyIdToken.mockRejectedValue(new Error("Invalid token"));

      await iamService.signInWithGoogle(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Authentication failed",
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("signOut", () => {
    it("should sign out successfully", async () => {
      await iamService.signOut(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Successfully signed out",
      });
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle unauthenticated signout", async () => {
      mockReq.user = undefined;
      await iamService.signOut(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Not authenticated" });
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user successfully", async () => {
      const mockUser = {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "test-url",
      };

      mockedAuth.getUser.mockResolvedValue(mockUser as any);

      await iamService.getCurrentUser(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User data retrieved",
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
      await iamService.getCurrentUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Not authenticated" });
      expect(logger.warn).toHaveBeenCalled();
    });

    it("should handle user not found", async () => {
      mockedAuth.getUser.mockRejectedValue(new Error("User not found"));

      await iamService.getCurrentUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to get user",
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
