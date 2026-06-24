import * as TYPES from "@/store/types";
import { describe, expect, it } from "vitest";

import uiReducer from "@/store/reducers/ui";

/**
 * Tests for UI reducer
 * @file tests/unit/store/reducers/ui.test.ts
 */

describe("uiReducer", () => {
  const initialState = {
    documnetDraggedOver: false,
    appTouched: false,
    theme: "light",
    locale: "de",
    loading: false,
    error: null,
    highContrast: false,
    dyslexiaFont: false,
  };

  it("should return initial state when no action matches", () => {
    const state = uiReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(initialState);
  });

  describe("CHANGE_APPLICATION_THEME", () => {
    it("should change theme to dark", () => {
      const action = {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "dark",
      };
      const state = uiReducer(initialState, action);
      expect(state.theme).toBe("dark");
    });

    it("should change theme to light", () => {
      const existingState = { ...initialState, theme: "dark" };
      const action = {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "light",
      };
      const state = uiReducer(existingState, action);
      expect(state.theme).toBe("light");
    });

    it("should handle system theme", () => {
      const action = {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "system",
      };
      const state = uiReducer(initialState, action);
      expect(state.theme).toBe("system");
    });

    it("should preserve other state when changing theme", () => {
      const existingState = {
        ...initialState,
        locale: "de",
        appTouched: true,
      };
      const action = {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "dark",
      };
      const state = uiReducer(existingState, action);
      expect(state.locale).toBe("de");
      expect(state.appTouched).toBe(true);
      expect(state.theme).toBe("dark");
    });
  });

  describe("CHANGE_APPLICATION_LOCALE", () => {
    it("should change locale to German", () => {
      const action = {
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "de",
      };
      const state = uiReducer(initialState, action);
      expect(state.locale).toBe("de");
    });

    it("should change locale to English", () => {
      const existingState = { ...initialState, locale: "de" };
      const action = {
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "en",
      };
      const state = uiReducer(existingState, action);
      expect(state.locale).toBe("en");
    });

    it("should preserve other state when changing locale", () => {
      const existingState = {
        ...initialState,
        theme: "dark",
        appTouched: true,
      };
      const action = {
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "de",
      };
      const state = uiReducer(existingState, action);
      expect(state.theme).toBe("dark");
      expect(state.appTouched).toBe(true);
      expect(state.locale).toBe("de");
    });
  });

  describe("SET_DOCUMENT_DRAGGED_OVER", () => {
    it("should set documnetDraggedOver to true", () => {
      const action = {
        type: TYPES.SET_DOCUMENT_DRAGGED_OVER,
        payload: true,
      };
      const state = uiReducer(initialState, action);
      expect(state.documnetDraggedOver).toBe(true);
    });

    it("should set documnetDraggedOver to false", () => {
      const existingState = { ...initialState, documnetDraggedOver: true };
      const action = {
        type: TYPES.SET_DOCUMENT_DRAGGED_OVER,
        payload: false,
      };
      const state = uiReducer(existingState, action);
      expect(state.documnetDraggedOver).toBe(false);
    });
  });

  describe("SET_APP_TOUCHED", () => {
    it("should set appTouched to true", () => {
      const action = {
        type: TYPES.SET_APP_TOUCHED,
        payload: true,
      };
      const state = uiReducer(initialState, action);
      expect(state.appTouched).toBe(true);
    });

    it("should set appTouched to false", () => {
      const existingState = { ...initialState, appTouched: true };
      const action = {
        type: TYPES.SET_APP_TOUCHED,
        payload: false,
      };
      const state = uiReducer(existingState, action);
      expect(state.appTouched).toBe(false);
    });

    it("should preserve other state when setting appTouched", () => {
      const existingState = {
        ...initialState,
        theme: "dark",
        locale: "de",
      };
      const action = {
        type: TYPES.SET_APP_TOUCHED,
        payload: true,
      };
      const state = uiReducer(existingState, action);
      expect(state.theme).toBe("dark");
      expect(state.locale).toBe("de");
      expect(state.appTouched).toBe(true);
    });
  });

  describe("Complex state transitions", () => {
    it("should handle multiple theme changes", () => {
      let state = uiReducer(initialState, {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "dark",
      });
      expect(state.theme).toBe("dark");

      state = uiReducer(state, {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "light",
      });
      expect(state.theme).toBe("light");

      state = uiReducer(state, {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "system",
      });
      expect(state.theme).toBe("system");
    });

    it("should handle multiple locale changes", () => {
      let state = uiReducer(initialState, {
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "de",
      });
      expect(state.locale).toBe("de");

      state = uiReducer(state, {
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "en",
      });
      expect(state.locale).toBe("en");
    });

    it("should handle combined changes", () => {
      let state = uiReducer(initialState, {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "dark",
      });
      state = uiReducer(state, {
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "de",
      });
      state = uiReducer(state, {
        type: TYPES.SET_APP_TOUCHED,
        payload: true,
      });

      expect(state.theme).toBe("dark");
      expect(state.locale).toBe("de");
      expect(state.appTouched).toBe(true);
    });

    it("should maintain immutability", () => {
      const originalState = { ...initialState };
      uiReducer(initialState, {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "dark",
      });

      // Original state should not be mutated
      expect(initialState).toEqual(originalState);
    });
  });

  describe("Accessibility settings", () => {
    it("should toggle high contrast to true", () => {
      const action = {
        type: TYPES.TOGGLE_HIGH_CONTRAST,
        payload: true,
      };
      const state = uiReducer(initialState, action);
      expect(state.highContrast).toBe(true);
    });

    it("should toggle high contrast to false", () => {
      const existingState = { ...initialState, highContrast: true };
      const action = {
        type: TYPES.TOGGLE_HIGH_CONTRAST,
        payload: false,
      };
      const state = uiReducer(existingState, action);
      expect(state.highContrast).toBe(false);
    });

    it("should toggle dyslexia font to true", () => {
      const action = {
        type: TYPES.TOGGLE_DYSLEXIA_FONT,
        payload: true,
      };
      const state = uiReducer(initialState, action);
      expect(state.dyslexiaFont).toBe(true);
    });

    it("should toggle dyslexia font to false", () => {
      const existingState = { ...initialState, dyslexiaFont: true };
      const action = {
        type: TYPES.TOGGLE_DYSLEXIA_FONT,
        payload: false,
      };
      const state = uiReducer(existingState, action);
      expect(state.dyslexiaFont).toBe(false);
    });

    it("should preserve other state when toggling accessibility", () => {
      const existingState = {
        ...initialState,
        theme: "dark",
        locale: "en",
      };
      const action = {
        type: TYPES.TOGGLE_HIGH_CONTRAST,
        payload: true,
      };
      const state = uiReducer(existingState, action);
      expect(state.theme).toBe("dark");
      expect(state.locale).toBe("en");
      expect(state.highContrast).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty string theme", () => {
      const action = {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "",
      };
      const state = uiReducer(initialState, action);
      expect(state.theme).toBe("");
    });

    it("should handle empty string locale", () => {
      const action = {
        type: TYPES.CHANGE_APPLICATION_LOCALE,
        payload: "",
      };
      const state = uiReducer(initialState, action);
      expect(state.locale).toBe("");
    });

    it("should not affect loading and error states", () => {
      const existingState = {
        ...initialState,
        loading: true,
        error: "Some error",
      };
      const action = {
        type: TYPES.CHANGE_APPLICATION_THEME,
        payload: "dark",
      };
      const state = uiReducer(existingState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe("Some error");
    });
  });
});
