import { useEffect } from "react";

import { getOnboardingSettings } from "@/store/actions/settingsActions";
import { AppDispatch, RootState } from "@/store/store";
import { DropdownOption } from "@/types/settings";
import { useDispatch, useSelector } from "react-redux";

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

  const getEnabledOptions = (
    options: DropdownOption[] = [],
  ): DropdownOption[] =>
    options.filter((opt) => opt.enabled).sort((a, b) => a.order - b.order);

  const getOptionValues = (options: DropdownOption[] = []): string[] =>
    getEnabledOptions(options).map((opt) => opt.value);

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
    genderOptions: onboarding?.genderOptions || [],
    salutationOptions: onboarding?.salutationOptions || [],
    religionOptions: onboarding?.religionOptions || [],
    contactPersonTypeOptions: onboarding?.contactPersonTypeOptions || [],
    schoolLevelOptions: onboarding?.schoolLevelOptions || [],
    schoolTypeOptions: onboarding?.schoolTypeOptions || [],
    degreeOptions: onboarding?.degreeOptions || [],
    languageOptions: onboarding?.languageOptions || [],
    professionOptions: onboarding?.professionOptions || [],
    countryOptions: onboarding?.countryOptions || [],
    fieldConfigs: onboarding?.fieldConfigs || {},
    maxContactPersons: onboarding?.maxContactPersons ?? 3,
    getEnabledOptions,
    getOptionValues,
    getSelectOptions,
  };
};
