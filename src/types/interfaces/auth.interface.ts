import { auth } from "firebase-admin";

export interface AuthResponse {
  message: string;
  user: {
    uid: string;
    email: string | undefined;
    displayName: string | undefined;
    photoURL: string | undefined;
  };
  sessionToken?: string;
}

export interface AdminCheckResponse {
  isAdmin: boolean;
}

export interface AdminListResponse {
  adminUids: string[];
}

export interface AuthenticatedRequest extends Request {
  user: auth.DecodedIdToken;
}
