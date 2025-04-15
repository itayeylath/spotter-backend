import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

// Mock Firebase Admin
jest.mock("firebase-admin", () => ({
  auth: () => ({
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
    createCustomToken: jest.fn(),
  }),
}));

// Mock Logger
jest.mock("@/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Helper to create mock request
export const mockRequest = (data: any = {}): Partial<Request> => ({
  body: data.body || {},
  headers: data.headers || {},
  user: data.user as DecodedIdToken | undefined,
});

// Helper to create mock response
export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
