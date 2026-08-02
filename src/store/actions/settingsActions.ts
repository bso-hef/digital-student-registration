import settingsService from "@/lib/services/settingsService";
import {
  AgreementSettings,
  AppSettings,
  OnboardingSettings,
} from "@/types/settings";
import { toAppError } from "@/utils/general.utils";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import i18n from "i18next";

import { AppThunk } from "../store";
import * as TYPES from "../types";

export const getSettings = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.GET_SETTINGS_REQUEST });
  try {
    const { data } = await settingsService.getAll();

    dispatch({ type: TYPES.GET_SETTINGS_SUCCESS, payload: data.data });
  } catch (error) {
    errorNotification(i18n.t("actions.settingsFetchFailed"));
    const appError = await toAppError(error);
    dispatch({ type: TYPES.GET_SETTINGS_FAILURE, payload: appError });
  }
};

export const getOnboardingSettings = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.GET_ONBOARDING_SETTINGS_REQUEST });
  try {
    const { data } = await settingsService.getPublicOnboarding();

    dispatch({
      type: TYPES.GET_ONBOARDING_SETTINGS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    errorNotification(i18n.t("actions.onboardingSettingsFetchFailed"));
    const appError = await toAppError(error);
    dispatch({
      type: TYPES.GET_ONBOARDING_SETTINGS_FAILURE,
      payload: appError,
    });
  }
};

export const updateSettings =
  (settings: Partial<AppSettings>): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.UPDATE_SETTINGS_REQUEST });
    try {
      const { data } = await settingsService.update(settings);

      dispatch({ type: TYPES.UPDATE_SETTINGS_SUCCESS, payload: data.data });
      successNotification(i18n.t("actions.settingsUpdateSuccess"));
    } catch (error) {
      errorNotification(i18n.t("actions.settingsUpdateFailed"));
      const appError = await toAppError(error);
      dispatch({ type: TYPES.UPDATE_SETTINGS_FAILURE, payload: appError });
    }
  };

export const updateOnboardingSettings =
  (onboarding: Partial<OnboardingSettings>): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.UPDATE_ONBOARDING_SETTINGS_REQUEST });
    try {
      const { data } = await settingsService.updateOnboarding(onboarding);

      dispatch({
        type: TYPES.UPDATE_ONBOARDING_SETTINGS_SUCCESS,
        payload: data.data,
      });
      successNotification(i18n.t("actions.onboardingSettingsUpdateSuccess"));
    } catch (error) {
      errorNotification(i18n.t("actions.onboardingSettingsUpdateFailed"));
      const appError = await toAppError(error);
      dispatch({
        type: TYPES.UPDATE_ONBOARDING_SETTINGS_FAILURE,
        payload: appError,
      });
    }
  };

export const getAgreementSettings = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.GET_AGREEMENT_SETTINGS_REQUEST });
  try {
    const { data } = await settingsService.getAgreements();

    dispatch({
      type: TYPES.GET_AGREEMENT_SETTINGS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    errorNotification(i18n.t("actions.agreementSettingsFetchFailed"));
    const appError = await toAppError(error);
    dispatch({
      type: TYPES.GET_AGREEMENT_SETTINGS_FAILURE,
      payload: appError,
    });
  }
};

export const getPublicAgreementSettings = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.GET_AGREEMENT_SETTINGS_REQUEST });
  try {
    const { data } = await settingsService.getPublicAgreements();

    dispatch({
      type: TYPES.GET_AGREEMENT_SETTINGS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    errorNotification(i18n.t("actions.agreementSettingsFetchFailed"));
    const appError = await toAppError(error);
    dispatch({
      type: TYPES.GET_AGREEMENT_SETTINGS_FAILURE,
      payload: appError,
    });
  }
};

export const updateAgreementSettings =
  (agreements: Partial<AgreementSettings>): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.UPDATE_AGREEMENT_SETTINGS_REQUEST });
    try {
      const { data } = await settingsService.updateAgreements(agreements);

      dispatch({
        type: TYPES.UPDATE_AGREEMENT_SETTINGS_SUCCESS,
        payload: data.data,
      });
      successNotification(i18n.t("actions.agreementSettingsUpdateSuccess"));
    } catch (error) {
      errorNotification(i18n.t("actions.agreementSettingsUpdateFailed"));
      const appError = await toAppError(error);
      dispatch({
        type: TYPES.UPDATE_AGREEMENT_SETTINGS_FAILURE,
        payload: appError,
      });
    }
  };
