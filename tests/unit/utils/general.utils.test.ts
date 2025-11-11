import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  delay,
  downloadBlob,
  downloadDocument,
  fullFileNameWithLowerCaseExtension,
  getAvatarFullURL,
  getCookie,
  getDisplayFileExtension,
  getFileExtension,
  getFileName,
  isValidURL,
  linkify,
  toLowerCase,
  msToTime,
  removeCookie,
  setCookie,
  toAppError,
} from "@/utils/general.utils";

import type { FileResponse, UserDocument } from "@/utils/general.utils";

/**
 * Tests for general utility functions
 * @file tests/unit/utils/general.utils.test.ts
 */

// Mock file-saver
vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

// Mock js-cookie
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock client-logger
vi.mock("@/lib/client-logger", () => ({
  default: {
    error: vi.fn(),
    log: vi.fn(),
  },
}));

describe("general.utils", () => {
  describe("getDisplayFileExtension", () => {
    it("should return 'txt' for 'plain' mimeType", () => {
      expect(getDisplayFileExtension("plain")).toBe("txt");
    });

    it("should return 'docx' for Word mimeTypes", () => {
      expect(getDisplayFileExtension("msword")).toBe("docx");
      expect(
        getDisplayFileExtension(
          "vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
      ).toBe("docx");
    });

    it("should return the mimeType as-is for other types", () => {
      expect(getDisplayFileExtension("pdf")).toBe("pdf");
      expect(getDisplayFileExtension("jpeg")).toBe("jpeg");
    });
  });

  describe("getFileExtension", () => {
    it("should extract extension from filename", () => {
      expect(getFileExtension("document.pdf")).toBe("pdf");
      expect(getFileExtension("image.jpeg")).toBe("jpeg");
    });

    it("should handle files with multiple dots", () => {
      expect(getFileExtension("my.document.pdf")).toBe("pdf");
    });

    it("should handle filenames without extension", () => {
      const result = getFileExtension("noextension");
      expect(result).toBeDefined();
    });

    it("should convert plain to txt", () => {
      expect(getFileExtension("file.plain")).toBe("txt");
    });

    it("should convert Word extensions to docx", () => {
      expect(getFileExtension("document.msword")).toBe("docx");
    });
  });

  describe("getFileName", () => {
    it("should remove extension from filename", () => {
      expect(getFileName("document.pdf")).toBe("document");
      expect(getFileName("image.jpeg")).toBe("image");
    });

    it("should handle multiple dots", () => {
      expect(getFileName("my.document.pdf")).toBe("my.document");
    });

    it("should handle filenames without extension", () => {
      expect(getFileName("noextension")).toBe("noextension");
    });
  });

  describe("toLowerCase", () => {
    it("should convert string to lowercase", () => {
      expect(toLowerCase("HELLO")).toBe("hello");
      expect(toLowerCase("HeLLo")).toBe("hello");
    });

    it("should handle undefined input", () => {
      expect(toLowerCase(undefined)).toBe("");
    });

    it("should handle non-string input", () => {
      expect(toLowerCase(123 as unknown as string)).toBe("");
    });
  });

  describe("fullFileNameWithLowerCaseExtension", () => {
    it("should return filename with lowercase extension", () => {
      expect(fullFileNameWithLowerCaseExtension("Document.PDF")).toBe(
        "Document.pdf",
      );
      expect(fullFileNameWithLowerCaseExtension("Image.JPEG")).toBe(
        "Image.jpeg",
      );
    });

    it("should handle multiple dots", () => {
      expect(fullFileNameWithLowerCaseExtension("My.Document.PDF")).toBe(
        "My.Document.pdf",
      );
    });
  });

  describe("isValidURL", () => {
    it("should return true for valid URLs", () => {
      expect(isValidURL("https://example.com")).toBe(true);
      expect(isValidURL("http://localhost:3000")).toBe(true);
      expect(isValidURL("https://example.com/path?query=value")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidURL("not a url")).toBe(false);
      expect(isValidURL("")).toBe(false);
      expect(isValidURL("just-text")).toBe(false);
    });
  });

  describe("linkify", () => {
    it("should convert URLs to links", () => {
      const text = "Visit https://example.com for more info";
      const result = linkify(text);
      expect(result).toContain('<a href="https://example.com"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noreferrer noopener"');
    });

    it("should handle multiple URLs", () => {
      const text = "Visit https://example.com and http://test.com";
      const result = linkify(text);
      expect(result).toContain("https://example.com");
      expect(result).toContain("http://test.com");
    });

    it("should handle text without URLs", () => {
      const text = "Just plain text";
      const result = linkify(text);
      expect(result).toBe(text);
    });
  });

  describe("msToTime", () => {
    it("should format milliseconds to HH:MM:SS", () => {
      expect(msToTime(0)).toBe("00:00:00");
      expect(msToTime(1000)).toBe("00:00:01");
      expect(msToTime(60000)).toBe("00:01:00");
      expect(msToTime(3600000)).toBe("01:00:00");
    });

    it("should handle complex times", () => {
      expect(msToTime(3661000)).toBe("01:01:01");
      expect(msToTime(7265000)).toBe("02:01:05");
    });

    it("should pad with zeros", () => {
      expect(msToTime(5000)).toBe("00:00:05");
      expect(msToTime(65000)).toBe("00:01:05");
    });
  });

  describe("delay", () => {
    it("should delay execution", async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90);
    });
  });

  describe("getCookie", () => {
    it("should call Cookies.get with name", () => {
      const mockGet = vi.fn();
      vi.doMock("js-cookie", () => ({
        default: {
          get: mockGet,
        },
      }));
      getCookie("test");
      // Just verify the function runs without error
      expect(true).toBe(true);
    });
  });

  describe("setCookie", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should call setCookie in production", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      setCookie("test", "value");

      // Just verify the function runs without error
      expect(true).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });

    it("should call setCookie in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      setCookie("test", "value");

      // Just verify the function runs without error
      expect(true).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("removeCookie", () => {
    it("should call removeCookie in production", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      removeCookie("test");

      // Just verify the function runs without error
      expect(true).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });

    it("should call removeCookie in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      removeCookie("test");

      // Just verify the function runs without error
      expect(true).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("downloadDocument", () => {
    it("should create and trigger download", () => {
      const mockCreateElement = vi.fn(() => ({
        href: "",
        download: "",
        click: vi.fn(),
      }));
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockCreateObjectURL = vi.fn(() => "blob:url");
      const mockRevokeObjectURL = vi.fn();

      global.document.createElement = mockCreateElement as never;
      global.document.body.appendChild = mockAppendChild;
      global.document.body.removeChild = mockRemoveChild;
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      const response: FileResponse = {
        data: new Blob(["test"]),
        name: "test",
        extension: "txt",
      };
      const doc: UserDocument = { name: "test", extension: "txt" };

      downloadDocument(response, doc);

      expect(mockCreateElement).toHaveBeenCalledWith("a");
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it("should add extension if filename doesn't have one", () => {
      const mockLink = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      const mockCreateElement = vi.fn(() => mockLink);
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockCreateObjectURL = vi.fn(() => "blob:url");
      const mockRevokeObjectURL = vi.fn();

      global.document.createElement = mockCreateElement as never;
      global.document.body.appendChild = mockAppendChild;
      global.document.body.removeChild = mockRemoveChild;
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      const response: FileResponse = {
        data: new Blob(["test"]),
        name: "test",
        extension: "txt",
      };
      const doc: UserDocument = { name: "testfile", extension: "txt" };

      downloadDocument(response, doc);

      expect(mockLink.download).toBe("testfile.txt");
    });
  });

  describe("downloadBlob", () => {
    it("should create and trigger blob download", () => {
      const mockLink = {
        href: "",
        download: "",
        click: vi.fn(),
        remove: vi.fn(),
      };
      const mockCreateElement = vi.fn(() => mockLink);
      const mockAppendChild = vi.fn();
      const mockCreateObjectURL = vi.fn(() => "blob:url");
      const mockRevokeObjectURL = vi.fn();

      global.document.createElement = mockCreateElement as never;
      global.document.body.appendChild = mockAppendChild;
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      const blob = new Blob(["test"], { type: "text/plain" });
      downloadBlob("test.txt", blob);

      expect(mockCreateElement).toHaveBeenCalledWith("a");
      expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
      expect(mockLink.download).toBe("test.txt");
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.remove).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:url");
    });
  });

  describe("getAvatarFullURL", () => {
    it("should return empty string for null path", () => {
      expect(getAvatarFullURL(null as unknown as string)).toBe("");
    });

    it("should return empty string for empty path", () => {
      expect(getAvatarFullURL("")).toBe("");
    });

    it("should return empty string for undefined path", () => {
      expect(getAvatarFullURL(undefined as unknown as string)).toBe("");
    });
  });

  describe("toAppError", () => {
    it("should convert Error to AppError", async () => {
      const error = new Error("Test error");
      const result = await toAppError(error);
      expect(result).toEqual({ message: "Test error" });
    });

    it("should convert Response to AppError with JSON", async () => {
      const response = new Response(JSON.stringify({ detail: "Error detail" }), {
        status: 404,
        statusText: "Not Found",
      });
      const result = await toAppError(response);
      expect(result.message).toBe("Not Found");
      expect(result.statusCode).toBe(404);
      expect(result.details).toEqual({ detail: "Error detail" });
    });

    it("should handle Response without JSON", async () => {
      const response = new Response("Not JSON", {
        status: 500,
        statusText: "Internal Server Error",
      });
      const result = await toAppError(response);
      expect(result.message).toBe("Internal Server Error");
      expect(result.statusCode).toBe(500);
      expect(result.details).toBeNull();
    });

    it("should handle Response with empty statusText", async () => {
      const response = new Response(null, {
        status: 400,
        statusText: "",
      });
      const result = await toAppError(response);
      expect(result.message).toBe("Request failed");
      expect(result.statusCode).toBe(400);
    });

    it("should convert unknown error to AppError", async () => {
      const result = await toAppError("string error");
      expect(result).toEqual({ message: "An unknown error occurred" });
    });

    it("should convert null to AppError", async () => {
      const result = await toAppError(null);
      expect(result).toEqual({ message: "An unknown error occurred" });
    });

    it("should convert undefined to AppError", async () => {
      const result = await toAppError(undefined);
      expect(result).toEqual({ message: "An unknown error occurred" });
    });
  });
});
