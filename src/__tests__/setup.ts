import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import * as admin from "firebase-admin";

// Mock Firebase Admin
jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: "test-user-id",
      email: "test@example.com",
    }),
    getUser: jest.fn().mockResolvedValue({
      uid: "test-user-id",
      customClaims: { admin: true },
    }),
    listUsers: jest.fn().mockResolvedValue({
      users: [
        { uid: "user1", email: "user1@example.com" },
        { uid: "user2", email: "user2@example.com" },
      ],
    }),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  });

  return {
    apps: [],
    credential: {
      cert: jest.fn(),
    },
    auth,
    initializeApp: jest.fn(),
  };
});

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Disconnect from the in-memory database and stop the server
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
