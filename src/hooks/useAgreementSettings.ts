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

  /**
   * Returns the label or description according to the language
   *
   * @param text
   */
  const getLocalizedAgreementText = (
    text: AgreementItem["labels"] | AgreementItem["description"],
  ): string => {
    if (!text) return "";

    const exactLanguage = i18n.resolvedLanguage || i18n.language;
    const baseLanguage = exactLanguage?.split("-")[0];

    return (
      text[exactLanguage as keyof typeof text] ||
      text[baseLanguage as keyof typeof text] ||
      text.en ||
      ""
    );
  };

  const getAgreementLabel = (agreement: AgreementItem): string => {
    return getLocalizedAgreementText(agreement.labels);
  };

  const getAgreementDescription = (agreement: AgreementItem): string => {
    return getLocalizedAgreementText(agreement.description);
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
