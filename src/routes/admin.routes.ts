import { Router } from "express";
import { iamService } from "../services/iam.service";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/check", requireAuth, iamService.checkAdminStatus);
router.get("/list", requireAuth, iamService.getAdminList);

export default router;
