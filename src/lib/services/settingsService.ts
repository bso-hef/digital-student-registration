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
   * Fetches onboarding settings for the unauthenticated student workflow
   */
  getPublicOnboarding: () => {
    return http.get<{
      success: boolean;
      data: Pick<AppSettings, "onboarding">;
    }>("/api/settings/onboarding/public");
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
   * Fetches enabled agreements for the unauthenticated student workflow
   */
  getPublicAgreements: () => {
    return http.get<{ success: boolean; data: AgreementSettings }>(
      "/api/settings/agreements/public",
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
