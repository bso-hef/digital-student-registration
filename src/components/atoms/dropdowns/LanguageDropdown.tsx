"use client";

import React, { memo } from "react";

import { LANGUAGES } from "@/constants/general.constants";
import { changeApplicationLocale } from "@/store/actions/uiActions";
import { AppDispatch } from "@/store/store";
import { appLanguageOptions } from "@/utils/ui.utils";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import GeneralDropdown from "./GeneralDropdown";

const LanguageDropdown: React.FC = () => {
  const { i18n, t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const selectedLang = event.target.value as string;
    i18n.changeLanguage(selectedLang);
    dispatch(changeApplicationLocale(selectedLang));
  };

  const getDefaultLanguage = () => {
    // i18n uses "en", "de" format, LANGUAGES uses "en-US", "de-DE" format
    const currentLang = i18n.language?.toLowerCase();
    if (currentLang?.startsWith("en")) return LANGUAGES.ENGLISH.isoCode;
    if (currentLang?.startsWith("de")) return LANGUAGES.GERMAN.isoCode;
    // Default to German as per the i18n fallback configuration
    return LANGUAGES.GERMAN.isoCode;
  };

  const defaultLanguage = getDefaultLanguage();

  return (
    <GeneralDropdown
      label={t("general.Language")}
      options={appLanguageOptions}
      value={defaultLanguage}
      onChange={handleChange}
      fullWidth
      flagIcon
    />
  );
};

export default memo(LanguageDropdown);
