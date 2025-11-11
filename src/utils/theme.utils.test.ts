import { THEME } from "@/constants/general.constants";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getSystemTheme,
  isSystemThemeSupported,
  resolveThemeMode,
  subscribeToThemeChanges,
} from "./theme.utils";

describe("theme.utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSystemTheme", () => {
    it("should return dark theme when system prefers dark", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(getSystemTheme()).toBe(THEME.DARK);
    });

    it("should return light theme when system prefers light", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(getSystemTheme()).toBe(THEME.LIGHT);
    });

    it("should return light theme by default", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: undefined,
      });

      expect(getSystemTheme()).toBe(THEME.LIGHT);
    });
  });

  describe("resolveThemeMode", () => {
    it("should return system theme when themeKey is auto", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: true,
          media: "(prefers-color-scheme: dark)",
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(resolveThemeMode(THEME.AUTO)).toBe(THEME.DARK);
    });

    it("should return dark when themeKey is dark", () => {
      expect(resolveThemeMode(THEME.DARK)).toBe(THEME.DARK);
    });

    it("should return light when themeKey is light", () => {
      expect(resolveThemeMode(THEME.LIGHT)).toBe(THEME.LIGHT);
    });

    it("should return light for any other themeKey", () => {
      expect(resolveThemeMode("unknown")).toBe(THEME.LIGHT);
    });
  });

  describe("subscribeToThemeChanges", () => {
    it("should call callback when theme changes", () => {
      const callback = vi.fn();
      const mockAddEventListener = vi.fn();
      const mockRemoveEventListener = vi.fn();

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        })),
      });

      const cleanup = subscribeToThemeChanges(callback);

      expect(mockAddEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );

      // Test cleanup
      cleanup();
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
    });

    it("should return no-op function when matchMedia is not supported", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: undefined,
      });

      const callback = vi.fn();
      const cleanup = subscribeToThemeChanges(callback);

      expect(typeof cleanup).toBe("function");
      expect(() => cleanup()).not.toThrow();
    });

    it("should use addListener for legacy browsers", () => {
      const callback = vi.fn();
      const mockAddListener = vi.fn();
      const mockRemoveListener = vi.fn();

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          addEventListener: undefined,
          removeEventListener: undefined,
          addListener: mockAddListener,
          removeListener: mockRemoveListener,
        })),
      });

      const cleanup = subscribeToThemeChanges(callback);

      expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function));

      cleanup();
      expect(mockRemoveListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should call callback with dark theme when matches is true", () => {
      const callback = vi.fn();
      let changeHandler: ((e: { matches: boolean }) => void) | null = null;

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          addEventListener: (
            event: string,
            handler: (event: { matches: boolean }) => void,
          ) => {
            changeHandler = handler;
          },
          removeEventListener: vi.fn(),
        })),
      });

      subscribeToThemeChanges(callback);

      // Simulate theme change to dark
      if (changeHandler) {
        changeHandler({ matches: true });
      }

      expect(callback).toHaveBeenCalledWith(THEME.DARK);
    });

    it("should call callback with light theme when matches is false", () => {
      const callback = vi.fn();
      let changeHandler: ((e: { matches: boolean }) => void) | null = null;

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          addEventListener: (
            event: string,
            handler: (event: { matches: boolean }) => void,
          ) => {
            changeHandler = handler;
          },
          removeEventListener: vi.fn(),
        })),
      });

      subscribeToThemeChanges(callback);

      // Simulate theme change to light
      if (changeHandler) {
        changeHandler({ matches: false });
      }

      expect(callback).toHaveBeenCalledWith(THEME.LIGHT);
    });
  });

  describe("isSystemThemeSupported", () => {
    it("should return true when system theme is supported", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: "(prefers-color-scheme: dark)",
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(isSystemThemeSupported()).toBe(true);
    });

    it("should return false when matchMedia is not available", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: undefined,
      });

      expect(isSystemThemeSupported()).toBe(false);
    });

    it('should return false when media is "not all"', () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: "not all",
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(isSystemThemeSupported()).toBe(false);
    });
  });
});
