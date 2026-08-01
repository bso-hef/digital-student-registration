import settingsService from "@/lib/services/settingsService";
import {
  getAgreementSettings,
  getOnboardingSettings,
  getSettings,
  updateAgreementSettings,
  updateOnboardingSettings,
  updateSettings,
} from "@/store/actions/settingsActions";
import * as TYPES from "@/store/types";
import * as notificationUtils from "@/utils/notification.utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@/lib/services/settingsService", () => ({
  default: {
    getAll: vi.fn(),
    getOnboarding: vi.fn(),
    getPublicOnboarding: vi.fn(),
    update: vi.fn(),
    updateOnboarding: vi.fn(),
    getAgreements: vi.fn(),
    updateAgreements: vi.fn(),
  },
}));

vi.mock("@/utils/notification.utils", () => ({
  errorNotification: vi.fn(),
  successNotification: vi.fn(),
}));

vi.mock("i18next", () => ({
  default: {
    t: vi.fn((key: string) => key),
  },
}));

/**
 * Tests for settings actions
 * @file tests/unit/store/actions/settingsActions.test.ts
 */

describe("settingsActions", () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let getState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getSettings", () => {
    it("should dispatch success on successful fetch", async () => {
      const mockSettings = {
        schoolName: "Test School",
        logo: null,
      };
      vi.mocked(settingsService.getAll).mockResolvedValue({
        data: { data: mockSettings },
      });

      await getSettings()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_SETTINGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_SETTINGS_SUCCESS,
        payload: mockSettings,
      });
    });

    it("should dispatch failure on fetch error", async () => {
      vi.mocked(settingsService.getAll).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await getSettings()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_SETTINGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("getOnboardingSettings", () => {
    it("should dispatch success on successful fetch", async () => {
      const mockOnboarding = {
        welcomeMessage: "Welcome!",
        fields: [],
      };
      vi.mocked(settingsService.getPublicOnboarding).mockResolvedValue({
        data: { data: { onboarding: mockOnboarding } },
      });

      await getOnboardingSettings()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_ONBOARDING_SETTINGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_ONBOARDING_SETTINGS_SUCCESS,
        payload: { onboarding: mockOnboarding },
      });
    });

    it("should dispatch failure on fetch error", async () => {
      vi.mocked(settingsService.getPublicOnboarding).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await getOnboardingSettings()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_ONBOARDING_SETTINGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("updateSettings", () => {
    it("should dispatch success on successful update", async () => {
      const mockSettings = { schoolName: "Updated School" };
      vi.mocked(settingsService.update).mockResolvedValue({
        data: { data: mockSettings },
      });

      await updateSettings({ schoolName: "Updated School" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_SETTINGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_SETTINGS_SUCCESS,
        payload: mockSettings,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on update error", async () => {
      vi.mocked(settingsService.update).mockRejectedValue(
        new Error("Update failed"),
      );

      await updateSettings({ schoolName: "Test" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_SETTINGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("updateOnboardingSettings", () => {
    it("should dispatch success on successful update", async () => {
      const mockOnboarding = { welcomeMessage: "Updated!" };
      vi.mocked(settingsService.updateOnboarding).mockResolvedValue({
        data: { data: mockOnboarding },
      });

      await updateOnboardingSettings({ welcomeMessage: "Updated!" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_ONBOARDING_SETTINGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_ONBOARDING_SETTINGS_SUCCESS,
        payload: mockOnboarding,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on update error", async () => {
      vi.mocked(settingsService.updateOnboarding).mockRejectedValue(
        new Error("Update failed"),
      );

      await updateOnboardingSettings({ welcomeMessage: "Test" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_ONBOARDING_SETTINGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("getAgreementSettings", () => {
    it("should dispatch success on successful fetch", async () => {
      const mockAgreements = {
        dataPrivacy: { enabled: true, text: "Privacy" },
      };
      vi.mocked(settingsService.getAgreements).mockResolvedValue({
        data: { data: mockAgreements },
      });

      await getAgreementSettings()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AGREEMENT_SETTINGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AGREEMENT_SETTINGS_SUCCESS,
        payload: mockAgreements,
      });
    });

    it("should dispatch failure on fetch error", async () => {
      vi.mocked(settingsService.getAgreements).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await getAgreementSettings()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AGREEMENT_SETTINGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("updateAgreementSettings", () => {
    it("should dispatch success on successful update", async () => {
      const mockAgreements = {
        dataPrivacy: { enabled: false, text: "Updated" },
      };
      vi.mocked(settingsService.updateAgreements).mockResolvedValue({
        data: { data: mockAgreements },
      });

      await updateAgreementSettings(mockAgreements)(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_AGREEMENT_SETTINGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_AGREEMENT_SETTINGS_SUCCESS,
        payload: mockAgreements,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on update error", async () => {
      vi.mocked(settingsService.updateAgreements).mockRejectedValue(
        new Error("Update failed"),
      );

      await updateAgreementSettings({})(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_AGREEMENT_SETTINGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });
});
