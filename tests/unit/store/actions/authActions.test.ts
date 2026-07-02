import profileService from "@/lib/services/profileService";
import {
  checkSetupStatus,
  clearAuthError,
  clearSetupWizard,
  fetchProfile,
  loginUser,
  logoutUser,
  resetPassword,
  setupAdmin,
  syncSession,
  updateProfile,
  updateSetupWizard,
} from "@/store/actions/authActions";
import * as TYPES from "@/store/types";
import * as notificationUtils from "@/utils/notification.utils";
// Import after mocking
import { signIn, signOut } from "next-auth/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@/lib/services/profileService", () => ({
  default: {
    updateProfile: vi.fn(),
    getProfile: vi.fn(),
  },
}));

vi.mock("@/utils/notification.utils", () => ({
  errorNotification: vi.fn(),
  successNotification: vi.fn(),
}));

vi.mock("i18next", () => ({
  default: {
    t: vi.fn((key: string) => key),
  },
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock persistor
vi.mock("@/store/store", () => ({
  persistor: {
    purge: vi.fn().mockResolvedValue(undefined),
  },
}));

/**
 * Tests for auth actions
 * @file tests/unit/store/actions/authActions.test.ts
 */

describe("authActions", () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let getState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("loginUser", () => {
    it("should dispatch success on successful login", async () => {
      vi.mocked(signIn).mockResolvedValue({ ok: true, error: undefined });

      const result = await loginUser("test@test.com", "password")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_LOGIN_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_LOGIN_SUCCESS,
        payload: { email: "test@test.com", role: "admin" },
      });
      expect(result.success).toBe(true);
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on login error", async () => {
      vi.mocked(signIn).mockResolvedValue({
        ok: false,
        error: "Invalid credentials",
      });

      const result = await loginUser("test@test.com", "wrong")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_LOGIN_FAILURE,
        payload: "Invalid credentials",
      });
      expect(result.success).toBe(false);
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });

    it("should handle exception during login", async () => {
      vi.mocked(signIn).mockRejectedValue(new Error("Network error"));

      const result = await loginUser("test@test.com", "password")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_LOGIN_FAILURE,
        payload: "Network error",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("logoutUser", () => {
    it("should dispatch success on successful logout", async () => {
      vi.mocked(signOut).mockResolvedValue(undefined);

      const result = await logoutUser()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_LOGOUT_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_LOGOUT_SUCCESS,
      });
      expect(result.success).toBe(true);
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on logout error", async () => {
      vi.mocked(signOut).mockRejectedValue(new Error("Logout failed"));

      const result = await logoutUser()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_LOGOUT_FAILURE,
        payload: "Logout failed",
      });
      expect(result.success).toBe(false);
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("setupAdmin", () => {
    it("should dispatch success on successful setup", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ recoveryCode: "ABC123" }),
      } as unknown as Response);

      const result = await setupAdmin("admin@test.com", "password")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_SETUP_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_SETUP_SUCCESS,
      });
      expect(result.success).toBe(true);
      expect(result.recoveryCode).toBe("ABC123");
    });

    it("should dispatch failure on setup error", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: "Admin already exists" }),
      } as unknown as Response);

      const result = await setupAdmin("admin@test.com", "password")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_SETUP_FAILURE,
        payload: "Admin already exists",
      });
      expect(result.success).toBe(false);
    });

    it("should handle network exception during setup", async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));

      const result = await setupAdmin("admin@test.com", "password")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_SETUP_FAILURE,
        payload: "Network error",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("resetPassword", () => {
    it("should dispatch success on successful reset", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      } as unknown as Response);

      const result = await resetPassword(
        "test@test.com",
        "ABC123",
        "newpassword",
      )(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_RESET_PASSWORD_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_RESET_PASSWORD_SUCCESS,
      });
      expect(result.success).toBe(true);
    });

    it("should dispatch failure on reset error", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: "Invalid recovery code" }),
      } as unknown as Response);

      const result = await resetPassword(
        "test@test.com",
        "WRONG",
        "newpassword",
      )(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_RESET_PASSWORD_FAILURE,
        payload: "Invalid recovery code",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("checkSetupStatus", () => {
    it("should dispatch success with setupCompleted true", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ setupCompleted: true }),
      } as unknown as Response);

      const result = await checkSetupStatus()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_CHECK_SETUP_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_CHECK_SETUP_SUCCESS,
        payload: true,
      });
      expect(result.setupCompleted).toBe(true);
    });

    it("should dispatch failure on check error", async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));

      const result = await checkSetupStatus()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_CHECK_SETUP_FAILURE,
      });
      expect(result.success).toBe(false);
      expect(result.setupCompleted).toBe(false);
    });
  });

  describe("syncSession", () => {
    it("should dispatch sync action with user data", () => {
      const user = { email: "test@test.com", role: "admin" };

      syncSession(true, user)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_SYNC_SESSION,
        payload: { isAuthenticated: true, user },
      });
    });

    it("should dispatch sync action with null user", () => {
      syncSession(false, null)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_SYNC_SESSION,
        payload: { isAuthenticated: false, user: null },
      });
    });
  });

  describe("clearAuthError", () => {
    it("should dispatch clear error action", () => {
      clearAuthError()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_CLEAR_ERROR,
      });
    });
  });

  describe("updateSetupWizard", () => {
    it("should return update action with step", () => {
      const action = updateSetupWizard({ step: 2 });

      expect(action).toEqual({
        type: TYPES.AUTH_UPDATE_SETUP_WIZARD,
        payload: { step: 2 },
      });
    });

    it("should return update action with email and password", () => {
      const action = updateSetupWizard({
        email: "test@test.com",
        password: "pass",
      });

      expect(action).toEqual({
        type: TYPES.AUTH_UPDATE_SETUP_WIZARD,
        payload: { email: "test@test.com", password: "pass" },
      });
    });
  });

  describe("clearSetupWizard", () => {
    it("should return clear action", () => {
      const action = clearSetupWizard();

      expect(action).toEqual({
        type: TYPES.AUTH_CLEAR_SETUP_WIZARD,
      });
    });
  });

  describe("updateProfile", () => {
    it("should dispatch success on successful update", async () => {
      const profileData = {
        firstName: "John",
        lastName: "Doe",
        avatar: null,
        phone: "123456",
        jobTitle: "Developer",
        timezone: "UTC",
      };
      vi.mocked(profileService.updateProfile).mockResolvedValue({
        data: { data: profileData },
      });

      const result = await updateProfile({ firstName: "John" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_UPDATE_PROFILE_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_UPDATE_PROFILE_SUCCESS,
        payload: profileData,
      });
      expect(result.success).toBe(true);
    });

    it("should dispatch failure on update error", async () => {
      vi.mocked(profileService.updateProfile).mockRejectedValue(
        new Error("Update failed"),
      );

      const result = await updateProfile({ firstName: "John" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_UPDATE_PROFILE_FAILURE,
        payload: "Update failed",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("fetchProfile", () => {
    it("should dispatch success on successful fetch", async () => {
      const profileData = {
        firstName: "John",
        lastName: "Doe",
        avatar: null,
        phone: "123456",
        jobTitle: "Developer",
        timezone: "UTC",
      };
      vi.mocked(profileService.getProfile).mockResolvedValue({
        data: { data: profileData },
      });

      await fetchProfile()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_FETCH_PROFILE_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_FETCH_PROFILE_SUCCESS,
        payload: profileData,
      });
    });

    it("should dispatch failure on fetch error", async () => {
      vi.mocked(profileService.getProfile).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await fetchProfile()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.AUTH_FETCH_PROFILE_FAILURE,
        payload: "Fetch failed",
      });
    });
  });
});
