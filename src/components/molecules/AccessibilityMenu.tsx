import React, { Fragment, useCallback, useState } from "react";

import {
  toggleDyslexiaFont,
  toggleHighContrast,
} from "@/store/actions/uiActions";
import { AppDispatch, RootState } from "@/store/store";
import AccessibilityRoundedIcon from "@mui/icons-material/AccessibilityRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Drawer, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import AppleSwitch from "../atoms/AppleSwitch";

import SmallIconButton from "../atoms/buttons/SmallIconButton";
import LanguageDropdown from "../atoms/dropdowns/LanguageDropdown";
import ThemeDropdown from "../atoms/dropdowns/ThemeDropdown";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(2px)",
  "& .MuiDrawer-paper": {
    background: theme.palette.surface.interface.base,
    borderLeft: `1px solid ${theme.palette.border.seperator}`,
    borderRadius: theme.spacing(3, 0, 0, 3),
    boxShadow: theme.shadows[4],
    width: "100%",
    maxWidth: 320,
    padding: theme.spacing(2),
  },
}));

const StyledButtonLabel = styled(Typography)(({ theme }) => ({
  fontSize: "18px !important",
  lineHeight: "24px !important",
  fontWeight: 500,
  textTransform: "none",
  color: theme.palette.text.default,
  marginBottom: theme.spacing(1),
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontSize: "14px !important",
  lineHeight: "18px !important",
  fontWeight: 400,
  color: theme.palette.text.information,
  marginBottom: theme.spacing(2),
}));

const StyledMenuBox = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const AccessibilityMenu = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const { highContrast, dyslexiaFont } = useSelector(
    (state: RootState) => ({
      highContrast: state.ui.highContrast,
      dyslexiaFont: state.ui.dyslexiaFont,
    }),
    shallowEqual,
  );

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleToggleMenu = useCallback(() => {
    setOpenMenu((prev) => !prev);
  }, []);

  const handleToggleHighContrast = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked?: boolean) => {
      const value =
        typeof checked === "boolean" ? checked : event.target.checked;
      dispatch(toggleHighContrast(value));
    },
    [dispatch],
  );

  const handleToggleDyslexiaFont = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked?: boolean) => {
      const value =
        typeof checked === "boolean" ? checked : event.target.checked;
      dispatch(toggleDyslexiaFont(value));
    },
    [dispatch],
  );

  return (
    <Fragment>
      <SmallIconButton
        icon={<AccessibilityRoundedIcon />}
        onAction={handleToggleMenu}
        hugeIcon
        title={t("general.Accessibility")}
        placement="bottom"
        aria-label={t("general.Accessibility")}
      />

      <StyledDrawer anchor="right" open={openMenu} onClose={handleToggleMenu}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" color="text.default">
            {t("general.Accessibility")}
          </Typography>
          <SmallIconButton
            icon={<CloseRoundedIcon />}
            onAction={handleToggleMenu}
            title={t("general.Close")}
            placement="bottom"
            bigIcon
            aria-label={t("general.Close")}
            noMargin
          />
        </Box>
        <StyledMenuBox>
          {/* Language Control */}
          <Box>
            <LanguageDropdown />
          </Box>

          {/* Theme Control */}
          <Box>
            <ThemeDropdown />
          </Box>

          {/* High Contrast Mode */}
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flex={1}>
                <StyledButtonLabel sx={{ mb: 0.5 }}>
                  {t("accessibility.High Contrast Mode")}
                </StyledButtonLabel>
                <StyledDescription sx={{ mb: 0 }}>
                  {t("accessibility.High Contrast Description")}
                </StyledDescription>
              </Box>
              <AppleSwitch
                checked={highContrast}
                onChange={handleToggleHighContrast}
                inputProps={{
                  "aria-label": t("accessibility.High Contrast Mode"),
                }}
              />
            </Box>
          </Box>

          {/* Dyslexia Font */}
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flex={1}>
                <StyledButtonLabel sx={{ mb: 0.5 }}>
                  {t("accessibility.Dyslexia Font")}
                </StyledButtonLabel>
                <StyledDescription sx={{ mb: 0 }}>
                  {t("accessibility.Dyslexia Font Description")}
                </StyledDescription>
              </Box>
              <AppleSwitch
                checked={dyslexiaFont}
                onChange={handleToggleDyslexiaFont}
                inputProps={{
                  "aria-label": t("accessibility.Dyslexia Font"),
                }}
              />
            </Box>
          </Box>
        </StyledMenuBox>
      </StyledDrawer>
    </Fragment>
  );
};

export default AccessibilityMenu;
