import { ThemeMode } from "@/constants/general.constants";

import { AppThunk } from "../store";
import * as TYPES from "../types";

export const setDocumentDraggedOver =
  (status: boolean): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.SET_DOCUMENT_DRAGGED_OVER,
      payload: status,
    });
  };

export const setApplicationTouched = (): AppThunk => (dispatch) => {
  dispatch({
    type: TYPES.SET_APP_TOUCHED,
    payload: true,
  });
};

export const changeApplicationTheme =
  (theme: ThemeMode): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.CHANGE_APPLICATION_THEME,
      payload: theme,
    });
  };

export const changeApplicationLocale =
  (locale: string): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.CHANGE_APPLICATION_LOCALE,
      payload: locale,
    });
  };

export const toggleHighContrast =
  (highContrastState: boolean): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.TOGGLE_HIGH_CONTRAST,
      payload: highContrastState,
    });
  };

export const toggleDyslexiaFont =
  (dyslexiaFontState: boolean): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.TOGGLE_DYSLEXIA_FONT,
      payload: dyslexiaFontState,
    });
  };
