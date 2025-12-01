import { LANGUAGES, THEME, ThemeMode } from "@/constants/general.constants";

import * as TYPES from "../types";
import { AppAction } from "../types";

export interface UIState {
  documnetDraggedOver: boolean;
  appTouched: boolean;
  theme: ThemeMode;
  locale: string;
  loading: boolean;
  error: Error | null;
  // Accessibility settings
  highContrast: boolean;
  dyslexiaFont: boolean;
}

const initialUIState: UIState = {
  documnetDraggedOver: false,
  appTouched: false,
  theme: THEME.LIGHT,
  locale: LANGUAGES.GERMAN.isoCode,
  loading: false,
  error: null,
  // Accessibility defaults
  highContrast: false,
  dyslexiaFont: false,
};

const uiReducer = (state = initialUIState, action: AppAction) => {
  switch (action.type) {
    case TYPES.SET_DOCUMENT_DRAGGED_OVER:
      return {
        ...state,
        documnetDraggedOver: action.payload,
      };
    case TYPES.SET_APP_TOUCHED:
      return {
        ...state,
        appTouched: action.payload,
      };
    case TYPES.CHANGE_APPLICATION_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case TYPES.CHANGE_APPLICATION_LOCALE:
      return {
        ...state,
        locale: action.payload,
      };
    case TYPES.TOGGLE_HIGH_CONTRAST:
      return {
        ...state,
        highContrast: action.payload,
      };
    case TYPES.TOGGLE_DYSLEXIA_FONT:
      return {
        ...state,
        dyslexiaFont: action.payload,
      };
    default:
      return state;
  }
};

export default uiReducer;
