import React, { Fragment, useState } from "react";

import {
  toggleDyslexiaFont,
  toggleHighContrast,
} from "@/store/actions/uiActions";
import { AppDispatch, RootState } from "@/store/store";
import AccessibilityRoundedIcon from "@mui/icons-material/AccessibilityRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Drawer, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import AppleSwitch from "../atoms/AppleSwitch";

import SmallIconButton from "../atoms/buttons/SmallIconButton";
import ThemeChangeButton from "../atoms/buttons/ThemeChangeButton";
import LanguageDropdown from "../atoms/dropdowns/LanguageDropdown";

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
  color: theme.palette.text.information,
  marginBottom: theme.spacing(1),
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontSize: "14px !important",
  lineHeight: "18px !important",
  fontWeight: 400,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

const AccessibilityMenu = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const { highContrast, dyslexiaFont } = useSelector(
    (state: RootState) => state.ui,
  );

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleToggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleToggleHighContrast = () => {
    dispatch(toggleHighContrast(!highContrast));
  };

  const handleToggleDyslexiaFont = () => {
    dispatch(toggleDyslexiaFont(!dyslexiaFont));
  };

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
          />
        </Box>

        <Box mt={2} display="flex" flexDirection="column" gap={3}>
          {/* Language Control */}
          <Box>
            <StyledButtonLabel>
              {t("accessibility.Language Control")}
            </StyledButtonLabel>
            <LanguageDropdown />
          </Box>

          {/* Theme Control */}
          <Box>
            <StyledButtonLabel>
              {t("accessibility.Theme Control")}
            </StyledButtonLabel>
            <ThemeChangeButton />
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
        </Box>
      </StyledDrawer>
    </Fragment>
  );
};

export default AccessibilityMenu;
