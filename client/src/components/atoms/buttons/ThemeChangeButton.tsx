import React from "react";

import { THEME } from "@/constants/general.constants";
import { changeApplicationTheme } from "@/store/actions/uiActions";
import { AppDispatch } from "@/store/store";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { Button, ButtonGroup, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const StyledButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const ThemeChangeButton = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const handleThemeChange = (theme: (typeof THEME)[keyof typeof THEME]) => {
    dispatch(changeApplicationTheme(theme));
  };

  return (
    <ButtonGroup variant="outlined" fullWidth>
      <StyledButton onClick={() => handleThemeChange(THEME.LIGHT)}>
        <LightModeRoundedIcon />
        {t("general.Light")}
      </StyledButton>
      <StyledButton onClick={() => handleThemeChange(THEME.DARK)}>
        <DarkModeRoundedIcon />
        {t("general.Dark")}
      </StyledButton>
    </ButtonGroup>
  );
};

export default ThemeChangeButton;
