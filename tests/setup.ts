import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { resetFactoryCounters } from './utils/factories';

/**
 * Global test setup for Vitest
 * This file runs before all tests
 */

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

/**
 * MSW Setup
 * Note: MSW is NOT enabled for unit tests because:
 * - MSW browser worker requires Service Workers (not available in jsdom)
 * - MSW node server is only for Node.js environment (integration tests)
 * For unit tests, we mock fetch directly (see below)
 * For integration tests, MSW server is configured in integration.setup.ts
 */

// Reset and cleanup after each test
afterEach(() => {
  resetFactoryCounters();
  cleanup();
  vi.clearAllMocks();
});

/**
 * Mock window.matchMedia
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Mock IntersectionObserver
 */
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

/**
 * Mock ResizeObserver
 */
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

/**
 * Mock window.scrollTo
 */
window.scrollTo = vi.fn();

/**
 * Mock localStorage
 */
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/**
 * Mock sessionStorage
 */
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

/**
 * Mock fetch (as a fallback in case MSW doesn't catch it)
 */
globalThis.fetch = vi.fn();

/**
 * Mock console methods to reduce noise in test output
 * Uncomment if you want to suppress console output during tests
 */
// global.console = {
//   ...console,
//   log: vi.fn(),
//   debug: vi.fn(),
//   info: vi.fn(),
//   warn: vi.fn(),
//   error: vi.fn(),
// };

/**
 * Set up timezone for consistent date testing
 */
process.env.TZ = 'UTC';
