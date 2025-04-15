import * as admin from "firebase-admin";
import { logger } from "../utils/logger";

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    // Validate required credentials
    if (
      !serviceAccount.projectId ||
      !serviceAccount.privateKey ||
      !serviceAccount.clientEmail
    ) {
      throw new Error("Missing Firebase service account credentials");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    logger.info("Firebase Admin initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

export const auth = admin.auth();
export const firestore = admin.firestore();
