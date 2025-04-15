import { auth } from "../config/firebase.config";
import { logger } from "../utils/logger";

export class AdminService {
  static async isAdmin(uid: string): Promise<boolean> {
    try {
      const adminUids = process.env.ADMIN_UIDS?.split(",") || [];
      return adminUids.includes(uid);
    } catch (error) {
      logger.error("Error checking admin status:", error);
      throw error;
    }
  }

  static async getAdminUsers(): Promise<string[]> {
    try {
      const adminUids = process.env.ADMIN_UIDS?.split(",") || [];
      return adminUids;
    } catch (error) {
      logger.error("Error getting admin users:", error);
      throw error;
    }
  }
}
