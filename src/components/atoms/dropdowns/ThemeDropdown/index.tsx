"use client";

import React, { memo } from "react";

import { ThemeMode } from "@/constants/general.constants";
import { changeApplicationTheme } from "@/store/actions/uiActions";
import { AppDispatch, RootState } from "@/store/store";
import { applicationThemeOptions } from "@/utils/ui.utils";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import GeneralDropdown from "../GeneralDropdown";

const ThemeDropdown: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const currentTheme = useSelector((state: RootState) => state.ui.theme);

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const selectedTheme = event.target.value as ThemeMode;
    dispatch(changeApplicationTheme(selectedTheme));
  };

  return (
    <GeneralDropdown
      label={t("accessibility.Theme Control")}
      options={applicationThemeOptions(t)}
      value={currentTheme}
      onChange={handleChange}
      fullWidth
    />
  );
};

export default memo(ThemeDropdown);
