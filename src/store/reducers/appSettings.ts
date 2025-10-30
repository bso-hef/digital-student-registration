import { AppSettings } from "@/types/settings";

import * as TYPES from "../types";
import { AppAction } from "./index";

interface AppSettingsState {
  data: AppSettings | null;
  loading: boolean;
  error: Error | null;
}

const initialAppSettingsState: AppSettingsState = {
  data: null,
  loading: false,
  error: null,
};

const appSettingsReducer = (
  state = initialAppSettingsState,
  action: AppAction,
) => {
  switch (action.type) {
    // Get all settings
    case TYPES.GET_SETTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TYPES.GET_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case TYPES.GET_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get onboarding settings
    case TYPES.GET_ONBOARDING_SETTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TYPES.GET_ONBOARDING_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case TYPES.GET_ONBOARDING_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update all settings
    case TYPES.UPDATE_SETTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TYPES.UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case TYPES.UPDATE_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update onboarding settings
    case TYPES.UPDATE_ONBOARDING_SETTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TYPES.UPDATE_ONBOARDING_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case TYPES.UPDATE_ONBOARDING_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default appSettingsReducer;
