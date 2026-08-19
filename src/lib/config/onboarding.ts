import { FieldConfig, OnboardingSettings } from "@/types/settings";

export const DEFAULT_PREVIOUS_SCHOOL_TYPE_FIELD_CONFIG: FieldConfig = {
  required: true,
  visible: true,
  allowCustom: true,
};

export const DEFAULT_STUDENT_PHONE_FIELD_CONFIG: FieldConfig = {
  required: false,
  visible: true,
  allowCustom: false,
};

export const applyOnboardingFieldConfigDefaults = (
  onboarding: OnboardingSettings,
): OnboardingSettings => ({
  ...onboarding,
  fieldConfigs: {
    ...onboarding.fieldConfigs,
    telefon1: {
      ...DEFAULT_STUDENT_PHONE_FIELD_CONFIG,
      ...onboarding.fieldConfigs?.telefon1,
      allowCustom: false,
    },
    vorhergehendeSchulform: {
      ...DEFAULT_PREVIOUS_SCHOOL_TYPE_FIELD_CONFIG,
      ...onboarding.fieldConfigs?.vorhergehendeSchulform,
    },
  },
});
