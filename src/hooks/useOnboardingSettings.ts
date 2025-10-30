import { useEffect } from "react";

import { getOnboardingSettings } from "@/store/actions/settingsActions";
import { AppDispatch, RootState } from "@/store/store";
import { DropdownOption } from "@/types/settings";
import { useDispatch, useSelector } from "react-redux";

/**
 * Custom hook to access onboarding settings in forms
 * Automatically fetches settings if not already loaded
 */
export const useOnboardingSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.appSettings,
  );
  const onboarding = data?.onboarding;

  useEffect(() => {
    if (!onboarding && !loading) {
      dispatch(getOnboardingSettings());
    }
  }, [onboarding, loading, dispatch]);

  /**
   * Get enabled options only, sorted by order
   */
  const getEnabledOptions = (
    options: DropdownOption[] = [],
  ): DropdownOption[] =>
    options.filter((opt) => opt.enabled).sort((a, b) => a.order - b.order);

  /**
   * Get option values for validation
   */
  const getOptionValues = (options: DropdownOption[] = []): string[] =>
    getEnabledOptions(options).map((opt) => opt.value);

  /**
   * Convert options to MUI Select format
   */
  const getSelectOptions = (
    options: DropdownOption[] = [],
  ): Array<{ value: string; label: string }> =>
    getEnabledOptions(options).map((opt) => ({
      value: opt.value,
      label: opt.label,
    }));

  return {
    settings: onboarding,
    loading,
    error,
    // Dropdown options
    genderOptions: onboarding?.genderOptions || [],
    salutationOptions: onboarding?.salutationOptions || [],
    religionOptions: onboarding?.religionOptions || [],
    contactPersonTypeOptions: onboarding?.contactPersonTypeOptions || [],
    schoolLevelOptions: onboarding?.schoolLevelOptions || [],
    schoolTypeOptions: onboarding?.schoolTypeOptions || [],
    degreeOptions: onboarding?.degreeOptions || [],
    languageOptions: onboarding?.languageOptions || [],
    professionOptions: onboarding?.professionOptions || [],
    // Field configs
    fieldConfigs: onboarding?.fieldConfigs || {},
    // Helper functions
    getEnabledOptions,
    getOptionValues,
    getSelectOptions,
  };
};
