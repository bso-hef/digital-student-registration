import * as TYPES from "../types";

export const setDocumentDraggedOver =
  (status: boolean) =>
  (
    dispatch: (action: {
      type: typeof TYPES.SET_DOCUMENT_DRAGGED_OVER;
      payload: boolean;
    }) => void,
  ) => {
    dispatch({
      type: TYPES.SET_DOCUMENT_DRAGGED_OVER,
      payload: status,
    });
  };

export const setApplicationTouched =
  () =>
  (
    dispatch: (action: {
      type: typeof TYPES.SET_APP_TOUCHED;
      payload: true;
    }) => void,
  ) => {
    dispatch({
      type: TYPES.SET_APP_TOUCHED,
      payload: true,
    });
  };

export const changeApplicationTheme =
  (theme: "light" | "dark") =>
  (
    dispatch: (action: {
      type: typeof TYPES.CHANGE_APPLICATION_THEME;
      payload: "light" | "dark";
    }) => void,
  ) => {
    dispatch({
      type: TYPES.CHANGE_APPLICATION_THEME,
      payload: theme,
    });
  };

export const changeApplicationLocale =
  (locale: string) =>
  (
    dispatch: (action: {
      type: typeof TYPES.CHANGE_APPLICATION_LOCALE;
      payload: string;
    }) => void,
  ) => {
    dispatch({
      type: TYPES.CHANGE_APPLICATION_LOCALE,
      payload: locale,
    });
  };

export const toggleHighContrast =
  (highContrastState: boolean) =>
  (
    dispatch: (action: {
      type: typeof TYPES.TOGGLE_HIGH_CONTRAST;
      payload: boolean;
    }) => void,
  ) => {
    dispatch({
      type: TYPES.TOGGLE_HIGH_CONTRAST,
      payload: highContrastState,
    });
  };

export const toggleDyslexiaFont =
  (dyslexiaFontState: boolean) =>
  (
    dispatch: (action: {
      type: typeof TYPES.TOGGLE_DYSLEXIA_FONT;
      payload: boolean;
    }) => void,
  ) => {
    dispatch({
      type: TYPES.TOGGLE_DYSLEXIA_FONT,
      payload: dyslexiaFontState,
    });
  };
