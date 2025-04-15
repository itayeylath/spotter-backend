import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { logger } from "../utils/logger";

export class AdminController {
  static async checkAdminStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.uid) {
        res.status(401).json({ error: "Unauthorized - No user found" });
        return;
      }

      const isAdmin = await AdminService.isAdmin(req.user.uid);
      res.json({ isAdmin });
    } catch (error) {
      logger.error("Error in checkAdminStatus:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAdmins(req: Request, res: Response): Promise<void> {
    try {
      const adminUids = await AdminService.getAdminUsers();
      res.json({ adminUids });
    } catch (error) {
      logger.error("Error in getAdmins:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
