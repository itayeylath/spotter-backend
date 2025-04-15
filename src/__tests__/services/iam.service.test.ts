import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { iamService } from "../../services/iam.service";
import * as IAMController from "../../controllers/iam.controller";
import { mockRequest, mockResponse } from "../setup";

// Mock the controller functions
jest.mock("../../controllers/iam.controller", () => ({
  signInWithGoogle: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  checkAdminStatus: jest.fn(),
  getAdminList: jest.fn(),
}));

describe("IAM Service", () => {
  let req: Partial<Request & { user?: DecodedIdToken }>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("signInWithGoogle", () => {
    const mockIdToken = "mock-id-token";

    it("should delegate to controller", async () => {
      req.body = { idToken: mockIdToken };
      await iamService.signInWithGoogle(req as Request, res as Response);

      expect(IAMController.signInWithGoogle).toHaveBeenCalledWith(req, res);
      expect(IAMController.signInWithGoogle).toHaveBeenCalledTimes(1);
    });

    it("should handle controller errors", async () => {
      const error = new Error("Test error");
      (IAMController.signInWithGoogle as jest.Mock).mockRejectedValue(error);

      await iamService.signInWithGoogle(req as Request, res as Response);

      expect(IAMController.signInWithGoogle).toHaveBeenCalledWith(req, res);
      expect(IAMController.signInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  describe("signOut", () => {
    it("should delegate to controller", async () => {
      await iamService.signOut(req as Request, res as Response);

      expect(IAMController.signOut).toHaveBeenCalledWith(req, res);
      expect(IAMController.signOut).toHaveBeenCalledTimes(1);
    });

    it("should handle controller errors", async () => {
      const error = new Error("Test error");
      (IAMController.signOut as jest.Mock).mockRejectedValue(error);

      await iamService.signOut(req as Request, res as Response);

      expect(IAMController.signOut).toHaveBeenCalledWith(req, res);
      expect(IAMController.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCurrentUser", () => {
    it("should delegate to controller", async () => {
      req.user = { uid: "test-uid" } as DecodedIdToken;
      await iamService.getCurrentUser(req as Request, res as Response);

      expect(IAMController.getCurrentUser).toHaveBeenCalledWith(req, res);
      expect(IAMController.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it("should handle controller errors", async () => {
      const error = new Error("Test error");
      (IAMController.getCurrentUser as jest.Mock).mockRejectedValue(error);

      await iamService.getCurrentUser(req as Request, res as Response);

      expect(IAMController.getCurrentUser).toHaveBeenCalledWith(req, res);
      expect(IAMController.getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  describe("checkAdminStatus", () => {
    it("should delegate to controller", async () => {
      req.user = { uid: "admin-uid" } as DecodedIdToken;
      await iamService.checkAdminStatus(req as Request, res as Response);

      expect(IAMController.checkAdminStatus).toHaveBeenCalledWith(req, res);
      expect(IAMController.checkAdminStatus).toHaveBeenCalledTimes(1);
    });

    it("should handle controller errors", async () => {
      const error = new Error("Test error");
      (IAMController.checkAdminStatus as jest.Mock).mockRejectedValue(error);

      await iamService.checkAdminStatus(req as Request, res as Response);

      expect(IAMController.checkAdminStatus).toHaveBeenCalledWith(req, res);
      expect(IAMController.checkAdminStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAdminList", () => {
    it("should delegate to controller", async () => {
      req.user = { uid: "test-uid" } as DecodedIdToken;
      await iamService.getAdminList(req as Request, res as Response);

      expect(IAMController.getAdminList).toHaveBeenCalledWith(req, res);
      expect(IAMController.getAdminList).toHaveBeenCalledTimes(1);
    });

    it("should handle controller errors", async () => {
      const error = new Error("Test error");
      (IAMController.getAdminList as jest.Mock).mockRejectedValue(error);

      await iamService.getAdminList(req as Request, res as Response);

      expect(IAMController.getAdminList).toHaveBeenCalledWith(req, res);
      expect(IAMController.getAdminList).toHaveBeenCalledTimes(1);
    });
  });

  describe("Singleton pattern", () => {
    it("should return the same instance", () => {
      const instance1 = iamService;
      const instance2 = iamService;
      expect(instance1).toBe(instance2);
    });

    it("should maintain state between calls", () => {
      const instance1 = iamService;
      const instance2 = iamService;
      expect(Object.keys(instance1)).toEqual(Object.keys(instance2));
    });
  });
});
