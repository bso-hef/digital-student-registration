/**
 * Setup file for integration tests
 * This runs in Node.js environment (not jsdom) and sets up mocks for API testing
 */
import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { server } from "./mocks/server";

/**
 * Mock console methods to reduce noise in test output
 */
globalThis.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

/**
 * Set test environment variables
 */
process.env.NODE_ENV = "test";

/**
 * MongoDB Memory Server instance
 */
let mongoServer: MongoMemoryServer;

/**
 * Global test setup - Start MongoDB Memory Server and MSW Server
 */
beforeAll(async () => {
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  console.info(`MongoDB Memory Server started at ${mongoUri}`);

  // Start MSW Server for API mocking
  server.listen({
    onUnhandledRequest: 'warn',
  });
});

/**
 * Reset MSW handlers after each test
 */
afterEach(() => {
  server.resetHandlers();
});

/**
 * Global test teardown - Stop MongoDB Memory Server and MSW Server
 */
afterAll(async () => {
  // Stop MSW Server
  server.close();

  // Stop MongoDB Memory Server
  if (mongoServer) {
    await mongoServer.stop();
    console.info("MongoDB Memory Server stopped");
  }
});
