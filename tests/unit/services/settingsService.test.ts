import http from "@/lib/services/api";
import settingsService from "@/lib/services/settingsService";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the http client
vi.mock("@/lib/services/api", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("settingsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch application settings", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: "settings123",
            onboarding: {
              welcomeMessage: "Welcome",
              steps: [],
            },
            audit: {
              enabled: true,
              retentionPeriodDays: 90,
            },
          },
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await settingsService.getAll();

      expect(http.get).toHaveBeenCalledWith("/api/settings");
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when fetching settings", async () => {
      const mockError = new Error("Failed to fetch settings");
      vi.mocked(http.get).mockRejectedValue(mockError);

      await expect(settingsService.getAll()).rejects.toThrow(
        "Failed to fetch settings",
      );
    });
  });

  describe("update", () => {
    it("should update application settings", async () => {
      const updateData = {
        audit: {
          enabled: true,
          retentionPeriodDays: 120,
        },
      };
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: "settings123",
            ...updateData,
          },
        },
      };
      vi.mocked(http.patch).mockResolvedValue(mockResponse);

      const result = await settingsService.update(updateData);

      expect(http.patch).toHaveBeenCalledWith("/api/settings", updateData);
      expect(result).toEqual(mockResponse);
    });

    it("should handle validation errors", async () => {
      const invalidData = { invalid: "data" } as any;
      const mockResponse = {
        data: {
          success: false,
          error: "Invalid request body",
        },
      };
      vi.mocked(http.patch).mockResolvedValue(mockResponse);

      const result = await settingsService.update(invalidData);

      expect(result.data.success).toBe(false);
    });
  });

  describe("getOnboarding", () => {
    it("should fetch onboarding settings", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            welcomeMessage: "Welcome to onboarding",
            steps: [
              { id: "general", enabled: true },
              { id: "address", enabled: true },
            ],
          },
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await settingsService.getOnboarding();

      expect(http.get).toHaveBeenCalledWith("/api/settings/onboarding");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateOnboarding", () => {
    it("should update onboarding settings", async () => {
      const updateData = {
        welcomeMessage: "Updated welcome message",
        steps: [
          { id: "general", enabled: true },
          { id: "address", enabled: false },
        ],
      };
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: "settings123",
            onboarding: updateData,
          },
        },
      };
      vi.mocked(http.patch).mockResolvedValue(mockResponse);

      const result = await settingsService.updateOnboarding(updateData);

      expect(http.patch).toHaveBeenCalledWith("/api/settings/onboarding", {
        onboarding: updateData,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle invalid onboarding data", async () => {
      const invalidData = { invalid: "structure" } as any;
      const mockResponse = {
        data: {
          success: false,
          error: "Invalid request body. Expected { onboarding: {...} }",
        },
      };
      vi.mocked(http.patch).mockResolvedValue(mockResponse);

      const result = await settingsService.updateOnboarding(invalidData);

      expect(result.data.success).toBe(false);
    });
  });
});
