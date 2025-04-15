import { Request, Response } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";

jest.mock("../services/admin.service");
jest.mock("../config/firebase.config");

describe("AdminController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      user: { uid: "test-uid" },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("checkAdminStatus", () => {
    it("should return admin status", async () => {
      (AdminService.isAdmin as jest.Mock).mockResolvedValue(true);

      await AdminController.checkAdminStatus(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.json).toHaveBeenCalledWith({ isAdmin: true });
    });

    it("should handle errors", async () => {
      (AdminService.isAdmin as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await AdminController.checkAdminStatus(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getAdmins", () => {
    it("should return list of admin UIDs", async () => {
      const adminUids = ["uid1", "uid2"];
      (AdminService.getAdminUsers as jest.Mock).mockResolvedValue(adminUids);

      await AdminController.getAdmins(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({ adminUids });
    });

    it("should handle errors", async () => {
      (AdminService.getAdminUsers as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await AdminController.getAdmins(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
