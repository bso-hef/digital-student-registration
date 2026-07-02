import * as TYPES from "@/store/types";
import { describe, expect, it } from "vitest";

import authReducer from "@/store/reducers/auth";

/**
 * Tests for auth reducer
 * @file tests/unit/store/reducers/auth.test.ts
 */

describe("authReducer", () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    setupCompleted: false,
    checkingSession: false,
    checkingSetup: false,
    setupWizardStep: 0,
    setupWizardEmail: "",
    setupWizardPassword: "",
  };

  const mockUser = {
    email: "test@test.com",
    role: "admin",
    firstName: "John",
    lastName: "Doe",
    avatar: null,
    phone: "123456",
    jobTitle: "Developer",
    timezone: "UTC",
  };

  it("should return initial state when no action matches", () => {
    const state = authReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(initialState);
  });

  describe("Login actions", () => {
    it("should handle AUTH_LOGIN_REQUEST", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_LOGIN_REQUEST,
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle AUTH_LOGIN_SUCCESS", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_LOGIN_SUCCESS,
        payload: mockUser,
      });
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBe(null);
    });

    it("should handle AUTH_LOGIN_FAILURE", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_LOGIN_FAILURE,
        payload: "Invalid credentials",
      });
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.error).toBe("Invalid credentials");
    });
  });

  describe("Logout actions", () => {
    it("should handle AUTH_LOGOUT_REQUEST", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_LOGOUT_REQUEST,
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle AUTH_LOGOUT_SUCCESS", () => {
      const authenticatedState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        setupCompleted: true,
      };
      const state = authReducer(authenticatedState, {
        type: TYPES.AUTH_LOGOUT_SUCCESS,
      });
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.setupCompleted).toBe(true); // Preserves setupCompleted
      expect(state.setupWizardStep).toBe(0);
    });

    it("should handle AUTH_LOGOUT_FAILURE", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_LOGOUT_FAILURE,
        payload: "Logout error",
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Logout error");
    });
  });

  describe("Setup actions", () => {
    it("should handle AUTH_SETUP_REQUEST", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_SETUP_REQUEST,
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle AUTH_SETUP_SUCCESS", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_SETUP_SUCCESS,
      });
      expect(state.isLoading).toBe(false);
      expect(state.setupCompleted).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle AUTH_SETUP_FAILURE", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_SETUP_FAILURE,
        payload: "Setup failed",
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Setup failed");
    });
  });

  describe("Reset password actions", () => {
    it("should handle AUTH_RESET_PASSWORD_REQUEST", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_RESET_PASSWORD_REQUEST,
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle AUTH_RESET_PASSWORD_SUCCESS", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_RESET_PASSWORD_SUCCESS,
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it("should handle AUTH_RESET_PASSWORD_FAILURE", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_RESET_PASSWORD_FAILURE,
        payload: "Reset failed",
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Reset failed");
    });
  });

  describe("Check session actions", () => {
    it("should handle AUTH_CHECK_SESSION_REQUEST", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_CHECK_SESSION_REQUEST,
      });
      expect(state.checkingSession).toBe(true);
    });

    it("should handle AUTH_CHECK_SESSION_SUCCESS", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_CHECK_SESSION_SUCCESS,
        payload: { isAuthenticated: true, user: mockUser },
      });
      expect(state.checkingSession).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it("should handle AUTH_CHECK_SESSION_FAILURE", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_CHECK_SESSION_FAILURE,
      });
      expect(state.checkingSession).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
    });
  });

  describe("Check setup actions", () => {
    it("should handle AUTH_CHECK_SETUP_REQUEST", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_CHECK_SETUP_REQUEST,
      });
      expect(state.checkingSetup).toBe(true);
    });

    it("should handle AUTH_CHECK_SETUP_SUCCESS", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_CHECK_SETUP_SUCCESS,
        payload: true,
      });
      expect(state.checkingSetup).toBe(false);
      expect(state.setupCompleted).toBe(true);
    });

    it("should handle AUTH_CHECK_SETUP_FAILURE", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_CHECK_SETUP_FAILURE,
      });
      expect(state.checkingSetup).toBe(false);
    });
  });

  describe("Sync session action", () => {
    it("should handle AUTH_SYNC_SESSION", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_SYNC_SESSION,
        payload: { isAuthenticated: true, user: mockUser },
      });
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe("Clear error action", () => {
    it("should handle AUTH_CLEAR_ERROR", () => {
      const stateWithError = { ...initialState, error: "Some error" };
      const state = authReducer(stateWithError, {
        type: TYPES.AUTH_CLEAR_ERROR,
      });
      expect(state.error).toBe(null);
    });
  });

  describe("Setup wizard actions", () => {
    it("should handle AUTH_UPDATE_SETUP_WIZARD with step", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_UPDATE_SETUP_WIZARD,
        payload: { step: 2 },
      });
      expect(state.setupWizardStep).toBe(2);
      expect(state.setupWizardEmail).toBe("");
      expect(state.setupWizardPassword).toBe("");
    });

    it("should handle AUTH_UPDATE_SETUP_WIZARD with email", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_UPDATE_SETUP_WIZARD,
        payload: { email: "test@test.com" },
      });
      expect(state.setupWizardEmail).toBe("test@test.com");
    });

    it("should handle AUTH_UPDATE_SETUP_WIZARD with password", () => {
      const state = authReducer(initialState, {
        type: TYPES.AUTH_UPDATE_SETUP_WIZARD,
        payload: { password: "secret" },
      });
      expect(state.setupWizardPassword).toBe("secret");
    });

    it("should handle AUTH_UPDATE_SETUP_WIZARD preserving existing values when undefined", () => {
      const existingState = {
        ...initialState,
        setupWizardStep: 1,
        setupWizardEmail: "existing@test.com",
        setupWizardPassword: "existingpass",
      };
      const state = authReducer(existingState, {
        type: TYPES.AUTH_UPDATE_SETUP_WIZARD,
        payload: { step: 2 },
      });
      expect(state.setupWizardStep).toBe(2);
      expect(state.setupWizardEmail).toBe("existing@test.com");
      expect(state.setupWizardPassword).toBe("existingpass");
    });

    it("should handle AUTH_CLEAR_SETUP_WIZARD", () => {
      const existingState = {
        ...initialState,
        setupWizardStep: 3,
        setupWizardEmail: "test@test.com",
        setupWizardPassword: "secret",
      };
      const state = authReducer(existingState, {
        type: TYPES.AUTH_CLEAR_SETUP_WIZARD,
      });
      expect(state.setupWizardStep).toBe(0);
      expect(state.setupWizardEmail).toBe("");
      expect(state.setupWizardPassword).toBe("");
    });
  });

  describe("Profile actions", () => {
    describe("Update profile", () => {
      it("should handle AUTH_UPDATE_PROFILE_REQUEST", () => {
        const state = authReducer(initialState, {
          type: TYPES.AUTH_UPDATE_PROFILE_REQUEST,
        });
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(null);
      });

      it("should handle AUTH_UPDATE_PROFILE_SUCCESS with existing user", () => {
        const stateWithUser = {
          ...initialState,
          user: { email: "test@test.com", role: "admin" },
        };
        const profileData = {
          firstName: "Updated",
          lastName: "User",
          avatar: "/avatar.png",
          phone: "999999",
          jobTitle: "Manager",
          timezone: "EST",
        };
        const state = authReducer(stateWithUser, {
          type: TYPES.AUTH_UPDATE_PROFILE_SUCCESS,
          payload: profileData,
        });
        expect(state.isLoading).toBe(false);
        expect(state.user?.firstName).toBe("Updated");
        expect(state.user?.lastName).toBe("User");
        expect(state.user?.avatar).toBe("/avatar.png");
        expect(state.user?.phone).toBe("999999");
        expect(state.user?.jobTitle).toBe("Manager");
        expect(state.user?.timezone).toBe("EST");
        expect(state.user?.email).toBe("test@test.com"); // Preserved
        expect(state.error).toBe(null);
      });

      it("should handle AUTH_UPDATE_PROFILE_SUCCESS with null user", () => {
        const state = authReducer(initialState, {
          type: TYPES.AUTH_UPDATE_PROFILE_SUCCESS,
          payload: { firstName: "Test" },
        });
        expect(state.isLoading).toBe(false);
        expect(state.user).toBe(null);
      });

      it("should handle AUTH_UPDATE_PROFILE_FAILURE", () => {
        const state = authReducer(initialState, {
          type: TYPES.AUTH_UPDATE_PROFILE_FAILURE,
          payload: "Update failed",
        });
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe("Update failed");
      });
    });

    describe("Fetch profile", () => {
      it("should handle AUTH_FETCH_PROFILE_REQUEST", () => {
        const state = authReducer(initialState, {
          type: TYPES.AUTH_FETCH_PROFILE_REQUEST,
        });
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(null);
      });

      it("should handle AUTH_FETCH_PROFILE_SUCCESS with existing user", () => {
        const stateWithUser = {
          ...initialState,
          user: { email: "test@test.com", role: "admin" },
        };
        const profileData = {
          firstName: "Fetched",
          lastName: "Profile",
          avatar: null,
          phone: "",
          jobTitle: "",
          timezone: "UTC",
        };
        const state = authReducer(stateWithUser, {
          type: TYPES.AUTH_FETCH_PROFILE_SUCCESS,
          payload: profileData,
        });
        expect(state.isLoading).toBe(false);
        expect(state.user?.firstName).toBe("Fetched");
        expect(state.user?.lastName).toBe("Profile");
        expect(state.error).toBe(null);
      });

      it("should handle AUTH_FETCH_PROFILE_SUCCESS with null user", () => {
        const state = authReducer(initialState, {
          type: TYPES.AUTH_FETCH_PROFILE_SUCCESS,
          payload: { firstName: "Test" },
        });
        expect(state.isLoading).toBe(false);
        expect(state.user).toBe(null);
      });

      it("should handle AUTH_FETCH_PROFILE_FAILURE", () => {
        const state = authReducer(initialState, {
          type: TYPES.AUTH_FETCH_PROFILE_FAILURE,
          payload: "Fetch failed",
        });
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe("Fetch failed");
      });
    });
  });
});
