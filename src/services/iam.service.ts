import { Request, Response } from "express";
import { IAMController } from "@/controllers/iam.controller";

class IAMService {
  private static instance: IAMService;

  private constructor() {}

  static getInstance(): IAMService {
    if (!IAMService.instance) {
      IAMService.instance = new IAMService();
    }
    return IAMService.instance;
  }

  async signInWithGoogle(req: Request, res: Response) {
    await IAMController.signInWithGoogle(req, res);
  }

  async signOut(req: Request, res: Response) {
    await IAMController.signOut(req, res);
  }

  async getCurrentUser(req: Request, res: Response) {
    await IAMController.getCurrentUser(req, res);
  }

  async checkAdminStatus(req: Request, res: Response) {
    await IAMController.checkAdminStatus(req, res);
  }

  async getAdminList(req: Request, res: Response) {
    await IAMController.getAdminList(req, res);
  }
}

export const iamService = IAMService.getInstance();
