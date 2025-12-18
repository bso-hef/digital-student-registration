import { useEffect } from "react";

import { getAgreementSettings } from "@/store/actions/settingsActions";
import { AppDispatch, RootState } from "@/store/store";
import { AgreementItem } from "@/types/settings.d";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export const useAgreementSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { i18n } = useTranslation();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.appSettings,
  );
  const agreements = data?.agreements?.agreements;

  useEffect(() => {
    dispatch(getAgreementSettings());
  }, [dispatch]);

  const getEnabledAgreements = (): AgreementItem[] => {
    if (!agreements) return [];
    return agreements
      .filter((agreement: AgreementItem) => agreement.enabled)
      .sort((a: AgreementItem, b: AgreementItem) => a.order - b.order);
  };

  const getAgreementLabel = (agreement: AgreementItem): string => {
    const lang = i18n.language as "en" | "de";
    return agreement.labels[lang] || agreement.labels.en;
  };

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
