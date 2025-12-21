import { describe, expect, it, vi } from "vitest";

import { THEME } from "@/constants/general.constants";
import * as TYPES from "@/store/types";

import {
  changeApplicationLocale,
  changeApplicationTheme,
  setApplicationTouched,
  setDocumentDraggedOver,
  toggleDyslexiaFont,
  toggleHighContrast,
} from "@/store/actions/uiActions";

/**
 * Tests for UI actions
 * @file tests/unit/store/actions/uiActions.test.ts
 */

describe("uiActions", () => {
  describe("setDocumentDraggedOver", () => {
    it("should dispatch SET_DOCUMENT_DRAGGED_OVER with true", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      setDocumentDraggedOver(true)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_DOCUMENT_DRAGGED_OVER,
        payload: true,
      });
    });

    it("should dispatch SET_DOCUMENT_DRAGGED_OVER with false", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      setDocumentDraggedOver(false)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_DOCUMENT_DRAGGED_OVER,
        payload: false,
      });
    });
  });

  describe("setApplicationTouched", () => {
    it("should dispatch SET_APP_TOUCHED with true", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      setApplicationTouched()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_APP_TOUCHED,
        payload: true,
      });
    });
  });

  describe("changeApplicationTheme", () => {
    it("should dispatch CHANGE_APPLICATION_THEME with dark theme", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      changeApplicationTheme(THEME.DARK)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: THEME.DARK,
      });
    });

    it("should dispatch CHANGE_APPLICATION_THEME with light theme", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      changeApplicationTheme(THEME.LIGHT)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: THEME.LIGHT,
      });
    });

    it("should dispatch CHANGE_APPLICATION_THEME with auto theme", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      changeApplicationTheme(THEME.AUTO)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: THEME.AUTO,
      });
    });
  });

  describe("changeApplicationLocale", () => {
    it("should dispatch CHANGE_APPLICATION_LOCALE with en", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      changeApplicationLocale("en")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "en",
      });
    });

    it("should dispatch CHANGE_APPLICATION_LOCALE with de", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      changeApplicationLocale("de")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "de",
      });
    });
  });

  describe("toggleHighContrast", () => {
    it("should dispatch TOGGLE_HIGH_CONTRAST with true", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      toggleHighContrast(true)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.TOGGLE_HIGH_CONTRAST,
        payload: true,
      });
    });

    it("should dispatch TOGGLE_HIGH_CONTRAST with false", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      toggleHighContrast(false)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.TOGGLE_HIGH_CONTRAST,
        payload: false,
      });
    });
  });

  describe("toggleDyslexiaFont", () => {
    it("should dispatch TOGGLE_DYSLEXIA_FONT with true", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      toggleDyslexiaFont(true)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.TOGGLE_DYSLEXIA_FONT,
        payload: true,
      });
    });

    it("should dispatch TOGGLE_DYSLEXIA_FONT with false", () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      toggleDyslexiaFont(false)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.TOGGLE_DYSLEXIA_FONT,
        payload: false,
      });
    });
  });
});
