import {
  AgreementSettings,
  AppSettings,
  OnboardingSettings,
  SettingsResponse,
} from "@/types/settings";

import http from "./api";

const settingsService = {
  /**
   * Fetches all application settings
   */
  getAll: () => {
    return http.get<SettingsResponse>("/api/settings");
  },

  /**
   * Fetches only onboarding settings
   */
  getOnboarding: () => {
    return http.get<{ success: boolean; data: AppSettings }>(
      "/api/settings/onboarding",
    );
  },

  /**
   * Updates all application settings
   */
  update: (settings: Partial<AppSettings>) => {
    return http.patch<SettingsResponse>("/api/settings", settings);
  },

  /**
   * Updates only onboarding settings
   */
  updateOnboarding: (onboarding: Partial<OnboardingSettings>) => {
    return http.patch<SettingsResponse>("/api/settings/onboarding", {
      onboarding,
    });
  },

  /**
   * Fetches only agreement settings
   */
  getAgreements: () => {
    return http.get<{ success: boolean; data: AgreementSettings }>(
      "/api/settings/agreements",
    );
  },

  /**
   * Updates only agreement settings
   */
  updateAgreements: (agreements: Partial<AgreementSettings>) => {
    return http.patch<{ success: boolean; data: AgreementSettings }>(
      "/api/settings/agreements",
      {
        agreements,
      },
    );
  },
};

export default settingsService;
