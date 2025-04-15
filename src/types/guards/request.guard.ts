import { Request } from "express";
import { auth } from "firebase-admin";

/**
 * Type guard to check if request has user property
 */
export function hasUser(
  req: Request
): req is Request & { user: auth.DecodedIdToken } {
  return req.user !== undefined;
}

/**
 * Type guard to check if request has valid ID token
 */
export function hasValidIdToken(req: Request): boolean {
  return (
    req.headers.authorization !== undefined &&
    req.headers.authorization.startsWith("Bearer ")
  );
}

/**
 * Extract ID token from request
 */
export function extractIdToken(req: Request): string | null {
  if (!hasValidIdToken(req)) {
    return null;
  }
  return req.headers.authorization!.split("Bearer ")[1];
}
