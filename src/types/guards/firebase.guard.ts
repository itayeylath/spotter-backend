import { auth } from "firebase-admin";

/**
 * Type guard to check if an object is a Firebase User
 */
export function isFirebaseUser(user: unknown): user is auth.UserRecord {
  return (
    typeof user === "object" &&
    user !== null &&
    "uid" in user &&
    "email" in user &&
    typeof (user as any).uid === "string"
  );
}

/**
 * Type guard to check if an object is a Firebase ID Token
 */
export function isFirebaseIdToken(
  token: unknown
): token is auth.DecodedIdToken {
  return (
    typeof token === "object" &&
    token !== null &&
    "uid" in token &&
    typeof (token as any).uid === "string"
  );
}

/**
 * Type guard to check if user has admin claim
 */
export function hasAdminClaim(user: auth.DecodedIdToken): boolean {
  return user.admin === true;
}
