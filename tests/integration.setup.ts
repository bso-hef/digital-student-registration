/**
 * Setup file for integration tests
 * This runs in Node.js environment (not jsdom) and sets up mocks for API testing
 */
import { beforeAll, vi } from "vitest";

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
process.env.MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/digital-student-onboarding-test";
process.env.NODE_ENV = "test";

/**
 * Global test setup
 */
beforeAll(() => {
  // Any global setup for integration tests
});
