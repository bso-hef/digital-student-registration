import Cookies from "js-cookie";
import { describe, expect, it, vi } from "vitest";

import {
  delay,
  fullFileNameWithLowerCaseExtension,
  getAvatarFullURL,
  getCookie,
  getDisplayFileExtension,
  getFileExtension,
  getFileName,
  isValidURL,
  linkify,
  msToTime,
  removeCookie,
  setCookie,
  toAppError,
  toLowerCase,
} from "./general.utils";

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("general.utils", () => {
  describe("getDisplayFileExtension", () => {
    it("should return txt for plain mime type", () => {
      expect(getDisplayFileExtension("plain")).toBe("txt");
    });

    it("should return docx for word mime types", () => {
      expect(getDisplayFileExtension("msword")).toBe("docx");
      expect(
        getDisplayFileExtension(
          "vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
      ).toBe("docx");
    });

    it("should return the mime type as-is for other types", () => {
      expect(getDisplayFileExtension("pdf")).toBe("pdf");
      expect(getDisplayFileExtension("jpeg")).toBe("jpeg");
    });
  });

  describe("getFileExtension", () => {
    it("should extract file extension", () => {
      expect(getFileExtension("document.pdf")).toBe("pdf");
      expect(getFileExtension("image.jpeg")).toBe("jpeg");
    });

    it("should handle files with multiple dots", () => {
      expect(getFileExtension("my.file.name.txt")).toBe("txt");
    });

    it("should return filename for files without extension", () => {
      expect(getFileExtension("filename")).toBe("filename");
    });

    it("should handle word documents", () => {
      expect(getFileExtension("document.docx")).toBe("docx");
    });
  });

  describe("getFileName", () => {
    it("should remove extension from filename", () => {
      expect(getFileName("document.pdf")).toBe("document");
      expect(getFileName("image.jpg")).toBe("image");
    });

    it("should handle files with multiple dots", () => {
      expect(getFileName("my.file.name.txt")).toBe("my.file.name");
    });

    it("should return filename as-is if no extension", () => {
      expect(getFileName("filename")).toBe("filename");
    });
  });

  describe("toLowerCase", () => {
    it("should convert string to lowercase", () => {
      expect(toLowerCase("HELLO")).toBe("hello");
      expect(toLowerCase("MiXeD")).toBe("mixed");
    });

    it("should handle empty string", () => {
      expect(toLowerCase("")).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(toLowerCase(undefined)).toBe("");
    });

    it("should handle unicode characters", () => {
      expect(toLowerCase("ÜBUNG")).toBe("übung");
    });
  });

  describe("fullFileNameWithLowerCaseExtension", () => {
    it("should lowercase the extension", () => {
      expect(fullFileNameWithLowerCaseExtension("Document.PDF")).toBe(
        "Document.pdf",
      );
      expect(fullFileNameWithLowerCaseExtension("Image.JPEG")).toBe(
        "Image.jpeg",
      );
    });

    it("should preserve the filename case", () => {
      expect(fullFileNameWithLowerCaseExtension("MyDocument.TXT")).toBe(
        "MyDocument.txt",
      );
    });

    it("should handle files with multiple dots", () => {
      expect(fullFileNameWithLowerCaseExtension("my.file.name.PDF")).toBe(
        "my.file.name.pdf",
      );
    });
  });

  describe("isValidURL", () => {
    it("should return true for valid HTTP URLs", () => {
      expect(isValidURL("http://example.com")).toBe(true);
      expect(isValidURL("https://example.com")).toBe(true);
    });

    it("should return true for URLs with paths and query strings", () => {
      expect(isValidURL("https://example.com/path?query=value")).toBe(true);
      expect(isValidURL("http://example.com:8080/api/test")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidURL("not a url")).toBe(false);
      expect(isValidURL("just some text")).toBe(false);
    });

    it("should return true for other valid protocols", () => {
      expect(isValidURL("ftp://example.com")).toBe(true);
      expect(isValidURL("file:///path/to/file")).toBe(true);
    });
  });

  describe("linkify", () => {
    it("should convert HTTP URLs to links", () => {
      const text = "Visit http://example.com for more";
      const result = linkify(text);
      expect(result).toContain('<a href="http://example.com"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noreferrer noopener"');
    });

    it("should convert HTTPS URLs to links", () => {
      const text = "Check out https://example.com/path";
      const result = linkify(text);
      expect(result).toContain('<a href="https://example.com/path"');
    });

    it("should handle multiple URLs in text", () => {
      const text = "Visit http://example1.com and https://example2.com";
      const result = linkify(text);
      expect(result).toContain("http://example1.com");
      expect(result).toContain("https://example2.com");
      expect((result.match(/<a href=/g) || []).length).toBe(2);
    });

    it("should not modify text without URLs", () => {
      const text = "Just some regular text";
      expect(linkify(text)).toBe(text);
    });

    it("should handle URLs with query parameters", () => {
      const text = "Go to https://example.com?param=value&other=test";
      const result = linkify(text);
      expect(result).toContain(
        '<a href="https://example.com?param=value&other=test"',
      );
    });
  });

  describe("msToTime", () => {
    it("should format milliseconds to HH:MM:SS", () => {
      expect(msToTime(0)).toBe("00:00:00");
      expect(msToTime(1000)).toBe("00:00:01");
      expect(msToTime(60000)).toBe("00:01:00");
      expect(msToTime(3600000)).toBe("01:00:00");
    });

    it("should handle complex time values", () => {
      expect(msToTime(3661000)).toBe("01:01:01"); // 1 hour, 1 minute, 1 second
      expect(msToTime(7200000)).toBe("02:00:00"); // 2 hours
    });

    it("should pad single digits with zeros", () => {
      expect(msToTime(9000)).toBe("00:00:09");
      expect(msToTime(540000)).toBe("00:09:00");
    });
  });

  describe("delay", () => {
    it("should delay execution", async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(95); // Allow some tolerance
    });

    it("should return a promise", () => {
      const result = delay(10);
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe("getCookie", () => {
    it("should call Cookies.get with the correct name", () => {
      getCookie("testCookie");
      expect(Cookies.get).toHaveBeenCalledWith("testCookie");
    });

    it("should return the cookie value", () => {
      vi.mocked(Cookies.get).mockReturnValue("cookieValue");
      const result = getCookie("testCookie");
      expect(result).toBe("cookieValue");
    });
  });

  describe("setCookie", () => {
    it("should call Cookies.set with correct parameters in development", () => {
      process.env.NODE_ENV = "development";
      setCookie("testCookie", "testValue");
      expect(Cookies.set).toHaveBeenCalledWith("testCookie", "testValue", {
        expires: 365,
        sameSite: "lax",
        secure: false,
      });
    });

    it("should call Cookies.set with correct parameters in production", () => {
      process.env.NODE_ENV = "production";
      setCookie("testCookie", "testValue");
      expect(Cookies.set).toHaveBeenCalledWith("testCookie", "testValue", {
        expires: 7,
        sameSite: "lax",
        secure: true,
      });
    });
  });

  describe("removeCookie", () => {
    it("should call Cookies.remove with correct parameters in development", () => {
      process.env.NODE_ENV = "development";
      removeCookie("testCookie");
      expect(Cookies.remove).toHaveBeenCalledWith("testCookie", {
        sameSite: "lax",
        secure: false,
      });
    });

    it("should call Cookies.remove with correct parameters in production", () => {
      process.env.NODE_ENV = "production";
      removeCookie("testCookie");
      expect(Cookies.remove).toHaveBeenCalledWith("testCookie", {
        sameSite: "lax",
        secure: true,
      });
    });
  });

  describe("getAvatarFullURL", () => {
    it("should return empty string for null or empty path", () => {
      expect(getAvatarFullURL("")).toBe("");
      expect(getAvatarFullURL(null as unknown as string)).toBe("");
    });

    it("should return data URL as-is", () => {
      const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANS...";
      expect(getAvatarFullURL(dataUrl)).toBe(dataUrl);
    });

    it("should return http/https URL as-is", () => {
      expect(getAvatarFullURL("http://example.com/avatar.jpg")).toBe(
        "http://example.com/avatar.jpg",
      );
      expect(getAvatarFullURL("https://example.com/avatar.jpg")).toBe(
        "https://example.com/avatar.jpg",
      );
    });

    it("should return path as-is for relative paths", () => {
      expect(getAvatarFullURL("/path/to/avatar.jpg")).toBe(
        "/path/to/avatar.jpg",
      );
    });
  });

  describe("toAppError", () => {
    it("should convert Error instance to AppError", async () => {
      const error = new Error("Test error message");
      const result = await toAppError(error);
      expect(result).toEqual({ message: "Test error message" });
    });

    it("should convert Response object to AppError with JSON details", async () => {
      const mockJson = { error: "Detailed error" };
      const response = new Response(JSON.stringify(mockJson), {
        status: 400,
        statusText: "Bad Request",
      });

      const result = await toAppError(response);
      expect(result).toEqual({
        message: "Bad Request",
        statusCode: 400,
        details: mockJson,
      });
    });

    it("should handle Response without statusText", async () => {
      // Response with empty body returns null from json()
      const response = new Response("null", {
        status: 500,
        statusText: "",
      });

      const result = await toAppError(response);
      expect(result).toEqual({
        message: "Request failed",
        statusCode: 500,
        details: null,
      });
    });

    it("should handle Response when json() throws", async () => {
      // Response with invalid JSON body will throw when json() is called
      const response = new Response("not valid json", {
        status: 500,
        statusText: "Internal Error",
      });

      const result = await toAppError(response);
      expect(result).toEqual({
        message: "Internal Error",
        statusCode: 500,
        details: null,
      });
    });

    it("should return unknown error for other types", async () => {
      const result = await toAppError("some string error");
      expect(result).toEqual({ message: "An unknown error occurred" });
    });

    it("should handle null/undefined errors", async () => {
      const result = await toAppError(null);
      expect(result).toEqual({ message: "An unknown error occurred" });
    });
  });
});
