"use client";

import React, { memo } from "react";

import { LANGUAGES } from "@/constants/general.constants";
import { changeApplicationLocale } from "@/store/actions/uiActions";
import { AppDispatch } from "@/store/store";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import GeneralDropdown from "./GeneralDropdown";

const LanguageDropdown: React.FC = () => {
  const { i18n, t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const options = Object.values(LANGUAGES).map((lang) => ({
    label: lang.value,
    value: lang.key,
  }));

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const selectedLang = event.target.value as string;
    i18n.changeLanguage(selectedLang);
    dispatch(changeApplicationLocale(selectedLang));
  };

  return (
    <GeneralDropdown
      label={t("general.Language")}
      options={options}
      value={i18n.language}
      onChange={handleChange}
      fullWidth
    />
  );
};

export default memo(LanguageDropdown);
