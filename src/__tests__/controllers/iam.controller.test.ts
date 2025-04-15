import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../config/firebase.config";
import * as IAMController from "../../controllers/iam.controller";
import { mockRequest, mockResponse } from "../setup";

// Mock Firebase Admin
jest.mock("../../config/firebase.config", () => ({
  auth: {
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
    createCustomToken: jest.fn(),
  },
}));

// Type the mocked functions
const mockedAuth = auth as jest.Mocked<typeof auth>;

describe("IAM Controller", () => {
  let req: Partial<Request & { user?: DecodedIdToken }>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("signInWithGoogle", () => {
    const mockIdToken = "mock-id-token";
    const mockUser = {
      uid: "user123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: "http://example.com/photo.jpg",
    };

    it("should successfully sign in user with valid token", async () => {
      req.headers = { authorization: `Bearer ${mockIdToken}` };
      mockedAuth.verifyIdToken.mockResolvedValue({
        uid: mockUser.uid,
      } as DecodedIdToken);
      mockedAuth.getUser.mockResolvedValue(mockUser as any);
      mockedAuth.createCustomToken.mockResolvedValue("session-token");

      await IAMController.signInWithGoogle(req as Request, res as Response);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Welcome to the app",
          user: expect.objectContaining(mockUser),
          sessionToken: "session-token",
        })
      );
    });

    it("should return 400 if no ID token provided", async () => {
      await IAMController.signInWithGoogle(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "ID token is required" });
    });
  });

  describe("getCurrentUser", () => {
    const mockUser = {
      uid: "user123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: "http://example.com/photo.jpg",
    };

    it("should return user data for authenticated user", async () => {
      req.user = { uid: mockUser.uid } as DecodedIdToken;
      mockedAuth.getUser.mockResolvedValue(mockUser as any);

      await IAMController.getCurrentUser(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User data retrieved",
          user: expect.objectContaining(mockUser),
        })
      );
    });

    it("should return 401 if user not authenticated", async () => {
      await IAMController.getCurrentUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Not authenticated" });
    });
  });

  describe("checkAdminStatus", () => {
    beforeEach(() => {
      process.env.ADMIN_UIDS = "admin123,admin456";
    });

    afterEach(() => {
      delete process.env.ADMIN_UIDS;
    });

    it("should return true for admin user", async () => {
      req.user = { uid: "admin123" } as DecodedIdToken;

      await IAMController.checkAdminStatus(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ isAdmin: true });
    });

    it("should return false for non-admin user", async () => {
      req.user = { uid: "user789" } as DecodedIdToken;

      await IAMController.checkAdminStatus(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ isAdmin: false });
    });
  });

  describe("getAdminList", () => {
    beforeEach(() => {
      process.env.ADMIN_UIDS = "admin123,admin456";
    });

    afterEach(() => {
      delete process.env.ADMIN_UIDS;
    });

    it("should return list of admin UIDs for authenticated user", async () => {
      req.user = { uid: "user123" } as DecodedIdToken;

      await IAMController.getAdminList(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        adminUids: ["admin123", "admin456"],
      });
    });

    it("should return 401 if user not authenticated", async () => {
      await IAMController.getAdminList(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Not authenticated" });
    });
  });
});
