"use client";

import React, { memo } from "react";

import { LANGUAGES } from "@/constants/general.constants";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";

import GeneralDropdown from "./GeneralDropdown";

const LanguageDropdown: React.FC = () => {
  const { i18n } = useTranslation();

  const options = Object.values(LANGUAGES).map((lang) => ({
    label: lang.value,
    value: lang.isoCode,
  }));

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    i18n.changeLanguage(event.target.value as string);
  };

  return (
    <GeneralDropdown
      label="Language"
      options={options}
      value={i18n.language}
      onChange={handleChange}
      fullWidth
    />
  );
};

export default memo(LanguageDropdown);
