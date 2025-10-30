import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import i18n from "i18next";
import { signIn, signOut } from "next-auth/react";

import { AppThunk } from "../store";
import * as TYPES from "../types";

/**
 * Login action - integrates with NextAuth
 */
export const loginUser =
  (
    email: string,
    password: string,
  ): AppThunk<Promise<{ success: boolean; error?: string }>> =>
  async (dispatch) => {
    dispatch({ type: TYPES.AUTH_LOGIN_REQUEST });
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        errorNotification(i18n.t("auth.login.loginError"));
        dispatch({
          type: TYPES.AUTH_LOGIN_FAILURE,
          payload: result.error,
        });
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        // Note: NextAuth will update the session, which we can sync
        successNotification(i18n.t("auth.login.loginSuccess"));
        dispatch({
          type: TYPES.AUTH_LOGIN_SUCCESS,
          payload: { email, role: "admin" },
        });
        return { success: true };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errorNotification(i18n.t("auth.login.loginError"));
      dispatch({
        type: TYPES.AUTH_LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

/**
 * Logout action - integrates with NextAuth
 */
export const logoutUser =
  (): AppThunk<Promise<{ success: boolean; error?: string }>> =>
  async (dispatch) => {
    dispatch({ type: TYPES.AUTH_LOGOUT_REQUEST });
    try {
      await signOut({ redirect: false });

      successNotification(i18n.t("navigation.Logged out successfully"));
      dispatch({ type: TYPES.AUTH_LOGOUT_SUCCESS });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errorNotification(i18n.t("navigation.Failed to logout"));
      dispatch({
        type: TYPES.AUTH_LOGOUT_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

/**
 * Setup admin account action
 */
export const setupAdmin =
  (
    email: string,
    password: string,
  ): AppThunk<
    Promise<{ success: boolean; error?: string; recoveryCode: string | null }>
  > =>
  async (dispatch) => {
    dispatch({ type: TYPES.AUTH_SETUP_REQUEST });
    try {
      const response = await fetch("/api/auth/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Always show user-friendly i18n message, log technical error
        console.error("Setup API error:", data.error);
        errorNotification(i18n.t("auth.setup.messages.setupFailed"));
        dispatch({
          type: TYPES.AUTH_SETUP_FAILURE,
          payload: data.error || "Setup failed",
        });
        return { success: false, error: data.error, recoveryCode: null };
      }

      successNotification(i18n.t("auth.setup.messages.accountCreated"));
      dispatch({ type: TYPES.AUTH_SETUP_SUCCESS });
      return {
        success: true,
        recoveryCode: data.recoveryCode,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errorNotification(i18n.t("auth.setup.messages.setupFailed"));
      dispatch({
        type: TYPES.AUTH_SETUP_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, recoveryCode: null };
    }
  };

/**
 * Reset password action
 */
export const resetPassword =
  (
    email: string,
    recoveryCode: string,
    newPassword: string,
  ): AppThunk<Promise<{ success: boolean; error?: string }>> =>
  async (dispatch) => {
    dispatch({ type: TYPES.AUTH_RESET_PASSWORD_REQUEST });
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, recoveryCode, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Always show user-friendly i18n message, log technical error
        console.error("Reset password API error:", data.error);
        errorNotification(i18n.t("auth.resetPassword.resetFailed"));
        dispatch({
          type: TYPES.AUTH_RESET_PASSWORD_FAILURE,
          payload: data.error || "Reset failed",
        });
        return { success: false, error: data.error };
      }

      successNotification(i18n.t("auth.resetPassword.resetSuccess"));
      dispatch({ type: TYPES.AUTH_RESET_PASSWORD_SUCCESS });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errorNotification(i18n.t("auth.resetPassword.resetFailed"));
      dispatch({
        type: TYPES.AUTH_RESET_PASSWORD_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

/**
 * Check setup status action
 */
export const checkSetupStatus =
  (): AppThunk<Promise<{ success: boolean; setupCompleted: boolean }>> =>
  async (dispatch) => {
    dispatch({ type: TYPES.AUTH_CHECK_SETUP_REQUEST });
    try {
      const response = await fetch("/api/auth/setup");
      const data = await response.json();

      const setupCompleted = data.setupCompleted === true;

      dispatch({
        type: TYPES.AUTH_CHECK_SETUP_SUCCESS,
        payload: setupCompleted,
      });
      return { success: true, setupCompleted };
    } catch {
      dispatch({ type: TYPES.AUTH_CHECK_SETUP_FAILURE });
      return { success: false, setupCompleted: false };
    }
  };

/**
 * Sync session with Redux state
 * Useful for when NextAuth session changes externally
 */
export const syncSession =
  (
    isAuthenticated: boolean,
    user: { email: string; role: string } | null,
  ): AppThunk<void> =>
  (dispatch) => {
    dispatch({
      type: TYPES.AUTH_SYNC_SESSION,
      payload: { isAuthenticated, user },
    });
  };

/**
 * Clear auth error
 */
export const clearAuthError = (): AppThunk<void> => (dispatch) => {
  dispatch({ type: TYPES.AUTH_CLEAR_ERROR });
};
