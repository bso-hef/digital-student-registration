import { THEME } from "@/constants/general.constants";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getSystemTheme,
  isSystemThemeSupported,
  resolveThemeMode,
  subscribeToThemeChanges,
} from "@/utils/theme.utils";

/**
 * Tests for theme utility functions
 * @file tests/unit/utils/theme.utils.test.ts
 */

describe("theme.utils", () => {
  describe("getSystemTheme", () => {
    beforeEach(() => {
      // Reset window.matchMedia mock before each test
      delete (global.window as { matchMedia?: unknown }).matchMedia;
    });

    it("should return dark theme when system prefers dark", () => {
      global.window = {
        matchMedia: vi.fn((query) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const result = getSystemTheme();
      expect(result).toBe(THEME.DARK);
    });

    it("should return light theme when system prefers light", () => {
      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const result = getSystemTheme();
      expect(result).toBe(THEME.LIGHT);
    });

    it("should return light theme when matchMedia is not supported", () => {
      global.window = {} as never;
      const result = getSystemTheme();
      expect(result).toBe(THEME.LIGHT);
    });

    it("should return light theme when window is undefined", () => {
      const originalWindow = global.window;
      delete (global as { window?: Window }).window;
      const result = getSystemTheme();
      global.window = originalWindow;
      expect(result).toBe(THEME.LIGHT);
    });
  });

  describe("resolveThemeMode", () => {
    beforeEach(() => {
      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      } as never;
    });

    it("should return system theme when theme key is auto", () => {
      const result = resolveThemeMode(THEME.AUTO);
      expect([THEME.DARK, THEME.LIGHT]).toContain(result);
    });

    it("should return dark when theme key is dark", () => {
      const result = resolveThemeMode(THEME.DARK);
      expect(result).toBe(THEME.DARK);
    });

    it("should return light when theme key is light", () => {
      const result = resolveThemeMode(THEME.LIGHT);
      expect(result).toBe(THEME.LIGHT);
    });

    it("should default to light for unknown theme keys", () => {
      const result = resolveThemeMode("unknown");
      expect(result).toBe(THEME.LIGHT);
    });
  });

  describe("subscribeToThemeChanges", () => {
    it("should add event listener when addEventListener is supported", () => {
      const mockAddEventListener = vi.fn();
      const mockRemoveEventListener = vi.fn();

      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
          addListener: undefined,
          removeListener: undefined,
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const callback = vi.fn();
      const cleanup = subscribeToThemeChanges(callback);

      expect(mockAddEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );

      cleanup();
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
    });

    it("should use addListener fallback for legacy browsers", () => {
      const mockAddListener = vi.fn();
      const mockRemoveListener = vi.fn();

      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addEventListener: undefined,
          removeEventListener: undefined,
          addListener: mockAddListener,
          removeListener: mockRemoveListener,
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const callback = vi.fn();
      const cleanup = subscribeToThemeChanges(callback);

      expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function));

      cleanup();
      expect(mockRemoveListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should return no-op cleanup when matchMedia is not supported", () => {
      global.window = {} as never;

      const callback = vi.fn();
      const cleanup = subscribeToThemeChanges(callback);

      expect(typeof cleanup).toBe("function");
      expect(() => cleanup()).not.toThrow();
    });

    it("should call callback with dark theme when change event fires with matches=true", () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | undefined;
      const mockAddEventListener = vi.fn((event, handler) => {
        if (event === "change") {
          changeHandler = handler;
        }
      });

      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addEventListener: mockAddEventListener,
          removeEventListener: vi.fn(),
          addListener: undefined,
          removeListener: undefined,
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const callback = vi.fn();
      subscribeToThemeChanges(callback);

      // Simulate theme change
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }

      expect(callback).toHaveBeenCalledWith(THEME.DARK);
    });

    it("should call callback with light theme when change event fires with matches=false", () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | undefined;
      const mockAddEventListener = vi.fn((event, handler) => {
        if (event === "change") {
          changeHandler = handler;
        }
      });

      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addEventListener: mockAddEventListener,
          removeEventListener: vi.fn(),
          addListener: undefined,
          removeListener: undefined,
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const callback = vi.fn();
      subscribeToThemeChanges(callback);

      // Simulate theme change
      if (changeHandler) {
        changeHandler({ matches: false } as MediaQueryListEvent);
      }

      expect(callback).toHaveBeenCalledWith(THEME.LIGHT);
    });

    it("should handle cleanup with neither modern nor legacy methods available", () => {
      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addEventListener: undefined,
          removeEventListener: undefined,
          addListener: undefined,
          removeListener: undefined,
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const callback = vi.fn();
      const cleanup = subscribeToThemeChanges(callback);

      expect(() => cleanup()).not.toThrow();
    });

    it("should return no-op when window is undefined", () => {
      const originalWindow = global.window;
      delete (global as { window?: Window }).window;

      const callback = vi.fn();
      const cleanup = subscribeToThemeChanges(callback);

      expect(typeof cleanup).toBe("function");
      expect(() => cleanup()).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe("isSystemThemeSupported", () => {
    it("should return true when prefers-color-scheme is supported", () => {
      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const result = isSystemThemeSupported();
      expect(result).toBe(true);
    });

    it("should return false when prefers-color-scheme is not supported", () => {
      global.window = {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: "not all",
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      } as never;

      const result = isSystemThemeSupported();
      expect(result).toBe(false);
    });

    it("should return false when matchMedia is not available", () => {
      global.window = {} as never;
      const result = isSystemThemeSupported();
      expect(result).toBe(false);
    });

    it("should return false when window is undefined", () => {
      const originalWindow = global.window;
      delete (global as { window?: Window }).window;

      const result = isSystemThemeSupported();

      global.window = originalWindow;
      expect(result).toBe(false);
    });
  });
});
