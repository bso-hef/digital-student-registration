import {
  copyText,
  getName,
  onlyInitials,
  sanitizeFilename,
  userInitials,
  uuid_v4,
} from "@/utils/string.utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests for string utility functions
 * @file tests/unit/utils/string.utils.test.tsx
 */

describe("string.utils", () => {
  describe("onlyInitials", () => {
    it("should return initials from a name", () => {
      expect(onlyInitials("John Doe")).toBe("JD");
      expect(onlyInitials("Alice Bob Charlie")).toBe("AC");
    });

    it("should handle single word", () => {
      const result = onlyInitials("John");
      expect(result).toBe("J");
    });

    it("should handle empty string", () => {
      const result = onlyInitials("");
      expect(result).toBe("");
    });

    it("should return uppercase initials", () => {
      expect(onlyInitials("john doe")).toBe("JD");
    });

    it("should handle names with special characters", () => {
      expect(onlyInitials("Jean-Pierre François")).toBe("JF");
    });
  });

  describe("userInitials", () => {
    it("should return combined initials from firstName and lastName", () => {
      expect(userInitials("John", "Doe")).toBe("JD");
    });

    it("should return only lastName initials when firstName is empty", () => {
      expect(userInitials("", "Doe")).toBe("D");
    });

    it("should return only firstName initials when lastName is empty", () => {
      expect(userInitials("John", "")).toBe("J");
    });

    it("should return space when both names are empty", () => {
      expect(userInitials("", "")).toBe(" ");
    });

    it("should handle complex names", () => {
      expect(userInitials("Mary Jane", "Watson Parker")).toBe("MJWP");
    });
  });

  describe("getName", () => {
    it("should return full name when firstName and lastName exist", () => {
      const user = { firstName: "John", lastName: "Doe" };
      expect(getName(user)).toBe("John Doe");
    });

    it("should return firstName only when lastName is missing", () => {
      const user = { firstName: "John" };
      expect(getName(user)).toBe("John ");
    });

    it("should return userName when firstName is missing", () => {
      const user = { userName: "johndoe123" };
      expect(getName(user)).toBe("johndoe123");
    });

    it("should return email when firstName and userName are missing", () => {
      const user = { email: "john@example.com" };
      expect(getName(user)).toBe("john@example.com");
    });

    it("should return deviceName when other fields are missing", () => {
      const user = { deviceName: "John's iPhone" };
      expect(getName(user)).toBe("John's iPhone");
    });

    it("should return name field when other fields are missing", () => {
      const user = { name: "John Doe" };
      expect(getName(user)).toBe("John Doe");
    });

    it("should return empty string when all fields are missing", () => {
      const user = {};
      expect(getName(user)).toBe("");
    });

    it("should prioritize firstName over other fields", () => {
      const user = {
        firstName: "John",
        lastName: "Doe",
        userName: "johndoe",
        email: "john@example.com",
      };
      expect(getName(user)).toBe("John Doe");
    });

    it("should prioritize userName over email", () => {
      const user = {
        userName: "johndoe",
        email: "john@example.com",
        deviceName: "Device",
      };
      expect(getName(user)).toBe("johndoe");
    });

    it("should handle null user", () => {
      const user = null as unknown as Parameters<typeof getName>[0];
      expect(getName(user)).toBe("");
    });

    it("should handle undefined user", () => {
      const user = undefined as unknown as Parameters<typeof getName>[0];
      expect(getName(user)).toBe("");
    });
  });

  describe("copyText", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      global.navigator = {
        clipboard: {
          writeText: vi.fn(() => Promise.resolve()),
        },
      } as never;
      global.window = {} as never;
      global.console.warn = vi.fn();
      global.console.log = vi.fn();
      global.console.error = vi.fn();
    });

    it("should copy text to clipboard successfully", async () => {
      await copyText("test text");
      expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(
        "test text",
      );
      expect(global.console.log).toHaveBeenCalledWith(
        "Text successfully copied to clipboard",
      );
    });

    it("should return early if value is empty", async () => {
      await copyText("");
      expect(global.navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it("should warn if clipboard API is not available", async () => {
      global.navigator = {} as never;
      await copyText("test");
      expect(global.console.warn).toHaveBeenCalledWith(
        "Clipboard API not available",
      );
    });

    it("should warn if window is undefined", async () => {
      const originalWindow = global.window;
      delete (global as { window?: Window }).window;

      await copyText("test");

      expect(global.console.warn).toHaveBeenCalledWith(
        "Clipboard API not available",
      );

      global.window = originalWindow;
    });

    it("should handle clipboard write error", async () => {
      const error = new Error("Write failed");
      global.navigator.clipboard.writeText = vi.fn(() => Promise.reject(error));

      await copyText("test");

      expect(global.console.error).toHaveBeenCalledWith(
        "Failed to copy text: ",
        error,
      );
    });
  });

  describe("uuid_v4", () => {
    it("should generate a valid UUID v4 format", () => {
      const uuid = uuid_v4();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it("should generate unique UUIDs", () => {
      const uuid1 = uuid_v4();
      const uuid2 = uuid_v4();
      expect(uuid1).not.toBe(uuid2);
    });

    it("should always have version 4 identifier", () => {
      const uuid = uuid_v4();
      expect(uuid.charAt(14)).toBe("4");
    });

    it("should have correct variant bits", () => {
      const uuid = uuid_v4();
      const variantChar = uuid.charAt(19);
      expect(["8", "9", "a", "b"]).toContain(variantChar.toLowerCase());
    });
  });

  describe("sanitizeFilename", () => {
    it("should remove special characters and replace with underscore", () => {
      expect(sanitizeFilename("hello world!")).toBe("hello_world");
      expect(sanitizeFilename("test@file#name")).toBe("test_file_name");
    });

    it("should normalize and remove diacritics", () => {
      expect(sanitizeFilename("café")).toBe("cafe");
      expect(sanitizeFilename("naïve")).toBe("naive");
    });

    it("should collapse multiple underscores", () => {
      expect(sanitizeFilename("hello___world")).toBe("hello_world");
    });

    it("should remove leading and trailing underscores", () => {
      expect(sanitizeFilename("___hello___")).toBe("hello");
    });

    it("should preserve dots and hyphens", () => {
      expect(sanitizeFilename("file-name.test.txt")).toBe("file-name.test.txt");
    });

    it("should handle empty string", () => {
      expect(sanitizeFilename("")).toBe("");
    });

    it("should handle undefined input", () => {
      expect(sanitizeFilename(undefined)).toBe("");
    });

    it("should handle complex filenames", () => {
      expect(sanitizeFilename("My Résumé (2024) - Final!!!.pdf")).toBe(
        "My_Resume_2024_-_Final_.pdf",
      );
    });
  });
});
