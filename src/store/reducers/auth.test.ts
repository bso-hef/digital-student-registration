import { describe, expect, it } from "vitest";

import * as TYPES from "../types";
import authReducer, { AuthState } from "./auth";

describe("authReducer", () => {
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    setupCompleted: false,
    checkingSession: false,
    checkingSetup: false,
    // Setup wizard persistence
    setupWizardStep: 0,
    setupWizardEmail: "",
    setupWizardPassword: "",
  };

  it("should return initial state", () => {
    const result = authReducer(undefined, { type: "UNKNOWN" });
    expect(result).toEqual(initialState);
  });

  it("should handle AUTH_LOGIN_SUCCESS", () => {
    const user = { email: "test@example.com", role: "admin" };
    const result = authReducer(initialState, {
      type: TYPES.AUTH_LOGIN_SUCCESS,
      payload: user,
    });

    expect(result.isAuthenticated).toBe(true);
    expect(result.user).toEqual(user);
    expect(result.isLoading).toBe(false);
  });

  it("should handle AUTH_LOGOUT_SUCCESS", () => {
    const loggedInState = {
      ...initialState,
      isAuthenticated: true,
      user: { email: "test@example.com", role: "admin" },
      setupCompleted: true,
    };

    const result = authReducer(loggedInState, {
      type: TYPES.AUTH_LOGOUT_SUCCESS,
    });

    expect(result.isAuthenticated).toBe(false);
    expect(result.user).toBeNull();
    expect(result.setupCompleted).toBe(true); // Should preserve setupCompleted
  });

  it("should handle AUTH_CHECK_SETUP_SUCCESS", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_CHECK_SETUP_SUCCESS,
      payload: true,
    });

    expect(result.setupCompleted).toBe(true);
    expect(result.checkingSetup).toBe(false);
  });

  it("should handle AUTH_LOGIN_REQUEST", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_LOGIN_REQUEST,
    });

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should handle AUTH_LOGIN_FAILURE", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_LOGIN_FAILURE,
      payload: "Login failed",
    });

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe("Login failed");
    expect(result.isAuthenticated).toBe(false);
  });

  it("should handle AUTH_LOGOUT_REQUEST", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_LOGOUT_REQUEST,
    });

    expect(result.isLoading).toBe(true);
  });

  it("should handle AUTH_CHECK_SESSION_REQUEST", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_CHECK_SESSION_REQUEST,
    });

    expect(result.checkingSession).toBe(true);
  });

  it("should handle AUTH_CHECK_SESSION_SUCCESS", () => {
    const user = { email: "test@example.com", role: "admin" };
    const result = authReducer(initialState, {
      type: TYPES.AUTH_CHECK_SESSION_SUCCESS,
      payload: {
        isAuthenticated: true,
        user: user,
      },
    });

    expect(result.checkingSession).toBe(false);
    expect(result.isAuthenticated).toBe(true);
    expect(result.user).toEqual(user);
  });

  it("should handle AUTH_CHECK_SESSION_FAILURE", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_CHECK_SESSION_FAILURE,
    });

    expect(result.checkingSession).toBe(false);
    expect(result.isAuthenticated).toBe(false);
  });

  it("should handle AUTH_CHECK_SETUP_REQUEST", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_CHECK_SETUP_REQUEST,
    });

    expect(result.checkingSetup).toBe(true);
  });

  it("should handle AUTH_CHECK_SETUP_FAILURE", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_CHECK_SETUP_FAILURE,
    });

    expect(result.checkingSetup).toBe(false);
  });

  it("should handle AUTH_SETUP_REQUEST", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_SETUP_REQUEST,
    });

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should handle AUTH_SETUP_SUCCESS", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_SETUP_SUCCESS,
      payload: true,
    });

    expect(result.isLoading).toBe(false);
    expect(result.setupCompleted).toBe(true);
  });

  it("should handle AUTH_SETUP_FAILURE", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_SETUP_FAILURE,
      payload: "Setup failed",
    });

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe("Setup failed");
  });

  it("should handle AUTH_LOGOUT_FAILURE", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_LOGOUT_FAILURE,
      payload: "Logout failed",
    });

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe("Logout failed");
  });

  it("should handle AUTH_RESET_PASSWORD_REQUEST", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_RESET_PASSWORD_REQUEST,
    });

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should handle AUTH_RESET_PASSWORD_SUCCESS", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_RESET_PASSWORD_SUCCESS,
    });

    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it("should handle AUTH_RESET_PASSWORD_FAILURE", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_RESET_PASSWORD_FAILURE,
      payload: "Reset failed",
    });

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe("Reset failed");
  });

  it("should handle AUTH_SYNC_SESSION", () => {
    const user = { email: "test@example.com", role: "admin" };
    const result = authReducer(initialState, {
      type: TYPES.AUTH_SYNC_SESSION,
      payload: {
        user,
        isAuthenticated: true,
      },
    });

    expect(result.user).toEqual(user);
    expect(result.isAuthenticated).toBe(true);
  });

  it("should preserve state for unknown action types", () => {
    const customState = {
      ...initialState,
      user: { email: "test@test.com", role: "user" },
      isAuthenticated: true,
    };

    const result = authReducer(customState, { type: "UNKNOWN_ACTION" });

    expect(result).toEqual(customState);
  });

  it("should handle AUTH_CHECK_SESSION_SUCCESS when not authenticated", () => {
    const result = authReducer(initialState, {
      type: TYPES.AUTH_CHECK_SESSION_SUCCESS,
      payload: {
        isAuthenticated: false,
        user: null,
      },
    });

    expect(result.checkingSession).toBe(false);
    expect(result.isAuthenticated).toBe(false);
    expect(result.user).toBeNull();
  });

  it("should handle AUTH_CLEAR_ERROR", () => {
    const stateWithError = {
      ...initialState,
      error: "Some error message",
    };

    const result = authReducer(stateWithError, {
      type: TYPES.AUTH_CLEAR_ERROR,
    });

    expect(result.error).toBeNull();
  });
});
