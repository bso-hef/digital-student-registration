import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  copyText,
  getName,
  onlyInitials,
  sanitizeFilename,
  userInitials,
  uuid_v4,
} from "./string.utils";

describe("string.utils", () => {
  describe("onlyInitials", () => {
    it("should return initials from a single word", () => {
      expect(onlyInitials("John")).toBe("J");
    });

    it("should return initials from two words", () => {
      expect(onlyInitials("John Doe")).toBe("JD");
    });

    it("should return initials from three words", () => {
      expect(onlyInitials("John Michael Doe")).toBe("JD");
    });

    it("should handle empty string", () => {
      expect(onlyInitials("")).toBe("");
    });

    it("should handle unicode characters", () => {
      expect(onlyInitials("Müller")).toBe("M");
    });
  });

  describe("userInitials", () => {
    it("should return initials from first and last name", () => {
      expect(userInitials("John", "Doe")).toBe("JD");
    });

    it("should return initials from only first name", () => {
      expect(userInitials("John", "")).toBe("J");
    });

    it("should return initials from only last name", () => {
      expect(userInitials("", "Doe")).toBe("D");
    });

    it("should return space when both names are empty", () => {
      expect(userInitials("", "")).toBe(" ");
    });

    it("should handle multi-word names", () => {
      expect(userInitials("John Michael", "Van Doe")).toBe("JMVD");
    });
  });

  describe("getName", () => {
    it("should return first and last name", () => {
      const user = { firstName: "John", lastName: "Doe" };
      expect(getName(user)).toBe("John Doe");
    });

    it("should return only first name when no last name", () => {
      const user = { firstName: "John" };
      expect(getName(user)).toBe("John ");
    });

    it("should return userName when no firstName", () => {
      const user = { userName: "johndoe" };
      expect(getName(user)).toBe("johndoe");
    });

    it("should return email when no firstName or userName", () => {
      const user = { email: "john@example.com" };
      expect(getName(user)).toBe("john@example.com");
    });

    it("should return deviceName when no other fields", () => {
      const user = { deviceName: "Device123" };
      expect(getName(user)).toBe("Device123");
    });

    it("should return name field when no other fields", () => {
      const user = { name: "John Doe" };
      expect(getName(user)).toBe("John Doe");
    });

    it("should return empty string when user has no identifiable fields", () => {
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
  });

  describe("copyText", () => {
    const mockWriteText = vi.fn();

    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should copy text to clipboard", async () => {
      mockWriteText.mockResolvedValue(undefined);
      await copyText("test text");
      expect(mockWriteText).toHaveBeenCalledWith("test text");
    });

    it("should not copy empty string", async () => {
      await copyText("");
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it("should handle clipboard errors", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockWriteText.mockRejectedValue(new Error("Clipboard error"));

      await copyText("test");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to copy text: ",
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
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

    it("should have correct length", () => {
      const uuid = uuid_v4();
      expect(uuid.length).toBe(36);
    });
  });

  describe("sanitizeFilename", () => {
    it("should remove special characters", () => {
      expect(sanitizeFilename("file@name#test.pdf")).toBe("file_name_test.pdf");
    });

    it("should normalize unicode characters", () => {
      expect(sanitizeFilename("filé-näme.pdf")).toBe("file-name.pdf");
    });

    it("should replace multiple underscores with single underscore", () => {
      expect(sanitizeFilename("file___name.pdf")).toBe("file_name.pdf");
    });

    it("should remove leading and trailing underscores", () => {
      expect(sanitizeFilename("_filename_.pdf")).toBe("filename_.pdf");
    });

    it("should handle empty string", () => {
      expect(sanitizeFilename("")).toBe("");
    });

    it("should handle undefined", () => {
      expect(sanitizeFilename(undefined)).toBe("");
    });

    it("should preserve dots and hyphens", () => {
      expect(sanitizeFilename("my-file.name.pdf")).toBe("my-file.name.pdf");
    });

    it("should handle spaces", () => {
      expect(sanitizeFilename("my file name.pdf")).toBe("my_file_name.pdf");
    });
  });
});
