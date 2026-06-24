import { buildZip } from "@/utils/zip.utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Use vi.hoisted to ensure mocks are available before vi.mock runs
const { mockFile, mockGenerateAsync } = vi.hoisted(() => {
  return {
    mockFile: vi.fn(),
    mockGenerateAsync: vi.fn(),
  };
});

vi.mock("jszip", () => {
  return {
    default: class MockJSZip {
      file = mockFile;
      generateAsync = mockGenerateAsync;
    },
  };
});

/**
 * Tests for zip utility functions
 * @file tests/unit/utils/zip.utils.test.ts
 */

describe("zip.utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateAsync.mockResolvedValue(new Blob(["mock zip content"]));
  });

  describe("buildZip", () => {
    it("should create a zip with multiple files", async () => {
      const files = [
        { name: "file1.txt", blob: new Blob(["content1"]) },
        { name: "file2.txt", blob: new Blob(["content2"]) },
      ];

      await buildZip(files);

      expect(mockFile).toHaveBeenCalledTimes(2);
      expect(mockFile).toHaveBeenCalledWith("file1.txt", files[0].blob);
      expect(mockFile).toHaveBeenCalledWith("file2.txt", files[1].blob);
    });

    it("should call generateAsync with correct options", async () => {
      const files = [{ name: "test.txt", blob: new Blob(["content"]) }];

      await buildZip(files);

      expect(mockGenerateAsync).toHaveBeenCalledWith(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 },
        },
        expect.any(Function),
      );
    });

    it("should return a Blob", async () => {
      const files = [{ name: "test.txt", blob: new Blob(["content"]) }];

      const result = await buildZip(files);

      expect(result).toBeInstanceOf(Blob);
    });

    it("should handle empty file list", async () => {
      const files: Array<{ name: string; blob: Blob }> = [];

      await buildZip(files);

      expect(mockFile).not.toHaveBeenCalled();
      expect(mockGenerateAsync).toHaveBeenCalled();
    });

    it("should call onProgress callback with progress updates", async () => {
      const files = [{ name: "test.txt", blob: new Blob(["content"]) }];
      const onProgress = vi.fn();

      // Capture the progress callback
      mockGenerateAsync.mockImplementation((_options, progressCallback) => {
        // Simulate progress updates
        progressCallback({ percent: 25 });
        progressCallback({ percent: 50 });
        progressCallback({ percent: 75 });
        progressCallback({ percent: 100 });
        return Promise.resolve(new Blob(["mock zip content"]));
      });

      await buildZip(files, onProgress);

      expect(onProgress).toHaveBeenCalledWith(25);
      expect(onProgress).toHaveBeenCalledWith(50);
      expect(onProgress).toHaveBeenCalledWith(75);
      expect(onProgress).toHaveBeenCalledWith(100);
    });

    it("should handle undefined percent in progress callback", async () => {
      const files = [{ name: "test.txt", blob: new Blob(["content"]) }];
      const onProgress = vi.fn();

      mockGenerateAsync.mockImplementation((_options, progressCallback) => {
        progressCallback({ percent: undefined });
        return Promise.resolve(new Blob(["mock zip content"]));
      });

      await buildZip(files, onProgress);

      expect(onProgress).toHaveBeenCalledWith(0);
    });

    it("should work without onProgress callback", async () => {
      const files = [{ name: "test.txt", blob: new Blob(["content"]) }];

      mockGenerateAsync.mockImplementation((_options, progressCallback) => {
        // Should not throw when onProgress is not provided
        progressCallback({ percent: 50 });
        return Promise.resolve(new Blob(["mock zip content"]));
      });

      const result = await buildZip(files);

      expect(result).toBeInstanceOf(Blob);
    });
  });
});
