import profileService, { ProfileData } from "@/lib/services/profileService";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import i18n from "i18next";
import { signIn, signOut } from "next-auth/react";

import { persistor } from "../store";
import { AppThunk } from "../store";
import * as TYPES from "../types";

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

export const logoutUser =
  (): AppThunk<Promise<{ success: boolean; error?: string }>> =>
  async (dispatch) => {
    dispatch({ type: TYPES.AUTH_LOGOUT_REQUEST });
    try {
      await signOut({ redirect: false });

      await persistor.purge();

      if (typeof window !== "undefined") {
        localStorage.clear();
      }

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

export const clearAuthError = (): AppThunk<void> => (dispatch) => {
  dispatch({ type: TYPES.AUTH_CLEAR_ERROR });
};

export const updateSetupWizard = (data: {
  step?: number;
  email?: string;
  password?: string;
}) => ({
  type: TYPES.AUTH_UPDATE_SETUP_WIZARD,
  payload: data,
});

export const clearSetupWizard = () => ({
  type: TYPES.AUTH_CLEAR_SETUP_WIZARD,
});

export const updateProfile =
  (
    data: Partial<ProfileData>,
  ): AppThunk<Promise<{ success: boolean; error?: string }>> =>
  async (dispatch) => {
    dispatch({ type: TYPES.AUTH_UPDATE_PROFILE_REQUEST });
    try {
      const response = await profileService.updateProfile(data);
      const profileData = response.data.data;

      successNotification(i18n.t("settings.profile.messages.updateSuccess"));
      dispatch({
        type: TYPES.AUTH_UPDATE_PROFILE_SUCCESS,
        payload: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          avatar: profileData.avatar,
          phone: profileData.phone,
          jobTitle: profileData.jobTitle,
          timezone: profileData.timezone,
        },
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errorNotification(i18n.t("settings.profile.messages.updateFailed"));
      dispatch({
        type: TYPES.AUTH_UPDATE_PROFILE_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

export const fetchProfile = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch({ type: TYPES.AUTH_FETCH_PROFILE_REQUEST });
  try {
    const response = await profileService.getProfile();
    const profileData = response.data.data;

    dispatch({
      type: TYPES.AUTH_FETCH_PROFILE_SUCCESS,
      payload: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        avatar: profileData.avatar,
        phone: profileData.phone,
        jobTitle: profileData.jobTitle,
        timezone: profileData.timezone,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch profile";
    dispatch({
      type: TYPES.AUTH_FETCH_PROFILE_FAILURE,
      payload: errorMessage,
    });
  }
};
