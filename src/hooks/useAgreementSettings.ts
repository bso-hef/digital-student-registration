import { useEffect } from "react";

import { getAgreementSettings } from "@/store/actions/settingsActions";
import { AppDispatch, RootState } from "@/store/store";
import { AgreementItem } from "@/types/settings.d";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

/**
 * Custom hook to fetch and manage agreement settings from admin configuration
 * Follows the same pattern as useOnboardingSettings.ts
 *
 * @returns {Object} Agreement settings with helper functions
 * @property {AgreementItem[]} agreements - All agreements from settings
 * @property {AgreementItem[]} enabledAgreements - Only enabled agreements, sorted by order
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message if any
 * @property {Function} getAgreementLabel - Get localized label for an agreement
 * @property {Function} getAgreementDescription - Get localized description for an agreement
 */
export const useAgreementSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { i18n } = useTranslation();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.appSettings,
  );
  const agreements = data?.agreements?.agreements;

  // Always fetch agreements on mount to ensure fresh data
  // This prevents issues with stale cached data from Redux persist
  useEffect(() => {
    dispatch(getAgreementSettings());
  }, [dispatch]);

  /**
   * Get only enabled agreements, sorted by order field
   * @returns {AgreementItem[]} Filtered and sorted agreements
   */
  const getEnabledAgreements = (): AgreementItem[] => {
    if (!agreements) return [];
    return agreements
      .filter((agreement: AgreementItem) => agreement.enabled)
      .sort((a: AgreementItem, b: AgreementItem) => a.order - b.order);
  };

  /**
   * Get localized label for an agreement based on current language
   * @param {AgreementItem} agreement - Agreement object
   * @returns {string} Localized label
   */
  const getAgreementLabel = (agreement: AgreementItem): string => {
    const lang = i18n.language as "en" | "de";
    return agreement.labels[lang] || agreement.labels.en;
  };

  /**
   * Get localized description for an agreement based on current language
   * @param {AgreementItem} agreement - Agreement object
   * @returns {string} Localized description (empty string if not provided)
   */
  const getAgreementDescription = (agreement: AgreementItem): string => {
    if (!agreement.description) return "";
    const lang = i18n.language as "en" | "de";
    return agreement.description[lang] || agreement.description.en || "";
  };

  return {
    agreements: agreements || [],
    enabledAgreements: getEnabledAgreements(),
    loading,
    error,
    getAgreementLabel,
    getAgreementDescription,
  };
};
