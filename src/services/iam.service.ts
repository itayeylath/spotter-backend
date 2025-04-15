import { Request, Response } from "express";
import * as IAMController from "@/controllers/iam.controller";
import { logger } from "@/utils/logger";

class IAMService {
  private static instance: IAMService;

  private constructor() {
    logger.info("[Service] IAM Service initialized");
  }

  static getInstance(): IAMService {
    if (!IAMService.instance) {
      IAMService.instance = new IAMService();
    }
    return IAMService.instance;
  }

  async signInWithGoogle(req: Request, res: Response) {
    logger.info("[Service] Delegating Google sign-in to controller");
    await IAMController.signInWithGoogle(req, res);
  }

  async signOut(req: Request, res: Response) {
    logger.info("[Service] Delegating sign-out to controller");
    await IAMController.signOut(req, res);
  }

  async getCurrentUser(req: Request, res: Response) {
    logger.info("[Service] Delegating get current user to controller");
    await IAMController.getCurrentUser(req, res);
  }

  async checkAdminStatus(req: Request, res: Response) {
    logger.info("[Service] Delegating admin status check to controller");
    await IAMController.checkAdminStatus(req, res);
  }

  async getAdminList(req: Request, res: Response) {
    logger.info("[Service] Delegating get admin list to controller");
    await IAMController.getAdminList(req, res);
  }
}

export const iamService = IAMService.getInstance();
