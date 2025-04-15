/**
 * Type guard to check if an unknown value is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard to check if an unknown value is a Firebase Auth Error
 */
export function isFirebaseAuthError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as any).code === "string" &&
    typeof (error as any).message === "string"
  );
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isFirebaseAuthError(error)) {
    return `Firebase Auth Error: ${error.code} - ${error.message}`;
  }
  if (isError(error)) {
    return error.message;
  }
  return "Unknown error occurred";
}
