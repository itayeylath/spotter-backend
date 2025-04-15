import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import iamRoutes from "../../routes/iam.routes";
import { iamService } from "../../services/iam.service";
import { requireAuth } from "../../middlewares/auth.middleware";

// Mock dependencies
jest.mock("../../services/iam.service", () => ({
  iamService: {
    signInWithGoogle: jest.fn().mockImplementation((req, res) => res.json({})),
    signOut: jest.fn().mockImplementation((req, res) => res.json({})),
    getCurrentUser: jest.fn().mockImplementation((req, res) => res.json({})),
    checkAdminStatus: jest.fn().mockImplementation((req, res) => res.json({})),
    getAdminList: jest.fn().mockImplementation((req, res) => res.json({})),
  },
}));

jest.mock("../../middlewares/auth.middleware", () => ({
  requireAuth: jest
    .fn()
    .mockImplementation((req: Request, res: Response, next: NextFunction) =>
      next()
    ),
}));

describe("IAM Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/auth", iamRoutes);
    jest.clearAllMocks();
  });

  describe("POST /auth/signin/google", () => {
    const mockIdToken = "mock-id-token";

    it("should call service signInWithGoogle", async () => {
      const response = await request(app)
        .post("/auth/signin/google")
        .send({ idToken: mockIdToken });

      expect(response.status).toBe(200);
      expect(iamService.signInWithGoogle).toHaveBeenCalled();
    });

    it("should pass the request body correctly", async () => {
      await request(app)
        .post("/auth/signin/google")
        .send({ idToken: mockIdToken });

      const mockCall = (iamService.signInWithGoogle as jest.Mock).mock
        .calls[0][0];
      expect(mockCall.body).toEqual({ idToken: mockIdToken });
    });
  });

  describe("POST /auth/signout", () => {
    it("should call service signOut", async () => {
      const response = await request(app).post("/auth/signout");

      expect(response.status).toBe(200);
      expect(iamService.signOut).toHaveBeenCalled();
    });
  });

  describe("GET /auth/me", () => {
    it("should require authentication", async () => {
      (requireAuth as jest.Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.status(401).json({ error: "Not authenticated" });
        }
      );

      const response = await request(app).get("/auth/me");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Not authenticated" });
    });

    it("should call service getCurrentUser when authenticated", async () => {
      const response = await request(app).get("/auth/me");

      expect(response.status).toBe(200);
      expect(iamService.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe("GET /auth/admin/check-status", () => {
    it("should require authentication", async () => {
      (requireAuth as jest.Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.status(401).json({ error: "Not authenticated" });
        }
      );

      const response = await request(app).get("/auth/admin/check-status");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Not authenticated" });
    });

    it("should call service checkAdminStatus when authenticated", async () => {
      const response = await request(app).get("/auth/admin/check-status");

      expect(response.status).toBe(200);
      expect(iamService.checkAdminStatus).toHaveBeenCalled();
    });
  });

  describe("GET /auth/admin/list", () => {
    it("should require authentication", async () => {
      (requireAuth as jest.Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.status(401).json({ error: "Not authenticated" });
        }
      );

      const response = await request(app).get("/auth/admin/list");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Not authenticated" });
    });

    it("should call service getAdminList when authenticated", async () => {
      const response = await request(app).get("/auth/admin/list");

      expect(response.status).toBe(200);
      expect(iamService.getAdminList).toHaveBeenCalled();
    });
  });
});
