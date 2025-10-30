import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import {
  defaultNotification,
  errorNotification,
  infoNotification,
  loadingNotification,
  successNotification,
  warningNotification,
} from "./notification.utils";

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
  }),
}));

describe("notification.utils", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("successNotification", () => {
    it("should call toast.success with default duration", () => {
      successNotification("Success message");
      expect(toast.success).toHaveBeenCalledWith("Success message", {
        duration: 5000,
      });
    });

    it("should call toast.success with custom duration", () => {
      successNotification("Success message", 3000);
      expect(toast.success).toHaveBeenCalledWith("Success message", {
        duration: 3000,
      });
    });
  });

  describe("errorNotification", () => {
    it("should call toast.error with default duration", () => {
      errorNotification("Error message");
      expect(toast.error).toHaveBeenCalledWith("Error message", {
        duration: 5000,
      });
    });

    it("should call toast.error with custom duration", () => {
      errorNotification("Error message", 2000);
      expect(toast.error).toHaveBeenCalledWith("Error message", {
        duration: 2000,
      });
    });
  });

  describe("infoNotification", () => {
    it("should call toast.info with default duration", () => {
      infoNotification("Info message");
      expect(toast.info).toHaveBeenCalledWith("Info message", {
        duration: 5000,
      });
    });

    it("should call toast.info with custom duration", () => {
      infoNotification("Info message", 4000);
      expect(toast.info).toHaveBeenCalledWith("Info message", {
        duration: 4000,
      });
    });
  });

  describe("warningNotification", () => {
    it("should call toast.warning with default duration", () => {
      warningNotification("Warning message");
      expect(toast.warning).toHaveBeenCalledWith("Warning message", {
        duration: 5000,
      });
    });

    it("should call toast.warning with custom duration", () => {
      warningNotification("Warning message", 6000);
      expect(toast.warning).toHaveBeenCalledWith("Warning message", {
        duration: 6000,
      });
    });
  });

  describe("loadingNotification", () => {
    it("should call toast.loading with default duration", () => {
      loadingNotification("Loading message");
      expect(toast.loading).toHaveBeenCalledWith("Loading message", {
        duration: 5000,
      });
    });

    it("should call toast.loading with custom duration", () => {
      loadingNotification("Loading message", 1000);
      expect(toast.loading).toHaveBeenCalledWith("Loading message", {
        duration: 1000,
      });
    });
  });

  describe("defaultNotification", () => {
    it("should call toast with default duration", () => {
      defaultNotification("Default message");
      expect(toast).toHaveBeenCalledWith("Default message", {
        duration: 5000,
      });
    });

    it("should call toast with custom duration", () => {
      defaultNotification("Default message", 7000);
      expect(toast).toHaveBeenCalledWith("Default message", {
        duration: 7000,
      });
    });
  });
});
