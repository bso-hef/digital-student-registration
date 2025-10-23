import * as TYPES from "../types";
import { AppAction } from "./index";

interface AppSettingsState {
  loading: boolean;
  error: Error | null;
}

const initialAppSettingsState: AppSettingsState = {
  loading: false,
  error: null,
};

const appSettingsReducer = (
  state = initialAppSettingsState,
  action: AppAction,
) => {
  switch (action.type) {
    case TYPES.SET_STUDENT_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };
    default:
      return state;
  }
};

export default appSettingsReducer;
