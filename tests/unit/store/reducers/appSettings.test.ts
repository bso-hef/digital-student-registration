import { describe, expect, it } from "vitest";

import appSettingsReducer from "@/store/reducers/appSettings";
import * as TYPES from "@/store/types";
import { AppSettings } from "@/types/settings";

/**
 * Tests for appSettings reducer
 * @file tests/unit/store/reducers/appSettings.test.ts
 */

describe("appSettingsReducer", () => {
  const initialState = {
    data: null,
    loading: false,
    error: null,
  };

  const mockSettings: Partial<AppSettings> = {
    _id: "settings1",
    dropdowns: {
      gender: [],
      salutation: [],
      religion: [],
      contactPersonType: [],
      schoolLevel: [],
      schoolType: [],
    },
  };

  it("should return initial state when no action matches", () => {
    const state = appSettingsReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(initialState);
  });

  describe("GET_SETTINGS actions", () => {
    it("should handle GET_SETTINGS_REQUEST", () => {
      const action = { type: TYPES.GET_SETTINGS_REQUEST };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_SETTINGS_SUCCESS", () => {
      const action = {
        type: TYPES.GET_SETTINGS_SUCCESS,
        payload: mockSettings,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual(mockSettings);
      expect(state.error).toBe(null);
    });

    it("should handle GET_SETTINGS_FAILURE", () => {
      const error = new Error("Failed to load settings");
      const action = {
        type: TYPES.GET_SETTINGS_FAILURE,
        payload: error,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("GET_ONBOARDING_SETTINGS actions", () => {
    it("should handle GET_ONBOARDING_SETTINGS_REQUEST", () => {
      const action = { type: TYPES.GET_ONBOARDING_SETTINGS_REQUEST };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_ONBOARDING_SETTINGS_SUCCESS", () => {
      const action = {
        type: TYPES.GET_ONBOARDING_SETTINGS_SUCCESS,
        payload: mockSettings,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual(mockSettings);
      expect(state.error).toBe(null);
    });

    it("should handle GET_ONBOARDING_SETTINGS_FAILURE", () => {
      const error = new Error("Failed to load onboarding settings");
      const action = {
        type: TYPES.GET_ONBOARDING_SETTINGS_FAILURE,
        payload: error,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("GET_AGREEMENT_SETTINGS actions", () => {
    it("should handle GET_AGREEMENT_SETTINGS_REQUEST", () => {
      const action = { type: TYPES.GET_AGREEMENT_SETTINGS_REQUEST };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_AGREEMENT_SETTINGS_SUCCESS", () => {
      const action = {
        type: TYPES.GET_AGREEMENT_SETTINGS_SUCCESS,
        payload: mockSettings,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual({ agreements: mockSettings });
      expect(state.error).toBe(null);
    });

    it("should handle GET_AGREEMENT_SETTINGS_FAILURE", () => {
      const error = new Error("Failed to load agreement settings");
      const action = {
        type: TYPES.GET_AGREEMENT_SETTINGS_FAILURE,
        payload: error,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("GET_ONBOARDING_SETTINGS actions", () => {
    it("should handle GET_ONBOARDING_SETTINGS_REQUEST", () => {
      const action = { type: TYPES.GET_ONBOARDING_SETTINGS_REQUEST };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_ONBOARDING_SETTINGS_SUCCESS", () => {
      const onboardingSettings = { enabled: true, steps: [] };
      const action = {
        type: TYPES.GET_ONBOARDING_SETTINGS_SUCCESS,
        payload: onboardingSettings,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual(onboardingSettings);
      expect(state.error).toBe(null);
    });

    it("should handle GET_ONBOARDING_SETTINGS_FAILURE", () => {
      const error = new Error("Failed to get onboarding settings");
      const action = {
        type: TYPES.GET_ONBOARDING_SETTINGS_FAILURE,
        payload: error,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("UPDATE_ONBOARDING_SETTINGS actions", () => {
    it("should handle UPDATE_ONBOARDING_SETTINGS_REQUEST", () => {
      const action = { type: TYPES.UPDATE_ONBOARDING_SETTINGS_REQUEST };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle UPDATE_ONBOARDING_SETTINGS_SUCCESS", () => {
      const updatedSettings = { ...mockSettings, _id: "updated" };
      const action = {
        type: TYPES.UPDATE_ONBOARDING_SETTINGS_SUCCESS,
        payload: updatedSettings,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual(updatedSettings);
      expect(state.error).toBe(null);
    });

    it("should handle UPDATE_ONBOARDING_SETTINGS_FAILURE", () => {
      const error = new Error("Failed to update onboarding settings");
      const action = {
        type: TYPES.UPDATE_ONBOARDING_SETTINGS_FAILURE,
        payload: error,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("GET_AGREEMENT_SETTINGS actions", () => {
    it("should handle GET_AGREEMENT_SETTINGS_REQUEST", () => {
      const action = { type: TYPES.GET_AGREEMENT_SETTINGS_REQUEST };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_AGREEMENT_SETTINGS_SUCCESS", () => {
      const agreementSettings = { datenschutz: true, teilnahmeunterricht: false };
      const action = {
        type: TYPES.GET_AGREEMENT_SETTINGS_SUCCESS,
        payload: agreementSettings,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual({ agreements: agreementSettings });
      expect(state.error).toBe(null);
    });

    it("should handle GET_AGREEMENT_SETTINGS_FAILURE", () => {
      const error = new Error("Failed to get agreement settings");
      const action = {
        type: TYPES.GET_AGREEMENT_SETTINGS_FAILURE,
        payload: error,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("UPDATE_AGREEMENT_SETTINGS actions", () => {
    it("should handle UPDATE_AGREEMENT_SETTINGS_REQUEST", () => {
      const action = { type: TYPES.UPDATE_AGREEMENT_SETTINGS_REQUEST };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle UPDATE_AGREEMENT_SETTINGS_SUCCESS", () => {
      const updatedSettings = { ...mockSettings, _id: "agreement-updated" };
      const action = {
        type: TYPES.UPDATE_AGREEMENT_SETTINGS_SUCCESS,
        payload: updatedSettings,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual({ agreements: updatedSettings });
      expect(state.error).toBe(null);
    });

    it("should handle UPDATE_AGREEMENT_SETTINGS_FAILURE", () => {
      const error = new Error("Failed to update agreement settings");
      const action = {
        type: TYPES.UPDATE_AGREEMENT_SETTINGS_FAILURE,
        payload: error,
      };
      const state = appSettingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("State transitions", () => {
    it("should clear error on new request", () => {
      const stateWithError = {
        ...initialState,
        error: new Error("Previous error"),
      };
      const action = { type: TYPES.GET_SETTINGS_REQUEST };
      const state = appSettingsReducer(stateWithError, action);
      expect(state.error).toBe(null);
    });

    it("should preserve data when request fails", () => {
      const stateWithData = {
        ...initialState,
        data: mockSettings as AppSettings,
      };
      const action = {
        type: TYPES.GET_SETTINGS_FAILURE,
        payload: new Error("Load failed"),
      };
      const state = appSettingsReducer(stateWithData, action);
      expect(state.data).toEqual(mockSettings);
    });

    it("should update data on successful update", () => {
      const existingState = {
        ...initialState,
        data: mockSettings as AppSettings,
      };
      const newSettings = { ...mockSettings, _id: "new-id" };
      const action = {
        type: TYPES.UPDATE_ONBOARDING_SETTINGS_SUCCESS,
        payload: newSettings,
      };
      const state = appSettingsReducer(existingState, action);
      expect(state.data).toEqual(newSettings);
    });
  });
});
