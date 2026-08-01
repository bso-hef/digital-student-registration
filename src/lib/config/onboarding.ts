import { FieldConfig, OnboardingSettings } from "@/types/settings";

export const DEFAULT_PREVIOUS_SCHOOL_TYPE_FIELD_CONFIG: FieldConfig = {
  required: true,
  visible: true,
  allowCustom: true,
};

export const applyOnboardingFieldConfigDefaults = (
  onboarding: OnboardingSettings,
): OnboardingSettings => ({
  ...onboarding,
  fieldConfigs: {
    ...onboarding.fieldConfigs,
    vorhergehendeSchulform: {
      ...DEFAULT_PREVIOUS_SCHOOL_TYPE_FIELD_CONFIG,
      ...onboarding.fieldConfigs?.vorhergehendeSchulform,
    },
  },
});
