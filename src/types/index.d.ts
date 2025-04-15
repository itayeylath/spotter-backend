import { Request } from "express";
import { auth } from "firebase-admin";

declare global {
  namespace Express {
    interface Request {
      user?: auth.DecodedIdToken & { isAdmin?: boolean };
    }
  }
}

export interface AuthResponse {
  message: string;
  user: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  };
  sessionToken?: string;
}

export interface AdminCheckResponse {
  isAdmin: boolean;
}

export interface AdminListResponse {
  adminUids: string[];
}

export * from "./guards/request.guard";
export * from "./guards/error.guard";
export * from "./guards/firebase.guard";
